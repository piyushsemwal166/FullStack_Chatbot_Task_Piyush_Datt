import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import { Admin } from '../models/Admin'
import { env } from '../config/env'
import { AppError } from '../middleware/errorHandler'

export async function login(req: Request, res: Response): Promise<void> {
  const admin = await Admin.findOne({ email: req.body.email })
  if (!admin || !(await bcrypt.compare(req.body.password, admin.passwordHash))) throw new AppError(401, 'Invalid email or password')
  const token = jwt.sign({ role: 'admin' }, env.JWT_SECRET, { subject: admin.id, expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] })
  res.json({ data: { token, admin: { id: admin.id, email: admin.email, role: admin.role } } })
}
