'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import { ArrowRight, RotateCcw, Send, Sparkles, Trash2 } from 'lucide-react'
import { PublicPage } from '@/components/public-shell'
import { ChatMessage, sendChat } from '@/lib/api'

type Message = ChatMessage & { id: number; createdAt: number; error?: boolean }
const welcome: Message = { id: 1, role: 'assistant', text: 'Hi, I’m Sky. I can help you choose a course, understand registration, or connect you with admissions.', createdAt: Date.now() }
const suggestions = ['Which course is right for me?', 'How does registration work?', 'Do you offer DGCA preparation?']

export default function ChatPage() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([welcome])
  const [error, setError] = useState('')
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])

  async function submit(event?: FormEvent, suggestion?: string) {
    event?.preventDefault()
    const clean = (suggestion ?? input).trim()
    if (!clean || loading) return
    setError('')
    const history: ChatMessage[] = messages.slice(-20).map(({ role, text }) => ({ role, text }))
    const userMessage: Message = { id: Date.now(), role: 'user', text: clean, createdAt: Date.now() }
    setMessages((current) => [...current, userMessage])
    setInput('')
    setLoading(true)
    try {
      const response = await sendChat(clean, history)
      setMessages((current) => [...current, { id: Date.now() + 1, role: 'assistant', text: response.data.reply, createdAt: Date.now() }])
      if (response.data.retryable) setError('Sky is using a temporary fallback. You can retry your question.')
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to reach Sky right now.')
    } finally { setLoading(false) }
  }

  function clearConversation() {
    setMessages([{ ...welcome, id: Date.now(), createdAt: Date.now() }])
    setInput('')
    setError('')
  }

  return <PublicPage><section className="mx-auto max-w-4xl px-5 pb-24 pt-16 sm:px-8 lg:pt-24"><div className="text-center"><span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#f1c72d]"><Sparkles /></span><p className="mt-6 text-xs font-bold uppercase tracking-[.22em] text-[#bf8e00]">DroneTV AI Assistant</p><h1 className="mt-4 text-6xl font-semibold leading-[.9] tracking-[-.08em] sm:text-8xl">Ask Sky anything.</h1><p className="mx-auto mt-7 max-w-xl text-lg leading-7 text-black/55">A conversational guide for courses, registration, support, and your next step.</p></div><div className="mt-14 overflow-hidden rounded-[2rem] border border-black/8 bg-white shadow-xl"><div className="flex items-center justify-between border-b p-4 sm:p-5"><div className="flex items-center gap-3"><span className="size-2 rounded-full bg-emerald-500" /><span className="text-sm font-bold">Sky is ready</span></div><button onClick={clearConversation} className="flex items-center gap-2 text-xs font-bold text-black/45 hover:text-black"><Trash2 className="size-4" /> Clear conversation</button></div><div className="min-h-[390px] max-h-[520px] space-y-5 overflow-y-auto bg-[#fafaf8] p-5 sm:p-8">{messages.map((item) => <div key={item.id} className={`flex ${item.role === 'user' ? 'justify-end' : ''}`}><div className={`max-w-[84%] rounded-2xl px-5 py-4 ${item.role === 'user' ? 'rounded-br-sm bg-[#f1c72d]' : 'rounded-bl-sm bg-white text-black/65 shadow-sm'}`}><p className="text-sm leading-6">{item.text}</p><time className="mt-2 block text-[10px] text-black/35">{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</time></div></div>)}{loading && <div className="flex items-center gap-2 text-sm text-black/40"><span className="flex gap-1"><i className="size-1.5 animate-bounce rounded-full bg-black/40" /><i className="size-1.5 animate-bounce rounded-full bg-black/40 [animation-delay:120ms]" /><i className="size-1.5 animate-bounce rounded-full bg-black/40 [animation-delay:240ms]" /></span> Sky is thinking…</div>}<div ref={endRef} /></div>{error && <div className="flex items-center justify-between gap-3 border-t bg-red-50 px-5 py-3 text-sm text-red-700"><span>{error}</span><button onClick={() => void submit()} className="flex shrink-0 items-center gap-1 font-bold"><RotateCcw className="size-4" /> Retry</button></div>}<div className="flex flex-wrap gap-2 border-t p-4">{suggestions.map((suggestion) => <button key={suggestion} disabled={loading} onClick={() => void submit(undefined, suggestion)} className="rounded-full border border-black/10 px-4 py-2 text-xs font-semibold transition hover:border-black/40 disabled:opacity-50">{suggestion}</button>)}</div><form onSubmit={submit} className="flex gap-3 border-t p-4"><input value={input} onChange={(event) => setInput(event.target.value)} className="min-w-0 flex-1 rounded-xl bg-[#f5f5f2] px-4 py-3 outline-none" placeholder="Ask about DroneTV..." aria-label="Chat message" /><button disabled={loading || !input.trim()} className="rounded-xl bg-[#171717] px-5 text-white disabled:opacity-40" aria-label="Send message"><Send className="size-4" /></button></form></div><a href="/contact" className="mx-auto mt-7 flex w-fit items-center gap-2 text-sm font-bold underline decoration-[#e0b51e] decoration-4 underline-offset-8">Want a human answer? Contact admissions <ArrowRight className="size-4" /></a></section></PublicPage>
}
