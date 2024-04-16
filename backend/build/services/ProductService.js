"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ProductModel_1 = __importDefault(require("../models/ProductModel"));
const csvParser_1 = __importDefault(require("../utils/csvParser"));
const ValidationService_1 = __importDefault(require("./ValidationService"));
class ProductService {
    constructor(productModel = new ProductModel_1.default(), validationService = new ValidationService_1.default()) {
        this.productModel = productModel;
        this.validationService = validationService;
    }
    getProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allProducts = yield this.productModel.getAllProducts();
                if (!allProducts) {
                    return { status: 'NO_CONTENT', data: { message: '' } };
                }
                return { status: 'SUCCESSFUL', data: allProducts };
            }
            catch (error) {
                console.error(`Erro ao buscar os produtos: ${error.message}`);
                return {
                    status: 'INTERNAL_SERVER_ERROR',
                    data: { message: error.message },
                };
            }
        });
    }
    checkIfProductsExist(productsList) {
        return __awaiter(this, void 0, void 0, function* () {
            // tipar o retorno
            try {
                let checkProductsCode = {
                    invalidCodes: [],
                    validCodes: [],
                };
                //tipar checkProductsCode
                for (const product of productsList) {
                    const isProduct = yield this.productModel.getProductByCode(Number(product.product_code));
                    if (!isProduct) {
                        checkProductsCode.invalidCodes.push(product.product_code);
                    }
                    else {
                        checkProductsCode.validCodes.push(product);
                    }
                }
                ;
                return checkProductsCode;
            }
            catch (error) {
                // refatorar tratativa de erro
                console.error(`Erro ao buscar os produtos: ${error.message}`);
                return error.message;
            }
        });
    }
    updateProductPrice(csvFileName) {
        return __awaiter(this, void 0, void 0, function* () {
            //mudar nome da função para validateCsvFile (ou algo assim)
            // tipar retorno e parametro
            try {
                const csvFileData = yield (0, csvParser_1.default)(csvFileName);
                const validateProductCodes = yield this.checkIfProductsExist(csvFileData);
                //tipar validateProductCodes
                const { validCodes, invalidCodes } = validateProductCodes;
                const validateFields = this.validationService.validateCsvFile(validCodes);
                //tipar
                let checkedProducts = {
                    validatedProducts: validCodes,
                    validationErrors: {
                        invalidProductsCodes: []
                    }
                };
                if (validateProductCodes.invalidCodes) {
                    checkedProducts.validationErrors.invalidProductsCodes.push(invalidCodes);
                }
                if (validateFields) {
                    checkedProducts.validationErrors.invalidFields = validateFields;
                }
                if (checkedProducts.validationErrors) {
                    return { status: 'INVALID_REQUEST', data: checkedProducts };
                }
                return { status: 'SUCCESSFUL', data: checkedProducts };
            }
            catch (error) {
                // refatorar tratativa de erro
                console.error(`Erro ao atualizar os produtos: ${error.message}`);
                return error.message;
            }
        });
    }
}
exports.default = ProductService;
