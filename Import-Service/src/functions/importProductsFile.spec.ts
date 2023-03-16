import createEvent from "mock-aws-events";
import { formatJSONResponse } from "../libs/api-gateway";
import { importProductsFileFunction } from "./importProductsFile ";
import * as AWSMock from "aws-sdk-mock";
import * as AWS from "aws-sdk";
import { ICustomErr } from "src/types/api-types";

describe("importProductsFile lambda", () => {
  AWSMock.setSDKInstance(AWS);
  const s3 = new AWS.S3({ region: "us-east-1" });

  it("should return signed url", async () => {
    const fileName = "file.csv";
    const event = createEvent("aws:apiGateway", {
      queryStringParameters: { name: fileName },
    });
    const statusCode = 200;
    const params = {
      Bucket: "node-aws-task5-2",
      Key: `uploaded/${fileName}`,
      Expires: 60,
      ContentType: "text/csv",
    };
    const url = await s3.getSignedUrlPromise("putObject", params);
    AWSMock.mock("S3", "getSignedUrl", url);
    const received = await importProductsFileFunction(event);
    expect(received).toEqual(formatJSONResponse(url, statusCode));
  });

  it("it should return 400 Bad Request error when file does not have .csv extension", async () => {
    const fileName = "file.txt";
    const event = createEvent("aws:apiGateway", {
      queryStringParameters: { name: fileName },
    });
    const statusCode = 400;
    const params = {
      Bucket: "node-aws-task5",
      Key: `uploaded/${fileName}`,
      Expires: 60,
      ContentType: "text/csv",
    };
    const url = await s3.getSignedUrlPromise("putObject", params);
    AWSMock.mock("S3", "getSignedUrl", url);
    let newError: ICustomErr = { message: "Not a valid csv file" };
    const received = await importProductsFileFunction(event);
    expect(received).toEqual(formatJSONResponse(newError, statusCode));
  });
});
