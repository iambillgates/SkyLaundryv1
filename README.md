# 🧺 Sky Laundry Management System

![Sky Laundry Banner](./public/banner-placeholder.png)
*(Ganti gambar ini dengan screenshot dashboard aplikasi kamu)*

> Aplikasi manajemen laundry modern berbasis web dengan **Next.js** dan **NestJS**. Didesain untuk efisiensi operasional, pelacakan real-time, dan pengalaman pengguna yang estetis.

---

## 🚀 Tentang Project

**Sky Laundry** adalah solusi fullstack untuk digitalisasi bisnis laundry. Aplikasi ini memisahkan antarmuka publik (untuk pelanggan melacak pesanan) dan dashboard admin (untuk manajemen internal).

Dibangun dengan fokus pada performa, keamanan data (Activity Log), dan kemudahan penggunaan (Auto-Print Struk), aplikasi ini siap menangani operasional laundry skala kecil hingga menengah.

## ✨ Fitur Unggulan

### 🌍 Public Facing (Pelanggan)
- **Cek Resi Real-time:** Pelacakan status laundry tanpa perlu login menggunakan Order ID unik.
- **Layanan & Harga:** Informasi paket (Kiloan, Satuan, Express) yang transparan.
- **WhatsApp Integration:** Tombol melayang untuk kontak langsung ke CS.

### 🔒 Admin Dashboard (Staff)
- **Manajemen Pesanan (CRUD):** Input, update status, dan hapus pesanan dengan mudah.
- **Activity Log System:** Mencatat setiap aktivitas staff (Create/Update/Delete) untuk keamanan audit.
- **Auto-Print Struk:** Integrasi pencetakan struk thermal otomatis setelah input pesanan.
- **Statistik & Grafik:** Visualisasi omzet dan performa bisnis menggunakan Chart.js.
- **Notifikasi Modern:** Feedback interaktif menggunakan Toast Notification & Modal Konfirmasi 2-Langkah.
- **UI Glassmorphism:** Tampilan antarmuka modern yang bersih dan responsif.

---

## 🛠️ Teknologi yang Digunakan

### Frontend (Client)
- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Data Fetching:** Axios
- **Charts:** Chart.js & React-Chartjs-2

### Backend (Server)
- **Framework:** [NestJS](https://nestjs.com/)
- **Database:** PostgreSQL / MySQL
- **ORM:** [Prisma](https://www.prisma.io/)
- **Validasi:** Class-Validator & Class-Transformer

---

## ⚙️ Cara Instalasi & Menjalankan (Localhost)

Ikuti langkah berikut untuk menjalankan project di komputer lokal:

### 1. Clone Repository
```bash
git clone [https://github.com/username-kamu/sky-laundry.git](https://github.com/username-kamu/sky-laundry.git)
cd sky-laundry
