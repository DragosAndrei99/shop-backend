import type { AWS } from "@serverless/typescript";

// workaround needed to allow adding necessary properties for swagger to generate file
interface CustomAWS extends AWS {
  functions: any;
}

const serverlessConfiguration: CustomAWS = {
  service: "product-service",
  frameworkVersion: "3",
  plugins: ["serverless-auto-swagger", "serverless-esbuild"],
  provider: {
    name: "aws",
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: ["dynamodb:*"],
        Resource: "*",
      },
      {
        Effect: "Allow",
        Action: [
        "sqs:ReceiveMessage", 
        "sqs:DeleteMessage",      
        "sqs:GetQueueAttributes"],
        Resource: "arn:aws:sqs:us-east-1:490917832704:catalogItemsQueue"
      },
      {
        Effect: "Allow",
        Action: "sns:Publish",
        Resource: "arn:aws:sns:us-east-1:490917832704:createProductTopic"
      }
    ],
    runtime: "nodejs14.x",
    stage: "dev",
    region: "us-east-1",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      PRODUCTS_TABLE: "CloudX_Course_Products",
      STOCKS_TABLE: "CloudX_Course_Stocks",
      POWERTOOLS_SERVICE_NAME: "Product-Service",
      SNS_TOPIC_ARN: "arn:aws:sns:us-east-1:490917832704:createProductTopic"
    },
  },
  // import the function via paths
  functions: {
    getProductsList: {
      handler: "./handler.getProductsList",
      events: [
        {
          http: {
            method: "get",
            path: "products",
            cors: true,
            responses: {
              200: {
                description: "Successful API Response",
                bodyType: "IProducts",
              },
              404: {
                description: "Products not found",
                bodyType: "ICustomErr",
              },
            },
          },
        },
      ],
    },
    getProductsById: {
      handler: "./handler.getProductsById",
      events: [
        {
          http: {
            method: "get",
            path: "products/{productId}",
            cors: true,
            responses: {
              200: {
                description: "Successful API Response",
                bodyType: "IProduct",
              },
              404: {
                description: "Product not found",
                bodyType: "ICustomErr",
              },
            },
          },
        },
      ],
    },
    createProduct: {
      handler: "./handler.createProduct",
      events: [
        {
          http: {
            method: "post",
            path: "products",
            cors: true,
            bodyType: "IProduct",
            responses: {
              200: {
                description: "Successful API Response",
                bodyType: "IProduct",
              },
              400: {
                description: "Product was not created",
                bodyType: "ICustomErr",
              },
            },
          },
        },
      ],
    },
    catalogBatchProcess: {
      handler: "./handler.catalogBatchProcess",
      events: [
        {
          sqs: {
            arn: "arn:aws:sqs:us-east-1:490917832704:catalogItemsQueue",
            batchSize: 5,
            maximumConcurrency: 2
          },
        },
      ],
    },
  },
  resources: {
    Resources: {
      catalogItemsQueue: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: `catalogItemsQueue`,
        },
      },
      createProductTopic : {
        Type: "AWS::SNS::Topic",
        Properties: {
          TopicName: "createProductTopic",
        },
      },
      mySubscription: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          TopicArn: {Ref: "createProductTopic"},
          Endpoint: "dragos_vasile@epam.com",
          Protocol : "email"
        }
      }
    },
  },
  package: { individually: true },
  custom: {
    autoswagger: {
      apiType: "http",
      basePath: "/${sls:stage}",
    },
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
