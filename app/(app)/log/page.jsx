'use client'
import { useStore } from '@/lib/store'
import { Table } from '@/components/ui'

export default function Log() {
  const logs = useStore((s) => s.logs)
  return (
    <>
      <h1 className="font-display text-2xl font-bold">Log aktivitas & kerusakan</h1>
      <div className="mt-4">
        <Table head={['Waktu', 'Aktivitas']} empty="Belum ada aktivitas.">
          {logs.map((g, i) => (
            <tr key={i} className="border-t border-slate-100">
              <td className="whitespace-nowrap p-3 text-slate-500">{g.t}</td><td className="p-3">{g.m}</td>
            </tr>
          ))}
        </Table>
      </div>
    </>
  )
}
