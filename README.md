# UAS_PBW_Riris_243026029
Berikut adalah **`README.md`** lengkap dan profesional untuk repository proyek kamu. Tinggal copy-paste dan simpan sebagai `README.md` di root folder project.

```markdown
#  Dashboard Analitik Penjualan UMKM

Sistem dashboard analitik berbasis web untuk memantau performa penjualan UMKM secara real-time. Dilengkapi dengan visualisasi data interaktif, manajemen transaksi terstruktur, export laporan CSV, dan sistem keamanan autentikasi berbasis JWT.

---

##  Fitur Utama

| Fitur | Deskripsi |
|-------|-----------|
|  **Autentikasi Aman** | Login dengan JWT Token + bcrypt hashing + Role-Based Access Control (Owner/Kasir/Analis) |
|  **Visualisasi Dinamis** | 3 Chart interaktif (Produk Terlaris, Revenue per Kota, Tren Bulanan) menggunakan Chart.js |
|  **Filter Rentang Waktu** | Analisis performa penjualan berdasarkan periode custom (start_date & end_date) |
|  **CRUD Transaksi** | Form input transaksi multi-item dengan auto-calculate subtotal & total |
|  **Export Laporan CSV** | Download data transaksi lengkap ke format Excel/CSV siap cetak |
|  **Security Baseline** | Validasi input (Joi), Helmet headers, Rate Limiting, Prepared Statements |
|  **Database Optimized** | MySQL relasional dengan indexing B-Tree & normalisasi BCNF |

---

## 🛠 Teknologi yang Digunakan

| Layer | Teknologi |
|-------|-----------|
| **Frontend** | Vanilla JavaScript (ES6+), HTML5, CSS3, Chart.js |
| **Backend** | Node.js, Express.js |
| **Database** | MySQL / MariaDB |
| **Autentikasi** | `jsonwebtoken`, `bcryptjs` |
| **Validasi** | `joi` |
| **Keamanan** | `helmet`, `express-rate-limit` |
| **Lingkungan** | `dotenv`, `nodemon` |

---

##  Struktur Folder

```
umkm-dashboard/
├── backend/
│   ├── config/          # Konfigurasi koneksi database
│   ├── controllers/     # Logika bisnis (auth, dashboard, transaksi, export)
│   ├── middleware/      # JWT verification & RBAC
│   ├── routes/          # Routing API
│   ├── server.js        # Entry point backend
│   └── package.json
├── frontend/
│   ├── js/              # Modular JS (api.js, auth.js, dashboard.js)
│   ├── login.html       # Halaman login
│   ├── dashboard.html   # Halaman utama dashboard
│   ├── input-transaksi.html # Form input transaksi
│   └── css/             # Styling (jika ada)
├── API_DOCUMENTATION.md # Dokumentasi endpoint lengkap
├── .env.example         # Template environment variables
└── README.md            # Dokumentasi proyek
```

---

##  Instalasi & Setup

### 1. Clone Repository
```bash
git clone https://github.com/username- kamu/umkm-dashboard.git
cd umkm-dashboard
```

### 2. Setup Backend
```bash
cd backend
npm install
```

### 3. Konfigurasi Environment
Buat file `.env` di folder `backend/` dan isi sesuai template:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=umkm_dashboard
PORT=3000

JWT_SECRET=rahasia_umkm_123_yang_panjang_dan_acak
NODE_ENV=development
```

### 4. Setup Database
1. Buat database MySQL: `CREATE DATABASE umkm_dashboard;`
2. Import tabel & data dummy (jika tersedia file `.sql`)
3. Pastikan relasi foreign key & indexing sudah diterapkan.

### 5. Jalankan Server
```bash
npm run dev
```
Server akan berjalan di: `http://localhost:3000`

---

##  Credentials Demo
| Role | Username | Password |
|------|----------|----------|
| Owner | `owner1` | `password123` |
| Kasir | `kasir1` | `password123` |
| Analis | `analis1` | `password123` |

---

##  Cara Penggunaan

1. **Login**  
   Buka `http://localhost:3000/login`, masukkan credentials di atas.

2. **Dashboard**  
   Setelah login, akan muncul summary cards & 3 chart analitik. Gunakan filter tanggal di atas untuk analisis periode spesifik.

3. **Input Transaksi**  
   Klik menu ` Input Transaksi` di navbar. Isi nomor transaksi, pilih outlet/kasir, tambahkan produk, lalu simpan. Dashboard akan otomatis terupdate.

4. **Export CSV**  
   Klik tombol ` Export CSV`. File laporan akan terdownload otomatis berisi semua transaksi (atau sesuai filter jika diimplementasikan).

---

##  Dokumentasi API
Dokumentasi lengkap endpoint, request/response, dan contoh penggunaan tersedia di:  
 [`API_DOCUMENTATION.md`](API_DOCUMENTATION.md)

**Base URL:** `http://localhost:3000/api`

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| `POST` | `/auth/login` | Login user |  |
| `GET`  | `/auth/profile` | Data profil user |  |
| `GET`  | `/dashboard/stats` | Statistik dashboard |  |
| `GET`  | `/dashboard/export` | Export CSV transaksi |  |
| `GET`  | `/transactions` | Daftar transaksi |  |
| `POST` | `/transactions` | Simpan transaksi baru |  |

---

##  Security & Best Practices
-  Password di-hash dengan `bcrypt` (salt rounds: 10)
-  JWT stateless dengan expiry 24 jam
-  Validasi input ketat menggunakan `Joi`
-  SQL Injection prevented via `mysql2` prepared statements
-  Security headers via `helmet`
-  Rate limiting: max 100 request/15 menit per IP
-  CORS enabled untuk development

---

##  License
Proyek ini dibuat untuk keperluan akademis & portofolio.  
© 2024 [Nama Kamu]. All rights reserved.

---

##  Kontributor & Kontak
**Developed by:** [Nama Kamu]  
**Email:** emailkamu@example.com  
**GitHub:** github.com/usernamekamu  

*Pull requests & feedback sangat diapresiasi!* 
```

---

###  **Tips Tambahan:**
1. Ganti `username- kamu`, `emailkamu@example.com`, dan `github.com/usernamekamu` dengan data asli kamu.
2. Kalau kamu punya file `.sql` untuk schema database, tambahkan instruksi import di bagian **Setup Database**.
3. File ini sudah SEO-friendly untuk GitHub, lengkap dengan badge implisit, tabel rapi, dan struktur standar industri.

**Sudah siap di-commit ke repository!**   
Ada yang mau ditambah atau disesuaikan lagi?
