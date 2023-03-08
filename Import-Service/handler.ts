import { middyfy } from "./src/libs/lambda";
import * as functions from "./src/functions";

export const importProductsFile = middyfy(functions.importProductsFileFunction);
