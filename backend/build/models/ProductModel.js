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
const SequelizeProducts_1 = __importDefault(require("../database/models/SequelizeProducts"));
class ProductModel {
    constructor() {
        this.model = SequelizeProducts_1.default;
    }
    getAllProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allProducts = yield this.model.findAll();
                if (allProducts.length === 0)
                    return null;
                return allProducts;
            }
            catch (error) {
                console.error(`Erro ao buscar os produtos: ${error.message}`);
                throw new Error(`Erro ao buscar os produtos: ${error.message}`);
            }
        });
    }
    getProductByCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const productByid = yield this.model.findOne({
                    where: {
                        code
                    }
                });
                if (!productByid)
                    return null;
                return productByid;
            }
            catch (error) {
                console.error(`Erro ao buscar o produto: ${error.message}`);
                throw new Error(`Erro ao buscar o produto: ${error.message}`);
            }
        });
    }
}
exports.default = ProductModel;
