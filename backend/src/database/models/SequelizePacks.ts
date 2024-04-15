import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import db from '.';
import SequelizeProducts from './SequelizeProducts';

export default class SequelizePacks extends Model<InferAttributes<SequelizePacks>,
InferCreationAttributes<SequelizePacks>> {
  declare id: number;
  declare pack_id: number;
  declare product_id: number;
  declare qty: number;
}

SequelizePacks.init({
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
      model: SequelizeProducts,
      key: 'code',      
    }
  },
  product_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: SequelizeProducts,
      key: 'code',      
    }
  },
  qty: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
}, {
  sequelize: db,
  modelName: 'SequelizePacks',
  tableName: 'packs',
  timestamps: false,
  underscored: true,
})