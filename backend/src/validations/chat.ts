import { z } from 'zod'
import { enquiryEmailSchema } from './email'

export const chatSchema = z.object({
  message: z.string().trim().min(1).max(2000),
  conversationId: z.string().trim().min(16).max(100).regex(/^[a-zA-Z0-9_-]+$/).optional(),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    text: z.string().trim().min(1).max(2000)
  })).max(20).default([]),
  enquiry: z.object({
    name: z.string().trim().min(2).max(100),
    email: enquiryEmailSchema,
    phone: z.string().trim().min(7).max(30).regex(/^[+()\d\s.-]+$/, 'Phone number contains invalid characters'),
    userType: z.enum(['Student', 'Customer', 'Other']),
    serviceOrCourse: z.string().trim().min(1).max(150),
    message: z.string().trim().min(1).max(5000)
  }).optional()
})
