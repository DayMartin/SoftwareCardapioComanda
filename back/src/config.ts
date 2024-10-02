import dotenv from 'dotenv';
import path from 'path';

dotenv.config();


const databaseConfig = {
    config: {
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || 'giovana0407 ',
        database: process.env.DB_NAME || 'financeiro',
        port: 3306
    },
    file: path.join(__dirname, '../src//Server/database/database.sqlite'),
};

export default databaseConfig;