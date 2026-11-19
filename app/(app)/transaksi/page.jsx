'use client'
import { useState } from 'react'
import { useStore } from '@/lib/store'
import { toast } from '@/lib/toast'
import { Button, LoanTable, Modal } from '@/components/ui'

export default function Transaksi() {
  const { loans, removeLoan } = useStore()
  const [del, setDel] = useState(null)
  return (
    <>
      <h1 className="font-display text-2xl font-bold">Semua transaksi</h1>
      <div className="mt-4">
        <LoanTable admin rows={[...loans].sort((a, b) => b.id - a.id)} empty="Belum ada transaksi."
          actions={(l) => l.status === 'Pending' && <Button variant="outline" onClick={() => setDel(l)}>Hapus</Button>} />
      </div>
      {del && (
        <Modal title="Hapus pengajuan?" danger okLabel="Hapus" onClose={() => setDel(null)} onSubmit={() => { removeLoan(del.id); toast('Pengajuan dihapus') }}>
          <p>Hanya pengajuan yang belum diproses yang bisa dihapus.</p>
        </Modal>
      )}
    </>
  )
}
