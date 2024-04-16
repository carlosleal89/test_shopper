export default class ValidationService {
  public validateCsvFile(data: any) {
    try {
      let fieldsErrors: any = {
        missingFields: [],
        invalidValues: [],
      };
      for (const dataEl of data) {
        if (!dataEl.product_code || !dataEl.new_price) {
          fieldsErrors.missingFields = dataEl;
        }
        if (isNaN(dataEl.new_price)) {          
          fieldsErrors.invalidValues.push(dataEl);
        }
      }

      return fieldsErrors;
    } catch (error: any) {
      console.error(error.message);
    }
  }
}