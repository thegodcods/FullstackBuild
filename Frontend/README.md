# CV Screening - Frontend

Ini adalah repository frontend untuk **Aplikasi Penapisan CV & Perankingan Kandidat**. Dibuat menggunakan React 19 dan didesain dengan Tailwind CSS, antarmuka ini menyediakan dashboard intuitif bagi tim HR untuk mengunggah resume, melihat kandidat, melacak status aplikasi, dan menganalisis daftar ranking.

---

## 🚀 Fitur

- **Dashboard**: Melacak statistik kandidat secara keseluruhan, distribusi status, dan metrik ringkasan.
- **Perankingan Kandidat**: Menampilkan kandidat yang diurutkan berdasarkan algoritma penapisan CV dan metrik evaluasi detail.
- **Autentikasi**: Alur pengguna lengkap dengan Pendaftaran (Sign Up), Masuk (Login), dan menu pengguna yang dipersonalisasi.
- **Detail Interaktif**: Modal detail interaktif untuk melihat profil kandidat secara mendalam.
- **Halaman Informasi Modern**: Halaman Fitur (Features), Cara Kerja (How It Works), dan Tentang Kami (About Us) untuk memandu pengguna.
- **Desain Responsif**: Didesain optimal untuk layar desktop, tablet, dan ponsel menggunakan Tailwind CSS.

---

## 🛠️ Stack Teknologi

- **Inti (Core)**: [React 19](https://react.dev/)
- **Desain (Styling)**: [Tailwind CSS v3](https://tailwindcss.com/)
- **Ikon (Icons)**: [Lucide React](https://lucide.dev/)
- **Build Tool**: Create React App (react-scripts)

---

## 📦 Langkah Memulai

### Prasyarat

Pastikan Anda telah menginstal **Node.js** (direkomendasikan versi 18 atau lebih baru) dan **npm** di komputer Anda.

### Instalasi

1. **Masuk ke folder frontend**:
   ```bash
   cd Frontend
   ```

2. **Instal dependensi**:
   ```bash
   npm install
   ```

### Menjalankan secara Lokal

Untuk menjalankan server pengembangan:
```bash
npm start
```
Aplikasi akan berjalan secara lokal di [http://localhost:3000](http://localhost:3000).

### Build untuk Produksi

Untuk mengompilasi aplikasi menjadi file statis yang dioptimalkan untuk produksi:
```bash
npm run build
```
Hasil build akan disimpan di direktori `build/` dan siap untuk dideploy.

---

## 📂 Struktur Project

```text
Frontend/
├── public/              # Aset statis (templat HTML, ikon, manifes)
├── src/
│   ├── assets/          # Aset statis lokal (gambar, logo, dll.)
│   ├── components/      # Komponen UI yang dapat digunakan kembali (Modal, Nav, dll.)
│   ├── config/          # Konfigurasi (endpoint API, rute)
│   ├── context/         # React Context untuk manajemen state global (Auth, Tema)
│   ├── pages/           # Halaman aplikasi (Dashboard, Ranking, Login, dll.)
│   ├── services/        # Layanan integrasi API (wrapper Axios/fetch)
│   ├── App.css          # Gaya global aplikasi
│   ├── App.jsx          # Router utama dan struktur aplikasi
│   ├── index.css        # Direktif Tailwind dan gaya utama
│   └── index.js         # Entry point React DOM
├── package.json         # Metadata project dan dependensi
└── tailwind.config.js   # File konfigurasi Tailwind CSS
```

---

## 🤝 Kontribusi

1. Buat branch fitur baru: `git checkout -b fitur/nama-fitur-anda`
2. Commit perubahan Anda: `git commit -m "Menambahkan fitur baru"`
3. Push ke branch tersebut: `git push origin fitur/nama-fitur-anda`
4. Buat Pull Request.
