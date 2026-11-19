'use client'
import { useEffect, useState } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { addDays, today } from './utils'

const setCookie = (role) => { document.cookie = `pa_role=${role}; path=/; max-age=86400; samesite=lax` }
const clearCookie = () => { document.cookie = 'pa_role=; path=/; max-age=0' }

const seed = () => ({
  users: [
    { id: 1, name: 'Bu Ratna', pw: 'admin123', role: 'admin' },
    { id: 2, name: 'Muhammad Ihsan', pw: 'ihsan123', role: 'student' },
  ],
  items: [
    { id: 1, name: 'Proyektor Epson', cat: 'Elektronik', stock: 3, total: 4, damaged: 0, desc: 'Proyektor 3300 lumen, kabel HDMI & VGA, tas pembawa.' },
    { id: 2, name: 'Laptop Praktik', cat: 'Elektronik', stock: 5, total: 8, damaged: 0, desc: 'Laptop untuk kelas TIK, dilengkapi charger.' },
    { id: 3, name: 'Bola Voli', cat: 'Olahraga', stock: 6, total: 6, damaged: 0, desc: 'Bola voli standar pertandingan.' },
    { id: 4, name: 'Raket Badminton', cat: 'Olahraga', stock: 0, total: 10, damaged: 0, desc: 'Satu set dua raket dan tiga shuttlecock.' },
    { id: 5, name: 'Setrika Uap', cat: 'Asrama', stock: 4, total: 5, damaged: 0, desc: 'Setrika uap 1200W untuk penghuni asrama.' },
    { id: 6, name: 'Kipas Angin Berdiri', cat: 'Asrama', stock: 2, total: 6, damaged: 1, desc: 'Kipas angin 3 kecepatan, tinggi 1,2 m.' },
    { id: 7, name: 'Mikroskop Binokuler', cat: 'Laboratorium', stock: 7, total: 8, damaged: 0, desc: 'Perbesaran 40x–1000x dengan lensa cadangan.' },
    { id: 8, name: 'Speaker Portabel', cat: 'Elektronik', stock: 2, total: 3, damaged: 0, desc: 'Speaker dan mikrofon nirkabel untuk acara kelas.' },
  ],
  loans: [],
  logs: [],
})

export const useStore = create(
  persist(
    (set, get) => ({
      ...seed(),
      me: null,

      log: (m) => set((s) => ({ logs: [{ t: new Date().toLocaleString('id-ID'), m }, ...s.logs].slice(0, 100) })),

      // ---- Autentikasi (berbasis nama) ----
      login: (name, pw) => {
        const u = get().users.find((x) => x.name.toLowerCase() === name.trim().toLowerCase() && x.pw === pw)
        if (!u) return null
        set({ me: u }); setCookie(u.role); return u
      },
      register: (name, pw) => {
        if (get().users.some((u) => u.name.toLowerCase() === name.toLowerCase())) return null
        const u = { id: Date.now(), name, pw, role: 'student' }
        set((s) => ({ users: [...s.users, u], me: u })); setCookie('student'); return u
      },
      logout: () => { set({ me: null }); clearCookie() },

      // ---- Transaksi peminjaman ----
      addLoan: (itemId, qty, due) => {
        const me = get().me, it = get().items.find((i) => i.id === itemId)
        set((s) => ({ loans: [...s.loans, { id: Date.now(), uid: me.id, itemId, qty, due, status: 'Pending', req: today(), out: null, inn: null, note: '' }] }))
        get().log(`${me.name} mengajukan ${it.name} ×${qty}`)
      },
      removeLoan: (id) => {
        const l = get().loans.find((x) => x.id === id)
        set((s) => ({ loans: s.loans.filter((x) => x.id !== id) }))
        get().log(`Pengajuan ${get().items.find((i) => i.id === l.itemId)?.name} dihapus`)
      },
      approve: (id) => {
        const s = get(), l = s.loans.find((x) => x.id === id), it = s.items.find((i) => i.id === l.itemId)
        if (!it || it.stock < l.qty) return false
        set({
          items: s.items.map((i) => (i.id === it.id ? { ...i, stock: i.stock - l.qty } : i)),
          loans: s.loans.map((x) => (x.id === id ? { ...x, status: 'Borrowed', out: 'Baik' } : x)),
        })
        get().log(`Disetujui: ${it.name} ×${l.qty} untuk ${s.users.find((u) => u.id === l.uid)?.name}`)
        return true
      },
      reject: (id) => {
        set((s) => ({ loans: s.loans.map((x) => (x.id === id ? { ...x, status: 'Rejected' } : x)) }))
        get().log('Pengajuan ditolak')
      },
      checkIn: (id, cond, note) => {
        const s = get(), l = s.loans.find((x) => x.id === id), it = s.items.find((i) => i.id === l.itemId)
        set({
          loans: s.loans.map((x) => (x.id === id ? { ...x, status: 'Returned', inn: cond, note } : x)),
          items: s.items.map((i) => {
            if (i.id !== it.id) return i
            if (cond === 'Hilang') return { ...i, total: Math.max(0, i.total - l.qty) }
            if (cond === 'Rusak Berat') return { ...i, damaged: i.damaged + l.qty }
            return { ...i, stock: i.stock + l.qty }
          }),
        })
        get().log(`Dikembalikan: ${it.name} ×${l.qty}, kondisi ${cond}${note ? ' – ' + note : ''}`)
      },

      // ---- CRUD barang ----
      saveItem: (data, id) => {
        if (id) set((s) => ({ items: s.items.map((i) => (i.id === id ? { ...i, ...data } : i)) }))
        else set((s) => ({ items: [...s.items, { id: Date.now(), damaged: 0, ...data }] }))
        get().log(`Barang "${data.name}" ${id ? 'diperbarui' : 'ditambahkan'}`)
      },
      deleteItem: (id) => {
        const it = get().items.find((i) => i.id === id)
        set((s) => ({ items: s.items.filter((i) => i.id !== id) }))
        get().log(`Barang "${it.name}" dihapus`)
      },
    }),
    // version dinaikkan agar data lama (yang memakai email) otomatis dibuang
    { name: 'pinjamalat', version: 2 }
  )
)

// Hindari hydration mismatch: data persist baru dipakai setelah mount di client
export const useHydrated = () => { const [h, setH] = useState(false); useEffect(() => setH(true), []); return h }

export const stats = (items, loans) => {
  const total = items.reduce((s, i) => s + i.total, 0), avail = items.reduce((s, i) => s + i.stock, 0)
  return {
    total, pct: total ? Math.round((avail / total) * 100) : 0,
    out: loans.filter((l) => l.status === 'Borrowed').reduce((s, l) => s + l.qty, 0),
    pending: loans.filter((l) => l.status === 'Pending').length,
    damaged: items.reduce((s, i) => s + i.damaged, 0),
    late: loans.filter((l) => l.status === 'Borrowed' && l.due < today()).length,
  }
}