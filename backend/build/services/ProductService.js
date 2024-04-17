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
                    const isPackOrComponent = yield this.packService.getPacks(productEl.product_code);
                    // verifica se o produto faz parte ou é algum pack.
                    if (!isPackOrComponent) {
                        // se não, envia o produto para validação de preço
                        validProducts.push(productEl);
                        const productIndex = csvFileData.indexOf(productEl);
                        csvFileData.splice(productIndex, 1);
                        return;
                    }
                    console.log('CSV', csvFileData);
                    const isPack = yield this.packService.getPackByPackId(productEl.product_code);
                    if (isPack)
                        console.log(isPack.toJSON());
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
