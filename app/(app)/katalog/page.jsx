'use client'
import { useState } from 'react'
import { useStore } from '@/lib/store'
import { toast } from '@/lib/toast'
import { addDays, cn, today } from '@/lib/utils'
import { inputCls, ItemCard, Modal } from '@/components/ui'

export default function Katalog() {
  const { items, addLoan } = useStore()
  const [q, setQ] = useState(''), [cat, setCat] = useState('Semua'), [sel, setSel] = useState(null)
  const cats = ['Semua', ...new Set(items.map((i) => i.cat))]
  const list = items.filter((i) => (cat === 'Semua' || i.cat === cat) && i.name.toLowerCase().includes(q.toLowerCase()))

  const submit = (f) => {
    const qty = +f.qty
    if (!(qty >= 1 && qty <= sel.stock) || !f.due || f.due <= today()) { toast('Periksa jumlah dan tanggal kembali', false); return false }
    addLoan(sel.id, qty, f.due); toast('Pengajuan terkirim')
  }

  return (
    <>
      <h1 className="font-display text-2xl font-bold">Katalog barang</h1>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input value={q} onChange={(e) => setQ(e.target.value)} className={cn(inputCls, 'sm:max-w-xs')} placeholder="Cari barang" />
        <div className="flex flex-wrap gap-2">
          {cats.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={cn('rounded-full px-3 py-1.5 text-sm font-medium', c === cat ? 'bg-indigo-600 text-white' : 'bg-white ring-1 ring-slate-300')}>{c}</button>
          ))}
        </div>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((i) => <ItemCard key={i.id} item={i} onBorrow={setSel} />)}
        {!list.length && <div className="text-slate-500">Tidak ada barang yang cocok.</div>}
      </div>
      {sel && (
        <Modal title="Ajukan peminjaman" okLabel="Kirim pengajuan" onClose={() => setSel(null)} onSubmit={submit}>
          <p>{sel.name} (stok {sel.stock})</p>
          <input name="qty" type="number" min="1" max={sel.stock} defaultValue="1" className={inputCls} />
          <label className="block">Tanggal kembali
            <input name="due" type="date" min={addDays(1)} max={addDays(30)} defaultValue={addDays(3)} className={cn(inputCls, 'mt-1')} />
          </label>
        </Modal>
      )}
    </>
  )
}
