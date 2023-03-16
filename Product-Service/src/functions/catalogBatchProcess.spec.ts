import createEvent from "mock-aws-events";
import { catalogBatchProcessFunction } from "./catalogBatchProcess";
import { SNS } from 'aws-sdk';

let mockProductService: {
  getProductById: jest.Mock;
  getAllProducts: jest.Mock;
  create: jest.Mock;
};


const sqsMessageMock = {
  "Records": [
      {
          "messageId": "059f36b4-87a3-44ab-83d2-661975830a7d",
          "receiptHandle": "AQEBwJnKyrHigUMZj6rYigCgxlaS3SLy0a...",
          "body": '{"count":"32","description":"test2","id":"99999995","price":"200","title":"test"}',
          "attributes": {
              "ApproximateReceiveCount": "1",
              "SentTimestamp": "1545082649183",
              "SenderId": "AIDAIENQZJOLO23YVJ4VO",
              "ApproximateFirstReceiveTimestamp": "1545082649185"
          },
          "messageAttributes": {},
          "md5OfBody": "098f6bcd4621d373cade4e832627b4f6",
          "eventSource": "aws:sqs",
          "eventSourceARN": "arn:aws:sqs:us-east-2:123456789012:my-queue",
          "awsRegion": "us-east-2"
      }
]};

const succesfulResponse = { message: "Succesfully processed batch of 5 messages" };

jest.mock('aws-sdk', () => {
  const mockSNS = {
    publish: jest.fn().mockReturnThis(),
    promise: jest.fn(),
  };
  return { SNS: jest.fn(() => mockSNS) };
});


describe("catalogBatchProcess lambda", () => {
  const event = createEvent("aws:sqs", sqsMessageMock);
  let sns;

  beforeEach(() => {
    mockProductService = {
      getProductById: jest.fn(),
      getAllProducts: jest.fn(),
      create: jest.fn(),
    };
    sns = new SNS();

  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return success message if processing is done", async () => {

    const received = await catalogBatchProcessFunction(mockProductService)(event);
    const data = JSON.parse(event.Records[0].body);
    expect(mockProductService.create).toHaveBeenCalledWith(data);
    expect(sns.publish).toHaveBeenCalledTimes(1);
    expect(received).toEqual(succesfulResponse);
  });

})