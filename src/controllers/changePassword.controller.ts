import {Request, Response} from 'express';
import bcrypt from 'bcrypt'

import {connect} from '../database'

//create a function to change password
export async function changePassword(req: Request, res: Response): Promise<Response> {
    const {email, user_password, confirm_password} = req.body;   
    const conn = await connect();
    const users: any = await conn.query('SELECT * FROM users  WHERE email = ?', [email]);
    //console.log(users[0].length);
    if(users[0].length > 0){
        if(bcrypt.compareSync(user_password, users[0][0].user_password)){
            return res.json({message: "Can't change password, the password is the same"});
        }else{
            if(user_password === confirm_password){
                await conn.query('UPDATE users SET user_password = ?, confirm_password = ? WHERE email = ?', [bcrypt.hashSync(user_password, 10), 
                                                                                                            bcrypt.hashSync(confirm_password, 10), email]);
                return res.json({message: "Password changed"});

            }else{
                return res.status(404).json({message: 'The passwords do not match'});
            }
        }
    }else{
        return res.status(404).json({message: 'User not found'});
    }
}
