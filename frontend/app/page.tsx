'use client'

import { FormEvent, useState } from 'react'
import {
  ArrowDownRight,
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  Clock3,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Play,
  Plus,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  UserRound,
  Users,
  X,
} from 'lucide-react'
import { createEnquiry } from '@/lib/api'
import { allowedEmailMessage, isAllowedEnquiryEmail } from '@/lib/email'
import { PhoneField } from '@/components/phone-field'

const courses = [
  {
    title: 'Drone Pilot Training',
    eyebrow: '01 / Foundations',
    description: 'Build confident flight skills and prepare for the DGCA pathway with experienced instructors.',
    image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1200&q=85',
    duration: '6 weeks',
    tag: 'Most popular',
  },
  {
    title: 'Aerial Photography',
    eyebrow: '02 / Creative',
    description: 'Learn the visual language of aerial storytelling, from composition to cinematic movement.',
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1200&q=85',
    duration: '4 weeks',
    tag: 'Creative track',
  },
  {
    title: 'Agriculture Drones',
    eyebrow: '03 / Industry',
    description: 'Explore precision agriculture, mapping workflows, and responsible field operations.',
    image: 'https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&w=1200&q=85',
    duration: '5 weeks',
    tag: 'Future ready',
  },
  {
    title: 'Commercial Operations',
    eyebrow: '04 / Pro',
    description: 'Turn flight skills into a career with mission planning, safety, and business operations.',
    image: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=1200&q=85',
    duration: '8 weeks',
    tag: 'Career track',
  },
]

const services = [
  { icon: ShieldCheck, title: 'Certified learning', text: 'Structured training built around safety, confidence, and industry standards.' },
  { icon: Users, title: 'Small cohort energy', text: 'Get more instructor time, practical feedback, and a crew that keeps you moving.' },
  { icon: Sparkles, title: 'AI support, human care', text: 'Sky answers everyday questions while our admissions team handles the important ones.' },
]

