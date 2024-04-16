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
      const {validProducts, invalidProducts} = await this.checkProductsInPacks(checkedProducts.validProducts);
      checkedProducts.validProducts.push(validProducts);
      checkedProducts.validationErrors.invalidPack.push(invalidProducts);
      console.log(invalidProducts);
      
      return checkedProducts;
    } catch (error: any) {
      console.error(error.message);
    }
  }

  public async checkProductsInPacks(data: any) {
    try {
      const validProducts = data;
      
      let checkedProducts: any = {
        validProducts: [],
        invalidProducts: [],
      };
      let productInpack: any = [];
      
      for (const product of validProducts) {
        // verifica se os produtos fazem parte de algum pack.
        // se sim, verificar se existe o preço de reajuste do pack.
        const isProductInPacks: any = await this.packService.getPackByProductId(Number(product.product_code));
        if (isProductInPacks) {
          const isPackInCSVFile = validProducts
            .find((productEl: any) => Number(productEl.product_code) === isProductInPacks.pack_id);
          
          if (!isPackInCSVFile) {
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