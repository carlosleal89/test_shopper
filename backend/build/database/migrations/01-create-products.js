"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
exports.default = {
    up(queryInterface) {
        return queryInterface.createTable('products', {
            code: {
                type: sequelize_1.DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true,
            },
            name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            cost_price: {
                type: sequelize_1.DataTypes.DECIMAL,
                allowNull: false,
            },
            sales_price: {
                type: sequelize_1.DataTypes.DECIMAL,
                allowNull: false,
            }
        });
    },
    down(queryInterface) {
        return queryInterface.dropDatabase('products');
    }
};
