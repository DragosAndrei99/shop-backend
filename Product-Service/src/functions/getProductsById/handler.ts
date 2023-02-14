import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import schema from './schema';
import cors from '@middy/http-cors'
import mockProductList from '../../../mock/mockDataProductList';
import { CustomErr, Product } from 'src/types/api-types';

const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    const data : Product[] = await mockProductList;
    if(data.length < 1) {
      let newError : CustomErr = {message: 'No products available' }
      return formatJSONResponse({newError}, 404);
    }
    const {productId} = event.pathParameters;
    const foundProduct : Product = data.find(elem => elem.id === productId);
    if(foundProduct === undefined) {
      let newError : CustomErr = {message: 'Product not found' }
      return formatJSONResponse({newError}, 404);
    }
    return formatJSONResponse({foundProduct}, 200);
  } catch (error) {
    let newError = error;
    return formatJSONResponse({newError}, 400);
  }
};

export const main = middyfy(getProductsById).use(cors());
