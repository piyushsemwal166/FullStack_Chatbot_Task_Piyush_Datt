import { Request, Response } from 'express'
import { chatSchema } from '../validations/chat'
import { answerChat, submitChatEnquiry } from '../services/chatService'
import { ChatConversation } from '../models/ChatConversation'
import { randomUUID } from 'node:crypto'

export async function chat(req: Request, res: Response): Promise<void> {
  const input = chatSchema.parse(req.body)
  const conversationId = input.conversationId || randomUUID()
  const conversation = await ChatConversation.findOneAndUpdate(
    { conversationId },
    { $setOnInsert: { conversationId }, $push: { messages: { role: 'user', content: input.message } } },
    { upsert: true, new: true }
  )
  const storedHistory = conversation.messages.slice(-20).map((message) => ({ role: message.role, text: message.content }))
  const result = await answerChat(input.message, storedHistory.slice(0, -1))
  const enquiry = input.enquiry ? await submitChatEnquiry(input.enquiry) : undefined
  await ChatConversation.updateOne({ conversationId }, { $push: { messages: { role: 'assistant', content: result.reply } } })
  res.json({ data: { ...result, conversationId, enquiry } })
}
