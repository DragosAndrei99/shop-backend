import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import schema from './schema';
import cors from '@middy/http-cors'
import mockProductList from '../../../mock/mockDataProductList';

const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  try {
    const data = await mockProductList;
    if(data.length < 1) {
      return formatJSONResponse({error: 'No products available'}, 404);
    }
    return formatJSONResponse({data}, 200);
  } catch (error) {
    return formatJSONResponse({error}, 400);
  }
};

export const main = middyfy(getProductsList).use(cors());
