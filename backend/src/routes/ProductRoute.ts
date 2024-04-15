import ProductController from '../controllers/ProductController';
import { Request, Response, Router } from 'express';
import upload from '../middlewares/uploadFile';

const router = Router();

const productController = new ProductController();

router.get('/', (req: Request, res: Response) =>
  productController.getAllProducts(req, res));

router.post('/update-price', upload.single('file'), (req: Request, res: Response) => {
  console.log('Arquivo enviado:', req.file?.filename);
  res.send('Arquivo enviado com sucesso!');
})

export default router;