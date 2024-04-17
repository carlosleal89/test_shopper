import { IPack } from "./IPack";

export interface IPackModel {
  getPackByProductID(product_id: number): Promise<IPack | null>;
  getPacksByPackId(pack_id: number): Promise<IPack[] | null>;
  getAllPacks(code: number): Promise<IPack[] | null>;
}