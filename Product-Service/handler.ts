import { middyfy } from './src/libs/lambda';
import cors from '@middy/http-cors';
import * as functions from './src/functions';
import {InMemoryDataProductServiceClass} from './src/services/in-memory-data-product-service';

const productService = new InMemoryDataProductServiceClass();

export const getProductsList = middyfy(functions.getProductsListFunction(productService)).use(cors()); 
export const getProductsById = middyfy(functions.getProductsByIdFunction(productService)).use(cors());  