'use client'
import Link from 'next/link'
import { stats, useHydrated, useStore } from '@/lib/store'
import { ItemCard } from '@/components/ui'

const STEPS = [['Pilih barang', 'Cari di katalog dan ajukan pinjam.'], ['Tunggu persetujuan', 'Petugas memeriksa pengajuanmu.'],
  ['Ambil & gunakan', 'Kondisi barang dicatat saat diserahkan.'], ['Kembalikan', 'Petugas memeriksa dan menutup tiket.']]

export default function Home() {
  const hydrated = useHydrated()
  const { items, loans, me } = useStore()
  const s = stats(hydrated ? items : [], hydrated ? loans : [])
  const popular = [...(hydrated ? items : [])].sort((a, b) => b.total - b.stock - (a.total - a.stock)).slice(0, 4)
  const dash = me?.role === 'admin' ? '/admin' : '/dasbor'

  return (
    <>
      <header className="sticky top-0 z-20 bg-white/90 ring-1 ring-slate-200 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="font-display text-xl font-extrabold text-indigo-600">PinjamAlat</Link>
          <div className="flex gap-2">
            {hydrated && me ? <Link href={dash} className="rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white">Buka dasbor</Link> : <>
              <Link href="/masuk" className="rounded-lg px-3.5 py-2 text-sm font-semibold ring-1 ring-slate-300">Masuk</Link>
              <Link href="/daftar" className="rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white">Daftar</Link></>}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 pb-16">
        <section className="grid items-center gap-10 py-12 sm:py-20 lg:grid-cols-2">
          <div>
            <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">Tiap alat tercatat,<br />tiap kondisi terbukti.</h1>
            <p className="mt-5 max-w-md text-lg text-slate-600">Ajukan peminjaman dari ponsel, pantau tenggat, dan biarkan petugas memeriksa kondisi barang saat keluar dan kembali.</p>
            <div className="mt-7 flex gap-3">
              <Link href={me ? '/katalog' : '/daftar'} className="rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white">Mulai meminjam</Link>
              <Link href="/masuk" className="rounded-lg px-5 py-3 font-semibold ring-1 ring-slate-300">Masuk</Link>
            </div>
          </div>
          <div className="rounded-2xl bg-slate-800 p-6 text-white">
            <div className="text-sm text-slate-300">Kesiapan alat hari ini</div>
            <div className="mt-1 font-display text-6xl font-extrabold">{s.pct}%</div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-600"><div className="h-full bg-emerald-500" style={{ width: `${s.pct}%` }} /></div>
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div><div className="text-slate-300">Total item</div><div className="text-2xl font-bold">{s.total}</div></div>
              <div><div className="text-slate-300">Sedang dipinjam</div><div className="text-2xl font-bold">{s.out}</div></div>
            </div>
          </div>
        </section>
        <section>
          <h2 className="font-display text-2xl font-bold">Barang yang sering dipinjam</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{popular.map((i) => <ItemCard key={i.id} item={i} />)}</div>
        </section>
        <section className="mt-14">
          <h2 className="font-display text-2xl font-bold">Alur peminjaman</h2>
          <ol className="mt-4 grid gap-4 sm:grid-cols-4">
            {STEPS.map(([t, d], n) => (
              <li key={t} className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-indigo-600 text-sm font-bold text-white">{n + 1}</div>
                <div className="mt-3 font-semibold">{t}</div><div className="text-sm text-slate-600">{d}</div>
              </li>
            ))}
          </ol>
        </section>
      </main>
    </>
  )
}
