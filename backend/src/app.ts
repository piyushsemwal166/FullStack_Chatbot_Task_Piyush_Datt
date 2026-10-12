import cors from 'cors'
import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import { env } from './config/env'
import authRoutes from './routes/authRoutes'
import chatRoutes from './routes/chatRoutes'
import enquiryRoutes from './routes/enquiryRoutes'
import statsRoutes from './routes/statsRoutes'
import { errorHandler } from './middleware/errorHandler'

export function createApp(): express.Express {
  const app = express()
  app.disable('x-powered-by')
  app.use(helmet())
  app.use(cors({ origin: env.FRONTEND_ORIGIN }))
  app.use(express.json({ limit: '32kb' }))
  app.use(rateLimit({ windowMs: env.RATE_LIMIT_WINDOW_MS, limit: env.RATE_LIMIT_MAX, standardHeaders: true, legacyHeaders: false }))
  app.get('/api/health', (_req, res) => res.json({ data: { status: 'ok' } }))
  app.use('/api/auth', authRoutes)
  app.use('/api/enquiries', enquiryRoutes)
  app.use('/api/stats', statsRoutes)
  app.use('/api/chat', chatRoutes)
  app.use((_req, res) => res.status(404).json({ error: 'Route not found' }))
  app.use(errorHandler)
  return app
}
