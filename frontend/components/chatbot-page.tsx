'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import { Check, Clock3, MessageCircle, RefreshCw, Send, Sparkles, Trash2, UserRound, X } from 'lucide-react'
import { createEnquiry, sendChat, ChatMessage, UserType } from '@/lib/api'
import { allowedEmailMessage, isAllowedEnquiryEmail } from '@/lib/email'
import { PhoneField } from '@/components/phone-field'

type Message = ChatMessage & { id: string; createdAt: number }
type EnquiryValues = { name: string; email: string; phone: string; userType: UserType | ''; serviceOrCourse: string; message: string }
type EnquiryErrors = Partial<Record<keyof EnquiryValues, string>>

const suggestions = [
  'What services does DroneTV provide?',
  'What courses / training are available?',
  'How can I contact DroneTV?',
  'How can I register?',
  'I am interested in a service.',
  'I am a student.',
  'I want to speak with someone.'
]

const predefined: Record<string, string> = {
  'What services does DroneTV provide?': 'DroneTV provides drone pilot training, aerial photography training, agriculture drone operations, and commercial drone operations guidance.',
  'What courses / training are available?': 'Our main pathways are Drone Pilot Training, Aerial Photography, Agriculture Drones, and Commercial Operations. I can help you choose one based on your goal.',
  'How can I contact DroneTV?': 'You can use the enquiry form on this page or visit the Contact page. Our admissions team will follow up with you directly.',
  'How can I register?': 'Choose a course, submit your contact details, and our admissions team will guide you through available batches and next steps.',
  'I am interested in a service.': 'Great. I can collect your details and the DroneTV team can recommend the right service. Please complete the enquiry form below.',
  'I am a student.': 'Welcome. Tell us what you want to learn and I can collect a student enquiry for the admissions team.',
  'I want to speak with someone.': 'Of course. Please submit the enquiry form and ask for human support in your message.'
}

const initialValues: EnquiryValues = { name: '', email: '', phone: '', userType: '', serviceOrCourse: '', message: '' }

function getConversationId() {
  const existing = window.sessionStorage.getItem('dronetv_chatbot_conversation_id')
  if (existing) return existing
  const id = crypto.randomUUID()
  window.sessionStorage.setItem('dronetv_chatbot_conversation_id', id)
  return id
}

