import * as AWS from "aws-sdk";
import { IProduct, IProducts, IStock } from "src/types/api-types";
import { ProductServiceInterface } from "./productServiceInterface";
const dynamo = new AWS.DynamoDB.DocumentClient();

export class DynamoProductService implements ProductServiceInterface {
  public async getAllProducts() {
    const stocks = (await DynamoProductService.scanDataFromDynamo(
      process.env.STOCKS_TABLE
    )) as IStock[];
    const products = (await DynamoProductService.scanDataFromDynamo(
      process.env.PRODUCTS_TABLE
    )) as IProducts;
    if (!products || !stocks) {
      throw new Error();
    }
    products.forEach((product) => {
      product["count"] = stocks.find(
        (elem) => elem.product_id === product.id
      ).count;
    });
    return products;
  }
  public async getProductById(id: string) {
    const product = (await DynamoProductService.queryDataFromDynamo(
      process.env.PRODUCTS_TABLE,
      id
    )) as IProducts;
    const stock = (await DynamoProductService.queryDataFromDynamo(
      process.env.STOCKS_TABLE,
      id
    )) as IStock[];
    if (product.length < 1 || stock.length < 1) {
      return undefined;
    }
    const result: IProduct = {
      ...product[0],
      count: stock[0].count,
    };
    return result;
  }

  public async create(product: IProduct) {
    try {
      const productFields = { ...product };
      delete productFields.id;
      delete productFields.count;
      const productFieldsExpression =
        DynamoProductService.generateUpdateQuery(productFields);
      const stockFieldsExpression = DynamoProductService.generateUpdateQuery({
        count: product.count,
      });
      const transaction = await dynamo
        .transactWrite({
          TransactItems: [
            {
              Update: {
                TableName: process.env.PRODUCTS_TABLE,
                Key: { id: product.id },
                ...productFieldsExpression,
                ConditionExpression: "attribute_not_exists(id)",
                ReturnValuesOnConditionCheckFailure: "ALL_OLD",
              },
            },
            {
              Update: {
                TableName: process.env.STOCKS_TABLE,
                Key: { product_id: product.id },
                ...stockFieldsExpression,
                ConditionExpression: "attribute_not_exists(product_id)",
                ReturnValuesOnConditionCheckFailure: "ALL_OLD",
              },
            },
          ],
        })
        .promise();
      return transaction;
    } catch (error) {
      return error;
    }
  }

  private static generateUpdateQuery(fields: any) {
    let exp = {
      UpdateExpression: "set",
      ExpressionAttributeNames: {},
      ExpressionAttributeValues: {},
    };
    Object.entries(fields).forEach(([key, item]) => {
      exp.UpdateExpression += ` #${key} = :${key},`;
      exp.ExpressionAttributeNames[`#${key}`] = key;
      exp.ExpressionAttributeValues[`:${key}`] = item;
    });
    exp.UpdateExpression = exp.UpdateExpression.slice(0, -1);
    return exp;
  }

  private static async scanDataFromDynamo(TABLE_NAME: string) {
    const data = await dynamo
      .scan({
        TableName: TABLE_NAME,
      })
      .promise();
    return data.Items;
  }

  private static async queryDataFromDynamo(TABLE_NAME: string, id: string) {
    let queryResults;
    if (TABLE_NAME === process.env.PRODUCTS_TABLE) {
      queryResults = await dynamo
        .query({
          TableName: TABLE_NAME,
          KeyConditionExpression: "id= :id",
          ExpressionAttributeValues: { ":id": id },
        })
        .promise();
    } else if (TABLE_NAME === process.env.STOCKS_TABLE) {
      queryResults = await dynamo
        .query({
          TableName: TABLE_NAME,
          KeyConditionExpression: "product_id= :product_id",
          ExpressionAttributeValues: { ":product_id": id },
        })
        .promise();
    }
    return queryResults.Items;
  }
}
