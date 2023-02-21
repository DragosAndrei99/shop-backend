import { formatJSONResponse } from '@libs/api-gateway';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ICustomErr } from 'src/services/productServiceInterface';
import { ProductServiceInterface } from 'src/services/productServiceInterface';

export const getProductsByIdFunction = (productService : ProductServiceInterface) => async (event : APIGatewayProxyEvent) : Promise<APIGatewayProxyResult> => {
  try {
    const {productId = ''} = event.pathParameters;
    const product = await productService.getProductById(productId);
    if(!product) {
      let newError : ICustomErr = {message: 'Product not found' }
      return formatJSONResponse({newError}, 404);
    }
    return formatJSONResponse({product}, 200);
  } catch (error) {
    let newError = error;
    return formatJSONResponse({newError}, 400);
  }
};