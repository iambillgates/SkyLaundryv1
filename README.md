# 🧺 Sky Laundry Management System

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-5.10-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-MariaDB-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

> **Sky Laundry** adalah aplikasi manajemen laundry berbasis web fullstack.
> Pelanggan bisa melacak cucian dengan nomor resi, staff mengelola pesanan,
> pembayaran, dan laporan omzet dari satu dashboard.

---

## ✨ Fitur

### 🌍 Sisi pelanggan (landing page)
- **Lacak pesanan:** masukkan nomor resi (contoh: `SKY-5FX8723`) untuk melihat
  status cucian: `PENDING` → `WASHING` → `IRONING` → `READY` → `COMPLETED`.
- **Katalog layanan:** Kiloan, Satuan, Express, lengkap dengan estimasi harga.
- **Tombol WhatsApp** untuk menghubungi CS.
- Tampilan responsif (mobile-friendly).

### 🔒 Sisi staff (dashboard)
- **Manajemen pesanan (CRUD):** nomor resi dibuat otomatis
  (`SKY-<kode acak><4 digit akhir nomor HP>`), update status & pembayaran
  (Lunas/Belum), hapus dengan konfirmasi 2 langkah.
- **Statistik keuangan:** omzet hari ini, kemarin, bulan ini & bulan lalu,
  plus grafik tren transaksi (Chart.js).
- **Activity log:** jejak audit setiap aksi staff (buat, ubah, hapus).
- **Cetak struk thermal** otomatis setelah input pesanan (`window.print()`).
- **Login staff (JWT):** semua endpoint pesanan terkunci — hanya halaman
  lacak resi yang bisa diakses tanpa login.

---

## 🛠️ Tech Stack

| Lapisan  | Teknologi |
|----------|-----------|
| Frontend | Next.js 16.1.6 (App Router), React 19, Tailwind CSS 3.4, Axios, Chart.js + react-chartjs-2, lucide-react |
| Backend  | NestJS 11, TypeScript, Prisma 5.10.2, class-validator, bcrypt, `@nestjs/jwt` + passport-jwt |
| Database | MySQL / MariaDB (`laundry_db`) — Prisma `provider = "mysql"` |

Struktur repo (monorepo 2 aplikasi):

```text
SkyLaundryv1/
├── backend-laundry/     # API NestJS + Prisma (port 4000)
│   ├── src/             # auth, orders, prisma
│   └── prisma/          # schema.prisma, migrations, seed.ts
├── frontend-laundry/    # UI Next.js (port 3000)
│   └── app/             # landing, staff-login, dashboard
└── laundry_db.sql       # dump SQL lama — lihat "Catatan database" di bawah
```

---

## 🚀 Cara Menjalankan

### Prasyarat
- Node.js 20+ dan npm
- MySQL / MariaDB yang sedang berjalan (lokal atau server)

### 1. Database
Buat database kosong bernama `laundry_db`:

```sql
CREATE DATABASE laundry_db;
```

### 2. Backend

```bash
cd backend-laundry
npm install
cp .env.example .env
```

Isi `.env` (lihat `backend-laundry/.env.example`):

```env
DATABASE_URL="mysql://user:password@localhost:3306/laundry_db"
JWT_SECRET="isi-dengan-string-acak-yang-panjang"
PORT=4000
FRONTEND_URL="http://localhost:3000"
```

`JWT_SECRET` **wajib diisi** — backend menolak jalan kalau kosong.
Buat satu dengan:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Lalu buat tabel + isi data awal:

```bash
npx prisma db push
npx prisma db seed
npm run start:dev   # jalan di http://localhost:4000
```

### 3. Frontend

```bash
cd frontend-laundry
npm install
cp .env.example .env.local
```

Isi `.env.local` (lihat `frontend-laundry/.env.example`):

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Lalu:

```bash
npm run dev   # jalan di http://localhost:3000
```

### 4. Login demo

|  |  |
|---|---|
| **Email** | `admin@skylaundry.com` |
| **Password** | `admin123` |

Akun ini dibuat oleh `npx prisma db seed` (lihat
`backend-laundry/prisma/seed.ts`). **Ini kredensial demo — ganti
passwordnya sebelum dipakai untuk laundry sungguhan** (ubah di `seed.ts`
lalu jalankan ulang seed, atau ubah password user admin langsung di
database).

---

## 🔐 API & Autentikasi

Base URL API: `http://localhost:4000` (atur lewat `PORT` di `.env` backend).

- `POST /auth/login` — login staff, mengembalikan JWT. Token disimpan di
  `localStorage` frontend dan dikirim sebagai header
  `Authorization: Bearer <token>` di setiap request dashboard.
- `GET /orders/track/:orderId` — **publik** (tanpa login): lacak status
  pesanan dari nomor resi.
- Semua endpoint `/orders` lainnya (`POST`, `GET`, `PATCH`, `DELETE`,
  `/orders/stats/financial`, `/orders/activity/logs`) **wajib JWT**.
  Tanpa token, server mengembalikan `401`.
- CORS hanya mengizinkan origin frontend (`FRONTEND_URL`, default
  `http://localhost:3000`).

---

## ⚠️ Catatan & batasan yang diketahui

- **Harga landing page vs backend belum disamakan.** Harga yang tampil di
  kartu layanan landing page (Kiloan Rp 8.000, Satuan Rp 25.000) berbeda
  dengan tarif di `backend-laundry/src/orders/orders.service.ts`
  (KILOAN 7000, SATUAN 10000 — dan Satuan saat ini ditagih per kg, bukan
  per item). Samakan dulu sebelum dipakai jualan.
- **Halaman lacak resi & login staff** (`frontend-laundry/app/page.tsx`,
  `frontend-laundry/app/staff-login/page.tsx`) saat ini masih memanggil
  `http://localhost:4000` secara langsung — `NEXT_PUBLIC_API_URL` baru
  dipakai halaman dashboard. Jadi kalau frontend di-deploy di luar laptop
  sendiri, lacak & login belum ikut pindah. Perbaikan sudah disiapkan dan
  akan di-push menyusul.
- **`laundry_db.sql` di root repo adalah dump lama** (berisi data contoh
  yang terlihat seperti data pelanggan asli). **Jangan diimpor** — pakai
  jalur Prisma (`npx prisma db push` + `npx prisma db seed`) untuk database
  baru. File dump ini rencananya akan dihapus dari repo.
- **Tombol "Bot WA"** di dashboard mengarah ke `http://localhost:3005`,
  aplikasi panel bot WhatsApp yang **tidak ada di repo ini** — tombol itu
  tidak berfungsi untuk orang lain.
- Test bawaan masih berupa scaffold dan belum semuanya jalan
  (`auth.service.spec.ts`, `orders.service.spec.ts`, e2e butuh database
  hidup).

---

## 📄 Lisensi

MIT — lihat [LICENSE](LICENSE).
