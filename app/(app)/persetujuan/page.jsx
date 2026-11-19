'use client'
import { useState } from 'react'
import { useStore } from '@/lib/store'
import { toast } from '@/lib/toast'
import { Button, LoanTable, Modal } from '@/components/ui'

export default function Persetujuan() {
  const { loans, approve, reject } = useStore()
  const [rej, setRej] = useState(null)
  const doApprove = (id) => (approve(id) ? toast('Pengajuan disetujui') : toast('Stok tidak cukup untuk menyetujui', false))
  return (
    <>
      <h1 className="font-display text-2xl font-bold">Persetujuan</h1>
      <div className="mt-4">
        <LoanTable admin rows={loans.filter((l) => l.status === 'Pending')} empty="Tidak ada pengajuan baru."
          actions={(l) => <>
            <Button variant="success" onClick={() => doApprove(l.id)}>Setujui</Button>
            <Button variant="danger" onClick={() => setRej(l)}>Tolak</Button></>} />
      </div>
      {rej && (
        <Modal title="Tolak pengajuan?" danger okLabel="Tolak" onClose={() => setRej(null)} onSubmit={() => { reject(rej.id); toast('Pengajuan ditolak') }}>
          <p>Siswa akan melihat statusnya berubah menjadi ditolak.</p>
        </Modal>
      )}
    </>
  )
}
