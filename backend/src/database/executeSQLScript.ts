import db from './models/index';
import fs from 'fs';
import path from 'path';

const readSQLFile = async (filePath: string): Promise<string> => {
  try {
    const sqlQuery = fs.readFileSync(path.join(__dirname, filePath)).toString();    
    return sqlQuery;
  } catch(error: any) {
    console.error('Erro ao ler o arquivo SQL');
    throw new Error(`Ocorreu um erro ao ler o arquivo SQL: ${error.message}`);
  }
}

const executeSQLScript = async () => {
  try {
    const sql = await readSQLFile('./database.sql');
    await db.query(sql);
    console.log('Script SQL executado com sucesso.');
  } catch (error: any) {
    console.error('Erro ao executar o script SQL:', error);
    throw new Error(`Ocorreu um erro ao executar o script SQL: ${error.message}`);
  }
};

export { executeSQLScript };