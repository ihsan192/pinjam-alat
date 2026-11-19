import { NextResponse } from 'next/server'

const ADMIN = ['/admin', '/persetujuan', '/pengembalian', '/barang', '/transaksi', '/log']
const STUDENT = ['/dasbor', '/katalog', '/riwayat']
const match = (list, p) => list.some((x) => p === x || p.startsWith(x + '/'))
const home = (role) => (role === 'admin' ? '/admin' : '/dasbor')

// Role-Based Access Control berdasarkan cookie `pa_role` (mock sesi)
export function middleware(req) {
  const role = req.cookies.get('pa_role')?.value
  const p = req.nextUrl.pathname
  const go = (to) => NextResponse.redirect(new URL(to, req.url))

  if (match(ADMIN, p) || match(STUDENT, p)) {
    if (!role) return go('/masuk')
    if (match(ADMIN, p) && role !== 'admin') return go('/dasbor')
    if (match(STUDENT, p) && role !== 'student') return go('/admin')
  }
  if ((p === '/masuk' || p === '/daftar') && role) return go(home(role))
  return NextResponse.next()
}

export const config = {
  matcher: ['/masuk', '/daftar', '/admin/:path*', '/persetujuan/:path*', '/pengembalian/:path*',
    '/barang/:path*', '/transaksi/:path*', '/log/:path*', '/dasbor/:path*', '/katalog/:path*', '/riwayat/:path*'],
}
