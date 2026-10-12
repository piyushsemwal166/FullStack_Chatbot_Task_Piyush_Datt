'use client'

import { ReactNode, useEffect, useState } from 'react'
import { ClipboardList, LayoutDashboard, LogOut, Menu, ShieldCheck, X } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

export function getAdminToken() {
  if (typeof window === 'undefined') return ''
  return window.localStorage.getItem('dronetv_admin_token') || ''
}

export function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  useEffect(() => { if (!getAdminToken()) router.replace('/admin/login') }, [router])
  function logout() {
    window.localStorage.removeItem('dronetv_admin_token')
    router.replace('/admin/login')
  }
  const links = [{ href: '/admin/overview', label: 'Overview', icon: LayoutDashboard }, { href: '/admin/enquiries', label: 'Enquiries', icon: ClipboardList }]
  return <div className="min-h-screen bg-[#f4f4f1] text-[#161616]"><aside className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-[#171717] p-6 text-white transition-transform lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}><div className="flex items-center justify-between"><a href="/" className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-[#f1c72d] font-black text-black">D</span><span className="text-lg font-bold tracking-[-.06em]">DroneTV</span></a><button className="lg:hidden" onClick={() => setMobileOpen(false)}><X /></button></div><p className="mt-2 pl-13 text-[10px] uppercase tracking-[.2em] text-white/35">Support workspace</p><nav className="mt-12 space-y-2">{links.map(({ href, label, icon: Icon }) => <a key={href} href={href} onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${pathname === href ? 'bg-[#f1c72d] text-black' : 'text-white/55 hover:bg-white/10 hover:text-white'}`}><Icon className="size-5" />{label}</a>)}</nav><div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4"><div className="flex items-center gap-2 text-sm font-bold"><ShieldCheck className="size-4 text-[#f1c72d]" />Secure workspace</div><p className="mt-2 text-xs leading-5 text-white/40">Live MongoDB data and protected admin actions.</p></div><button onClick={logout} className="mt-5 flex items-center gap-3 border-t border-white/10 pt-5 text-sm font-semibold text-white/55 hover:text-white"><LogOut className="size-4" />Log out</button></aside><div className="lg:pl-72"><header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-black/5 bg-[#f4f4f1]/90 px-5 backdrop-blur-md sm:px-8"><button className="rounded-lg p-2 lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open admin menu"><Menu /></button><div><p className="text-xs font-bold uppercase tracking-[.18em] text-black/35">DroneTV admin</p><h1 className="mt-1 text-xl font-bold tracking-tight">{pathname.includes('overview') ? 'Operations overview' : 'Enquiry management'}</h1></div><a href="/" className="text-sm font-semibold text-black/50 hover:text-black">View site</a></header><main className="mx-auto max-w-[1440px] p-5 sm:p-8">{children}</main></div></div>
}
