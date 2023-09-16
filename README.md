# serverless-parallel-processing-with-step-functions

This is a sample project to demonstrate how to use AWS Step Functions to orchestrate parallel processing with AWS Lambda. It takes advantage of the new [Map State](https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-map-state.html) feature of Step Functions to process multiple items in parallel and store the results in DynamoDB table.

## Technologies

- [AWS Step Functions](https://aws.amazon.com/step-functions/)
- [AWS Lambda](https://aws.amazon.com/lambda/)
- [AWS DynamoDB](https://aws.amazon.com/dynamodb/)
- [AWS S3](https://aws.amazon.com/s3/)

## Architecture

![Architecture OW](https://github.com/skaznowiecki/parallel-processing-step-function/blob/main/assets/architecture.png)

- Configure max items per batch in 25 in order to avoid throttling errors in DynamoDB and use the maximum throughput of the table.
- The max concurrency of the Map State is 200 in order to avoid throttling errors in Lambda.

## Deployment

- Go to `bin/parallel-processing.ts` file and set up your own configuration.
- Run `cdk deploy` to deploy the stack.
- Upload the `assets/sample.csv` file to the S3 bucket created by the stack.
- Go to the Step Functions console and start a new execution. Provide the name of the S3 bucket and the name of the file uploaded in the previous step following the next structure:

```
{
    "bucket": "bucket-name",
    "key": "file-name"
}
```

- Check the DynamoDB table to see the results.
