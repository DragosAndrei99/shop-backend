import { formatJSONResponse } from "../libs/api-gateway";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as AWS from 'aws-sdk';
import { ICustomErr } from "src/types/api-types";

export const importProductsFileFunction = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const s3 = new AWS.S3({region: 'us-east-1'});
  try {
    const {name} = event.queryStringParameters;
    if(!name.match(/^.*\.(csv)$/gi)) {
      let newError: ICustomErr = { message: "Not a valid csv file" };
      return formatJSONResponse(newError, 400);
    }
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `uploaded/${name}`,
      Expires: 60,
      ContentType: 'text/csv'
    };
    const url = await s3.getSignedUrlPromise('putObject', params);
    return formatJSONResponse(url, 200);
  } catch (error) {
    return formatJSONResponse({error}, 500)
  }
};
