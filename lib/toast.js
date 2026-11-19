'use client'
import { create } from 'zustand'

export const useToast = create((set) => ({
  toasts: [],
  push: (message, ok = true) => {
    const id = Date.now() + Math.random()
    set((s) => ({ toasts: [...s.toasts, { id, message, ok }] }))
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 3200)
  },
}))
export const toast = (m, ok = true) => useToast.getState().push(m, ok)
