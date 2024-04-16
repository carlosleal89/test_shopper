import { NextFunction, Request, Response } from 'express';
import express from 'express';
import router from './routes';
import cors from 'cors';
import multer from 'multer';

const app = express();

app.use(cors({
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

app.use(router);

app.get('/health', (req: Request, res: Response) => res.status(200).json({ message: "Yeah, it's working." }));

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {  
  console.log('Error middleware', err.message);
  return res.status(500).json({ message: `Internal server error: ${err.message}` });
});

export default app;
