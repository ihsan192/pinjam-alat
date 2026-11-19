'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AlertTriangle, Archive, Boxes, CheckCheck, History, LayoutGrid, ListChecks, LogOut, Menu, Undo2 } from 'lucide-react'
import { useHydrated, useStore } from '@/lib/store'
import { toast } from '@/lib/toast'
import { cn } from '@/lib/utils'

const NAV = {
  student: [['/dasbor', 'Dasbor', LayoutGrid], ['/katalog', 'Katalog', Boxes], ['/riwayat', 'Riwayat', History]],
  admin: [['/admin', 'Dasbor', LayoutGrid], ['/persetujuan', 'Persetujuan', CheckCheck], ['/pengembalian', 'Pengembalian', Undo2],
    ['/barang', 'Barang', Archive], ['/transaksi', 'Transaksi', ListChecks], ['/log', 'Log audit', History]],
}

export default function Shell({ children }) {
  const path = usePathname(), router = useRouter(), hydrated = useHydrated()
  const me = useStore((s) => s.me), logout = useStore((s) => s.logout)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => { if (hydrated && !me) router.replace('/masuk') }, [hydrated, me, router])
  if (!hydrated || !me) return <div className="grid min-h-screen place-items-center text-slate-500">Memuat…</div>

  const nav = NAV[me.role]
  const current = nav.find((n) => n[0] === path)?.[1]
  const out = () => { logout(); toast('Kamu sudah keluar'); router.replace('/') }

  return (
    <div className="flex min-h-screen">
      <aside className={cn('hidden shrink-0 flex-col bg-slate-800 p-3 md:flex', collapsed ? 'w-16' : 'w-60')}>
        <div className="px-3 py-3 font-display text-lg font-extrabold text-white">{collapsed ? 'P' : 'PinjamAlat'}</div>
        <nav className="mt-2 space-y-1">
          {nav.map(([href, label, Icon]) => (
            <Link key={href} href={href} className={cn('flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium', path === href ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-700')}>
              <Icon className="h-5 w-5 shrink-0" />{!collapsed && label}
            </Link>
          ))}
        </nav>
        <button onClick={out} className="mt-auto flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-700">
          <LogOut className="h-5 w-5 shrink-0" />{!collapsed && 'Keluar'}
        </button>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-between gap-3 bg-white px-4 py-3 ring-1 ring-slate-200">
          <div className="flex items-center gap-3">
            <button onClick={() => setCollapsed(!collapsed)} aria-label="Ciutkan menu" className="hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:block"><Menu className="h-6 w-6" /></button>
            <span className="text-sm text-slate-500">{me.role === 'admin' ? 'Petugas' : 'Siswa'} / <b className="text-slate-800">{current}</b></span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">{me.name}</span>
            <button onClick={out} aria-label="Keluar" className="text-slate-500 md:hidden"><LogOut className="h-5 w-5" /></button>
          </div>
        </header>
        <main className="p-4 pb-28 sm:p-6 md:pb-6">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 flex overflow-x-auto bg-white ring-1 ring-slate-200 md:hidden">
        {nav.map(([href, label, Icon]) => (
          <Link key={href} href={href} className={cn('flex min-w-[4.5rem] flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium', path === href ? 'text-indigo-600' : 'text-slate-500')}>
            <Icon className="h-5 w-5" />{label}
          </Link>
        ))}
      </nav>
    </div>
  )
}
