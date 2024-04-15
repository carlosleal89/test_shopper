import { IPack } from "./IPack";

export interface IPackModel {
  getAllPacks(): Promise<IPack | null>;
}