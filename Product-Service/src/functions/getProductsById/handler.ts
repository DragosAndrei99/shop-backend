import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import schema from './schema';
import cors from '@middy/http-cors'
import mockProductList from '../../../mock/mockDataProductList';

const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const data = mockProductList;
  
  const {productId} = event.pathParameters;
  const foundProduct = data.filter(elem => elem.id === productId);
  return formatJSONResponse({foundProduct});
};

export const main = middyfy(getProductsById).use(cors());
