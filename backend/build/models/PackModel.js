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
const SequelizePacks_1 = __importDefault(require("../database/models/SequelizePacks"));
const SequelizeProducts_1 = __importDefault(require("../database/models/SequelizeProducts"));
const sequelize_1 = require("sequelize");
class PackModel {
    constructor() {
        this.model = SequelizePacks_1.default;
    }
    getPackByProductID(product_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const packByProductId = yield this.model.findOne({
                    where: {
                        product_id
                    }
                });
                if (!packByProductId)
                    return null;
                return packByProductId;
            }
            catch (error) {
                console.error(`Erro ao buscar o pack: ${error.message}`);
                throw new Error(`Erro ao buscar o pack: ${error.message}`);
            }
        });
    }
    getPacksByPackId(pack_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const packByPackId = yield this.model.findAll({
                    where: {
                        pack_id
                    },
                    include: [
                        {
                            model: SequelizeProducts_1.default,
                            as: 'product'
                        }
                    ]
                });
                if (!packByPackId)
                    return null;
                return packByPackId;
            }
            catch (error) {
                console.error(`Erro ao buscar o pack: ${error.message}`);
                throw new Error(`Erro ao buscar o pack: ${error.message}`);
            }
        });
    }
    getAllPacks(code) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allPacks = yield this.model.findAll({
                    where: {
                        [sequelize_1.Op.or]: [
                            { pack_id: code },
                            { product_id: code }
                        ]
                    }
                });
                if (allPacks.length === 0)
                    return null;
                return allPacks;
            }
            catch (error) {
                console.error(`Erro ao buscar os packs: ${error.message}`);
                throw new Error(`Erro ao buscar os packs: ${error.message}`);
            }
        });
    }
}
exports.default = PackModel;
