import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import schema from './schema';

import mockProductList from './productList';

const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  return formatJSONResponse({mockProductList});
};

export const main = middyfy(getProductsList);
