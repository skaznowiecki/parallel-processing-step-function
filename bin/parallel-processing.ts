#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { ParallelProcessingStack } from '../lib/parallel-processing-stack'

const app = new cdk.App()
new ParallelProcessingStack(app, 'ParallelProcessingStack', {
  env: { account: process.env.ACCOUNT, region: process.env.REGION },
})
