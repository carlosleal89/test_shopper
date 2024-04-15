import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import db from '.';

export default class SequelizeProducts extends Model<InferAttributes<SequelizeProducts>,
InferCreationAttributes<SequelizeProducts>> {
  declare code: BigInt;
  declare name: string;
  declare cost_price: number;
  declare sales_price: number;
}

SequelizeProducts.init({
  code: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  cost_price: {
    type: DataTypes.DECIMAL(9,2),
    allowNull: false,
  },
  sales_price: {
    type: DataTypes.DECIMAL(9,2),
    allowNull: false,
  },
}, {
  sequelize: db,
  modelName: 'SequelizeProducts',
  tableName: 'products',
  timestamps: false,
  underscored: true,
});