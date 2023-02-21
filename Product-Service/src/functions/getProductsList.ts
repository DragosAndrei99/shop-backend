import { formatJSONResponse } from "@libs/api-gateway";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { ICustomErr } from "src/types/api-types";
import { ProductServiceInterface } from "src/services/productServiceInterface";

export const getProductsListFunction =
  (productService: ProductServiceInterface) =>
  async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const products = await productService.getAllProducts();
      if (products.length < 1) {
        let newError: ICustomErr = { message: "No products available" };
        return formatJSONResponse(newError, 404);
      }
      return formatJSONResponse(products, 200);
    } catch (error) {
      return formatJSONResponse(error, 400);
    }
  };
