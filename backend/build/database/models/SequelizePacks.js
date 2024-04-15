"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const _1 = __importDefault(require("."));
const SequelizeProducts_1 = __importDefault(require("./SequelizeProducts"));
class SequelizePacks extends sequelize_1.Model {
}
exports.default = SequelizePacks;
SequelizePacks.init({
    id: {
        type: sequelize_1.DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    pack_id: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: SequelizeProducts_1.default,
            key: 'code',
        }
    },
    product_id: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: SequelizeProducts_1.default,
            key: 'code',
        }
    },
    qty: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
    },
}, {
    sequelize: _1.default,
    modelName: 'SequelizePacks',
    tableName: 'packs',
    timestamps: false,
    underscored: true,
});
