import { ErrorRequestHandler } from 'express'
import mongoose from 'mongoose'
import { ZodError } from 'zod'

export class AppError extends Error {
  constructor(public readonly statusCode: number, message: string) {
    super(message)
    this.name = 'AppError'
  }
}

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    res.status(400).json({ error: 'Validation failed', details: error.issues.map((issue) => ({ field: issue.path.join('.'), message: issue.message })) })
    return
  }
  if (error instanceof mongoose.Error.ValidationError) {
    res.status(400).json({ error: 'Validation failed', details: Object.values(error.errors).map((item) => ({ field: item.path, message: item.message })) })
    return
  }
  if (error instanceof AppError) {
    res.status(error.statusCode).json({ error: error.message })
    return
  }
  if ((error as { code?: number }).code === 11000) {
    res.status(409).json({ error: 'An administrator with that email already exists' })
    return
  }
  console.error(error)
  res.status(500).json({ error: 'An unexpected server error occurred' })
}
