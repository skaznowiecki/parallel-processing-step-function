import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs'
import { Construct } from 'constructs'

import { Runtime } from 'aws-cdk-lib/aws-lambda'
import { Table } from 'aws-cdk-lib/aws-dynamodb'

export const processCsvItemsFunction = (scope: Construct, csvItemTable: Table): lambda.NodejsFunction => {
  const lambdaFunction = new lambda.NodejsFunction(scope, 'ProcessCsvItems', {
    functionName: 'process-csv-items',
    entry: `${__dirname}/handler.ts`,
    handler: 'handler',
    runtime: Runtime.NODEJS_18_X,
    environment: {
      CSV_ITEM_TABLE_NAME: csvItemTable.tableName,
    },
    bundling: {
      minify: true,
      nodeModules: ['uuid'],
    },
  })

  csvItemTable.grantWriteData(lambdaFunction)

  return lambdaFunction
}
