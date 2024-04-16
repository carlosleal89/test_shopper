import ProductModel from '../models/ProductModel';
import { IProductModel } from '../interfaces/IProductModel';
import { ServiceResponse } from '../interfaces/ServiceResponse';
import { IProduct } from '../interfaces/IProduct';
import csvParserHelper from '../utils/csvParser';

export default class ProductService {
  constructor(
    private productModel: IProductModel = new ProductModel(),
  ) {}

  public async getProducts(): Promise<ServiceResponse<IProduct[]>> {
    try {
      const allProducts = await this.productModel.getAllProducts();

      if (!allProducts) {
        return { status: 'NO_CONTENT', data: { message: '' }};
      }

      return { status: 'SUCCESSFUL', data: allProducts };

    } catch (error: any) {
      console.error(`Erro ao buscar os produtos: ${error.message}`);
      return {
        status: 'INTERNAL_SERVER_ERROR',
        data: { message: error.message },
      }
    }
  }

  public async checkIfProductsExist(product_code: number[]): Promise<number[] | string> {
    try {
      let invalidCodes: number[] = [];

      for (const code of product_code) {
        const isProduct = await this.productModel.getProductByCode(code);
        if (!isProduct) {
          invalidCodes.push(code);
        }
      };

      return invalidCodes;

    } catch (error: any) {
      // refatorar tratativa de erro
      console.error(`Erro ao buscar os produtos: ${error.message}`);
      return error.message;
    }
  }

  public async updateProductPrice(csvFileName: string) {
    // tipar retorno e parametro
    try {
      const csvFileData = await csvParserHelper(csvFileName);
      console.log('service', csvFileData);
      

    } catch (error: any) {
      // refatorar tratativa de erro
      console.error(`Erro ao atualizar os produtos: ${error.message}`);
      return error.message;
    }
  }
}