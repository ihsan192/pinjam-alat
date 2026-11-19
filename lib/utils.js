export const today = () => new Date().toISOString().slice(0, 10)
export const addDays = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10) }
export const fmt = (d) => new Date(d + 'T00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
// Status turunan: peminjaman yang melewati tenggat tampil sebagai "Overdue"
export const effStatus = (l) => (l.status === 'Borrowed' && l.due < today() ? 'Overdue' : l.status)
export const cn = (...a) => a.filter(Boolean).join(' ')
