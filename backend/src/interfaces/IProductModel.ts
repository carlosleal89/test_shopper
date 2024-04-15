import { IProduct } from "./IProduct";

export interface IProductModel {
  getAllProducts(): Promise<IProduct[] | null>;
}