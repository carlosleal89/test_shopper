import SequelizeProducts from '../database/models/SequelizeProducts';
import { IProduct } from '../interfaces/IProduct';
import { IProductModel } from '../interfaces/IProductModel';

export default class ProductModel implements IProductModel {
  private model = SequelizeProducts;

  async getAllProducts(): Promise<IProduct[] | null> {
    try {
      const allProducts = await this.model.findAll();
      if (allProducts.length === 0) return null;

      return allProducts as IProduct[];
    } catch (error: any) {
      console.error(`Erro ao buscar os produtos: ${error.message}`);
      throw new Error(`Erro ao buscar os produtos: ${error.message}`);
    }
  }

  async getProductByCode(code: number): Promise<IProduct | null> {
    try {
      const productByid = await this.model.findOne({
        where: {
          code
        }
      });

      if (!productByid) return null;

      return productByid as IProduct;

    } catch (error: any) {
      console.error(`Erro ao buscar o produto: ${error.message}`);
      throw new Error(`Erro ao buscar o produto: ${error.message}`);
    }   
  }
}