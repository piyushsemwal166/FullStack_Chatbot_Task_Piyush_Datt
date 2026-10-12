'use client'

import { FormEvent, ReactNode, useState } from 'react'
import { ArrowRight, Check, Mail, MapPin, MessageCircle, Send, Sparkles, X } from 'lucide-react'
import { createEnquiry, sendChat } from '@/lib/api'
import { allowedEmailMessage, isAllowedEnquiryEmail } from '@/lib/email'
import { PhoneField } from '@/components/phone-field'

export const courseCatalog = [
  { title: 'Drone Pilot Training', description: 'Build confident flight skills and prepare for the DGCA pathway with experienced instructors.', image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1000&q=85', duration: '6 weeks' },
  { title: 'Aerial Photography', description: 'Learn cinematic movement, composition, and the visual language of aerial storytelling.', image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1000&q=85', duration: '4 weeks' },
  { title: 'Agriculture Drones', description: 'Explore precision agriculture, mapping workflows, and responsible field operations.', image: 'https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&w=1000&q=85', duration: '5 weeks' },
  { title: 'Commercial Operations', description: 'Turn flight skills into a career with mission planning, safety, and business operations.', image: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=1000&q=85', duration: '8 weeks' },
]

export function PublicNav() {
  return <nav className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-6 sm:px-8 lg:px-12"><a href="/" className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-[#f1c72d] text-xl font-black text-black">D</span><span className="text-lg font-bold tracking-[-.06em]">Drone<span className="text-[#c89a12]">TV</span><span className="ml-2 text-[10px] font-medium uppercase tracking-[.22em] text-black/40">academy</span></span></a><div className="hidden items-center gap-7 text-sm font-semibold text-black/60 md:flex"><a href="/courses" className="hover:text-black">Courses</a><a href="/#services" className="hover:text-black">Services</a><a href="/chatbot" className="hover:text-black">AI Assistant</a><a href="/contact" className="hover:text-black">Contact</a><a href="/admin/login" className="hover:text-black">Admin Login</a></div><a href="/contact" className="hidden rounded-full bg-[#171717] px-5 py-3 text-sm font-bold text-white md:block">Start learning <ArrowRight className="ml-2 inline size-4" /></a></nav>
}

export function PublicFooter() {
  return <footer className="bg-[#171717] px-5 py-12 text-white sm:px-8 lg:px-12"><div className="mx-auto max-w-[1440px]"><div className="flex flex-col justify-between gap-8 border-b border-white/10 pb-10 md:flex-row md:items-end"><div><div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-lg bg-[#f1c72d] font-black text-black">D</span><span className="text-xl font-bold tracking-[-.06em]">DroneTV</span></div><p className="mt-4 max-w-xs text-sm leading-6 text-white/45">Training the next generation of pilots, makers, and sky thinkers.</p></div><a href="/chatbot" className="flex items-center gap-2 text-sm font-bold text-[#f1c72d]">Ask Sky <ArrowRight className="size-4" /></a></div><div className="pt-6 text-xs text-white/35">© 2026 DroneTV Academy. All rights reserved.</div></div></footer>
}

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([{ role: 'assistant', text: 'Hi, I’m Sky. Ask me about courses, registration, or getting started.' }])
  async function submit(event: FormEvent) {
    event.preventDefault()
    const clean = input.trim()
    if (!clean || loading) return
    const history = messages
    setMessages((current) => [...current, { role: 'user', text: clean }])
    setInput('')
    setLoading(true)
    try {
      const response = await sendChat(clean, history)
      setMessages((current) => [...current, { role: 'assistant', text: response.data.reply }])
    } catch {
      setMessages((current) => [...current, { role: 'assistant', text: 'I’m having trouble connecting. Please use our enquiry form and the team will help.' }])
    } finally { setLoading(false) }
  }
  return <><button onClick={() => setOpen(true)} className="fixed bottom-6 right-5 z-30 flex items-center gap-3 rounded-full bg-[#171717] p-2.5 pr-5 text-sm font-bold text-white shadow-2xl"><span className="grid size-11 place-items-center rounded-full bg-[#f1c72d] text-black"><MessageCircle className="size-5" /></span><span className="hidden sm:inline">Ask Sky</span></button>{open && <div className="fixed bottom-5 right-5 z-50 flex h-[min(650px,calc(100vh-40px))] w-[min(390px,calc(100vw-40px))] flex-col overflow-hidden rounded-[1.8rem] border border-black/10 bg-white shadow-2xl"><div className="flex items-center justify-between bg-[#171717] p-5 text-white"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-full bg-[#f1c72d] text-black"><Sparkles className="size-5" /></span><div><p className="font-bold">Sky, your AI guide</p><p className="text-xs text-white/50">Ask about DroneTV</p></div></div><button onClick={() => setOpen(false)} aria-label="Close assistant"><X /></button></div><div className="flex-1 space-y-4 overflow-y-auto bg-[#fafaf8] p-4">{messages.map((item, index) => <div key={index} className={`flex ${item.role === 'user' ? 'justify-end' : ''}`}><p className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-5 ${item.role === 'user' ? 'bg-[#f1c72d]' : 'bg-white text-black/65 shadow-sm'}`}>{item.text}</p></div>)}{loading && <p className="text-xs text-black/40">Sky is thinking…</p>}</div><form onSubmit={submit} className="flex gap-2 border-t p-3"><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about courses..." className="min-w-0 flex-1 rounded-xl bg-[#f5f5f2] px-4 py-3 text-sm outline-none" /><button className="grid size-11 place-items-center rounded-xl bg-[#171717] text-white" aria-label="Send message"><Send className="size-4" /></button></form></div>}</>
}

export function EnquiryForm({ initialCourse = '' }: { initialCourse?: string }) {
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [phoneCountryCode, setPhoneCountryCode] = useState('+91')
  const [phoneNumber, setPhoneNumber] = useState('')
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    const data = new FormData(event.currentTarget)
    const email = String(data.get('email') || '')
    if (!isAllowedEnquiryEmail(email)) {
      setError(allowedEmailMessage)
      return
    }
    try {
      await createEnquiry({ name: String(data.get('name')), email, phone: `${phoneCountryCode} ${phoneNumber}`, userType: String(data.get('userType')) as 'Student' | 'Customer' | 'Other', serviceOrCourse: String(data.get('course')), message: String(data.get('message')), source: 'Contact Form' })
      setSent(true)
      event.currentTarget.reset()
      setPhoneNumber('')
      setPhoneCountryCode('+91')
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to submit enquiry.') }
  }
  if (sent) return <div className="rounded-3xl bg-[#f7f3dc] p-10 text-center"><span className="mx-auto grid size-12 place-items-center rounded-full bg-[#f1c72d]"><Check /></span><h3 className="mt-4 text-2xl font-bold">You’re on the list.</h3><p className="mt-2 text-sm text-black/50">Our admissions team will contact you shortly.</p><button onClick={() => setSent(false)} className="mt-5 text-sm font-bold underline">Send another enquiry</button></div>
  return <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-bold">Name<input required name="name" className="mt-2 w-full rounded-xl border border-black/10 bg-[#fafaf8] p-3.5 font-normal outline-none focus:border-black" placeholder="Your name" /></label><label className="text-sm font-bold">Email<input required type="email" name="email" className="mt-2 w-full rounded-xl border border-black/10 bg-[#fafaf8] p-3.5 font-normal outline-none focus:border-black" placeholder="you@email.com" /></label>  <label className="text-sm font-bold">Phone<PhoneField value={phoneNumber} countryCode={phoneCountryCode} onCountryCodeChange={setPhoneCountryCode} onChange={setPhoneNumber} /></label><label className="text-sm font-bold">I am a<select name="userType" defaultValue="Student" className="mt-2 w-full rounded-xl border border-black/10 bg-[#fafaf8] p-3.5 font-normal outline-none"><option>Student</option><option>Customer</option><option>Other</option></select></label><label className="text-sm font-bold sm:col-span-2">Course or service<select name="course" defaultValue={initialCourse || courseCatalog[0].title} className="mt-2 w-full rounded-xl border border-black/10 bg-[#fafaf8] p-3.5 font-normal outline-none">{courseCatalog.map((course) => <option key={course.title}>{course.title}</option>)}</select></label><label className="text-sm font-bold sm:col-span-2">Message<textarea required name="message" rows={4} className="mt-2 w-full resize-none rounded-xl border border-black/10 bg-[#fafaf8] p-3.5 font-normal outline-none focus:border-black" placeholder="Tell us what you want to learn..." /></label>{error && <p className="text-sm text-red-600 sm:col-span-2">{error}</p>}<button className="rounded-xl bg-[#171717] p-4 text-sm font-bold text-white sm:col-span-2">Send enquiry <ArrowRight className="ml-2 inline size-4" /></button></form>
}

export function PublicPage({ children }: { children: ReactNode }) {
  return <main className="min-h-screen bg-[#f4f4f1] text-[#161616]"><PublicNav />{children}<PublicFooter /><ChatWidget /></main>
}
