import {Request, Response} from 'express';
import bcrypt from 'bcrypt';
import jwt from  'jsonwebtoken';

import {connect} from '../database';
import { users } from '../interface/users';
import { addUser } from '../../lalu_ldap/ldap_auth';


export async function getUsers(req: Request, res: Response): Promise<Response> {
    const conn = await connect();
    const users = await conn.query('SELECT * FROM users');
    return res.json(users[0]);
}

//Se crea una funcion para crear un usuario
export async function createUser(req: Request, res: Response): Promise<Response> {
    
    const newUser: users = req.body;

    const conn = await connect();
    const user_email_conf: any = await conn.query('SELECT email FROM users  WHERE email = ?', [newUser.email]);
    const user_name_conf: any = await conn.query('SELECT user_name FROM users  WHERE user_name = ?', [newUser.user_name]);
    const salt = await bcrypt.genSalt(10);

    if(newUser.user_password !== newUser.confirm_password) return res.status(404).json({message: 'The passwords are different'});

    //console.log(user_email_conf[0].length);
    //console.log(user_name_conf[0].length);

    if(user_email_conf[0].length == 0){
        if(user_name_conf[0].length == 0){
            // Keeping the user and encryption of the password
            newUser.user_password = bcrypt.hashSync(newUser.user_password, salt);
            newUser.confirm_password = bcrypt.hashSync(newUser.confirm_password, salt);
            
            //Create user on LDAP
            addUser(newUser.user_name, newUser.first_name,newUser.email, newUser.user_password);
           
            //Insert the user in the database
            await conn.query('INSERT INTO users SET ?', [newUser]);

            //creating a token
            const token: string = jwt.sign({
                user_ID: newUser.id
            }, process.env.TOKEN_SECRET || 'my_secret_token');
            
            return res.header('token',token).json({
                newUser,
            });
        }else{
            return res.status(404).json({message: 'The user name is already in use'});
        }
    }else{
        return res.status(404).json({message: 'User already exists'});
    }
}


//delete user
export async function deleteUser(req: Request, res: Response): Promise<Response> {
    const id = req.body;
    //console.log(id.id);
    const conn = await connect();
    const user_id_conf: any = await conn.query('SELECT id FROM users  WHERE id = ?', [id.id]);

    if(user_id_conf[0].length > 0){
    await conn.query('DELETE FROM users WHERE id = ?', [id.id]);
    return res.json({message: 'User deleted'});
    }else{
        return res.status(404).json({message: 'User not found'});
    }
}
