"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const _1 = __importDefault(require("."));
class SequelizeProducts extends sequelize_1.Model {
}
exports.default = SequelizeProducts;
SequelizeProducts.init({
    code: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    cost_price: {
        type: sequelize_1.DataTypes.DECIMAL(9, 2),
        allowNull: false,
    },
    sales_price: {
        type: sequelize_1.DataTypes.DECIMAL(9, 2),
        allowNull: false,
    },
}, {
    sequelize: _1.default,
    modelName: 'SequelizeProducts',
    tableName: 'products',
    timestamps: false,
    underscored: true,
});
