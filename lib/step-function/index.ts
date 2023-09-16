import { Effect, PolicyDocument, PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { Bucket } from 'aws-cdk-lib/aws-s3'
import { Chain, DefinitionBody, StateMachine, StateMachineType } from 'aws-cdk-lib/aws-stepfunctions'
import { Construct } from 'constructs'
import { constructParallelProcessStep } from './parallel-process-step'

export const constructStepFunction = (scope: Construct, bucket: Bucket, lambda: NodejsFunction) => {
  const parallelProcessStep = constructParallelProcessStep(scope, lambda)
  const chain = Chain.start(parallelProcessStep)

  return new StateMachine(scope, 'CsvToDynamoDBStateMachine', {
    stateMachineName: 'parallel-processing-csv-to-dynamodb',
    stateMachineType: StateMachineType.STANDARD,
    definitionBody: DefinitionBody.fromChainable(chain),
    role: new Role(scope, 'StateMachineRole', {
      assumedBy: new ServicePrincipal('states.amazonaws.com'),
      roleName: 'parallel-processing-csv-to-dynamodb-role',
      inlinePolicies: {
        LambdaInvokePolicy: new PolicyDocument({
          statements: [
            new PolicyStatement({
              effect: Effect.ALLOW,
              actions: ['lambda:InvokeFunction'],
              resources: [lambda.functionArn],
            }),
          ],
        }),
        S3GetObjectPolicy: new PolicyDocument({
          statements: [
            new PolicyStatement({
              effect: Effect.ALLOW,
              actions: ['s3:GetObject'],
              resources: [bucket.arnForObjects('*')],
            }),
          ],
        }),
        StepFunctionsStartExecutionPolicy: new PolicyDocument({
          statements: [
            new PolicyStatement({
              effect: Effect.ALLOW,
              actions: ['states:StartExecution', 'states:DescribeExecution', 'states:StopExecution'],
              resources: ['*'],
            }),
          ],
        }),
      },
    }),
  })
}
