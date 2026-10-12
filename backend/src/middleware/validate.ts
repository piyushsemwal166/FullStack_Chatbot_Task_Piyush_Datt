import { NextFunction, Request, Response } from 'express'
import { ZodType } from 'zod'

export function validate(schema: ZodType, location: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const parsed = schema.parse(req[location])
    req[location] = parsed
    next()
  }
}