export default function ChatbotPage() {
  const [conversationId, setConversationId] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showEnquiry, setShowEnquiry] = useState(false)
  const [values, setValues] = useState(initialValues)
  const [countryCode, setCountryCode] = useState('+91')
  const [fieldErrors, setFieldErrors] = useState<EnquiryErrors>({})
  const [enquiryLoading, setEnquiryLoading] = useState(false)
  const [enquirySuccess, setEnquirySuccess] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const id = getConversationId()
    setConversationId(id)
    const saved = window.sessionStorage.getItem(`dronetv_chatbot_messages_${id}`)
    setMessages(saved ? JSON.parse(saved) as Message[] : [{ id: crypto.randomUUID(), role: 'assistant', text: 'Hi, I’m Sky. I can help with DroneTV services, courses, registration, and enquiries.', createdAt: Date.now() }])
  }, [])
  useEffect(() => { if (conversationId) window.sessionStorage.setItem(`dronetv_chatbot_messages_${conversationId}`, JSON.stringify(messages)) }, [conversationId, messages])
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading, showEnquiry])

  function addMessage(role: Message['role'], text: string) {
    setMessages((current) => [...current, { id: crypto.randomUUID(), role, text, createdAt: Date.now() }])
  }

  async function sendMessage(event?: FormEvent, suggested?: string) {
    event?.preventDefault()
    const clean = (suggested ?? input).trim()
    if (!clean || loading) return
    setInput('')
    setError('')
    const history: ChatMessage[] = messages.slice(-20).map(({ role, text }) => ({ role, text }))
    addMessage('user', clean)
    if (predefined[clean]) setShowEnquiry(/interested|student|speak/.test(clean))
    setLoading(true)
    try {
      const response = await sendChat(clean, history, conversationId)
      setConversationId(response.data.conversationId)
      addMessage('assistant', response.data.reply)
      if (response.data.retryable) setError('Sky is temporarily using a fallback. You can retry your message.')
    } catch {
      addMessage('assistant', predefined[clean] || 'I can help with DroneTV services, training courses, registration, contact details, or collecting an enquiry. Please try again or use the enquiry form.')
      setError('Sky is unavailable right now. Your conversation is still here; please retry.')
    } finally { setLoading(false) }
  }

  function resetConversation() {
    if (!window.confirm('Reset this conversation?')) return
    const id = crypto.randomUUID()
    window.sessionStorage.setItem('dronetv_chatbot_conversation_id', id)
    setConversationId(id)
    setMessages([{ id: crypto.randomUUID(), role: 'assistant', text: 'Hi, I’m Sky. How can I help with your DroneTV journey today?', createdAt: Date.now() }])
    setInput('')
    setError('')
    setShowEnquiry(false)
  }

  function validateEnquiry(): EnquiryErrors {
    const next: EnquiryErrors = {}
    if (values.name.trim().length < 2) next.name = 'Please enter your full name.'
    if (!isAllowedEnquiryEmail(values.email)) next.email = allowedEmailMessage
    if (!/^[+()\d\s.-]{7,30}$/.test(values.phone)) next.phone = 'Enter a valid phone number.'
    if (!values.userType) next.userType = 'Select a user type.'
    if (!values.serviceOrCourse.trim()) next.serviceOrCourse = 'Tell us what you are interested in.'
    if (!values.message.trim()) next.message = 'Please enter a message.'
    return next
  }

  async function submitEnquiry(event: FormEvent) {
    event.preventDefault()
    const next = validateEnquiry()
    setFieldErrors(next)
    if (Object.keys(next).length) return
    setEnquiryLoading(true)
    setError('')
    try {
      await createEnquiry({ ...values, phone: `${countryCode} ${values.phone}`, userType: values.userType as UserType, source: 'Chatbot' })
      setEnquirySuccess(true)
      addMessage('assistant', 'Thanks — your enquiry has been sent to the DroneTV team. They will follow up with you soon.')
    } catch (reason) {
      const details = reason instanceof Error
        ? (reason as Error & { details?: Array<{ field?: string; message?: string }> }).details
        : undefined
      if (details?.length) {
        const serverErrors = details.reduce<EnquiryErrors>((errors, detail) => {
          if (detail.field && detail.message) errors[detail.field as keyof EnquiryValues] = detail.message
          return errors
        }, {})
        setFieldErrors(serverErrors)
        setError('Please correct the highlighted fields and try again.')
      } else {
        setError('We could not submit your enquiry. Please check your connection and try again.')
      }
    } finally { setEnquiryLoading(false) }
  }

  return <main className="min-h-screen bg-[#ecece8] text-[#161616]"><header className="border-b border-black/8 bg-white/75 backdrop-blur"><div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8"><a href="/" className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-[#f1c72d] text-xl font-black">D</span><span className="text-lg font-bold tracking-[-.06em]">Drone<span className="text-[#c89a12]">TV</span></span></a><div className="flex items-center gap-4"><div className="hidden items-center gap-2 text-sm font-semibold text-black/55 sm:flex"><span className="size-2 rounded-full bg-emerald-500" /> Sky is online</div><button onClick={resetConversation} className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2.5 text-xs font-bold transition hover:border-black/30"><RefreshCw className="size-3.5" /> Reset conversation</button></div></div></header><div className="mx-auto grid max-w-6xl gap-6 px-5 py-6 sm:px-8 lg:grid-cols-[1fr_360px] lg:py-10"><section className="flex min-h-[calc(100vh-150px)] flex-col overflow-hidden rounded-[2rem] border border-black/8 bg-white shadow-[0_20px_60px_rgba(0,0,0,.06)]"><div className="flex items-center gap-4 border-b border-black/8 px-5 py-4 sm:px-7"><span className="grid size-12 place-items-center rounded-2xl bg-[#171717] text-[#f1c72d]"><Sparkles className="size-6" /></span><div><h1 className="font-bold">Sky <span className="ml-2 text-xs font-medium text-black/35">DroneTV assistant</span></h1><p className="mt-1 text-xs text-black/45">Courses, services, and your next step</p></div></div><div className="flex-1 space-y-5 overflow-y-auto bg-[#fafaf8] p-5 sm:p-8">{messages.map((message) => <div key={message.id} className={`flex items-end gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>{message.role === 'assistant' && <span className="hidden size-8 shrink-0 place-items-center rounded-full bg-[#f1c72d] sm:grid"><Sparkles className="size-4" /></span>}<div className={`max-w-[86%] rounded-2xl px-4 py-3 ${message.role === 'user' ? 'rounded-br-sm bg-[#171717] text-white' : 'rounded-bl-sm bg-white shadow-sm'}`}><p className="text-sm leading-6">{message.text}</p><time className={`mt-2 flex items-center gap-1 text-[10px] ${message.role === 'user' ? 'text-white/45' : 'text-black/35'}`}><Clock3 className="size-3" />{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</time></div>{message.role === 'user' && <span className="hidden size-8 shrink-0 place-items-center rounded-full bg-black/8 sm:grid"><UserRound className="size-4" /></span>}</div>)}{loading && <div className="flex items-center gap-2 text-sm text-black/40"><span className="flex gap-1"><i className="size-1.5 animate-bounce rounded-full bg-black/40" /><i className="size-1.5 animate-bounce rounded-full bg-black/40 [animation-delay:120ms]" /><i className="size-1.5 animate-bounce rounded-full bg-black/40 [animation-delay:240ms]" /></span> Sky is typing…</div>}<div ref={endRef} /></div>{error && <div className="flex items-center justify-between gap-3 bg-red-50 px-5 py-3 text-sm text-red-700"><span>{error}</span><button onClick={() => void sendMessage()} className="font-bold">Retry</button></div>}<div className="flex flex-wrap gap-2 border-t p-4"><p className="w-full text-[10px] font-bold uppercase tracking-[.16em] text-black/35">Suggested questions</p>{suggestions.map((suggestion) => <button key={suggestion} disabled={loading} onClick={() => void sendMessage(undefined, suggestion)} className="rounded-full border border-black/10 px-3 py-2 text-left text-xs font-semibold transition hover:border-black/40 disabled:opacity-50">{suggestion}</button>)}</div><form onSubmit={sendMessage} className="flex gap-3 border-t p-4 sm:p-5"><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Type your message..." aria-label="Message Sky" className="min-w-0 flex-1 rounded-xl bg-[#f3f3ef] px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-[#f1c72d]" /><button disabled={loading || !input.trim()} className="grid size-12 shrink-0 place-items-center rounded-xl bg-[#171717] text-white disabled:opacity-40" aria-label="Send message"><Send className="size-4" /></button></form></section><aside className="rounded-[2rem] border border-black/8 bg-white p-5 shadow-sm sm:p-7"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#bf8e00]">Talk to the team</p><h2 className="mt-3 text-2xl font-bold tracking-tight">Start an enquiry</h2><p className="mt-2 text-sm leading-5 text-black/45">Share your details and admissions will follow up.</p></div><MessageCircle className="text-[#c89a12]" /></div>{enquirySuccess ? <div className="mt-10 rounded-2xl bg-[#f7f3dc] p-6 text-center"><span className="mx-auto grid size-11 place-items-center rounded-full bg-[#f1c72d]"><Check /></span><h3 className="mt-3 font-bold">Enquiry sent</h3><p className="mt-2 text-xs leading-5 text-black/50">The DroneTV team will be in touch.</p>  <button onClick={() => { setEnquirySuccess(false); setValues(initialValues); setCountryCode('+91') }} className="mt-4 text-xs font-bold underline">Send another</button></div> :   <form onSubmit={submitEnquiry} className="mt-7 space-y-4">{(['name', 'email'] as const).map((field) =>  <label key={field} className="block text-xs font-bold capitalize">{field === 'name' ? 'Full name' : field}  <input type={field === 'email' ? 'email' : 'text'} value={values[field]} onChange={(event) => setValues((current) => ({ ...current, [field]: event.target.value }))} className={`mt-2 w-full rounded-xl border bg-[#fafaf8] p-3 text-sm font-normal outline-none ${fieldErrors[field] ? 'border-red-400' : 'border-black/10'}`} />  </label>)}{fieldErrors.name && <p className="-mt-2 text-xs text-red-600">{fieldErrors.name}</p>}{fieldErrors.email && <p className="-mt-2 text-xs text-red-600">{fieldErrors.email}</p>}<label className="block text-xs font-bold">Phone<PhoneField value={values.phone} countryCode={countryCode} onCountryCodeChange={setCountryCode} onChange={(phone) => setValues((current) => ({ ...current, phone }))} /></label>{fieldErrors.phone && <p className="-mt-2 text-xs text-red-600">{fieldErrors.phone}</p>}<label className="block text-xs font-bold">User type<select value={values.userType} onChange={(event) => setValues((current) => ({ ...current, userType: event.target.value as UserType }))} className="mt-2 w-full rounded-xl border border-black/10 bg-[#fafaf8] p-3 text-sm font-normal outline-none"><option value="">Select one</option><option>Student</option><option>Customer</option><option>Other</option></select></label>{fieldErrors.userType && <p className="-mt-2 text-xs text-red-600">{fieldErrors.userType}</p>}<label className="block text-xs font-bold">Service or course<input value={values.serviceOrCourse} onChange={(event) => setValues((current) => ({ ...current, serviceOrCourse: event.target.value }))} className="mt-2 w-full rounded-xl border border-black/10 bg-[#fafaf8] p-3 text-sm font-normal outline-none" placeholder="Drone Pilot Training" /></label>{fieldErrors.serviceOrCourse && <p className="-mt-2 text-xs text-red-600">{fieldErrors.serviceOrCourse}</p>}<label className="block text-xs font-bold">Message<textarea value={values.message} onChange={(event) => setValues((current) => ({ ...current, message: event.target.value }))} rows={3} className="mt-2 w-full resize-none rounded-xl border border-black/10 bg-[#fafaf8] p-3 text-sm font-normal outline-none" /></label>{fieldErrors.message && <p className="-mt-2 text-xs text-red-600">{fieldErrors.message}</p>}<button disabled={enquiryLoading} className="w-full rounded-xl bg-[#f1c72d] p-3.5 text-sm font-bold disabled:opacity-50">{enquiryLoading ? 'Sending enquiry…' : 'Send enquiry'} <Send className="ml-2 inline size-4" /></button></form>}</aside></div></main>
}
