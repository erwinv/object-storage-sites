import Router from '@koa/router'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import { err } from './error.js'
import { logger } from './logger.cjs'
import s3website from './s3website.js'

export default function App() {
  const router = new Router()

  router.get(/.*/, s3website(/([a-z0-9_-]+)\.erwinv\.dev/))

  const app = new Koa({ proxy: true })
  app
    .use(bodyParser())
    .use(logger(app))
    .use(err())
    .use(router.routes())
    .use(router.allowedMethods())
  return app
}
