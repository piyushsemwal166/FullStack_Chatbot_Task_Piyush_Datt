import { InferSchemaType, model, Schema } from 'mongoose'

const adminSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin'], default: 'admin' }
}, { timestamps: true })

export type AdminDocument = InferSchemaType<typeof adminSchema>
export const Admin = model('Admin', adminSchema)
