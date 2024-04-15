import { Router } from 'express';
import productRouter from './ProductRoute';

const router = Router();

router.use('/products', productRouter);

export default router;