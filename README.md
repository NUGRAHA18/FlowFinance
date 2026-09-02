# FlowFinance

Aplikasi pencatatan keuangan pribadi. Arsitektur terpisah menjadi tiga service independen.

```
┌──────────────────┐        HTTPS         ┌──────────────────┐
│    frontend/     │  ──────────────────► │    backend/      │
│  React + Vite    │   VITE_API_URL       │  Express + Prisma│
│  ▸ Vercel        │  ◄────────────────── │  ▸ Render        │
└──────────────────┘        JSON          └────────┬─────────┘
                                                   │ Postgres wire
                                                   │ (pgbouncer :6543)
                                          ┌────────▼─────────┐
                                          │    Supabase      │
                                          │  Managed Postgres│
                                          └──────────────────┘
```

Ketiganya deploy dan di-scale sendiri-sendiri. Satu-satunya kontrak antar service adalah
REST API di `/api/*` dan skema database yang dikelola migrasi Prisma.

---

## Struktur

| Path | Service | Deploy ke | Konfigurasi |
|---|---|---|---|
| `backend/` | REST API | Render | `render.yaml` (di root) |
| `frontend/` | SPA | Vercel | `frontend/vercel.json` |
| `backend/prisma/` | Skema & migrasi DB | Supabase | `schema.prisma` |

Monorepo — satu repo Git, tapi Render dan Vercel masing-masing di-set ke *root directory*-nya
sendiri, jadi tiap service build terpisah.

---

## Menjalankan secara lokal

```bash
# 1. Install dependencies kedua service
npm run install:all

# 2. Isi environment variables
cp backend/.env.example backend/.env      # DATABASE_URL, DIRECT_URL, JWT_SECRET
cp frontend/.env.example frontend/.env    # VITE_API_URL

# 3. Terapkan skema ke database
npm run db:deploy

# 4. Jalankan keduanya sekaligus (api :5000, web :5173)
npm run dev
```

Menjalankan satu-satu: `npm run dev:backend` / `npm run dev:frontend`.

---

## Setup Supabase

