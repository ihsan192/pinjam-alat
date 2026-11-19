'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react' // 1. Impor ikon panah
import { useStore } from '@/lib/store'
import { toast } from '@/lib/toast'
import { Button, inputCls } from '@/components/ui'

export default function AuthForm({ register }) {
  const router = useRouter()
  const { login, register: signUp } = useStore()

  const submit = (e) => {
    e.preventDefault()
    const f = Object.fromEntries(new FormData(e.currentTarget))
    const name = f.name?.trim()
    if (register) {
      if (!name || f.pw.length < 6) return toast('Isi nama; kata sandi minimal 6 karakter', false)
      if (!signUp(name, f.pw)) return toast('Nama itu sudah dipakai. Tambahkan nama belakang atau kelas', false)
      toast('Akun berhasil dibuat'); router.replace('/dasbor')
    } else {
      const u = login(name ?? '', f.pw)
      if (!u) return toast('Nama atau kata sandi salah', false)
      toast(`Selamat datang, ${u.name}`); router.replace(u.role === 'admin' ? '/admin' : '/dasbor')
    }
  }

  return (
    <div className="grid min-h-screen place-items-center p-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl bg-white p-6 ring-1 ring-slate-200">
        {/* 2. Tambahkan tombol panah kembali di samping logo */}
        <div className="flex items-center gap-2">
          <Link 
            href="/" 
            className="p-1 -ml-1 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
            title="Kembali ke Beranda"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <span className="font-display text-xl font-extrabold text-indigo-600">PinjamAlat</span>
        </div>

        <h1 className="mt-4 font-display text-2xl font-bold">{register ? 'Buat akun siswa' : 'Masuk ke akunmu'}</h1>
        <div className="mt-4 space-y-3">
          <input name="name" className={inputCls} placeholder="Nama lengkap" autoComplete="username" />
          <input name="pw" type="password" className={inputCls} placeholder="Kata sandi" autoComplete={register ? 'new-password' : 'current-password'} />
        </div>
        <Button type="submit" className="mt-4 w-full">{register ? 'Daftar' : 'Masuk'}</Button>
        {!register && (
          <div className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
            Akun contoh:<br />Siswa: Muhammad Ihsan / ihsan123<br />Admin: Bu Ratna / admin123
          </div>
        )}
        <p className="mt-4 text-sm text-slate-600">
          {register ? <>Sudah punya akun? <Link className="font-semibold text-indigo-600" href="/masuk">Masuk</Link></>
            : <>Belum punya akun? <Link className="font-semibold text-indigo-600" href="/daftar">Daftar</Link></>}
        </p>
      </form>
    </div>
  )
}