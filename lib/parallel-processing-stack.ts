import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { processCsvItemsFunction } from './process-csv-items'
import { constructCSVBucket } from './resources/csv-bucket'
import { constructCSVTable } from './resources/csv-table'
import { constructStepFunction } from './step-function'

export class ParallelProcessingStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const bucket = constructCSVBucket(this)
    const table = constructCSVTable(this)
    const lambda = processCsvItemsFunction(this, table)

    constructStepFunction(this, bucket, lambda)
  }
}
