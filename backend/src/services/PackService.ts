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

  public async getPacks() {
    //tipar o retorno 
    try {
      const allPacks = await this.packModel.getAllPacks();

      if (!allPacks) null;

      return allPacks;

    } catch (error: any) {
      console.error(`Erro ao buscar os produtos: ${error.message}`);
      return {
        status: 'INTERNAL_SERVER_ERROR',
        data: { message: error.message },
      }
    }
  }
}