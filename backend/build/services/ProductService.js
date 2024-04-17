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
const PackService_1 = __importDefault(require("./PackService"));
const csvParser_1 = __importDefault(require("../utils/csvParser"));
// import ValidationService from './ValidationService';
class ProductService {
    constructor(productModel = new ProductModel_1.default(), packService = new PackService_1.default()) {
        this.productModel = productModel;
        this.packService = packService;
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
    validateData(csvFileName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const csvFileData = yield (0, csvParser_1.default)(csvFileName);
                let validProducts = [];
                let validationErrors = {
                    invalidCodes: [],
                    invalidPrices: [],
                    invalidPacks: [],
                };
                yield Promise.all(csvFileData.map((productEl) => __awaiter(this, void 0, void 0, function* () {
                    const productByCode = yield this.productModel.getProductByCode(productEl.product_code);
                    // Valida se o id existe
                    if (!productByCode) {
                        validationErrors.invalidCodes.push(productEl);
                        const productIndex = csvFileData.indexOf(productEl);
                        csvFileData.splice(productIndex, 1);
                        return;
                    }
                    // Valida se o preço é um número válido
                    if (isNaN(productEl.new_price)) {
                        validationErrors.invalidPrices.push(productEl);
                        const productIndex = csvFileData.indexOf(productEl);
                        csvFileData.splice(productIndex, 1);
                        return;
                    }
                    const isPack = yield this.packService.getPacks(productEl.product_code);
                    console.log(isPack);
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
                })));
                if (validationErrors.invalidCodes.length > 0 || validationErrors.invalidPrices.length > 0) {
                    return { status: 'INVALID_REQUEST', data: { validationErrors, validProducts } };
                }
                return { status: 'SUCCESSFUL', data: { validProducts } };
            }
            catch (error) {
                console.error(`Erro ao atualizar os produtos: ${error.message}`);
                return { status: 'ERROR', message: error.message };
            }
        });
    }
}
exports.default = ProductService;
