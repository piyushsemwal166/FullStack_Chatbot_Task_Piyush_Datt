const allowedEmailDomains = new Set([
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
])

export function isAllowedEnquiryEmail(value: string): boolean {
  const email = value.trim().toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return false
  const domain = email.split('@').pop()
  return domain ? allowedEmailDomains.has(domain) : false
}

export const allowedEmailMessage = 'Invalid email address.'
