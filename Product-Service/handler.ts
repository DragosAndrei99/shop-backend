import { handleErrors, middyfy, validate } from "./src/libs/lambda";
import cors from "@middy/http-cors";
import * as functions from "./src/functions";
// import { InMemoryDataProductServiceClass } from "./src/services/inMemoryDataProductService";
import { DynamoProductService } from "./src/services/dynamoProductService";

const productService = new DynamoProductService();

export const getProductsList = middyfy(
  functions.getProductsListFunction(productService)
).use(cors());
export const getProductsById = middyfy(
  functions.getProductsByIdFunction(productService)
).use(cors());
export const createProduct = handleErrors(
  validate(middyfy(functions.createProduct(productService)))
);
