import { describe, expect, it } from 'vitest'
import { createEnquirySchema } from '../src/validations/enquiry'

describe('enquiry validation', () => {
  it('accepts a valid enquiry', () => {
    expect(createEnquirySchema.parse({
      name: 'Aarav Kumar',
      email: 'aarav@gmail.com',
      phone: '+91 98765 43210',
      userType: 'Student',
      serviceOrCourse: 'DGCA Drone Pilot',
      message: 'Please share the next batch details.',
      source: 'Contact Form'
    }).userType).toBe('Student')
  })

  it('rejects invalid email, phone, and enum values', () => {
    const result = createEnquirySchema.safeParse({
      name: 'A',
      email: 'not-an-email',
      phone: 'invalid',
      userType: 'Lead',
      serviceOrCourse: '',
      message: '',
      source: 'Website'
    })
    expect(result.success).toBe(false)
  })
})
