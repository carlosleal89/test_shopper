import { Model, QueryInterface, DataTypes } from 'sequelize';
import { IPack } from '../../interfaces/IPack';

export default {
  up(queryInterface: QueryInterface) {
    return queryInterface.createTable<Model<IPack>>('packs', {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      pack_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'products',
          key: 'code',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      product_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'products',
          key: 'code',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      qty: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },      
    })
  },
  down(queryInterface: QueryInterface) {
    return queryInterface.dropDatabase('packs');
  }
};