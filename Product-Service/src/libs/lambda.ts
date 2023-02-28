import middy from "@middy/core";
import middyJsonBodyParser from "@middy/http-json-body-parser";

import validator from "@middy/validator";
import { transpileSchema } from '@middy/validator/transpile';
import httpErrorHandler from "@middy/http-error-handler";

const inputSchema = {
  type: "object",
  properties: {
    body: {
      type: "object",
      properties: {
        id: { type: "string" },
        description: { type: "string" },
        title: { type: "string" },
        price: { type: "number" },
        count: { type: "number" }
      },
      required: ["id", "description", "title", "price", "count"],
    },
  },
};

export const validate = (handler) => {
  return handler.use(validator({eventSchema: transpileSchema(inputSchema)}));
}

export const middyfy = (handler) => {
  return middy(handler).use(middyJsonBodyParser());
};

export const handleErrors = (handler) => {
  return handler.use(httpErrorHandler());

}
