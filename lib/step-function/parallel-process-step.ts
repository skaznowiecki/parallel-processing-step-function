import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { CustomState } from 'aws-cdk-lib/aws-stepfunctions'
import { Construct } from 'constructs'

export const constructParallelProcessStep = (scope: Construct, lambda: NodejsFunction): CustomState => {
  return new CustomState(scope, 'CsvToDynamoDBState', {
    stateJson: {
      Type: 'Map',
      ItemReader: {
        Resource: 'arn:aws:states:::s3:getObject',
        ReaderConfig: {
          InputType: 'CSV',
          CSVHeaderLocation: 'FIRST_ROW',
        },
        Parameters: {
          'Bucket.$': '$.bucket',
          'Key.$': '$.key',
        },
      },
      ItemProcessor: {
        ProcessorConfig: {
          Mode: 'DISTRIBUTED',
          ExecutionType: 'STANDARD',
        },
        StartAt: 'Lambda Invoke',
        States: {
          'Lambda Invoke': {
            Type: 'Task',
            Resource: 'arn:aws:states:::lambda:invoke',
            OutputPath: '$.Payload',
            Parameters: {
              'Payload.$': '$',
              FunctionName: lambda.functionArn,
            },
            Retry: [
              {
                ErrorEquals: [
                  'Lambda.ServiceException',
                  'Lambda.AWSLambdaException',
                  'Lambda.SdkClientException',
                  'Lambda.TooManyRequestsException',
                ],
                IntervalSeconds: 2,
                MaxAttempts: 6,
                BackoffRate: 2,
              },
            ],
            End: true,
          },
        },
      },
      MaxConcurrency: 200,
      Label: 'CsvToDynamoDB',
      End: true,
      ItemBatcher: {
        MaxItemsPerBatch: 25,
      },
    },
  })
}
