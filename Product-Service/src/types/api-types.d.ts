export interface IStock {
  count: number;
  product_id: string;
}

export interface IProduct {
  count?: number;
  description: string;
  id: string;
  price: number;
  title: string;
}

export type IProducts = IProduct[];

export interface ICustomErr {
  message: string;
}
