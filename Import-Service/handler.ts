import { middyfy } from "./src/libs/lambda";
import * as functions from "./src/functions";
import cors from "@middy/http-cors";

export const importProductsFile = middyfy(
  functions.importProductsFileFunction
).use(cors());

export const importFileParser = functions.importFileParserFunction;
