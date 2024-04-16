import SequelizePacks from '../database/models/SequelizePacks';
import { IPack } from '../interfaces/IPack';
import { IPackModel } from '../interfaces/IPackModel';

export default class PackModel implements IPackModel {
  private model = SequelizePacks;

  async getPackByProductID(product_id: number): Promise<IPack | null> {
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
}