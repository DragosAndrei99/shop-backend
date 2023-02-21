export interface IProduct {
  count: number;
  description: string;
  id: string;
  price: number;
  title: string;
}

export type IProducts = IProduct[]

export interface ICustomErr {
  message: string;
}

export interface ProductServiceInterface {
  getProductById :  (id: string) => Promise<IProduct>;
  getAllProducts : () => Promise<IProducts>;
}