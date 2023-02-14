import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import schema from './schema';
import cors from '@middy/http-cors'
import mockProductList from '../../../mock/mockDataProductList';
import { CustomErr, Product } from 'src/types/api-types';

const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  try {
    const data : Product[] = await mockProductList;
    if(data.length < 1) {
      let newError : CustomErr = {message: 'No products available' }
      return formatJSONResponse({newError}, 404);
    }
    return formatJSONResponse({data}, 200);
  } catch (error) {
    let newError = error;
    return formatJSONResponse({newError}, 400);
  }
};

export const main = middyfy(getProductsList).use(cors());
