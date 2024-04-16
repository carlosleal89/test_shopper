import multer from 'multer';
import path from 'path';
import { Request } from 'express';
import crypto from 'crypto';

const storage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb: Function) {
    cb(null, path.join(__dirname, '../uploads')); // define o local para o arquivo
  },
  filename: function (req: Request, file: Express.Multer.File, cb: Function) {
    const fileExtension = file.originalname.split('.')[1];

    if (fileExtension !== 'csv') {
      return cb(new Error('Apenas arquivos CSV são permitidos'));      
    }

    const newFileName = crypto.randomBytes(16).toString('hex');
    cb(null, `${newFileName}.${fileExtension}`);
  },
});

const upload = multer({ storage });

export default upload;

