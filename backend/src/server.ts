import app from './app';
import * as dotenv from 'dotenv';
import { executeSQLScript } from './database/executeSQLScript';

dotenv.config();

const EXPRESS_PORT = process.env.EXPRESS_PORT || 3001;

executeSQLScript(); // executa o script database.sql

app.listen(EXPRESS_PORT, () => {
  console.log(`Server is running on port ${EXPRESS_PORT}`);
})