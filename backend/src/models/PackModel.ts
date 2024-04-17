import SequelizePacks from '../database/models/SequelizePacks';
import { IPack } from '../interfaces/IPack';
import { IPackModel } from '../interfaces/IPackModel';
import { Op } from 'sequelize';

export default class PackModel implements IPackModel {
  private model = SequelizePacks;

  public async getPackByProductID(product_id: number): Promise<IPack | null> {
    try {
      const packByProductId = await this.model.findOne({
        where: {
          product_id
        }
      });

      if (!packByProductId) return null;

      return packByProductId as IPack;

    } catch (error: any) {
      console.error(`Erro ao buscar o pack: ${error.message}`);
      throw new Error(`Erro ao buscar o pack: ${error.message}`);
    }
  }

  public async getPackByPackId(pack_id: number): Promise<IPack | null> {
    try {
      const packByPackId = await this.model.findOne({
        where: {
          pack_id
        }
      });

      if (!packByPackId) return null;

      return packByPackId as IPack;

    } catch (error: any) {
      console.error(`Erro ao buscar o pack: ${error.message}`);
      throw new Error(`Erro ao buscar o pack: ${error.message}`);
    }
  }
  
  public async getAllPacks(code: number): Promise<IPack[] | null> {
    try {
      const allPacks = await this.model.findAll({
        where: {
          [Op.or]: [
            { pack_id: code },
            { product_id: code }
          ]
        }
      });

      if (allPacks.length === 0) return null;

      return allPacks as IPack[];
    } catch (error: any) {
      console.error(`Erro ao buscar os packs: ${error.message}`);
      throw new Error(`Erro ao buscar os packs: ${error.message}`);
    }
  }
}