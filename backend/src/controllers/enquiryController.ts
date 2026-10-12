import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { Enquiry } from '../models/Enquiry'
import { AppError } from '../middleware/errorHandler'

function assertId(id: string): void {
  if (!mongoose.isValidObjectId(id)) throw new AppError(400, 'Invalid enquiry id')
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export async function listEnquiries(req: Request, res: Response): Promise<void> {
  const { search, userType, status, page, limit } = req.query as Record<string, string | undefined>
  const filter: Record<string, unknown> = {}
  if (userType) filter.userType = userType
  if (status) filter.status = status
  if (search) {
    const safeSearch = escapeRegex(search)
    filter.$or = [{ name: new RegExp(safeSearch, 'i') }, { email: new RegExp(safeSearch, 'i') }, { phone: new RegExp(safeSearch, 'i') }]
  }
  const skip = (Number(page) - 1) * Number(limit)
  const [data, total] = await Promise.all([Enquiry.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(), Enquiry.countDocuments(filter)])
  res.json({ data, meta: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) } })
}

export async function getEnquiry(req: Request, res: Response): Promise<void> {
  const id = String(req.params.id)
  assertId(id)
  const data = await Enquiry.findById(id).lean()
  if (!data) throw new AppError(404, 'Enquiry not found')
  res.json({ data })
}

export async function createEnquiry(req: Request, res: Response): Promise<void> {
  const data = await Enquiry.create(req.body)
  res.status(201).json({ data })
}

export async function updateEnquiry(req: Request, res: Response): Promise<void> {
  const id = String(req.params.id)
  assertId(id)
  const data = await Enquiry.findByIdAndUpdate(id, { $set: req.body }, { new: true, runValidators: true }).lean()
  if (!data) throw new AppError(404, 'Enquiry not found')
  res.json({ data })
}

export async function deleteEnquiry(req: Request, res: Response): Promise<void> {
  const id = String(req.params.id)
  assertId(id)
  const deleted = await Enquiry.findByIdAndDelete(id)
  if (!deleted) throw new AppError(404, 'Enquiry not found')
  res.status(204).send()
}
