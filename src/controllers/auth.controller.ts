import {Request, Response} from 'express';
import bcrypt from 'bcrypt'
import jwt from  'jsonwebtoken'

import {connect} from '../database'
import { login } from '../interface/login';
import { searchUser } from '../lalu_ldap/ldap_auth';



//create a function to login
export async function loginUser(req: Request, res: Response): Promise<Response> {
    const loginU: login = req.body;

    //LDAP operation
    let username: any = loginU.user_name;
    let password: any = loginU.user_password;
    var verification: any = await searchUser(username, password);
    if(!verification){
        return res.status(404).json({message: 'User not found'});
    }

    //Normal operation 
    const conn = await connect();
    if(loginU.user_name){
        //console.log("test0");
        var login_users: any = await conn.query('SELECT * FROM users  WHERE user_name = ?', [loginU.user_name]);
    }else if(loginU.email){
        var login_users: any = await conn.query('SELECT * FROM users  WHERE email = ?', [loginU.email]);
    }else{
        
        return res.status(404).json({message: 'incorrect data'});
    }
    //console.log("test1");
    console.log(login_users[0].length);
    if(login_users[0].length > 0){
        //console.log("test2");
        if(bcrypt.compareSync(loginU.user_password, login_users[0][0].user_password)){
            //token generator
            const token: string = jwt.sign({id: login_users[0][0].id}, process.env.TOKEN_SECRET || 'my_secret_token',
            {expiresIn: '1h'});

            console.log(token);
            return res.header('token',token).json({message: "login successful and token generated"});
            
        }else{
            return res.status(404).json({message: 'The passwords do not match'});
        }
    }else{
        return res.status(404).json({message: 'User not found'});
    }
}

//show profile with token auth
export async function showProfile(req: Request, res: Response): Promise<Response> {
    const conn = await connect();
    const users: any = await conn.query('SELECT * FROM users  WHERE id = ?', [req.userId]);
    if(!users) return res.status(404).json({message: 'User not found'});
    //console.log("test11");
    return res.json(users[0][0]);
}