import ProductService from '../services/ProductService';
import mapStatusHTTP from '../utils/mapStatusToHTTP';
import { Request, Response } from 'express';

export default class ProductController {
  constructor(
    private productService = new ProductService(),
  ) {}

  public async getAllProducts(req: Request, res: Response) {
    const serviceResponse = await this.productService.getProducts();
    
    return res.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.data);
  }
}