import * as dotenv from 'dotenv';
import { Options } from 'sequelize';

dotenv.config();

const config: Options = {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    // port: Number(process.env.DB_PORT) || 33060,
    host: process.env.DB_HOST,
    dialect: "mysql"
  }

export = config;
