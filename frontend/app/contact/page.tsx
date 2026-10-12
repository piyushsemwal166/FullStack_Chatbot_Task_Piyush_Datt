'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Mail, MapPin } from 'lucide-react'
import { EnquiryForm, PublicPage } from '@/components/public-shell'

function ContactContent() {
  const params = useSearchParams()
  return <PublicPage><section className="mx-auto grid max-w-[1440px] gap-12 px-5 pb-24 pt-16 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:px-12 lg:pt-24"><div><p className="text-xs font-bold uppercase tracking-[.22em] text-[#bf8e00]">Your next move</p><h1 className="mt-5 text-6xl font-semibold leading-[.9] tracking-[-.08em] sm:text-8xl">Ready to take off?</h1><p className="mt-8 max-w-md text-lg leading-7 text-black/55">Tell us where you want to go. We’ll map the right course, schedule, and support for your journey.</p><div className="mt-12 space-y-5 text-sm font-semibold"><p><Mail className="mr-3 inline size-4" /> hello@dronetv.in</p><p><MapPin className="mr-3 inline size-4" /> Pune · Bengaluru · Online</p></div></div><div className="rounded-[2rem] bg-white p-6 shadow-xl sm:p-10"><h2 className="text-2xl font-bold tracking-tight">Start a conversation</h2><p className="mt-2 mb-8 text-sm text-black/45">No pressure. Just a clear next step.</p><EnquiryForm initialCourse={params.get('course') || ''} /></div></section></PublicPage>
}

export default function ContactPage() {
  return <Suspense fallback={<PublicPage><section className="mx-auto max-w-4xl px-5 py-24"><div className="h-96 animate-pulse rounded-3xl bg-white" /></section></PublicPage>}><ContactContent /></Suspense>
}
