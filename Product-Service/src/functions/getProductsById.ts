import { formatJSONResponse } from "../libs/api-gateway";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { ICustomErr } from "src/types/api-types";
import { ProductServiceInterface } from "src/services/productServiceInterface";

export const getProductsByIdFunction =
  (productService: ProductServiceInterface) =>
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const { productId = "" } = event.pathParameters;
      const product = await productService.getProductById(productId);
      if (!product) {
        let newError: ICustomErr = { message: "Product not found" };
        return formatJSONResponse(newError, 404);
      }
      return formatJSONResponse(product, 200);
    } catch (error) {
      return formatJSONResponse(error.message, 500);
    }
  };
