export default class ValidationService {
  public validateCsvFile(data: any) {
    try {
      let fieldsErrors: any = {
        missingPrice: [],
        invalidPrice: [],
      };
      for (const dataEl of data) {
        if (!dataEl.new_price) {
          fieldsErrors.missingPrice.push(dataEl);
        }
        if (isNaN(dataEl.new_price)) {          
          fieldsErrors.invalidPrice.push(dataEl);
        }
      }

      return fieldsErrors;
    } catch (error: any) {
      console.error(error.message);
    }
  }
}