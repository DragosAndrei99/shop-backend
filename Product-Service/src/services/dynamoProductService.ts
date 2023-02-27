import * as AWS from "aws-sdk";
import { IProduct, IProducts, IStock } from "src/types/api-types";
import { ProductServiceInterface } from "./productServiceInterface";
const dynamo = new AWS.DynamoDB.DocumentClient();

export class DynamoProductService implements ProductServiceInterface {
  public async getAllProducts()  {
    const stocks = await DynamoProductService.scanDataFromDynamo(process.env.STOCKS_TABLE) as IStock[];
    const products = await DynamoProductService.scanDataFromDynamo(process.env.PRODUCTS_TABLE) as IProducts;
    if(!products || !stocks) {
      throw new Error();
    }
    products.forEach(product => {
      product['count'] = stocks.find(elem => elem.product_id === product.id).count;
    })
    return products;
  };
  public async getProductById(id: string) {
    const product = await DynamoProductService.queryDataFromDynamo(process.env.PRODUCTS_TABLE, id) as IProducts;
    const stock = await DynamoProductService.queryDataFromDynamo(process.env.STOCKS_TABLE, id) as IStock[];
    if(!product || !stock) {
      throw new Error();
    }
    const result : IProduct = {
      ...product[0],
      count: stock[0].count
    }
    return result;
  };

  private static async scanDataFromDynamo(TABLE_NAME : string) {
    const data = await dynamo.scan({
      TableName: TABLE_NAME
    }).promise();
    return data.Items;
  }

  private static async queryDataFromDynamo(TABLE_NAME: string, id:string) {
    let queryResults;
    if(TABLE_NAME === process.env.PRODUCTS_TABLE) {
      queryResults = await dynamo.query({
        TableName: TABLE_NAME,
        KeyConditionExpression: 'id= :id',
        ExpressionAttributeValues: {':id': id}
      }).promise();
    } else if ( TABLE_NAME === process.env.STOCKS_TABLE) {
      queryResults = await dynamo.query({
        TableName: TABLE_NAME,
        KeyConditionExpression: 'product_id= :product_id',
        ExpressionAttributeValues: {':product_id': id}
      }).promise();
    }
    return queryResults.Items;
  }
}