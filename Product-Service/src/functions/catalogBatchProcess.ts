import { SQSEvent } from "aws-lambda/trigger/sqs";
import { ProductServiceInterface } from "src/services/productServiceInterface";
import { IProduct } from "src/types/api-types";

export const catalogBatchProcessFunction =
  (productService: ProductServiceInterface) => async (event: SQSEvent) => {
    try {
      for (const record of event.Records) {
        const { id, description, title, price, count }: IProduct = JSON.parse(
          record.body
        );
        const product = { id, description, title, price, count };
        await productService.create(product);
      }
      return { message: "success" };
    } catch (error) {
      return error;
    }
  };
