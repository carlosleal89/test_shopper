import PackModel from '../models/PackModel';
import { IPack } from '../interfaces/IPack';
import { IPackModel } from '../interfaces/IPackModel';
import { ServiceResponse } from '../interfaces/ServiceResponse';

export default class PackService {
  constructor(
    private packModel: IPackModel = new PackModel(),
  ) {}

  public async getPackByProductId(product_id: number) {
  //tipar o retorno 
    try {
      const packByProductId = await this.packModel.getPackByProductID(Number(product_id));
      if (!packByProductId) return null;

      return packByProductId;

    } catch (error: any) {
      console.error(`Erro ao buscar o pack: ${error.message}`);
      return error.message;
    }
  }

  public async getPackByPackId(pack_id: number) {
    //tipar o retorno 
      try {
        const packByPackId = await this.packModel.getPackByPackId(Number(pack_id));
        if (!packByPackId) return null;
  
        return packByPackId;
  
      } catch (error: any) {
        console.error(`Erro ao buscar o pack: ${error.message}`);
        return error.message;
      }
    }

  public async getPacks(code: number) {
    //tipar o retorno 
    try {
      const allPacks = await this.packModel.getAllPacks(code);

      if (!allPacks) null;

      return allPacks;

    } catch (error: any) {
      console.error(`Erro ao buscar os produtos: ${error.message}`);
    }
  }
}