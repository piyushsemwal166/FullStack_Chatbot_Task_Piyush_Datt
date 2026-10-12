import { InferSchemaType, model, Schema } from 'mongoose'

const chatMessageSchema = new Schema({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true, maxlength: 2000 },
  createdAt: { type: Date, default: Date.now }
}, { _id: false })

const chatConversationSchema = new Schema({
  conversationId: { type: String, required: true, unique: true, index: true },
  messages: { type: [chatMessageSchema], default: [] }
}, { timestamps: true })

export type ChatConversationDocument = InferSchemaType<typeof chatConversationSchema>
export const ChatConversation = model('ChatConversation', chatConversationSchema)
