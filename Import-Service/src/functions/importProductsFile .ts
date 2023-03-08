import { formatJSONResponse } from "@libs/api-gateway";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const importProductsFileFunction = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  return formatJSONResponse({
    message: `Hello ${event.body}, welcome to the exciting Serverless world!`,
    event,
  });
};
