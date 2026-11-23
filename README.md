# PinjamAlat – Aplikasi Peminjaman Peralatan Sekolah / Asrama

Next.js 14 (App Router) + TailwindCSS + Zustand + Lucide-React.

## Menjalankan
```bash
npm install
npm run dev      # http://localhost:3000
```

## Akun contoh
- Siswa: Muhammad Ihsan / siswa123
- Admin: Bu Ratna / admin123

## Struktur
- `middleware.js` – Role-Based Access Control (cookie `pa_role`)
- `lib/store.js` – Zustand (persist localStorage): auth, barang, transaksi, log
- `app/(app)/*` – halaman siswa (`/dasbor /katalog /riwayat`) dan admin (`/admin /persetujuan /pengembalian /barang /transaksi /log`)
- `components/` – Shell (sidebar/bottom nav), Modal, Toaster, tabel, badge

Catatan: data dan sesi bersifat mock (disimpan di browser). Untuk produksi, ganti store dengan API + database dan cookie sesi bertanda tangan.
