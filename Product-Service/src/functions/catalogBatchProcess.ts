import { SQSEvent } from "aws-lambda/trigger/sqs";
import { ProductServiceInterface } from "src/services/productServiceInterface";
import { IProduct } from "src/types/api-types";
import * as AWS from "aws-sdk";
const sns = new AWS.SNS({ region: "us-east-1" });

const publishToSns = async (event: IProduct) => {
  try {
    const message = {
      message: "Products succesfully created",
      body: event,
    };
    const params = {
      TopicArn: process.env.SNS_TOPIC_ARN,
      Message: JSON.stringify(message),
      Subject: "Notification from catalogBatchProcess lambda",
    };
    const result = await sns.publish(params).promise();
    return result;
  } catch (error) {
    return error;
  }
};

export const catalogBatchProcessFunction =
  (productService: ProductServiceInterface) => async (event: SQSEvent) => {
    if (!event.Records || event.Records.length === 0) {
      console.log("No messages received");
      return;
    }
    try {
      for (const record of event.Records) {
        const { id, description, title, price, count }: IProduct = JSON.parse(
          record.body
        );
        const product: IProduct = { id, description, title, price, count };
        await productService.create(product);
        await publishToSns(product);
      }
      return { message: "Succesfully processed batch of 5 messages" };
    } catch (error) {
      console.error(error);
      return error;
    }
  };
