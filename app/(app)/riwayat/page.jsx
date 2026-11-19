'use client'
import { useStore } from '@/lib/store'
import { LoanTable } from '@/components/ui'

export default function Riwayat() {
  const { me, loans } = useStore()
  const mine = loans.filter((l) => l.uid === me.id).sort((a, b) => b.id - a.id)
  return (
    <>
      <h1 className="font-display text-2xl font-bold">Riwayat peminjaman</h1>
      <div className="mt-4"><LoanTable rows={mine} empty="Belum ada riwayat." /></div>
    </>
  )
}
