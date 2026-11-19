'use client'
import { cn, effStatus, fmt } from '@/lib/utils'
import { useStore } from '@/lib/store'

// Kelas ditulis lengkap agar terdeteksi Tailwind JIT (jangan dibuat dinamis)
const TONE = {
  emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  rose: 'bg-rose-50 text-rose-700 ring-rose-200',
  amber: 'bg-amber-50 text-amber-700 ring-amber-200',
  indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
}
const STATUS = {
  Pending: ['amber', 'Menunggu persetujuan'], Borrowed: ['indigo', 'Dipinjam'], Returned: ['emerald', 'Dikembalikan'],
  Overdue: ['rose', 'Terlambat'], Rejected: ['rose', 'Ditolak'], Available: ['emerald', 'Tersedia'], Out: ['rose', 'Habis'],
}
export const CONDITIONS = { Baik: 'emerald', 'Rusak Ringan': 'amber', 'Rusak Berat': 'rose', Hilang: 'rose' }

export function Badge({ status }) {
  const [tone, label] = STATUS[status]
  return <span className={cn('inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1', TONE[tone])}>{label}</span>
}
export function CondBadge({ c }) {
  if (!c) return <span className="text-slate-400">–</span>
  return <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium ring-1', TONE[CONDITIONS[c]])}>{c}</span>
}

const VARIANT = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
  outline: 'bg-white text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50',
  danger: 'bg-rose-600 text-white hover:bg-rose-700',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700',
}
export function Button({ variant = 'primary', className, ...p }) {
  return <button {...p} className={cn('rounded-lg px-3.5 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40', VARIANT[variant], className)} />
}
export const inputCls = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-600'

export function Modal({ title, children, okLabel = 'Simpan', danger, onClose, onSubmit }) {
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-slate-900/50 p-4 sm:items-center">
      <form
        onSubmit={(e) => { e.preventDefault(); if (onSubmit(Object.fromEntries(new FormData(e.currentTarget))) !== false) onClose() }}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="font-display text-lg font-bold">{title}</h3>
        <div className="mt-3 space-y-3 text-sm text-slate-600">{children}</div>
        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
          <Button type="submit" variant={danger ? 'danger' : 'primary'}>{okLabel}</Button>
        </div>
      </form>
    </div>
  )
}

export function Table({ head, children, empty }) {
  const rows = Array.isArray(children) ? children.length : children ? 1 : 0
  return (
    <div className="overflow-x-auto rounded-xl bg-white ring-1 ring-slate-200">
      <table className="w-full text-left text-sm">
        <thead className="text-slate-500"><tr>{head.map((h, i) => <th key={i} className="p-3 font-medium">{h}</th>)}</tr></thead>
        <tbody>{rows ? children : <tr><td colSpan={9} className="p-8 text-center text-slate-500">{empty}</td></tr>}</tbody>
      </table>
    </div>
  )
}

export function LoanTable({ rows, admin, actions, empty }) {
  const items = useStore((s) => s.items), users = useStore((s) => s.users)
  const head = ['Barang', ...(admin ? ['Peminjam'] : []), 'Diajukan', 'Tenggat', 'Status', 'Kondisi (keluar → masuk)', '']
  return (
    <Table head={head} empty={empty}>
      {rows.map((l) => (
        <tr key={l.id} className="border-t border-slate-100">
          <td className="p-3 font-medium">{items.find((i) => i.id === l.itemId)?.name ?? '(dihapus)'} ×{l.qty}</td>
          {admin && <td className="p-3">{users.find((u) => u.id === l.uid)?.name}</td>}
          <td className="p-3">{fmt(l.req)}</td>
          <td className="p-3">{fmt(l.due)}</td>
          <td className="p-3"><Badge status={effStatus(l)} /></td>
          <td className="p-3"><CondBadge c={l.out} /> → <CondBadge c={l.inn} /></td>
          <td className="space-x-2 whitespace-nowrap p-3 text-right">{actions?.(l)}</td>
        </tr>
      ))}
    </Table>
  )
}

export function ItemCard({ item, onBorrow }) {
  return (
    <div className="flex flex-col rounded-xl bg-white p-4 ring-1 ring-slate-200">
      <div className="flex items-start justify-between gap-2">
        <div><div className="font-semibold">{item.name}</div><div className="text-xs text-slate-500">{item.cat}</div></div>
        <Badge status={item.stock > 0 ? 'Available' : 'Out'} />
      </div>
      <p className="mt-2 flex-1 text-sm text-slate-600">{item.desc}</p>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-sm text-slate-500">Stok {item.stock}/{item.total}</span>
        {onBorrow && <Button disabled={item.stock < 1} onClick={() => onBorrow(item)}>Pinjam</Button>}
      </div>
    </div>
  )
}

export const StatCard = ({ label, value }) => (
  <div className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
    <div className="text-sm text-slate-500">{label}</div>
    <div className="mt-1 font-display text-3xl font-extrabold">{value}</div>
  </div>
)
