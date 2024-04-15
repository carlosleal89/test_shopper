import ProductController from '../controllers/ProductController';
import { Request, Response, Router } from 'express';

const router = Router();

const productController = new ProductController();

router.get('/', (req: Request, res: Response) =>
  productController.getAllProducts(req, res));

export default router;