1. Buat project di [supabase.com](https://supabase.com).
2. **Project Settings → Database → Connection string**, ambil dua URL:

   | Env | Mode | Port | Dipakai untuk |
   |---|---|---|---|
   | `DATABASE_URL` | Transaction pooler | `6543` | Runtime aplikasi |
   | `DIRECT_URL` | Direct connection | `5432` | `prisma migrate` |

   `DATABASE_URL` **wajib** diakhiri `?pgbouncer=true&connection_limit=1`. Tanpa itu Prisma
   akan memakai prepared statement yang tidak didukung pgbouncer dalam mode transaction.

   `DIRECT_URL` dipakai terpisah karena pgbouncer tidak bisa menjalankan DDL migrasi.

3. Jalankan migrasi:

   ```bash
   npm run db:deploy
   ```

Lima migrasi yang ada sudah dalam dialek PostgreSQL dan akan apply bersih ke database kosong.

---

## Migrasi data dari database lama (Neon → Supabase)

Kalau database Neon lama masih berisi data, `backend/scripts/migrate-data.js` menyalinnya.
Script memakai driver `pg` langsung — **tidak perlu `pg_dump`/`psql` terpasang**.

Skema harus sudah ada di Supabase lebih dulu (`npm run db:deploy`).

```bash
cd backend

export SOURCE_DATABASE_URL="<connection string Neon>"
export TARGET_DATABASE_URL="<Supabase DIRECT connection, port 5432>"

# 1. Lihat jumlah baris di kedua sisi — tidak menulis apa pun
npm run db:migrate-data -- --dry-run

# 2. Jalankan migrasi sungguhan
npm run db:migrate-data
```

Di PowerShell, ganti `export X="y"` dengan `$env:X = "y"`.

**Sifat script:**

- **Satu transaksi.** Kalau ada satu baris gagal, semuanya di-rollback — Supabase tidak
  ditinggalkan dalam keadaan setengah terisi.
- **Idempoten.** Baris dengan `id` yang sudah ada di tujuan dilewati
  (`ON CONFLICT DO NOTHING`), jadi aman dijalankan ulang setelah gagal di tengah.
- **Urutan foreign key** mengikuti relasi di `schema.prisma` (User → Account → Category →
  Transaction → ...), ditambah `session_replication_role = replica` sebagai jaring pengaman.
- **Verifikasi otomatis** membandingkan jumlah baris tiap tabel setelah selesai, dan keluar
  dengan exit code 1 kalau ada yang kurang.

| Flag | Fungsi |
|---|---|
| `--dry-run` | Hanya hitung baris di kedua sisi, tidak menulis |
| `--truncate` | Kosongkan tabel tujuan dulu — **menghapus data Supabase yang ada** |
| `--no-ssl-verify` | Matikan verifikasi sertifikat TLS, kalau koneksi gagal karena sertifikat |

`TARGET_DATABASE_URL` **harus** direct connection (port 5432). Script menolak port 6543 —
transaction pooler memutus transaksi panjang di tengah jalan.

> Setelah migrasi berhasil dan login sudah dites, hapus/rotate kredensial Neon lama.
> Kredensial itu pernah ter-commit di `.env`, jadi masih ada di history Git.

---

## Deploy backend → Render

Render dashboard → **New → Blueprint** → pilih repo ini. Render membaca `render.yaml`
yang ada di root repo (Blueprint tidak bisa membacanya dari subfolder).

Atau manual (**New → Web Service**):

| Field | Nilai |
|---|---|
| Root Directory | `backend` |
| Build Command | `npm ci && npm run build` |
| Start Command | `npm start` |
| Health Check Path | `/health` |

Environment variables yang harus diisi manual (ditandai `sync: false` di blueprint):

- `DATABASE_URL` — Supabase **pooler** (`aws-0-<region>.pooler.supabase.com`), bukan
  `db.<ref>.supabase.co`
- `DIRECT_URL` — Supabase direct, port 5432
- `JWT_SECRET` — minimal 32 karakter (`openssl rand -hex 32`)
- `FRONTEND_URL` — URL produksi Vercel, mis. `https://flowfinance.vercel.app`

`npm run build` menjalankan `prisma generate && prisma migrate deploy`, jadi migrasi ikut
ter-apply tiap deploy. Kalau migrasi gagal, build gagal — service lama tetap jalan.

> **Direct connection Supabase (`db.<ref>.supabase.co`) hanya melayani IPv6** kecuali kamu
> membeli add-on IPv4. Render tidak menjamin outbound IPv6, jadi untuk `DATABASE_URL` di
> Render pakai host pooler (`aws-0-<region>.pooler.supabase.com`) — Session pooler port 5432
> atau Transaction pooler port 6543. Untuk development lokal, direct connection biasanya
> aman dipakai.

> Free tier Render mematikan instance setelah ~15 menit idle. Request pertama setelah itu
> butuh ~30–50 detik untuk bangun.

---

## Deploy frontend → Vercel

Vercel dashboard → **Add New → Project** → import repo ini.

| Field | Nilai |
|---|---|
| Framework Preset | Vite |
| Root Directory | `frontend` |
| Build Command | `npm run build` (dari `vercel.json`) |
| Output Directory | `dist` |

Environment variable:

- `VITE_API_URL` = `https://<nama-service>.onrender.com/api` — **jangan lupa sufiks `/api`**

> Variabel Vite di-*inline* saat build, bukan dibaca saat runtime. Setelah mengubah
> `VITE_API_URL` di Vercel, wajib redeploy agar nilai barunya ikut terbawa.

`vercel.json` sudah berisi rewrite SPA, jadi refresh di `/dashboard` tidak jadi 404.

---

## CORS

`FRONTEND_URL` di backend menerima beberapa origin sekaligus, dipisah koma:

```
FRONTEND_URL=https://flowfinance.vercel.app,https://flowfinance.com
```

Domain `*.vercel.app` diizinkan lewat pola regex, jadi preview deployment (yang URL-nya
berubah tiap commit) tetap bisa memanggil API tanpa perlu didaftarkan satu per satu.

---

## Perintah

| Perintah | Fungsi |
|---|---|
| `npm run install:all` | Install dependencies backend + frontend |
| `npm run dev` | Jalankan kedua service bersamaan |
| `npm run db:migrate` | Buat migrasi baru dari perubahan schema (development) |
| `npm run db:deploy` | Terapkan migrasi yang ada (production) |
| `npm run db:studio` | Buka Prisma Studio |
| `npm run db:migrate-data` | Salin data dari database lama ke Supabase (lihat bagian di atas) |
| `npm test` | Jest test suite backend |
| `npm run lint` | ESLint frontend |
