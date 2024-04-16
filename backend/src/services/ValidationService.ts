import { IPack } from '../interfaces/IPack';
import PackService from './PackService';

export default class ValidationService {
  constructor(
    private packService = new PackService(),
  ) {}

  public async validateCsvFile(data: any) {
    try {
      let checkedProducts: any = {
        validationErrors: {
          missingPrice: [],
          invalidPrice: [],
          invalidPack: [],
        },
        validProducts: [],
      };
      for (const dataEl of data) {
        if (!dataEl.new_price) {
          checkedProducts.validationErrors.missingPrice.push(dataEl);
        } else if (isNaN(dataEl.new_price)) {
          checkedProducts.validationErrors.invalidPrice.push(dataEl);
        } else {
          checkedProducts.validProducts.push(dataEl);
        }
      }
      const { invalidProducts } = await this.checkProductsInPacks(checkedProducts.validProducts);
      
      checkedProducts.validationErrors.invalidPack.push(...invalidProducts);

      await this.validatePacks(checkedProducts.validProducts);
      
      return checkedProducts;
    } catch (error: any) {
      console.error(error.message);
    }
  }

  public async checkProductsInPacks(data: any) {
    try {
      const validProducts = data;
      const packsList: any = await this.packService.getPacks();      
      
      let checkedProducts: any = {
        invalidProducts: [],
      };
      let productInpack: any = [];
      
      for (const product of validProducts) {
        // verifica se os produtos fazem parte de algum pack.
        const isProductInPacks: any = packsList
          .find((packEl: IPack) => packEl.product_id === Number(product.product_code));

        if (isProductInPacks) {
          const isPackInCSVFile = validProducts
            .find((productEl: any) => Number(productEl.product_code) === isProductInPacks.pack_id);
          
          if (!isPackInCSVFile) {
            // se sim, mas não houver o código do pack no CSV, adiciona o produto ao array de produtos invalidos;
            // e remove o elemento do array de produtos validos;
            const productIndex = validProducts.indexOf(product);
            checkedProducts.invalidProducts.push(product);
            validProducts.splice(productIndex, 1);
          }
        }
      }
      return checkedProducts;

    } catch (error: any) {
      console.error(error.message);
    }
  }

   public async validatePacks(data: any) {
    try {
      const validProducts = data;      
      
      let checkedProducts: any = {
        invalidProducts: [],
      };
      let productInpack: any = [];
      
      for (const product of validProducts) {
        // verifica se os produtos fazem parte de algum pack.
        const isProductInPacks: any = await this.packService.getPackByProductId(Number(product.product_code));

        if (isProductInPacks) {
          const isPackInCSVFile = validProducts
            .find((productEl: any) => Number(productEl.product_code) === isProductInPacks.pack_id);

          if (!isPackInCSVFile) {
            // se sim, mas não houver o código do pack no CSV, adiciona o produto ao array de produtos invalidos
            const productIndex = validProducts.indexOf(product);
            checkedProducts.invalidProducts.push(product);
            validProducts.splice(productIndex, 1);
          }
        }
      }
      return checkedProducts;

    } catch (error: any) {
      console.error(error.message);
    }
  }
}

//tipar