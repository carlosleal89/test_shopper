import { Model, QueryInterface, DataTypes } from 'sequelize';
import { IProduct } from '../../interfaces/IProduct';

export default {
  up(queryInterface: QueryInterface) {
    return queryInterface.createTable<Model<IProduct>>('products', {
      code: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cost_price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      sales_price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      }
    });
  },

  down(queryInterface: QueryInterface) {
    return queryInterface.dropDatabase('products');
  }
};

