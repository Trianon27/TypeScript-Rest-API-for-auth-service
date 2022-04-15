import {Request, Response} from 'express';
import bcrypt from 'bcrypt'
import jwt from  'jsonwebtoken'

import {connect} from '../database'



export async function getUsers(req: Request, res: Response): Promise<Response> {
    const conn = await connect();
    const users = await conn.query('SELECT * FROM users');
    return res.json(users[0]);
}

//create a function to login
export async function loginUser(req: Request, res: Response): Promise<Response> {
    const {email, user_password} = req.body;   
    const conn = await connect();
    const users: any = await conn.query('SELECT * FROM users  WHERE email = ?', [email]);
    if(users[0].length > 0){
        if(bcrypt.compareSync(user_password, users[0][0].user_password)){
            
            //token generator
            const token: string = jwt.sign({id: users[0][0].id}, process.env.TOKEN_SECRET || 'my_secret_token',
            {expiresIn: '1h'});

            
            return res.header('token',token).json(users[0]);
            
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
    console.log(req.userId);
    console.log(users[0]);
    return res.json(users[0][0]);
}