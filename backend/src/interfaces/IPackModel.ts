import { IPack } from "./IPack";

export interface IPackModel {
  getPackByProductID(product_id: number): Promise<IPack | null>;
  getPackByPackId(pack_id: number): Promise<IPack | null>;
  getAllPacks(): Promise<IPack[] | null>;
}