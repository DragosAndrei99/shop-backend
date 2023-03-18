import { formatJSONResponse } from '@libs/api-gateway';

export const basicAuthorizerFunction = async (event) => {
  return formatJSONResponse({
    message: `Hello ${event.body.name}, welcome to the exciting Serverless world!`,
    event,
  }, 200);
};

