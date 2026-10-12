import { z } from 'zod'
import { ENQUIRY_STATUSES, ENQUIRY_SOURCES, USER_TYPES } from '../models/Enquiry'
import { enquiryEmailSchema } from './email'

const phoneSchema = z.string().trim().min(7).max(30).regex(/^[+()\d\s.-]+$/, 'Phone number contains invalid characters')
const base = z.object({
  name: z.string().trim().min(2).max(100),
  email: enquiryEmailSchema,
  phone: phoneSchema,
  userType: z.enum(USER_TYPES),
  serviceOrCourse: z.string().trim().min(1).max(150),
  message: z.string().trim().min(1).max(5000),
  status: z.enum(ENQUIRY_STATUSES).optional(),
  source: z.enum(ENQUIRY_SOURCES)
})

export const createEnquirySchema = base
export const updateEnquirySchema = base.partial().refine((value) => Object.keys(value).length > 0, 'At least one field is required')
export const enquiryQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),
  userType: z.enum(USER_TYPES).optional(),
  status: z.enum(ENQUIRY_STATUSES).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20)
})
