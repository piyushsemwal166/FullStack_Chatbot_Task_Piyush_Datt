import { InferSchemaType, model, Schema } from 'mongoose'

export const USER_TYPES = ['Student', 'Customer', 'Other'] as const
export const ENQUIRY_STATUSES = ['New', 'Contacted', 'In Progress', 'Closed'] as const
export const ENQUIRY_SOURCES = ['Chatbot', 'Contact Form'] as const

const enquirySchema = new Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
  phone: { type: String, required: true, trim: true, maxlength: 30 },
  userType: { type: String, enum: USER_TYPES, required: true },
  serviceOrCourse: { type: String, required: true, trim: true, maxlength: 150 },
  message: { type: String, required: true, trim: true, maxlength: 5000 },
  status: { type: String, enum: ENQUIRY_STATUSES, default: 'New', required: true },
  source: { type: String, enum: ENQUIRY_SOURCES, required: true }
}, { timestamps: true })

enquirySchema.index({ email: 1 })
enquirySchema.index({ status: 1, userType: 1 })
enquirySchema.index({ name: 'text', email: 'text', phone: 'text' })

export type EnquiryDocument = InferSchemaType<typeof enquirySchema>
export const Enquiry = model('Enquiry', enquirySchema)
