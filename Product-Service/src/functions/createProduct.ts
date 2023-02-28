import { formatJSONResponse } from "../libs/api-gateway";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { IProduct } from "src/types/api-types";
import { ProductServiceInterface } from "src/services/productServiceInterface";

export const createProduct = ( productService : ProductServiceInterface) => async (event: APIGatewayProxyEvent) : Promise<APIGatewayProxyResult> => {
  try {
    const {id, description, title, price, count} : IProduct = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    const product = {id, description, title, price, count};
    const result = await productService.create(product);
    return formatJSONResponse(result, 200);
  } catch (error) {
    return formatJSONResponse(error.message, error.statusCode = 500);
  }
}