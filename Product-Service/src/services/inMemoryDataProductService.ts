import products from "./mock-data/mockDataProductList";
import { ProductServiceInterface } from "./productServiceInterface";

class InMemoryDataProductServiceClass
  implements Partial<ProductServiceInterface>
{
  getAllProducts() {
    return Promise.resolve(products);
  }
  getProductById(id: string) {
    return Promise.resolve(products.find((product) => product.id === id));
  }
}

export { InMemoryDataProductServiceClass };
