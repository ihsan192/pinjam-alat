'use client'
import Link from 'next/link'
import { stats, useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { StatCard } from '@/components/ui'

export default function AdminDasbor() {
  const { items, loans } = useStore()
  const s = stats(items, loans)
  return (
    <>
      <h1 className="font-display text-2xl font-bold">Ringkasan inventaris</h1>
      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total aset" value={s.total} /><StatCard label="Sedang dipinjam" value={s.out} />
        <StatCard label="Antrean persetujuan" value={s.pending} /><StatCard label="Unit rusak" value={s.damaged} />
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link href="/persetujuan" className="rounded-xl bg-amber-50 p-4 font-medium text-amber-700 ring-1 ring-amber-200">{s.pending} pengajuan menunggu keputusan</Link>
        <Link href="/pengembalian" className={cn('rounded-xl p-4 font-medium ring-1', s.late ? 'bg-rose-50 text-rose-700 ring-rose-200' : 'bg-emerald-50 text-emerald-700 ring-emerald-200')}>{s.late} peminjaman terlambat</Link>
      </div>
    </>
  )
}
