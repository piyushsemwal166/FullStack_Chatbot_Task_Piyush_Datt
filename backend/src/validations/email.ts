import { z } from 'zod'

export const ALLOWED_EMAIL_DOMAINS = [
  'gmail.com',
  'googlemail.com',
  'outlook.com',
  'hotmail.com',
  'live.com',
  'msn.com',
  'yahoo.com',
  'icloud.com',
  'proton.me',
  'protonmail.com',
  'zoho.com',
  'aol.com'
] as const

export const enquiryEmailSchema = z.string().trim().email().max(254).refine((value) => {
  const domain = value.toLowerCase().split('@').pop()
  return domain ? ALLOWED_EMAIL_DOMAINS.includes(domain as typeof ALLOWED_EMAIL_DOMAINS[number]) : false
}, 'Invalid email address')
