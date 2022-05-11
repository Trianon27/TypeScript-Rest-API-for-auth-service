import mysql from 'mysql';
import { createPool } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();
export async function connect(){

    const userLimit = parseInt(process.env.DB_LIMIT || '')
    const dbLimit = Number.isInteger(userLimit) ? userLimit : 20

    const userPort = parseInt(process.env.DB_PORT || '')
    const dbPort = Number.isInteger(userPort) ? userPort : 3306

    const connection = await createPool({
        host: process.env.DB_HOST,
        port: dbPort,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE ,
        connectionLimit: dbLimit
    
    });
    return connection;
}