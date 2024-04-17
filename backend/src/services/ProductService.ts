import ProductModel from '../models/ProductModel';
import PackService from './PackService';
import { IProductModel } from '../interfaces/IProductModel';
import { ServiceResponse } from '../interfaces/ServiceResponse';
import { IProduct } from '../interfaces/IProduct';
import { ICsvFileParsed } from '../interfaces/ICsvFile';
import csvParserHelper from '../utils/csvParser';
import { IPack } from '../interfaces/IPack';
// import ValidationService from './ValidationService';

export default class ProductService {
  constructor(
    private productModel: IProductModel = new ProductModel(),
    private packService = new PackService(),
    // private validationService = new ValidationService(),
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

  public async validateData(csvFileName: string) {
    try {
      const csvFileData: ICsvFileParsed[] = await csvParserHelper(csvFileName);
  
      let validProducts: any = [];
      let validationErrors: any = {
        invalidCodes: [],
        invalidPrices: [],
        invalidPacks: [],
      };
      let packProducts: any = [];

      await Promise.all(csvFileData.map(async (productEl) => {
        const productByCode = await this.productModel.getProductByCode(productEl.product_code);
        
        // Valida se o id existe
        if (!productByCode) {
          validationErrors.invalidCodes.push(productEl);
          return;
        }
        
        // Valida se o preço é um número válido
        if (isNaN(productEl.new_price)) {
          validationErrors.invalidPrices.push(productEl);
          return;
        }
        
        const isPackOrComponent = await this.packService.getPacks(Number(productEl.product_code));
        
        // verifica se o produto faz parte ou é algum pack.
        if (!isPackOrComponent) {
          // se não, envia o produto para validação de preço
          validProducts.push(productEl);
        } else {
          packProducts.push(productEl);
        }

        // const isPack = await this.packService.getPackByPackId(productEl.product_code);

        // if (isPack.length > 0) {
        //   const isValidPack = this.validatePack(csvFileData, isPack);
        //   if (isValidPack) {
        //     validProducts.push(isValidPack);
        //   }
        // }
      }));
  
      if (validationErrors.invalidCodes.length > 0 || validationErrors.invalidPrices.length > 0) {
        return { status: 'INVALID_REQUEST', data: { validationErrors, validProducts, packProducts } };
      }
      return { status: 'SUCCESSFUL', data: { validProducts } };

    } catch (error: any) {
      console.error(`Erro ao atualizar os produtos: ${error.message}`);
      return { status: 'ERROR', message: error.message };
    }
  }

  public validatePack(data: any, isPack: any) {
    try {
      const csvArray = data;      
      const isPackArray = isPack;

      for (const csvEl of csvArray) {
        const tst = isPackArray.find((packEl: any) => Number(csvEl.product_code) === packEl.product.code);
        if (tst) return csvEl;
      }

    } catch (error: any) {
      console.error(error.message);
    }
  }

  public async validatePackComponent(data: any, currCsvEl: any) {
    try {
      const csvArray = data;

      const packByProductId = await this.packService.getPackByProductId(currCsvEl);

      for (const csvEl of csvArray) {
        // const tst = isPackArray.find((packEl: any) => Number(csvEl.product_code) === packEl.product.code);
        // if (tst) return csvEl;
      }

    } catch (error: any) {
      console.error(error.message);
    }
  }
}