import { RemovalPolicy } from 'aws-cdk-lib'
import { Bucket, BucketEncryption } from 'aws-cdk-lib/aws-s3'
import { Construct } from 'constructs'

export const constructCSVBucket = (scope: Construct): Bucket => {
  return new Bucket(scope, 'Bucket', {
    bucketName: 'csv.data-lake.example.com',
    encryption: BucketEncryption.S3_MANAGED,
    autoDeleteObjects: true,
    removalPolicy: RemovalPolicy.DESTROY,
  })
}
