import type { AWS } from "@serverless/typescript";

// workaround needed to allow adding necessary properties for swagger to generate file
interface CustomAWS extends AWS {
  functions: any;
}
const serverlessConfiguration: CustomAWS = {
  service: "import-service",
  frameworkVersion: "3",
  plugins: ["serverless-auto-swagger", "serverless-esbuild"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 's3:*',
        Resource: 'arn:aws:s3:::node-aws-task5/*'
      }
    ],
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      S3_BUCKET_NAME: 'node-aws-task5'
    }
  },
  // import the function via paths
  functions: {
    importProductsFile: {
      handler: "./handler.importProductsFile",
      events: [
        {
          http: {
            method: "get",
            path: "import",
            cors: true,
            queryStringParameters: {
              name: {
                required: true,
                type: 'string',
                description: 'name of csv file'
              }
            },
            produces: 'text/plain',
            responses: {
              200: {
                description: "Successful API Response"
              },
              400: {
                description: "Not a valid csv file",
                bodyType: "ICustomErr",
              },
            },
          },
        },
      ],
    },
  },
  package: { individually: true },
  custom: {
    autoswagger: {
      apiType: 'http',
      basePath: '/${sls:stage}'
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
