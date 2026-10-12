import { describe, expect, it } from 'vitest'
import { getChatReply } from '../src/services/chatService'

describe('rule-based chat service', () => {
  it('answers course questions', () => {
    expect(getChatReply('Which drone training course should I take?')).toContain('DGCA Drone Pilot')
  })

  it('returns a helpful fallback for unknown questions', () => {
    expect(getChatReply('What is the weather tomorrow?')).toContain('courses')
  })
})