export default function HomePage() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState('')
  const [phoneCountryCode, setPhoneCountryCode] = useState('+91')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [videoOpen, setVideoOpen] = useState(false)
  const [formSent, setFormSent] = useState(false)
  const [formError, setFormError] = useState('')

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setMobileOpen(false)
  }

  function chooseCourse(course: string) {
    setSelectedCourse(course)
    scrollTo('contact')
  }

  async function handleEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError('')
    const form = new FormData(event.currentTarget)
    const email = String(form.get('email') || '')
    if (!isAllowedEnquiryEmail(email)) {
      setFormError(allowedEmailMessage)
      return
    }
    try {
      await createEnquiry({
        name: String(form.get('name') || ''),
        email,
        phone: `${phoneCountryCode} ${phoneNumber}`,
        userType: 'Other',
        serviceOrCourse: String(form.get('course') || selectedCourse || 'Drone training'),
        message: String(form.get('message') || 'I would like to learn more about DroneTV courses.'),
        source: 'Contact Form',
      })
      setFormSent(true)
      setPhoneNumber('')
      setPhoneCountryCode('+91')
      event.currentTarget.reset()
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Please check your details and try again.')
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#f4f4f1] text-[#161616]">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-40 [background-image:radial-gradient(circle_at_15%_20%,rgba(255,255,255,.95),transparent_22%),radial-gradient(circle_at_84%_8%,rgba(255,255,255,.9),transparent_24%),radial-gradient(circle_at_60%_70%,rgba(224,224,215,.75),transparent_26%)]" />
      <nav className="relative z-20 mx-auto flex max-w-[1440px] items-center justify-between px-5 py-6 sm:px-8 lg:px-12">
        <button onClick={() => scrollTo('top')} className="flex items-center gap-3" aria-label="DroneTV home">
          <span className="grid size-10 place-items-center rounded-xl bg-[#f0c928] text-xl font-black tracking-tighter shadow-sm">D</span>
          <span className="text-lg font-bold tracking-[-0.06em]">Drone<span className="text-[#ce9f00]">TV</span><span className="ml-2 text-[10px] font-medium uppercase tracking-[.22em] text-black/40">academy</span></span>
        </button>
        <div className="hidden items-center gap-8 text-sm font-medium text-black/60 md:flex">
          <button onClick={() => scrollTo('courses')} className="transition hover:text-black">Courses</button>
          <button onClick={() => scrollTo('services')} className="transition hover:text-black">Services</button>
          <a href="/chatbot" className="transition hover:text-black">AI Assistant</a>
          <button onClick={() => scrollTo('contact')} className="transition hover:text-black">Contact</button>
        </div>
        <div className="hidden items-center gap-4 md:flex">
          <a href="/admin/login" className="text-sm font-semibold text-black/60 transition hover:text-black">Admin Login</a>
          <button onClick={() => scrollTo('contact')} className="rounded-full bg-[#171717] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black">Start learning <ArrowRight className="ml-2 inline size-4" /></button>
        </div>
        <button className="rounded-full bg-white p-3 shadow-sm md:hidden" onClick={() => setMobileOpen((open) => !open)} aria-label="Toggle navigation">{mobileOpen ? <X /> : <Menu />}</button>
        {mobileOpen && <div className="absolute left-5 right-5 top-20 rounded-3xl border border-black/5 bg-white p-5 shadow-xl md:hidden"><div className="flex flex-col gap-4 text-left text-sm font-semibold"><button onClick={() => scrollTo('courses')}>Courses</button><button onClick={() => scrollTo('services')}>Services</button><a href="/chatbot" onClick={() => setMobileOpen(false)}>AI Assistant</a><button onClick={() => scrollTo('contact')}>Contact</button><a href="/admin/login">Admin Login</a></div></div>}
      </nav>

      <section id="top" className="relative z-10 mx-auto max-w-[1440px] px-5 pb-20 pt-8 sm:px-8 lg:px-12 lg:pb-28 lg:pt-16">
        <div className="grid items-center gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-4">
          <div className="relative z-10 max-w-xl">
            <p className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[.22em] text-black/45"><span className="size-2 rounded-full bg-[#e2b719]" /> Learn above the ordinary</p>
            <h1 className="max-w-2xl text-[clamp(3.5rem,8vw,7.6rem)] font-semibold leading-[.88] tracking-[-.085em]">Unlock your <span className="relative inline-block italic text-[#c89a12] after:absolute after:-bottom-1 after:left-0 after:h-2 after:w-full after:rounded-full after:bg-[#e7c94b]/45 after:content-['']">potential</span> with drone training.</h1>
            <p className="mt-8 max-w-md text-base leading-7 text-black/55 sm:text-lg">Practical flight skills, creative confidence, and a clear path into the industries shaping tomorrow from above.</p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <button onClick={() => scrollTo('courses')} className="rounded-full bg-[#f1c72d] px-6 py-4 text-sm font-bold shadow-[0_8px_24px_rgba(214,169,24,.2)] transition hover:-translate-y-1">Explore courses <ArrowDownRight className="ml-5 inline size-4" /></button>
              <a href="/chatbot" className="rounded-full border border-black/10 bg-white px-6 py-4 text-sm font-bold transition hover:-translate-y-1 hover:border-black/30"><MessageCircle className="mr-2 inline size-4" /> Talk to Sky</a>
            </div>
            <div className="mt-12 flex items-center gap-8 border-t border-black/10 pt-6 text-sm"><div><strong className="block text-2xl tracking-tight">1,200+</strong><span className="text-black/45">pilots trained</span></div><div><strong className="block text-2xl tracking-tight">4.9/5</strong><span className="text-black/45">student rating</span></div><div className="hidden sm:block"><strong className="block text-2xl tracking-tight">12 yrs</strong><span className="text-black/45">in the sky</span></div></div>
          </div>
          <div className="relative min-h-[560px] lg:min-h-[700px]">
            <div className="absolute right-0 top-6 h-[82%] w-[88%] rounded-[3rem] bg-[#deded9] sm:w-[82%]" />
            <div className="absolute right-0 top-0 h-[78%] w-[92%] overflow-hidden rounded-[3rem] bg-[#d0d0cb] shadow-2xl shadow-black/10 sm:w-[88%]">
              <img src="https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=1400&q=90" alt="Drone pilot wearing a VR headset" className="h-full w-full object-cover object-center grayscale-[.12]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/10" />
              <div className="absolute bottom-6 left-6 rounded-2xl border border-white/30 bg-white/20 p-4 text-white backdrop-blur-md"><p className="text-[10px] uppercase tracking-[.2em] text-white/70">Next cohort</p><p className="mt-1 font-semibold">Applications open · Jan 2027</p></div>
            </div>
            <div className="absolute -left-2 bottom-16 flex max-w-[240px] items-center gap-3 rounded-2xl border border-black/5 bg-white/90 p-3 shadow-xl shadow-black/10 backdrop-blur sm:left-0"><img src="https://images.unsplash.com/photo-1506947411487-a56738267384?auto=format&fit=crop&w=240&q=80" alt="Drone in flight" className="size-16 rounded-xl object-cover" /><div><p className="text-xs font-bold">See it differently</p><p className="mt-1 text-[11px] leading-4 text-black/45">Aerial skills for real-world careers.</p></div></div>
            <button onClick={() => setVideoOpen(true)} className="absolute bottom-0 right-5 flex items-center gap-3 rounded-full bg-[#171717] px-4 py-3 text-sm font-semibold text-white shadow-xl transition hover:scale-105 sm:right-10"><span className="grid size-10 place-items-center rounded-full bg-[#f1c72d] text-black"><Play className="ml-0.5 size-4 fill-current" /></span> Watch the preview</button>
          </div>
        </div>
      </section>

      <section id="courses" className="relative z-10 scroll-mt-10 bg-[#191919] px-5 py-20 text-white sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[1440px]"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="text-xs font-bold uppercase tracking-[.22em] text-[#f1c72d]">The flight path</p><h2 className="mt-4 max-w-xl text-4xl font-semibold tracking-[-.06em] sm:text-6xl">Courses that take you places.</h2></div><p className="max-w-xs text-sm leading-6 text-white/50">From your first flight to your next career move, choose the pace and pathway that fits your ambition.</p></div><div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">{courses.map((course) => <article key={course.title} className="group overflow-hidden rounded-[1.6rem] bg-[#292929] transition hover:-translate-y-2"><div className="relative h-64 overflow-hidden"><img src={course.image} alt={course.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" /><span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-black">{course.tag}</span><span className="absolute bottom-4 left-4 text-xs font-medium text-white/75">{course.eyebrow}</span></div><div className="p-5"><h3 className="text-xl font-semibold tracking-tight">{course.title}</h3><p className="mt-3 min-h-14 text-sm leading-5 text-white/50">{course.description}</p><div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-white/45"><span><Clock3 className="mr-1 inline size-3.5" /> {course.duration}</span><button onClick={() => chooseCourse(course.title)} className="font-bold text-[#f1c72d]">Enquire <ArrowRight className="ml-1 inline size-3.5" /></button></div></div></article>)}</div></div>
      </section>

      <section id="services" className="relative z-10 scroll-mt-10 px-5 py-20 sm:px-8 lg:px-12 lg:py-28"><div className="mx-auto max-w-[1440px]"><div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]"><div><p className="text-xs font-bold uppercase tracking-[.22em] text-[#bf8e00]">Why DroneTV</p><h2 className="mt-4 max-w-md text-4xl font-semibold leading-[.95] tracking-[-.065em] sm:text-6xl">Made for curious people who look up.</h2><p className="mt-6 max-w-sm text-sm leading-6 text-black/50">We make the technical feel human, and the ambitious feel possible. You bring the curiosity. We bring the flight plan.</p><button onClick={() => scrollTo('contact')} className="mt-8 text-sm font-bold underline decoration-[#e0b51e] decoration-4 underline-offset-8">Meet your next skill <ArrowRight className="ml-2 inline size-4" /></button></div><div className="grid gap-4 sm:grid-cols-3">{services.map(({ icon: Icon, title, text }, index) => <div key={title} className="rounded-[1.5rem] border border-black/8 bg-white p-6 shadow-sm"><span className="grid size-12 place-items-center rounded-2xl bg-[#f7e7a5] text-black"><Icon className="size-5" /></span><p className="mt-12 text-xs font-bold text-black/35">0{index + 1}</p><h3 className="mt-2 text-lg font-bold tracking-tight">{title}</h3><p className="mt-3 text-sm leading-5 text-black/50">{text}</p></div>)}</div></div></div></section>

      <section className="relative z-10 px-5 pb-20 sm:px-8 lg:px-12 lg:pb-28"><div className="mx-auto grid max-w-[1440px] items-center gap-8 overflow-hidden rounded-[2rem] bg-[#deded8] p-6 sm:p-10 lg:grid-cols-[1fr_.85fr] lg:p-16"><div><p className="text-xs font-bold uppercase tracking-[.22em] text-black/45">A different perspective</p><h2 className="mt-5 max-w-xl text-4xl font-semibold leading-[.95] tracking-[-.07em] sm:text-6xl">The best view is the one you earn.</h2><p className="mt-6 max-w-md text-sm leading-6 text-black/55">Learn with people who fly for a living, in a studio that feels more like a creative lab than a classroom.</p><div className="mt-8 flex flex-wrap gap-4 text-sm font-semibold"><span><Check className="mr-2 inline size-4 text-[#bd920e]" />Hands-on flight time</span><span><Check className="mr-2 inline size-4 text-[#bd920e]" />Portfolio support</span></div></div><div className="relative h-72 overflow-hidden rounded-[1.5rem] bg-black sm:h-96"><img src="https://images.unsplash.com/photo-1524143986875-3b098d78b363?auto=format&fit=crop&w=1200&q=85" alt="Drone landscape" className="h-full w-full object-cover opacity-85" /><div className="absolute inset-0 grid place-items-center"><button onClick={() => setVideoOpen(true)} className="grid size-20 place-items-center rounded-full bg-white/90 text-black shadow-2xl transition hover:scale-110"><Play className="ml-1 size-7 fill-current" /></button></div><span className="absolute bottom-4 left-4 rounded-full bg-black/60 px-3 py-1.5 text-xs text-white">01:48 · Studio preview</span></div></div></section>

      <section id="contact" className="relative z-10 scroll-mt-10 bg-[#f1c72d] px-5 py-20 sm:px-8 lg:px-12 lg:py-28"><div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[.9fr_1.1fr]"><div><p className="text-xs font-bold uppercase tracking-[.22em] text-black/45">Your next move</p><h2 className="mt-5 max-w-lg text-5xl font-semibold leading-[.9] tracking-[-.08em] sm:text-7xl">Ready to take off?</h2><p className="mt-7 max-w-md text-base leading-7 text-black/60">Tell us where you want to go. We’ll help map the right course, schedule, and support for your journey.</p><div className="mt-10 space-y-4 text-sm font-semibold"><p><Mail className="mr-3 inline size-4" /> hello@dronetv.in</p><p><MapPin className="mr-3 inline size-4" /> Pune · Bengaluru · Online</p></div></div><div className="rounded-[1.8rem] bg-white p-6 shadow-xl shadow-[#b78c0c]/15 sm:p-8"><div className="mb-7 flex items-center justify-between"><div><h3 className="text-2xl font-bold tracking-tight">Start a conversation</h3><p className="mt-1 text-sm text-black/45">No pressure. Just a clear next step.</p></div><span className="grid size-11 place-items-center rounded-full bg-[#f6e398]"><Send className="size-4" /></span></div>{formSent ? <div className="rounded-2xl bg-[#f7f3dc] p-8 text-center"><span className="mx-auto grid size-12 place-items-center rounded-full bg-[#f1c72d]"><Check /></span><h3 className="mt-4 text-xl font-bold">You’re on the list.</h3><p className="mt-2 text-sm leading-6 text-black/50">Our admissions team will be in touch shortly.</p><button onClick={() => setFormSent(false)} className="mt-5 text-sm font-bold underline">Send another enquiry</button></div> : <form onSubmit={handleEnquiry} className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold">Name<input name="name" required className="mt-2 w-full rounded-xl border border-black/10 bg-[#fafaf8] p-3.5 font-normal outline-none focus:border-black" placeholder="Your name" /></label><label className="text-sm font-semibold">Email<input type="email" name="email" required className="mt-2 w-full rounded-xl border border-black/10 bg-[#fafaf8] p-3.5 font-normal outline-none focus:border-black" placeholder="you@email.com" /></label>      <label className="text-sm font-semibold">Phone<PhoneField value={phoneNumber} countryCode={phoneCountryCode} onCountryCodeChange={setPhoneCountryCode} onChange={setPhoneNumber} /></label><label className="text-sm font-semibold">Course<select name="course" defaultValue={selectedCourse || courses[0].title} className="mt-2 w-full rounded-xl border border-black/10 bg-[#fafaf8] p-3.5 font-normal outline-none focus:border-black">{courses.map((course) => <option key={course.title}>{course.title}</option>)}</select></label><label className="text-sm font-semibold sm:col-span-2">Message<textarea name="message" rows={3} className="mt-2 w-full resize-none rounded-xl border border-black/10 bg-[#fafaf8] p-3.5 font-normal outline-none focus:border-black" placeholder="What would you like to learn?" /></label>{formError && <p className="text-sm text-red-600 sm:col-span-2">{formError}</p>}<button className="rounded-xl bg-[#171717] px-5 py-4 text-sm font-bold text-white transition hover:bg-black sm:col-span-2">Send enquiry <ArrowRight className="ml-2 inline size-4" /></button></form>}</div></div></section>

      <footer className="relative z-10 bg-[#171717] px-5 py-12 text-white sm:px-8 lg:px-12"><div className="mx-auto max-w-[1440px]"><div className="flex flex-col justify-between gap-8 border-b border-white/10 pb-10 md:flex-row md:items-end"><div><div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-lg bg-[#f1c72d] font-black text-black">D</span><span className="text-xl font-bold tracking-[-.06em]">DroneTV</span></div><p className="mt-4 max-w-xs text-sm leading-6 text-white/45">Training the next generation of pilots, makers, and sky thinkers.</p></div><div className="flex gap-3"><a href="#" aria-label="Instagram" className="grid size-10 place-items-center rounded-full border border-white/15 text-xs font-bold transition hover:bg-white hover:text-black">IG</a><a href="#" aria-label="YouTube" className="grid size-10 place-items-center rounded-full border border-white/15 text-xs font-bold transition hover:bg-white hover:text-black">YT</a><a href="#" aria-label="LinkedIn" className="grid size-10 place-items-center rounded-full border border-white/15 text-xs font-bold transition hover:bg-white hover:text-black">in</a></div></div><div className="flex flex-col justify-between gap-4 pt-6 text-xs text-white/35 sm:flex-row"><span>© 2026 DroneTV Academy. All rights reserved.</span><span>Built for people who look up.</span></div></div></footer>

      <a href="/chatbot" className="fixed bottom-6 right-5 z-30 flex items-center gap-3 rounded-full bg-[#171717] p-2.5 pr-5 text-sm font-bold text-white shadow-2xl shadow-black/20 transition hover:-translate-y-1" aria-label="Open AI assistant"><span className="grid size-11 place-items-center rounded-full bg-[#f1c72d] text-black"><MessageCircle className="size-5" /></span><span className="hidden sm:inline">Ask Sky</span></a>

      {videoOpen && <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-5 backdrop-blur-sm" onClick={() => setVideoOpen(false)}><div className="relative aspect-video w-full max-w-4xl overflow-hidden rounded-3xl bg-[#222]" onClick={(event) => event.stopPropagation()}><img src="https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1600&q=90" alt="Drone preview" className="h-full w-full object-cover opacity-80" /><button onClick={() => setVideoOpen(false)} className="absolute right-4 top-4 rounded-full bg-white/90 p-2 text-black" aria-label="Close preview"><X className="size-5" /></button><div className="absolute inset-0 grid place-items-center"><div className="grid size-20 place-items-center rounded-full bg-white text-black"><Play className="ml-1 size-7 fill-current" /></div></div></div></div>}
    </main>
  )
}
