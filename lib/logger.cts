import type Application from 'koa'
import { type Middleware } from 'koa'
import perf_hooks from 'node:perf_hooks'
import pino, { type Logger } from 'pino'

declare module 'koa' {
  interface DefaultContext {
    logger: Logger
  }
}

export function logger(app: Application): Middleware {
  app.context.logger = pino()

  return async (ctx, next) => {
    const logger = ctx.logger.child({
      id: ctx.state.transactionId,
      req: { ...ctx.request.toJSON(), body: ctx.request.body },
    })

    const start = perf_hooks.performance.now()
    try {
      await next()
      logger.info({
        res: { ...ctx.response.toJSON(), body: ctx.response.body },
        ms: performance.now() - start,
      })
    } catch (e) {
      logger.error({
        res: { ...ctx.response.toJSON(), body: ctx.response.body },
        err: e,
        ms: perf_hooks.performance.now() - start,
      })
      throw e
    }
  }
}
