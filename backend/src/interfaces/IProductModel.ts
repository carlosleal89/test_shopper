import { IProduct } from "./IProduct";

export interface IProductModel {
  getAllProducts(): Promise<IProduct[] | null>;
  getProductByCode(code: number): Promise<IProduct | null>;
}