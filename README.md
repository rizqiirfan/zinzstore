# ZinzStore — Top Up Diamond Free Fire (Full Stack)

Upgrade dari project statis (HTML/CSS/JS) menjadi aplikasi full-stack:

- **Database**: MySQL (SQL murni, ada file `schema.sql`)
- **Backend**: Node.js + Express + MySQL (`mysql2`), autentikasi JWT
- **Frontend**: React (Vite), tampilan & desain 100% sama seperti versi asli

Semua data (login, paket diamond, metode pembayaran, kode promo, transaksi)
sekarang tersimpan di database — bukan lagi array/localStorage di JavaScript.

## Struktur Folder

```
zinzstore-fullstack/
├── backend/
│   ├── database/
│   │   ├── schema.sql     # struktur tabel
│   │   └── seed.sql       # contoh data (referensi saja, seeding asli via seed.js)
│   ├── src/
│   │   ├── config/db.js       # koneksi pool MySQL
│   │   ├── middleware/        # auth (JWT) & error handler
│   │   ├── controllers/       # logic tiap fitur
│   │   ├── routes/            # definisi endpoint REST API
│   │   ├── utils/
│   │   │   ├── jwt.js
│   │   │   └── seed.js        # script isi data awal + hash password
│   │   ├── app.js
│   │   └── server.js          # entry point
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── public/                # gambar (ff-icon, hero-banner, login-bg, icons/)
    ├── src/
    │   ├── api/                # pemanggilan REST API (axios)
    │   ├── context/            # AuthContext, ToastContext
    │   ├── components/         # Navbar, Hero, TopUpSection, dll — 1:1 dari HTML asli
    │   ├── styles/style.css    # CSS asli, tidak diubah
    │   ├── utils/
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env.example
    └── package.json
```

## 1. Setup Database (MySQL)

1. Pastikan MySQL/MariaDB sudah jalan (bisa pakai XAMPP/Laragon/MySQL server biasa).
2. Import struktur tabel:
   ```bash
   mysql -u root -p < backend/database/schema.sql
   ```
   Perintah ini otomatis membuat database `zinzstore` beserta semua tabelnya.

## 2. Setup Backend

```bash
cd backend
cp .env.example .env
# edit .env sesuai kredensial MySQL kamu (DB_USER, DB_PASSWORD, JWT_SECRET, dll)

npm install
npm run seed     # isi data awal: paket diamond, metode bayar, promo, akun demo
npm run dev       # jalankan server di http://localhost:5000 (pakai nodemon)
# atau: npm start untuk mode production
```

Akun demo hasil seeding (password sama dengan username):

| Username | Password |
|----------|----------|
| demo     | demo     |
| admin    | admin    |
| gamer    | 1234     |
| zinz     | zinz     |

Kode promo yang tersedia: `ZINZSTORE10` (diskon 10%, maks Rp50.000) dan `NEWUSER` (diskon Rp2.000).

## 3. Setup Frontend

```bash
cd frontend
cp .env.example .env
# pastikan VITE_API_URL mengarah ke backend, default: http://localhost:5000/api

npm install
npm run dev       # jalankan di http://localhost:5173
```

Buka `http://localhost:5173` di browser. Login dulu dengan akun demo di atas,
lalu coba alur top up: cek ID → pilih paket → pilih pembayaran → pakai kode promo
→ bayar sekarang.

## Ringkasan REST API

| Method | Endpoint                     | Keterangan                          | Auth |
|--------|-------------------------------|--------------------------------------|------|
| POST   | /api/auth/register            | Daftar akun baru                     | -    |
| POST   | /api/auth/login                | Login, dapat JWT                     | -    |
| GET    | /api/auth/me                   | Data user yang sedang login          | ✅   |
| GET    | /api/packages                  | Daftar paket diamond                 | -    |
| GET    | /api/payment-methods            | Daftar metode pembayaran             | -    |
| POST   | /api/promo/apply                | Cek & hitung diskon kode promo       | -    |
| POST   | /api/player/check                | Simulasi cek User ID/Zone ID game    | -    |
| POST   | /api/transactions                | Buat transaksi (checkout)            | ✅   |
| POST   | /api/transactions/:id/pay        | Simulasi konfirmasi pembayaran       | ✅   |
| GET    | /api/transactions                | Riwayat transaksi milik user login   | ✅   |

Semua perhitungan harga (harga paket, biaya admin, diskon promo, total) dihitung
ulang di **backend**, bukan dipercaya dari data yang dikirim frontend — supaya
tidak bisa dimanipulasi dari sisi client.

