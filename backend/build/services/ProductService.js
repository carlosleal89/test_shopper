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
                    invalidPriceFormat: [],
                    invalidPacks: [],
                };
                let packProducts = [];
                yield Promise.all(csvFileData.map((productEl) => __awaiter(this, void 0, void 0, function* () {
                    const productByCode = yield this.productModel.getProductByCode(productEl.product_code);
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
                    const isPackOrComponent = yield this.packService.getPacks(Number(productEl.product_code));
                    // verifica se o produto faz parte ou é algum pack.
                    if (!isPackOrComponent) {
                        // se não, envia o produto para validação de preço
                        validProducts.push(productEl);
                    }
                    else {
                        // se for ou fizer parte de um pack, envia para o array de packs para fazer uma validação
                        packProducts.push(productEl);
                    }
                })));
                yield this.validatePack(packProducts);
                if (validationErrors.invalidCodes.length > 0 || validationErrors.invalidPrices.length > 0) {
                    return { status: 'INVALID_REQUEST', data: { validationErrors, validProducts, packProducts } };
                }
                return { status: 'SUCCESSFUL', data: { validProducts } };
            }
            catch (error) {
                console.error(`Erro ao atualizar os produtos: ${error.message}`);
                return { status: 'ERROR', message: error.message };
            }
        });
    }
    validatePack(packsArray) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const packs = [];
                const products = [];
                const packsWithComponents = {};
                const invalidPacks = [];
                const invalidProducts = [];
                // separa os packs dos componentes
                for (const packEl of packsArray) {
                    const isPack = yield this.packService.getPackByPackId(packEl.product_code);
                    if (isPack.length > 0) {
                        packs.push(packEl.product_code);
                        const componentCodes = isPack.map((component) => component.product_id.toString());
                        // atribui os componentes aos packs
                        packsWithComponents[packEl.product_code] = componentCodes;
                    }
                    else {
                        products.push(packEl.product_code);
                    }
                }
                const validPacks = {};
                // verifica quais componentes do CSV pertencem aos packs e adiciona ao packsWithProducts
                for (const packCode of packs) {
                    const packComponents = packsWithComponents[packCode];
                    const includedProducts = products.filter((productCode) => packComponents.includes(productCode));
                    if (includedProducts.length > 0) {
                        validPacks[packCode] = includedProducts;
                    }
                    else {
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
                console.log(packsWithComponents);
                console.log('INVALID_PACKS', invalidPacks);
                console.log('INVALID_PRODUCTS', invalidProducts);
            }
            catch (error) {
                console.error(error.message);
            }
        });
    }
    validatePackPrice(data, currCsvEl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const csvArray = data;
                const packByProductId = yield this.packService.getPackByProductId(currCsvEl);
                for (const csvEl of csvArray) {
                    // const tst = isPackArray.find((packEl: any) => Number(csvEl.product_code) === packEl.product.code);
                    // if (tst) return csvEl;
                }
            }
            catch (error) {
                console.error(error.message);
            }
        });
    }
}
exports.default = ProductService;
