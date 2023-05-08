import 'dotenv/config'

import { GetObjectCommand } from '@aws-sdk/client-s3'
import assert from 'node:assert'
import { Readable } from 'node:stream'
import s3client from '../lib/s3client.js'

async function main(bucket: string, key: string) {
  try {
    const response = await s3client.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      })
    )

    const { Body } = response
    assert(Body instanceof Readable)
    console.info(response.ContentType)
    Body.pipe(process.stdout)
  } catch (e) {
    console.error(e)
  }
}

const [, , bucket, key] = process.argv
main(bucket, key)
