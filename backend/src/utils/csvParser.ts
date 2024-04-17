import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import { ICsvFileParsed } from '../interfaces/ICsvFile';

const csvParserHelper = async (filename: string): Promise<ICsvFileParsed[]> => {
  const filePath = path.join(__dirname, `../uploads/${filename}`);
  const results: ICsvFileParsed[] = [];

  await new Promise((resolve, reject) => {
    fs.createReadStream(path.join(filePath))
      .pipe(csv())
      .on('data', (data) => {
        if (Object.keys(data).length > 0) {
          results.push(data);
        } //remove linhas em branco do csv
      })
      .on('end', () => {
        fs.unlink(filePath, (err) => {
          if (err) {
            reject(new Error('Erro ao excluir o arquivo CSV.'));
            return;
          }
        });
        resolve(results);        
      })
      .on('error', (error) => {
        reject(new Error(`Erro ao ler o arquivo CSV: ${error.message}`));
      })      
    })
    return results;
}

export default csvParserHelper;
