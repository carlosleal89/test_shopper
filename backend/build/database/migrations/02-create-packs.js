"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
exports.default = {
    up(queryInterface) {
        return queryInterface.createTable('packs', {
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
                    model: 'products',
                    key: 'code',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
            product_id: {
                type: sequelize_1.DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: 'products',
                    key: 'code',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
            qty: {
                type: sequelize_1.DataTypes.BIGINT,
                allowNull: false,
            },
        });
    },
    down(queryInterface) {
        return queryInterface.dropDatabase('packs');
    }
};
