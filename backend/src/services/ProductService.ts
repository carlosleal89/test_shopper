import ProductModel from '../models/ProductModel';
import { IProductModel } from '../interfaces/IProductModel';
import { ServiceResponse } from '../interfaces/ServiceResponse';
import { IProduct } from '../interfaces/IProduct';
import { ICsvFileParsed } from '../interfaces/ICsvFile';
import csvParserHelper from '../utils/csvParser';
import ValidationService from './ValidationService';

export default class ProductService {
  constructor(
    private productModel: IProductModel = new ProductModel(),
    private validationService = new ValidationService(),
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

  public async checkIfProductsExist(productsList: ICsvFileParsed[]) {
    // tipar o retorno
    try {
      let checkProductsCode: any = {
        invalidCodes: [],
        validCodes: [],
      };
      //tipar checkProductsCode

      for (const product of productsList) {
        const isProduct = await this.productModel.getProductByCode(Number(product.product_code));
        if (!isProduct) {
          checkProductsCode.invalidCodes.push(product.product_code);
        } else {
          checkProductsCode.validCodes.push(product);
        }
      };

      return checkProductsCode;

    } catch (error: any) {
      // refatorar tratativa de erro
      console.error(`Erro ao buscar os produtos: ${error.message}`);
      return error.message;
    }
  }

  public async validateData(csvFileName: string) {
    // tipar retorno e parametro
    try {
      const csvFileData = await csvParserHelper(csvFileName);      
      
      // const validateProductCodes = await this.checkIfProductsExist(csvFileData);
      //tipar validateProductCodes
      const { validCodes, invalidCodes } = await this.checkIfProductsExist(csvFileData);;

      // const validateFields = this.validationService.validateCsvFile(validCodes);
      const {
        validationErrors, validProducts
      } = this.validationService.validateCsvFile(validCodes);
      //tipar      

      let checkedProducts: any = {
        validationErrors: {
          invalidProductsCodes: [],
          // missingPrice: [],
          // invalidPrice: [],
        }
      };

      if (invalidCodes) {
        checkedProducts.validationErrors.invalidProductsCodes.push(...invalidCodes);
      } // codigos inexistentes

      if (validationErrors) {
        checkedProducts.validationErrors.missingPrice = validationErrors.missingPrice;
        checkedProducts.validationErrors.invalidPrice = validationErrors.invalidPrice;
      }

      if (checkedProducts.validationErrors) {
        return { status: 'INVALID_REQUEST', data: checkedProducts }
      }
      return { status: 'SUCCESSFUL', data: checkedProducts };
      

    } catch (error: any) {
      // refatorar tratativa de erro
      console.error(`Erro ao atualizar os produtos: ${error.message}`);
      return error.message;
    }
  }
}