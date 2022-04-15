import { createPool } from 'mysql2/promise';

export async function connect(){

    const connection = await createPool({
        host: 'localhost',
        user: 'root',
        password: 'Maosanti1827Trianon27@',
        database: 'users_lalu',
        connectionLimit: 10
    });
    return connection;
}