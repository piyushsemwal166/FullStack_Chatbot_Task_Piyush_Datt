'use client'

import { FormEvent, useState } from 'react'
import { ArrowLeft, ArrowRight, LockKeyhole, Sparkles } from 'lucide-react'
import { login } from '@/lib/api'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const response = await login(email, password)
      window.localStorage.setItem('dronetv_admin_token', response.data.token)
      window.location.assign('/admin/overview')
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to sign in.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="grid min-h-screen bg-[#f4f4f1] lg:grid-cols-[.85fr_1.15fr]">
      <section className="relative hidden overflow-hidden bg-[#171717] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 opacity-60"><img src="https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=1200&q=90" alt="" className="h-full w-full object-cover grayscale" /></div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/45 to-[#e3bb25]/40" />
        <div className="relative"><a href="/" className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-[#f1c72d] font-black text-black">D</span><span className="text-lg font-bold tracking-[-.06em]">DroneTV</span></a></div>
        <div className="relative max-w-md"><Sparkles className="mb-6 size-8 text-[#f1c72d]" /><h1 className="text-6xl font-semibold leading-[.9] tracking-[-.08em]">The sky is only the beginning.</h1><p className="mt-6 text-sm leading-6 text-white/60">Manage every lead, conversation, and next step from one calm command center.</p></div>
        <p className="relative text-xs text-white/40">Private workspace · DroneTV admissions</p>
      </section>
      <section className="flex items-center justify-center bg-[#f4f4f1] p-6 text-[#171717] sm:p-12"><div className="w-full max-w-md"><a href="/" className="mb-12 inline-flex items-center gap-2 text-sm font-semibold text-black/60 transition hover:text-black"><ArrowLeft className="size-4" /> Back to DroneTV</a><div className="mb-8"><span className="mb-5 grid size-12 place-items-center rounded-2xl bg-[#f1c72d]"><LockKeyhole className="size-5 text-black" /></span><h2 className="text-4xl font-semibold tracking-[-.07em] text-[#171717]">Welcome back.</h2><p className="mt-3 text-sm leading-6 text-black/60">Sign in to your support and lead workspace.</p></div><form onSubmit={handleSubmit} className="space-y-4"><label className="block text-sm font-semibold text-[#171717]">Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-black/15 bg-white p-4 text-[#171717] outline-none placeholder:text-black/35 transition focus:border-black" placeholder="admin@gmail.com" /></label><label className="block text-sm font-semibold text-[#171717]">Password<input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-black/15 bg-white p-4 text-[#171717] outline-none placeholder:text-black/35 transition focus:border-black" placeholder="Enter your password" /></label>{error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>}<button disabled={loading} className="w-full rounded-xl bg-[#171717] p-4 text-sm font-bold text-white transition hover:bg-black disabled:cursor-wait disabled:opacity-60">{loading ? 'Signing in…' : 'Enter workspace'} <ArrowRight className="ml-2 inline size-4" /></button></form><p className="mt-8 text-center text-xs leading-5 text-black/50">Admin access is protected by JWT authentication. Contact your system owner if you need credentials.</p></div></section>
    </main>
  )
}
