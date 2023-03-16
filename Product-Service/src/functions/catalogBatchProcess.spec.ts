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
          "body": '{"id":"99999995","description":"test2","title":"test","price":"200","count":"32"}',
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

mockProductService = {
  getProductById: jest.fn(),
  getAllProducts: jest.fn(),
  create: jest.fn(),
};


describe("catalogBatchProcess lambda", () => {
  const event = createEvent("aws:sqs", sqsMessageMock);
  let sns;
  sns = new SNS();
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return success message if processing is done", async () => {
    const data = JSON.parse(event.Records[0].body);
    const message = {
      message: "Products succesfully created",
      body: data
    }
    const received = await catalogBatchProcessFunction(mockProductService)(event);
    expect(mockProductService.create).toHaveBeenCalledWith(data);
    expect(sns.publish).toHaveBeenCalledWith({
      TopicArn: process.env.SNS_TOPIC_ARN,
      Message: JSON.stringify(message),
      Subject: "Notification from catalogBatchProcess lambda"
    });
    expect(received).toEqual(succesfulResponse);
  });

  it("should handle errors when sns fails", async () => {
    const error = new Error('Test error');
    sns.publish.mockReturnValueOnce({
      promise: jest.fn().mockRejectedValue(error)
    });
    const received = await catalogBatchProcessFunction(mockProductService)(event);
    expect(received).toEqual(error.message);
  });

  it("should return undefined if no messages received", async () => {
    event.Records.length = 0;
    const received = await catalogBatchProcessFunction(mockProductService)(event);
    expect(received).toEqual(undefined);
  })

  it("should handle errors when create product fails", async () => {
    const error = new Error('Test error');
    mockProductService.create.mockRejectedValueOnce(error);
    const received = await catalogBatchProcessFunction(mockProductService)(event);
    expect(received).toEqual(error.message);
  });
})