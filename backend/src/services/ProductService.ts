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

  // public async checkIfProductsExist(productsList: ICsvFileParsed[]) {
  //   // tipar o retorno
  //   try {
  //     let checkProductsCode: any = {
  //       invalidCodes: [],
  //       validCodes: [],
  //     };
  //     //tipar checkProductsCode

  //     for (const product of productsList) {
  //       const isProduct = await this.productModel.getProductByCode(Number(product.product_code));
  //       console.log('TESTE', isProduct);
        
  //       if (!isProduct) {
  //         checkProductsCode.invalidCodes.push(product.product_code);
  //       } else {
  //         checkProductsCode.validCodes.push(product);
  //       }
  //     };

  //     return checkProductsCode;

  //   } catch (error: any) {
  //     // refatorar tratativa de erro
  //     console.error(`Erro ao buscar os produtos: ${error.message}`);
  //     return error.message;
  //   }
  // }

  public async validateData(csvFileName: string) {
    try {
      const csvFileData: ICsvFileParsed[] = await csvParserHelper(csvFileName);
  
      let validProducts: any = [];
      let validationErrors: any = {
        invalidCodes: [],
        invalidPrices: [],
        invalidPacks: [],
      };

      await Promise.all(csvFileData.map(async (productEl) => {
        const productByCode = await this.productModel.getProductByCode(productEl.product_code);
        
        // Valida se o id existe
        if (!productByCode) {
          validationErrors.invalidCodes.push(productEl);
          const productIndex: number =  csvFileData.indexOf(productEl);
          csvFileData.splice(productIndex, 1);
          return;
        }
        
        // Valida se o preço é um número válido
        if (isNaN(productEl.new_price)) {
          validationErrors.invalidPrices.push(productEl);
          const productIndex: number =  csvFileData.indexOf(productEl);
          csvFileData.splice(productIndex, 1);
          return;
        }
  
        const isPack = await this.packService.getPacks(productEl.product_code);
        if (!isPack) {
          validProducts.push(productEl);
          const productIndex: number =  csvFileData.indexOf(productEl);
          csvFileData.splice(productIndex, 1);
          return;
        }

        console.log(csvFileData);
        
        
        // // valida se o produto é um pack;
        // if (!isPack) {
        //   const isPackComponent: IPack = await this.packService.getPackByProductId(productEl.product_code);
        //   // verifica se faz parte de um pack
        //   if (!isPackComponent) {
        //     // não faz parte de um pack então vai pra validação de preço
        //     validProducts.push(productEl);
        //     const productIndex: number =  csvFileData.indexOf(productEl);
        //     csvFileData.splice(productIndex, 1);
        //     return;
        //   } else {
        //     // se faz parte de um pack valida se o codigo do pack esta no csv
        //     const isPackCSV = csvFileData.find((csvEl) => isPackComponent.pack_id === Number(csvEl.product_code));
        //     if (!isPackCSV) {
        //       validationErrors.invalidPacks.push(productEl);
        //       const productIndex: number =  csvFileData.indexOf(productEl);
        //       csvFileData.splice(productIndex, 1);
        //       return;
        //     }
        //   }
        // } else {
        //   // se for um pack, valida se pelo menos um code de produto esta no csv
        //   const packsByPackID = await this.packService.getPacks(productEl.product_code);
        //   csvFileData.forEach((csvEl) => {
        //     const isPackComponent = packsByPackID?.find((packEL) => packEL.product_id === Number(csvEl.product_code));
        //     console.log(isPackComponent);
        //     if (isPackComponent) {
        //       validProducts.push(productEl);
        //       const productIndex: number =  csvFileData.indexOf(productEl);
        //       csvFileData.splice(productIndex, 1);
        //       return;
        //     } else {
        //       validationErrors.invalidPacks.push(productEl);
        //       const productIndex: number =  csvFileData.indexOf(productEl);
        //       csvFileData.splice(productIndex, 1);
        //       return;
        //     }
        //   });

        // }
      }));
  
      if (validationErrors.invalidCodes.length > 0 || validationErrors.invalidPrices.length > 0) {
        return { status: 'INVALID_REQUEST', data: { validationErrors, validProducts } };
      }
      return { status: 'SUCCESSFUL', data: { validProducts } };
  
    } catch (error: any) {
      console.error(`Erro ao atualizar os produtos: ${error.message}`);
      return { status: 'ERROR', message: error.message };
    }
  }
  
}