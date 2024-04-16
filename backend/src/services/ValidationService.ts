export default class ValidationService {
  public validateCsvFile(data: any) {
    try {
      let checkedProducts: any = {
        validationErrors: {
          missingPrice: [],
          invalidPrice: [],
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

      return checkedProducts;
    } catch (error: any) {
      console.error(error.message);
    }
  }
}

//tipar