import './globals.css'
import { Bricolage_Grotesque, Figtree } from 'next/font/google'
import Toaster from '@/components/Toaster'

const display = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-display', weight: ['500', '700', '800'] })
const body = Figtree({ subsets: ['latin'], variable: '--font-body' })

export const metadata = { title: 'PinjamAlat – Peminjaman Peralatan Sekolah & Asrama', description: 'Aplikasi peminjaman peralatan sekolah dan asrama.' }

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${display.variable} ${body.variable}`}>
      <body>{children}<Toaster /></body>
    </html>
  )
}
