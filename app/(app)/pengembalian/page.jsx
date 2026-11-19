'use client'
import { useState } from 'react'
import { useStore } from '@/lib/store'
import { toast } from '@/lib/toast'
import { Button, CONDITIONS, inputCls, LoanTable, Modal } from '@/components/ui'

export default function Pengembalian() {
  const { loans, items, checkIn } = useStore()
  const [sel, setSel] = useState(null)
  return (
    <>
      <h1 className="font-display text-2xl font-bold">Pusat pengembalian</h1>
      <div className="mt-4">
        <LoanTable admin rows={loans.filter((l) => l.status === 'Borrowed')} empty="Semua barang sudah kembali."
          actions={(l) => <Button onClick={() => setSel(l)}>Terima kembali</Button>} />
      </div>
      {sel && (
        <Modal title="Terima pengembalian" okLabel="Tutup tiket" onClose={() => setSel(null)}
          onSubmit={(f) => { checkIn(sel.id, f.cond, f.note?.trim() ?? ''); toast('Tiket pengembalian ditutup') }}>
          <p>{items.find((i) => i.id === sel.itemId)?.name} ×{sel.qty}</p>
          <label className="block">Kondisi saat diterima
            <select name="cond" className={inputCls + ' mt-1'}>{Object.keys(CONDITIONS).map((c) => <option key={c}>{c}</option>)}</select>
          </label>
          <input name="note" className={inputCls} placeholder="Catatan (opsional)" />
        </Modal>
      )}
    </>
  )
}
