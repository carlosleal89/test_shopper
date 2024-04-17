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
const PackModel_1 = __importDefault(require("../models/PackModel"));
class PackService {
    constructor(packModel = new PackModel_1.default()) {
        this.packModel = packModel;
    }
    getPackByProductId(product_id) {
        return __awaiter(this, void 0, void 0, function* () {
            //tipar o retorno 
            try {
                const packByProductId = yield this.packModel.getPackByProductID(Number(product_id));
                if (!packByProductId)
                    return null;
                return packByProductId;
            }
            catch (error) {
                console.error(`Erro ao buscar o pack: ${error.message}`);
                return error.message;
            }
        });
    }
    getPackByPackId(pack_id) {
        return __awaiter(this, void 0, void 0, function* () {
            //tipar o retorno 
            try {
                const packByPackId = yield this.packModel.getPackByPackId(Number(pack_id));
                if (!packByPackId)
                    return null;
                return packByPackId;
            }
            catch (error) {
                console.error(`Erro ao buscar o pack: ${error.message}`);
                return error.message;
            }
        });
    }
    getPacks(code) {
        return __awaiter(this, void 0, void 0, function* () {
            //tipar o retorno 
            try {
                const allPacks = yield this.packModel.getAllPacks(code);
                if (!allPacks)
                    null;
                return allPacks;
            }
            catch (error) {
                console.error(`Erro ao buscar os produtos: ${error.message}`);
            }
        });
    }
}
exports.default = PackService;
