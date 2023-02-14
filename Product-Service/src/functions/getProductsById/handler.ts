import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import schema from './schema';
import cors from '@middy/http-cors'
import mockProductList from '../../../mock/mockDataProductList';

const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    const data = await mockProductList;
    if(data.length < 1) {
      return formatJSONResponse({error: 'No products available'}, 404);
    }
    const {productId} = event.pathParameters;
    const foundProduct = data.filter(elem => elem.id === productId);
    if(foundProduct === undefined) {
      return formatJSONResponse({error: 'Product not found'}, 404);
    }
    return formatJSONResponse({foundProduct}, 200);
  } catch (error) {
    return formatJSONResponse({error}, 400);
  }
};

export const main = middyfy(getProductsById).use(cors());
