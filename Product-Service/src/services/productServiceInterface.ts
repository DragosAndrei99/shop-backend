import { IProduct, IProducts } from "src/types/api-types";

export interface ProductServiceInterface {
  getProductById: (id: string) => Promise<IProduct>;
  getAllProducts: () => Promise<IProducts>;
}
