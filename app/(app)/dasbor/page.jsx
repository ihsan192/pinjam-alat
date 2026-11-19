'use client'
import Link from 'next/link'
import { useState } from 'react'
import { AlertTriangle, Clock } from 'lucide-react'
import { useStore } from '@/lib/store'
import { toast } from '@/lib/toast'
import { addDays, cn, effStatus, fmt } from '@/lib/utils'
import { Badge, Button, LoanTable, Modal } from '@/components/ui'

export default function Dasbor() {
  const { me, loans, items, removeLoan } = useStore()
  const [cancel, setCancel] = useState(null)
  const mine = loans.filter((l) => l.uid === me.id).sort((a, b) => b.id - a.id)
  const active = mine.filter((l) => l.status === 'Borrowed')
  const late = active.filter((l) => effStatus(l) === 'Overdue')

  return (
    <>
      <h1 className="font-display text-2xl font-bold">Halo, {me.name.split(' ')[0]}</h1>
      {late.length > 0 && (
        <div className="mt-4 flex items-center gap-3 rounded-xl bg-rose-50 p-4 text-rose-700 ring-1 ring-rose-200">
          <AlertTriangle className="h-5 w-5" />
          <div className="text-sm font-medium">{late.length} peminjaman melewati tenggat. Segera kembalikan ke petugas.</div>
        </div>
      )}
      <h2 className="mt-6 font-semibold">Sedang kamu bawa</h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {active.map((l) => {
          const e = effStatus(l), soon = l.due <= addDays(1) && e !== 'Overdue'
          return (
            <div key={l.id} className={cn('rounded-xl bg-white p-4 ring-1', e === 'Overdue' ? 'ring-rose-300' : soon ? 'ring-amber-300' : 'ring-slate-200')}>
              <div className="flex justify-between gap-2"><div className="font-semibold">{items.find((i) => i.id === l.itemId)?.name}</div><Badge status={e} /></div>
              <div className={cn('mt-3 flex items-center gap-2 text-sm', e === 'Overdue' ? 'text-rose-600' : soon ? 'text-amber-600' : 'text-slate-600')}>
                <Clock className="h-4 w-4" />Batas kembali {fmt(l.due)}{soon && ' (segera)'}
              </div>
            </div>
          )
        })}
        {!active.length && <div className="text-sm text-slate-500">Belum ada barang yang kamu bawa. <Link className="font-semibold text-indigo-600" href="/katalog">Buka katalog</Link></div>}
      </div>
      <h2 className="mt-8 font-semibold">Pengajuan menunggu</h2>
      <div className="mt-3">
        <LoanTable rows={mine.filter((l) => l.status === 'Pending')} empty="Tidak ada pengajuan yang menunggu."
          actions={(l) => <Button variant="outline" onClick={() => setCancel(l)}>Batalkan</Button>} />
      </div>
      {cancel && (
        <Modal title="Batalkan pengajuan?" danger okLabel="Ya, hapus" onClose={() => setCancel(null)}
          onSubmit={() => { removeLoan(cancel.id); toast('Pengajuan dihapus') }}>
          <p>Pengajuan ini akan dihapus dari daftar.</p>
        </Modal>
      )}
    </>
  )
}
