import { type Middleware } from 'koa'

export function err(): Middleware {
  return async (ctx, next) => {
    try {
      await next()
    } catch (e) {
      console.error(e)
      ctx.status = 500
    }
  }
}
