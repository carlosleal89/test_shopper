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
        invalidPriceFormat: [],
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
          validationErrors.invalidPriceFormat.push(productEl);
          return;
        }
        
        const isPackOrComponent = await this.packService.getPacks(Number(productEl.product_code));
        
        // verifica se o produto faz parte ou é algum pack.
        if (!isPackOrComponent) {
          // se não, envia o produto para validação de preço
          validProducts.push(productEl);
        } else {
          // se for ou fizer parte de um pack, envia para o array de packs para fazer uma validação
          packProducts.push(productEl);
        }
      }));

      await this.validatePack(packProducts)
  
      if (validationErrors.invalidCodes.length > 0 || validationErrors.invalidPrices.length > 0) {
        return { status: 'INVALID_REQUEST', data: { validationErrors, validProducts, packProducts } };
      }
      return { status: 'SUCCESSFUL', data: { validProducts } };

    } catch (error: any) {
      console.error(`Erro ao atualizar os produtos: ${error.message}`);
      return { status: 'ERROR', message: error.message };
    }
  }

  public async validatePack(packsArray: any[]) {
    try {
      const packs: string[] = [];
      const products: string[] = [];
      const packComponentsMap: Record<string, string[]> = {};
      const invalidPacks: string[] = [];
      const invalidProducts: string[] = []; 
      
      // separa os packs dos componentes
      for (const packEl of packsArray) {
        const isPack = await this.packService.getPackByPackId(packEl.product_code);
        if (isPack.length > 0) {
          packs.push(packEl.product_code);
          const componentCodes = isPack.map((component: any) => component.product_id.toString());
          // atribui os componentes aos packs
          packComponentsMap[packEl.product_code] = componentCodes;
        } else {
          products.push(packEl.product_code);
        }
      }

      const packsWithProducts: Record<string, string[]> = {};
      // verifica quais componentes do CSV pertencem aos packs e adiciona ao packsWithProducts
      for (const packCode of packs) {
        const packComponents = packComponentsMap[packCode];
        const includedProducts = products.filter((productCode) => packComponents.includes(productCode));
        if (includedProducts.length > 0) {
          packsWithProducts[packCode] = includedProducts;
        } else {
          invalidPacks.push(packCode);
        }
      }

      for (const productCode of products) {
        let found = false;
        for (const packCode in packsWithProducts) {
          if (packsWithProducts[packCode].includes(productCode)) {
            found = true;
            break;
          }
        }
        if (!found) {
          invalidProducts.push(productCode);
        }
      }

      console.log('VALID', packsWithProducts);
      console.log('INVALID_PACKS', invalidPacks);
      console.log('INVALID_PRODUCTS', invalidProducts);
      console.log(products);     

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