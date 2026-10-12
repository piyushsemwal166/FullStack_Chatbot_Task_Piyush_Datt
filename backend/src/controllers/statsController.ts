import { Request, Response } from 'express'
import { Enquiry } from '../models/Enquiry'

export async function getStats(_req: Request, res: Response): Promise<void> {
  const [total, newCount, contacted, inProgress, closed, bySource, activity] = await Promise.all([
    Enquiry.countDocuments(),
    Enquiry.countDocuments({ status: 'New' }),
    Enquiry.countDocuments({ status: 'Contacted' }),
    Enquiry.countDocuments({ status: 'In Progress' }),
    Enquiry.countDocuments({ status: 'Closed' }),
    Enquiry.aggregate([{ $group: { _id: '$source', count: { $sum: 1 } } }]),
    Enquiry.aggregate([
      { $match: { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ])
  ])
  res.json({ data: { total, statuses: { new: newCount, contacted, inProgress, closed }, bySource, activity } })
}
