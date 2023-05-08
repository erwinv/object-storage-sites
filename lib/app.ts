import { GetObjectCommand, NoSuchBucket, NoSuchKey } from '@aws-sdk/client-s3'
import Router from '@koa/router'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import assert from 'node:assert'
import { Readable } from 'node:stream'
import { err } from './error.js'
import { logger } from './logger.cjs'
import s3client from './s3client.js'

export default function App() {
  const router = new Router()

  router.get(/.*/, async (ctx) => {
    const site = ctx.hostname
    let key = ctx.path.slice(1)
    if (!key) {
      key = 'index.html'
    }

    if (!/([a-z0-9_-]+)\.erwinv\.dev/.test(site)) {
      ctx.status = 404 // TODO 404.html page (from Object Storage)
      return
    }

    try {
      const response = await s3client
        .send(
          new GetObjectCommand({
            Bucket: site,
            Key: key,
          })
        )
        .catch((e) => {
          const shouldFallbackToIndex = e instanceof NoSuchKey
          if (shouldFallbackToIndex) {
            return s3client.send(
              new GetObjectCommand({
                Bucket: site,
                Key: 'index.html',
              })
            )
          } else {
            throw e
          }
        })

      const { Body } = response
      if (!Body) throw response
      assert(Body instanceof Readable)
      if (response.ContentType) {
        ctx.set('Content-Type', response.ContentType)
      }
      ctx.body = Body
    } catch (e) {
      if (e instanceof NoSuchBucket) {
        ctx.status = 400
      } else {
        throw e
      }
    }
  })

  const app = new Koa({ proxy: true })
  app
    .use(err())
    .use(bodyParser())
    .use(logger(app))
    .use(router.routes())
    .use(router.allowedMethods())
  return app
}