## Catatan Pengembangan Selanjutnya

- Endpoint `POST /api/transactions/:id/pay` saat ini masih simulasi (langsung
  menandai transaksi `paid`). Untuk produksi, ganti dengan integrasi payment
  gateway sungguhan (mis. Midtrans/Xendit) dan verifikasi lewat webhook.
- Endpoint `POST /api/player/check` masih simulasi nama pemain acak. Untuk
  produksi, ganti dengan pemanggilan API resmi penyedia game.
- Tombol login Google/Facebook di frontend sengaja dinonaktifkan karena
  perlu OAuth sungguhan (Google/Facebook Developer Console) — tidak termasuk
  dalam scope upgrade ini.

---

## Fitur Tambahan: Login Admin, Dashboard Admin, Riwayat Transaksi & Simulasi Pembayaran

### 1. Login Admin

Tidak ada halaman login terpisah untuk admin — form login-nya sama persis dengan
user biasa. Bedanya cuma di kolom `role` pada tabel `users`: kalau `role = 'admin'`,
setelah login akan muncul menu **"Dashboard Admin"** di navbar (yang tidak muncul
untuk user biasa).

Akun demo admin (dari `npm run seed`): **username `admin`, password `admin`**.

Untuk menjadikan user lain sebagai admin secara manual:
```sql
UPDATE users SET role = 'admin' WHERE username = 'nama_usernya';
```

### 2. Dashboard Admin

Setelah login sebagai admin, klik **"Dashboard Admin"** di navbar. Ada 3 tab:
- **Ringkasan** — total pengguna, total transaksi, total pendapatan, breakdown status transaksi
- **Transaksi** — semua transaksi semua user, bisa difilter per status, dan admin bisa
  override status transaksi secara manual (misalnya untuk konfirmasi pembayaran manual/offline)
- **Pengguna** — daftar semua akun yang terdaftar beserta role-nya

### 3. Riwayat Transaksi (User)

User yang login (admin maupun biasa) bisa klik **"Riwayat"** di navbar untuk melihat
semua transaksi top up miliknya sendiri, lengkap dengan status pembayaran. Kalau ada
transaksi yang masih **pending**, tersedia tombol **"Cek Status"** untuk memicu
verifikasi ulang statusnya ke backend.

### 4. Simulasi Pembayaran + Verifikasi Status

Proyek ini **tidak terhubung ke payment gateway pihak ketiga** (Midtrans, dll) —
supaya tidak perlu daftar akun apa pun untuk menjalankannya. Sebagai gantinya,
alur pembayaran disimulasikan sepenuhnya di backend, tapi tetap dengan konsep
**verifikasi status yang nyata** (bukan cuma disulap instan di frontend):

**Alurnya:**
1. User checkout → backend membuat transaksi dengan status `pending`
2. Frontend menampilkan modal "Memverifikasi Pembayaran..." dan mulai polling
   (tanya ke backend berkala tiap 1.5 detik) lewat endpoint `POST /api/transactions/:id/sync`
3. Backend **mengecek sendiri** di server: kalau sudah lewat beberapa detik sejak
   transaksi dibuat, baru status diubah jadi `paid` di database — bukan langsung
   di-set dari klik tombol user, jadi tetap ada proses "verifikasi" yang terpisah
4. Begitu backend konfirmasi `paid`, modal sukses muncul otomatis

Kalau kamu ingin **mengintegrasikan payment gateway asli** di kemudian hari
(Midtrans, Xendit, dll), bagian yang perlu diubah cuma di
`backend/src/controllers/transactionController.js` — logic `createTransaction`
(untuk minta token pembayaran ke gateway) dan `syncTransactionStatus` (untuk
cek status ke gateway, bukan simulasi waktu). Struktur endpoint & frontend-nya
sudah didesain supaya gampang diganti tanpa bongkar semua kode.

### 5. Kalau Database Sudah Pernah Dibuat Sebelumnya

Kalau kamu sempat menjalankan `migration_admin_payment.sql` versi sebelumnya
(yang menambahkan kolom `snap_token`, `payment_url`, `midtrans_status`), itu
tidak masalah — kolom-kolom itu sekarang cuma tidak dipakai lagi, tidak
mengganggu jalannya aplikasi. Tidak perlu di-rollback.

Kalau kamu baru mulai dari nol, cukup jalankan `schema.sql` seperti biasa.
