import { SQSEvent } from "aws-lambda/trigger/sqs";
import { ProductServiceInterface } from "src/services/productServiceInterface";
import { IProduct } from "src/types/api-types";
import * as AWS from "aws-sdk";
const sns = new AWS.SNS({ region: "us-east-1" });


const publishToSns = async (event) => {
  const message = {
    message: "Products succesfully created",
    body: event
  }
  const params= {
    TopicArn: process.env.SNS_TOPIC_ARN,
    Message: JSON.stringify(message),
    Subject: "Notification from catalogBatchProcess lambda"
  }

  await sns.publish(params, async function (err, data) {
    if (err) {
      console.log(err.stack);
      return;
  }
  console.log('Search push suceeded: ' + JSON.stringify(data));
  return data;
  }).promise();
}

export const catalogBatchProcessFunction =
  (productService: ProductServiceInterface) => async (event: SQSEvent) => {
    if (!event.Records || event.Records.length === 0) {
      console.log('No messages received');
      return;
    }

    try {    
      for (const record of  event.Records) {
        const { id, description, title, price, count }: IProduct = JSON.parse(
          record.body
        );
        const product: IProduct = { id, description, title, price, count };
        const dynamoResult = productService.create(product);
        const snsResult =  publishToSns(product);
        await Promise.all([dynamoResult, snsResult]);
      }
      if (event.Records.length < 5) {
        console.log(`Received less than 5 messages: ${event.Records.length}`);
        return;
      }
      console.log('Received 5 messages successfully');

      return { message: "Succesfully processed batch of 5 messages" };
    } catch (error) {
      return error;
    }
  };
