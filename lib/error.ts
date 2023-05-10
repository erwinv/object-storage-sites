import { S3ServiceException } from '@aws-sdk/client-s3'
import { type Middleware } from 'koa'

export class NotFound extends Error {
  constructor(public resource: string) {
    super(`${resource} cannot be found`)
  }
}

export function err(): Middleware {
  return async (ctx, next) => {
    try {
      await next()
    } catch (e) {
      if (e instanceof NotFound) {
        ctx.body = {
          error: 'NotFound',
          resource: e.resource,
        }
        ctx.status = 404
      } else if (e instanceof S3ServiceException) {
        ctx.body = e
        ctx.status = e.$metadata.httpStatusCode ?? 500
      } else {
        console.error(e)
        ctx.status = 500
      }
    }
  }
}
