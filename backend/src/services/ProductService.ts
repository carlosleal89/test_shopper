import ProductModel from '../models/ProductModel';
import { IProductModel } from '../interfaces/IProductModel';
import { ServiceResponse } from '../interfaces/ServiceResponse';
import { IProduct } from '../interfaces/IProduct';
import { ICsvFile } from '../interfaces/ICsvFile';
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

  public async checkIfProductsExist(productsList: ICsvFile[]): Promise<number[] | string> {
    try {
      let invalidCodes: number[] = [];

      for (const product_code of productsList) {
        const isProduct = await this.productModel.getProductByCode(Number(product_code.product_code));
        if (!isProduct) {
          invalidCodes.push(product_code.product_code);
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
      const isValidProductCodes = await this.checkIfProductsExist(csvFileData)
      console.log(isValidProductCodes);
      
      return { status: 'SUCCESSFUL', data: csvFileData };
      

    } catch (error: any) {
      // refatorar tratativa de erro
      console.error(`Erro ao atualizar os produtos: ${error.message}`);
      return error.message;
    }
  }
}