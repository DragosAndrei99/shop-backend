import { formatJSONResponse } from '@libs/api-gateway';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ICustomErr } from 'src/services/productServiceInterface';
import { ProductServiceInterface } from 'src/services/productServiceInterface';


export const getProductsListFunction = (productService : ProductServiceInterface) => async (_event : APIGatewayProxyEvent) : Promise<APIGatewayProxyResult>   => {
  try {
    const data = await productService.getAllProducts();
    if(data.length < 1) {
      let newError : ICustomErr = {message: 'No products available' }
      return formatJSONResponse({newError}, 404);
    }
    return formatJSONResponse({data}, 200);
  } catch (error) {
    let newError = error;
    return formatJSONResponse({newError}, 400);
  }
};