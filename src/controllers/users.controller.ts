import {Request, Response} from 'express';
import bcrypt from 'bcrypt'
import jwt from  'jsonwebtoken'

import {connect} from '../database'
import { users } from '../interface/users';


export async function getUsers(req: Request, res: Response): Promise<Response> {
    const conn = await connect();
    const users = await conn.query('SELECT * FROM users');
    return res.json(users[0]);
}

//Se crea una funcion para crear un usuario
export async function createUser(req: Request, res: Response): Promise<Response> {
    
    const newUser: users = req.body;
    const conn = await connect();
    const user_conf: any = await conn.query('SELECT * FROM users  WHERE email = ?', [newUser.email]);
    const salt = await bcrypt.genSalt(10);

    if(user_conf[0].length == 0){

        // Keeping the user and encryption of the password
        newUser.user_password = bcrypt.hashSync(newUser.user_password, salt);
        newUser.confirm_password = bcrypt.hashSync(newUser.confirm_password, salt);
        await conn.query('INSERT INTO users SET ?', [newUser]);
        
        //creating a token
        const token: string = jwt.sign({
            user_ID: newUser.id
        }, process.env.TOKEN_SECRET || 'my_secret_token');
        
        return res.header('token',token).json({
            newUser,
        });
    }else{
        return res.status(404).json({message: 'User already exists'});
    }
}



