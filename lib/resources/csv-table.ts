import { RemovalPolicy } from 'aws-cdk-lib'
import { AttributeType, Table, BillingMode } from 'aws-cdk-lib/aws-dynamodb'
import { Construct } from 'constructs'

export const constructCSVTable = (scope: Construct): Table => {
  return new Table(scope, 'CsvItemTable', {
    tableName: `CsvItems`,
    partitionKey: {
      name: 'pk',
      type: AttributeType.STRING,
    },
    billingMode: BillingMode.PAY_PER_REQUEST,
    removalPolicy: RemovalPolicy.DESTROY,
  })
}
