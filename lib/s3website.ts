import { GetObjectCommand, NoSuchKey } from '@aws-sdk/client-s3'
import { Middleware } from 'koa'
import assert from 'node:assert'
import { Readable } from 'node:stream'
import { NotFound } from './error'
import s3client from './s3client'

export default function s3website(domain: RegExp): Middleware {
  return async (ctx) => {
    const site = ctx.hostname
    let key = ctx.path.slice(1)
    if (!key) {
      key = 'index.html'
    }

    if (!domain.test(site)) {
      throw new NotFound(site)
    }

    const response = await s3client
      .send(
        new GetObjectCommand({
          Bucket: site,
          Key: key,
        })
      )
      .catch((e) => {
        if (e instanceof NoSuchKey) {
          key = 'index.html'

          return s3client.send(
            new GetObjectCommand({
              Bucket: site,
              Key: key,
            })
          )
        } else throw e
      })

    const { Body } = response
    if (!Body) throw response
    assert(Body instanceof Readable)
    if (response.ContentType) {
      ctx.set('Content-Type', response.ContentType)
    }
    ctx.body = Body
  }
}
