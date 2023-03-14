import { SQSEvent } from "aws-lambda/trigger/sqs";

export const catalogBatchProcessFunction = async (event: SQSEvent) => {
  event.Records.forEach(record => {
    try {
      const { body } = record;
      console.log(body);
    } catch (error) {
      return error;
    }
  });
  return {message: "success"};
}

