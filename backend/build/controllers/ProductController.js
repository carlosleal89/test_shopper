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
const ProductService_1 = __importDefault(require("../services/ProductService"));
const mapStatusToHTTP_1 = __importDefault(require("../utils/mapStatusToHTTP"));
class ProductController {
    constructor(productService = new ProductService_1.default()) {
        this.productService = productService;
    }
    getAllProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const serviceResponse = yield this.productService.getProducts();
            return res.status((0, mapStatusToHTTP_1.default)(serviceResponse.status)).json(serviceResponse.data);
        });
    }
    updateProductPrice(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.file) {
                const serviceResponse = yield this.productService.updateProductPrice(req.file.filename);
                return res.status((0, mapStatusToHTTP_1.default)(serviceResponse.status)).json(serviceResponse.data);
            }
            return res.status((0, mapStatusToHTTP_1.default)('INVALID_REQUEST')).json('Requisição inválida');
        });
    }
}
exports.default = ProductController;
