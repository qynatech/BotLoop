# 🥤 BotLoop — Aplikasi Bank Sampah Sekolah 🏫

BotLoop adalah aplikasi mobile bank sampah berbasis Android yang dirancang untuk memudahkan pengelolaan setoran dan penarikan saldo sampah plastik di lingkungan sekolah. Aplikasi ini menghubungkan siswa dengan admin/pengepul secara digital.

---

## ✨ Fitur

### 👤 Siswa (User)
- Register & Login
- Lihat saldo
- Ajukan penarikan saldo
- Lihat riwayat transaksi

### 🛠️ Admin
- Input setoran sampah siswa (berat & harga per kg otomatis dihitung)
- Approve / Tolak permintaan penarikan
- Lihat riwayat semua transaksi
- **Laporan rekap** total berat sampah, nilai setoran, dan saldo admin
- **Export laporan ke PDF** untuk pelaporan ke atasan

---

## 🛠️ Teknologi yang Digunakan

| Bagian | Teknologi |
|--------|-----------|
| Mobile App | React Native (Expo SDK 54) |
| Backend | Node.js + Express.js |
| Database | MySQL |
| Server | Railway |
| Navigation | React Navigation (Bottom Tabs) |
| Storage | AsyncStorage |

---

## 📁 Struktur Folder

```
BotLoop/
├── config/
│   └── db.js                  # Koneksi database MySQL
├── frontEnd/
│   └── botloop-app/
│       ├── screens/
│       │   ├── admin/
│       │   │   ├── DashboardAdmin.js
│       │   │   ├── InputSetoranScreen.js
│       │   │   ├── PenarikanPendingScreen.js
│       │   │   ├── RiwayatAdminScreen.js
│       │   │   └── LaporanScreen.js
│       │   ├── user/
│       │   │   ├── DashboardUser.js
│       │   │   ├── RiwayatScreen.js
│       │   │   ├── ProfilScreen.js
│       │   │   └── TarikSaldoScreen.js
│       │   ├── LoginScreen.js
│       │   ├── RegisterScreen.js
│       │   └── SplashScreen.js
│       ├── config.js           # Base URL API
│       └── App.js
├── index.js                   # Entry point backend
└── package.json
```

---

## 🚀 Cara Menjalankan Project

### Prasyarat
- Node.js
- MySQL
- Expo Go (di HP Android)

### 1. Clone repository
```bash
git clone https://github.com/qynatech/BotLoop.git
cd BotLoop
```

### 2. Setup Backend
```bash
npm install
```

Import database:
- Buka phpMyAdmin atau TablePlus
- Buat database bernama `bank_sampah`
- Import file `bank_sampah.sql`

Jalankan backend:
```bash
node index.js
```

### 3. Setup Frontend
```bash
cd frontEnd/botloop-app
npm install
npx expo start
```

Scan QR code menggunakan aplikasi **Expo Go** di HP Android.

---

## 🗄️ Struktur Database

### Tabel `users`
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | int | Primary key |
| nama | varchar | Nama pengguna |
| kelas | varchar | Kelas siswa |
| email | varchar | Email (unique) |
| password | varchar | Password |
| role | enum | `user` atau `admin` |
| saldo | int | Saldo pengguna |
| created_at | timestamp | Waktu daftar |

### Tabel `transactions`
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | int | Primary key |
| user_id | int | Foreign key ke users |
| tipe | enum | `setor` atau `tarik` |
| jumlah | int | Nominal (Rupiah) |
| berat | decimal | Berat sampah (kg) |
| harga_perkg | int | Harga per kg saat transaksi |
| status | enum | `pending`, `approved`, `rejected` |
| created_at | timestamp | Waktu transaksi |

---

## 📊 Logika Saldo Admin

```
Saldo Admin = Total Setor (approved) - Total Tarik (approved)
```

Admin dapat menolak permintaan penarikan apabila:
- Saldo admin tidak mencukupi
- Siswa setor bukan pada jadwal yang ditentukan
- Nominal yang diinput tidak wajar

---

## 📦 Download APK

Lihat di bagian [Releases](https://github.com/qynatech/BotLoop/releases) untuk download APK versi terbaru.

---

## 👨‍💻 Developer

Dibuat oleh **qynatech** sebagai tugas implementasi aplikasi bank sampah di lingkungan sekolah.
