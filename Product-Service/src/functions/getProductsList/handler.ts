import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import schema from './schema';
import cors from '@middy/http-cors'
import mockProductList from './productList';

const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  const data = mockProductList;
  return formatJSONResponse({data});
};

export const main = middyfy(getProductsList).use(cors());
