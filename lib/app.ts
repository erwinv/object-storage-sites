// import {S3Client} from '@aws-sdk/client-s3'
import Router from '@koa/router'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import { err } from './error.js'
import { logger } from './logger.cjs'

export default function App() {
  const router = new Router()
  router.get(/.*/, async (ctx) => {})

  const app = new Koa()
  app
    .use(err())
    .use(bodyParser())
    .use(logger(app))
    .use(router.routes())
    .use(router.allowedMethods())
  return app
}
