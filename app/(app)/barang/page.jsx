'use client'
import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { useStore } from '@/lib/store'
import { toast } from '@/lib/toast'
import { Badge, Button, inputCls, Modal, Table } from '@/components/ui'

export default function Barang() {
  const { items, saveItem, deleteItem } = useStore()
  const [q, setQ] = useState(''), [form, setForm] = useState(null), [del, setDel] = useState(null)
  const list = items.filter((i) => i.name.toLowerCase().includes(q.toLowerCase()))

  const submit = (f) => {
    const total = +f.total, stock = +f.stock
    if (!f.name.trim() || !f.cat.trim() || total < 0 || stock < 0 || stock > total) { toast('Lengkapi nama, kategori, dan pastikan stok tidak melebihi total', false); return false }
    saveItem({ name: f.name.trim(), cat: f.cat.trim(), total, stock, desc: f.desc.trim() }, form.id)
    toast(form.id ? 'Barang diperbarui' : 'Barang ditambahkan')
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Data barang</h1>
        <Button onClick={() => setForm({})}>Tambah barang</Button>
      </div>
      <input value={q} onChange={(e) => setQ(e.target.value)} className={inputCls + ' mt-4 sm:max-w-xs'} placeholder="Cari barang" />
      <div className="mt-4">
        <Table head={['Nama', 'Kategori', 'Stok', 'Rusak', 'Status', '']} empty="Barang tidak ditemukan.">
          {list.map((i) => (
            <tr key={i.id} className="border-t border-slate-100">
              <td className="p-3 font-medium">{i.name}</td><td className="p-3">{i.cat}</td>
              <td className="p-3">{i.stock}/{i.total}</td><td className="p-3">{i.damaged}</td>
              <td className="p-3"><Badge status={i.stock > 0 ? 'Available' : 'Out'} /></td>
              <td className="space-x-2 whitespace-nowrap p-3 text-right">
                <Button variant="outline" aria-label="Ubah" onClick={() => setForm(i)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="danger" aria-label="Hapus" onClick={() => setDel(i)}><Trash2 className="h-4 w-4" /></Button>
              </td>
            </tr>
          ))}
        </Table>
      </div>
      {form && (
        <Modal title={form.id ? 'Ubah barang' : 'Tambah barang'} okLabel={form.id ? 'Simpan perubahan' : 'Simpan'} onClose={() => setForm(null)} onSubmit={submit}>
          <input name="name" className={inputCls} placeholder="Nama barang" defaultValue={form.name} />
          <input name="cat" className={inputCls} placeholder="Kategori (mis. Elektronik)" defaultValue={form.cat} />
          <input name="total" type="number" min="0" className={inputCls} placeholder="Jumlah total" defaultValue={form.total} />
          <input name="stock" type="number" min="0" className={inputCls} placeholder="Stok tersedia" defaultValue={form.stock} />
          <textarea name="desc" className={inputCls} placeholder="Deskripsi" defaultValue={form.desc} />
        </Modal>
      )}
      {del && (
        <Modal title="Hapus barang?" danger okLabel="Hapus" onClose={() => setDel(null)} onSubmit={() => { deleteItem(del.id); toast('Barang dihapus') }}>
          <p>{del.name} akan dihapus permanen dari inventaris.</p>
        </Modal>
      )}
    </>
  )
}
