import type { AWS } from '@serverless/typescript';

//import hello from '@functions/hello';
const SERVICE_NAME = 'template-api'
const DYNAMODB_TABLE = `${SERVICE_NAME}-dev`
const TOKEN = ""
const serverlessConfiguration: AWS = {
  service: SERVICE_NAME,
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      DYNAMODB_TABLE,
      TOKEN
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: [
        'dynamodb:Query',
        'dynamodb:Scan',
        'dynamodb:GetItem',
        'dynamodb:PutItem',
        'dynamodb:UpdateItem',
        'dynamodb:DeleteItem',

      ],
      Resource: '*'
      }
    ],
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: { 
    createTemplate: {
      handler: 'src/functions/endpoints/createTemplate.handler',
      events: [
        {
          http: {
            method: "post",
            path: "criaTemplate",
            cors: true,
          },
        },
      ],
    },
    updateTemplate: {
      handler: 'src/functions/endpoints/updateTemplate.handler',
      events: [
        {
          http: {
            method: "put",
            path: "updateTemplate",
            cors: true,
          },
        },
      ],
    },
   },
  resources: {
    Resources: {
      TemplateDynamodbTable: {
        Type: 'AWS::DynamoDB::Table',
        DeletionPolicy: 'Retain',
        Properties: {
          AttributeDefinitions: [
            {
              AttributeName: 'id',
              AttributeType: 'S'
            }
          ],
          KeySchema: [
            {
              AttributeName: 'id',
              KeyType: 'HASH'
            }
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
          TableName: DYNAMODB_TABLE
        },
      },
    },
  }, 
};

module.exports = serverlessConfiguration;
