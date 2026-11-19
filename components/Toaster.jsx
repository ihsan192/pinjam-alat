'use client'
import { useToast } from '@/lib/toast'

export default function Toaster() {
  const toasts = useToast((s) => s.toasts)
  return (
    <div className="fixed right-4 top-4 z-50 flex flex-col gap-2" role="status">
      {toasts.map((t) => (
        <div key={t.id} className={`rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg ${t.ok ? 'bg-emerald-600' : 'bg-rose-600'}`}>{t.message}</div>
      ))}
    </div>
  )
}
