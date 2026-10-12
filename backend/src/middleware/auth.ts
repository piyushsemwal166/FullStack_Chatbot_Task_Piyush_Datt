import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import { AppError } from './errorHandler'

export type AuthenticatedRequest = Request & { admin?: { id: string; role: 'admin' } }

export function requireAdmin(req: Request, _res: Response, next: NextFunction): void {
  const token = req.header('authorization')?.replace(/^Bearer\s+/i, '')
  if (!token) return next(new AppError(401, 'Authentication required'))
  try {
    const payload = jwt.verify(token, env.JWT_SECRET)
    if (typeof payload === 'string' || payload.role !== 'admin') return next(new AppError(403, 'Administrator access required'))
    ;(req as AuthenticatedRequest).admin = { id: payload.sub as string, role: 'admin' }
    next()
  } catch {
    next(new AppError(401, 'Invalid or expired authentication token'))
  }
}
