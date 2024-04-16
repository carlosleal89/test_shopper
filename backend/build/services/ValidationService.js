"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ValidationService {
    validateCsvFile(data) {
        try {
            let fieldsErrors = {
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
        }
        catch (error) {
            console.error(error.message);
        }
    }
}
exports.default = ValidationService;
