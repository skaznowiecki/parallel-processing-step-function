import { Handler } from 'aws-lambda'

import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { BatchWriteCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

import { v4 as uuid } from 'uuid'

const client = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(client)

const CSV_ITEM_TABLE_NAME = process.env.CSV_ITEM_TABLE_NAME!

interface Item {
  date: string
  volume: string
  high: string
  adjusted_close: string
  low: string
  avg_vol_20d: string
  close: string
  open: string
  change_percent: string
}

interface HandlerEvent {
  Items: Item[]
}

export const handler: Handler<HandlerEvent> = async ({ Items }) => {
  const command = new BatchWriteCommand({
    RequestItems: {
      [CSV_ITEM_TABLE_NAME]: Items.map((item) => ({
        PutRequest: {
          Item: {
            pk: uuid(),
            ...item,
          },
        },
      })),
    },
  })

  await docClient.send(command)
}
