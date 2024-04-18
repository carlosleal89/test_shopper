import ProductModel from '../models/ProductModel';
import PackService from './PackService';
import { IProductModel } from '../interfaces/IProductModel';
import { ServiceResponse, ServiceResponseError } from '../interfaces/ServiceResponse';
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
      //tipar
      let validProducts: any = [];
      let validationErrors: any = {
        invalidCodes: [],
        invalidPriceFormat: [],
        invalidPrice: [],
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
          // se não, valida o preço
          const isValidPrice = this
            .validateProductPrice(
              Number(productEl.new_price),
              Number(productByCode.cost_price),
              Number(productByCode.sales_price)
            );
          // se o preço for valido, envia para o array de produtos validados
          if (isValidPrice) validProducts.push(productEl);
          // se o preço for invalido, envia para o array de produtos invalidos
          else validationErrors.invalidPrice.push(productEl);
          return;
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
      return { status: 'INTERNAL_SERVER_ERROR', message: error.message };
    }
  }

  public async validatePack(packsArray: any[]) {
    try {
      const packs: string[] = [];
      const products: string[] = [];
      const packsWithComponents: Record<string, string[]> = {};
      const invalidPacks: string[] = [];
      const invalidProducts: string[] = []; 
      
      // separa os packs dos componentes
      console.log('TESTE');
      for (const packEl of packsArray) {
        
        const isPack = await this.packService.getPackByPackId(packEl.product_code);
        if (isPack.length > 0) {
          packs.push(packEl.product_code);
          const componentCodes = isPack.map((component: any) => component.product_id.toString());
          // atribui os componentes aos packs
          packsWithComponents[packEl.product_code] = componentCodes;
        } else {
          products.push(packEl.product_code);
        }
      }

      const validPacks: Record<string, string[]> = {};
      // verifica quais componentes do CSV pertencem aos packs e adiciona ao packsWithProducts
      for (const packCode of packs) {
        const packComponents = packsWithComponents[packCode];
        const includedProducts = products.filter((productCode) => packComponents.includes(productCode));
        if (includedProducts.length > 0) {
          validPacks[packCode] = includedProducts;
        } else {
          invalidPacks.push(packCode);
        }
      }

      // verifica quais produtos não fazem parte de nenhum pack enviado no csv
      for (const productCode of products) {
        let found = false;
        for (const packCode in validPacks) {
          if (validPacks[packCode].includes(productCode)) {
            found = true;
            break;
          }
        }
        if (!found) {
          invalidProducts.push(productCode);
        }
      }

      console.log('VALID', validPacks);      
      console.log('INVALID_PACKS', invalidPacks);
      console.log('INVALID_PRODUCTS', invalidProducts);

    } catch (error: any) {
      console.error(error.message);
      return { status: 'INTERNAL_SERVER_ERROR', data: error.message };
    }
  }

  public validateProductPrice(new_price: number, cost_price: number, sales_price: number): boolean | ServiceResponseError {
    try {
      if (new_price < cost_price) {
        return false;
      }

      if (new_price > sales_price) {
        const priceDiff = new_price - sales_price;
        const percentage = (priceDiff / sales_price) * 100;
        if (percentage > 10) return false;
      }

      if (new_price < sales_price) {
        const priceDiff = sales_price - new_price;
        const percentage = (priceDiff / sales_price) * 100;
        if (percentage > 10) return false;
      } 

      return true;

    } catch (error: any) {
      console.error(error.message);
      return { status: 'INTERNAL_SERVER_ERROR', data: error.message };
    }
  }
}