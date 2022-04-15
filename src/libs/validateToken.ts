import {Request, Response, NextFunction } from 'express'
import jwt from  'jsonwebtoken'

interface TokenPayload {
    id: string;
    iat: number;
    exp: number;
}


export   function tokenValidation  (req: Request, res: Response, next: NextFunction)  {
    try{
        const token = req.header('token');
        if(!token) return res.status(404).json({message: 'Access denied'});
        const payload = jwt.verify(token, process.env['TOKEN_SECRET'] || 'my_secret_token' ) as TokenPayload;
        req.userId = payload.id;
        next();
    }catch (e) {
        res.status(400).send('Invalid Token');
    }
}