# Dokumentasi Lengkap — NikahYuk by Ratna Offset

> Platform undangan pernikahan digital berbasis SaaS. Pengguna beli paket, pilih template, isi data, dan bagikan link undangan ke tamu.

---

## Daftar Isi

1. [Gambaran Umum](#1-gambaran-umum)
2. [Tech Stack](#2-tech-stack)
3. [Struktur Proyek](#3-struktur-proyek)
4. [Environment Variables](#4-environment-variables)
5. [Database Schema](#5-database-schema)
6. [Arsitektur Sistem](#6-arsitektur-sistem)
7. [Halaman & Routes](#7-halaman--routes)
8. [API Endpoints](#8-api-endpoints)
9. [Fitur Lengkap](#9-fitur-lengkap)
10. [Template Undangan](#10-template-undangan)
11. [Admin Panel](#11-admin-panel)
12. [Sistem Pembayaran (Midtrans)](#12-sistem-pembayaran-midtrans)
13. [Sistem Subdomain](#13-sistem-subdomain)
14. [Email Notifikasi](#14-email-notifikasi)
15. [Deployment (Vercel + Supabase)](#15-deployment-vercel--supabase)
16. [SQL Migration Manual](#16-sql-migration-manual)

---

## 1. Gambaran Umum

**NikahYuk by Ratna Offset** adalah platform SaaS undangan pernikahan digital. Bisnis modelnya:

- Admin (ratnaoffset.com) mengelola **Paket**, **Template**, **Lagu**, dan **Kupon**
- Calon pengantin (user) **beli paket** → **pilih template** → **bayar via Midtrans**
- Setelah bayar, sistem otomatis membuat **undangan kosong** siap diisi
- User mengisi data pengantin, acara, galeri, dll di **editor undangan**
- Undangan dipublikasikan dan dibagikan via link `/u/[slug]` atau subdomain eksklusif

**URL Produksi:** `https://ratnaoffset.com`

---

## 2. Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | Next.js 14 (App Router) |
| Bahasa | TypeScript |
| Database | PostgreSQL via Supabase |
| ORM | Prisma 5 |
| Auth | NextAuth.js 4 (Google OAuth + Email/Password) |
| Styling | Tailwind CSS 3 dengan custom color system |
| Animasi | Framer Motion |
| Payment | Midtrans Snap |
| Storage | Supabase Storage (audio lagu) + Cloudinary (gambar) |
| Email | Resend |
| Deployment | Vercel |
| QR Code | qrcode package |

---

## 3. Struktur Proyek

```
NikahYukByRatnaOffset/
├── prisma/
│   ├── schema.prisma          # Definisi semua model database
│   └── seed.ts                # Data awal (dev)
├── public/
│   └── templates/             # Asset template (SVG, dll)
├── src/
│   ├── app/
│   │   ├── admin/             # Dashboard admin (semua management)
│   │   ├── app/               # Area user terautentikasi
│   │   ├── api/               # Semua API routes
│   │   ├── daftar/            # Halaman registrasi
│   │   ├── harga/             # Halaman harga/paket publik
│   │   ├── login/             # Halaman login
│   │   ├── preview/[slug]/    # Preview template (public)
│   │   ├── sub/[prefix]/      # Handler subdomain custom
│   │   ├── template/          # Galeri template (public)
│   │   ├── u/[slug]/          # Undangan publik
│   │   ├── layout.tsx         # Root layout + providers
│   │   ├── page.tsx           # Landing page
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── invitation/        # Komponen dalam undangan
│   │   ├── layout/            # Navbar, Footer
│   │   ├── templates/         # 5 template undangan
│   │   └── ui/                # Button, Input, ImageUpload
│   ├── lib/
│   │   ├── auth.ts            # Konfigurasi NextAuth
│   │   ├── email.ts           # Fungsi kirim email (Resend)
│   │   ├── prisma.ts          # Prisma client singleton
│   │   ├── supabase-admin.ts  # Supabase server client
│   │   ├── supabase-client.ts # Supabase browser client
│   │   └── utils.ts           # Helpers (cn, formatRupiah, dll)
│   ├── types/
│   │   ├── invitation.ts      # Semua type + emptyInvitationData/defaultInvitationData
│   │   ├── midtrans-client.d.ts
│   │   └── next-auth.d.ts     # Augmentasi session (id, role)
│   └── middleware.ts          # Routing subdomain custom
```

---

## 4. Environment Variables

Semua variabel harus diset di Vercel dashboard dan `.env.local` untuk development:

```env
# Domain utama aplikasi (tanpa https://)
NEXT_PUBLIC_APP_DOMAIN=ratnaoffset.com

# Database (Supabase)
DATABASE_URL=postgresql://...?pgbouncer=true&connection_limit=1
DIRECT_URL=postgresql://...   # Untuk migrasi Prisma

# NextAuth
NEXTAUTH_SECRET=rahasia-panjang-acak
NEXTAUTH_URL=https://ratnaoffset.com

# Google OAuth
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxx

# Midtrans
MIDTRANS_SERVER_KEY=SB-Mid-server-xxx   # atau Mid-server-xxx untuk produksi
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxx
MIDTRANS_IS_PRODUCTION=false            # true untuk produksi

# Cloudinary (upload foto)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=xxx
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx

# Supabase (storage audio)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxx

# Email (Resend)
RESEND_API_KEY=re_xxx
```

---

## 5. Database Schema

### User
```
id           String  (cuid, PK)
email        String  (unique)
name         String? 
passwordHash String? (null jika login Google)
role         Role    (USER | ADMIN, default USER)
invitations  Invitation[]
orders       Order[]
createdAt    DateTime
```

### Template
```
id           String  (cuid, PK)
name         String  (contoh: "Elegan Gold")
slug         String  (unique, untuk URL preview)
description  String?
thumbnail    String  (URL gambar)
category     String  (elegan | minimalis | islami | romantis)
componentKey String  (key ke registry, contoh: "EleganGold")
isActive     Boolean (default true)
invitations  Invitation[]
packages     Package[]    ← many-to-many (join table _PackageToTemplate)
createdAt    DateTime
```

### Package
```
id           String   (cuid, PK)
name         String   (contoh: "Basic", "Premium", "Exclusive")
price        Int      (dalam Rupiah, contoh: 150000)
durationDays Int      (berapa hari undangan aktif setelah beli)
features     Json     {
                        maxPhotos: number,
                        customDomain: boolean,
                        musik: boolean,
                        livestream: boolean,
                        guestManagement: boolean
                      }
isActive     Boolean  (default true)
templates    Template[] ← many-to-many
```

> **Catatan penting:** Jika `Package.templates` kosong (0 template), artinya paket tersebut bisa dipakai dengan **semua** template. Jika ada isi, hanya template yang terdaftar yang tersedia untuk paket itu.

### Order
```
id              String      (cuid, PK)
userId          String      → User
packageId       String      (skalar, tidak ada @relation ke Package)
templateId      String      (skalar)
amount          Int         (harga final setelah diskon)
discountAmount  Int         (nominal diskon, default 0)
couponCode      String?     (kode kupon yang dipakai)
status          OrderStatus (PENDING | PAID | EXPIRED | FAILED | REFUNDED)
midtransOrderId String?     (unique, dipakai Midtrans webhook)
paymentMethod   String?     (transfer_bank, gopay, dll)
paidAt          DateTime?
invitation      Invitation? (one-to-one)
createdAt       DateTime
```

### Invitation
```
id           String     (cuid, PK)
userId       String     → User
templateId   String     → Template
orderId      String?    (unique) → Order
slug         String     (unique, contoh: "budi-siti" atau "inv-ab12cd34")
customDomain String?    (unique, contoh: "ilhamica" → ilhamica.ratnaoffset.com)
isPublished  Boolean    (default false)
expiresAt    DateTime?  (kapan undangan kadaluarsa)
data         Json       (InvitationData lengkap)
rsvps        Rsvp[]
guestbook    Guestbook[]
guests       Guest[]
visits       Visit[]
createdAt    DateTime
```

### Guest
```
id           String     (cuid, PK)
invitationId String     → Invitation
name         String
slug         String     (nama di-slugify untuk URL)
group        String?    (keluarga | teman | rekan kerja)
```

### Rsvp
```
id           String     (cuid, PK)
invitationId String     → Invitation
name         String
attendance   Attendance (HADIR | TIDAK_HADIR | RAGU)
guestCount   Int        (jumlah orang yang hadir, default 1)
createdAt    DateTime
```

### Guestbook
```
id           String     (cuid, PK)
invitationId String     → Invitation
name         String
message      String
createdAt    DateTime
```

### Coupon
```
id            String       (cuid, PK)
code          String       (unique, huruf kapital)
discountType  DiscountType (PERCENT | FIXED)
discountValue Int          (persen atau nominal Rupiah)
maxUses       Int?         (null = unlimited)
usedCount     Int          (default 0)
expiresAt     DateTime?    (null = tidak ada batas waktu)
isActive      Boolean      (default true)
createdAt     DateTime
```

### Song
```
id        String   (cuid, PK)
title     String
artist    String
category  String   (pop | islami | instrumental | dll)
url       String   (URL file audio di Supabase storage)
filename  String
isActive  Boolean
createdAt DateTime
```

### Visit
```
id           String     (cuid, PK)
invitationId String     → Invitation
createdAt    DateTime   (satu record per kunjungan)
```

### PreviewConfig
```
id        String   ("singleton" — hanya satu row)
data      Json     (InvitationData untuk data demo preview)
updatedAt DateTime
```

---

## 6. Arsitektur Sistem

### Alur Pembelian
```
User buka /app/beli
  → Step 1: Pilih Paket (lihat durationDays, features, template count)
  → Step 2: Pilih Template (difilter sesuai paket yang dipilih)
  → Step 3: Checkout (masukkan kupon opsional, lihat total)
  → POST /api/orders (buat Order PENDING, dapatkan Midtrans token)
  → Midtrans Snap popup
  → User bayar
  → Midtrans kirim webhook ke POST /api/payment/webhook
  → Webhook verifikasi signature, update Order → PAID
  → Webhook buat Invitation baru dengan emptyInvitationData()
  → Webhook kirim email konfirmasi via Resend
  → User redirect ke /app (dashboard)
```

### Alur Edit Undangan
```
User buka /app/undangan/[id]/edit
  → Fetch GET /api/invitations/[id]
  → Tampil 6 tab: Mempelai, Acara, Galeri & Musik, Kisah & Quote, Amplop Digital, Pengaturan
  → User edit → klik Simpan → PUT /api/invitations/[id]
  → User klik Publikasikan → POST /api/invitations/[id]/publish
  → Undangan bisa diakses di /u/[slug]
```

### Alur Subdomain Custom (Paket Exclusive)
```
User set custom domain "ilhamica" di tab Setelan
  → PUT /api/invitations/[id]/custom-domain
  → Disimpan sebagai customDomain = "ilhamica" di DB

Tamu buka ilhamica.ratnaoffset.com
  → middleware.ts deteksi subdomain
  → Rewrite ke /sub/ilhamica
  → Server Component /sub/[prefix]/page.tsx
  → Query DB: Invitation.customDomain = "ilhamica"
  → Render template undangan
```

### Struktur Data Undangan (InvitationData)
```typescript
{
  mempelai: {
    pria: { namaLengkap, namaPanggilan, anakKe, ayah, ibu, instagram, foto },
    wanita: { namaLengkap, namaPanggilan, anakKe, ayah, ibu, instagram, foto },
    urutanTampil: 'pria-dulu' | 'wanita-dulu'
  },
  acara: Array<{
    nama, tanggal, waktuMulai, waktuSelesai, lokasi, alamat, mapsUrl
  }>,
  countdown: { tanggal },
  galeri: string[],          // Array URL gambar
  loveStory: Array<{ tahun, judul, cerita }>,
  quote: { teks, sumber },
  musik: { url?, judul?, autoplay },
  amplopDigital: {
    aktif: boolean,
    rekening: Array<{ bank, nomor, atasNama }>,
    eWallet: Array<{ jenis, nomor, qrUrl? }>,
    alamatKado?: string
  },
  livestream: { aktif, platform?, url? },
  rsvpAktif: boolean,
  guestbookAktif: boolean,
  protokolKesehatan: { aktif, catatan? },
  tema: { warnaPrimer, warnaSekunder, font }
}
```

**emptyInvitationData()** — digunakan saat undangan baru dibuat (setelah bayar). Semua field nama/foto/lokasi/cerita kosong. Akad Nikah + Resepsi sudah ada strukturnya tapi fieldnya kosong.

**defaultInvitationData()** — digunakan **hanya** untuk halaman preview template dan admin preview config. Berisi data demo lengkap (Ahmad Rizki & Siti Aminah, foto picsum, dll).

---

## 7. Halaman & Routes

### Halaman Publik
| Route | Keterangan |
|---|---|
| `/` | Landing page (hero, fitur, template highlights, CTA) |
| `/login` | Login dengan email/password atau Google OAuth |
| `/daftar` | Registrasi akun baru |
| `/harga` | Halaman perbandingan paket & harga |
| `/template` | Galeri semua template dengan filter kategori + badge ketersediaan paket |
| `/preview/[slug]` | Preview template dengan data demo. Banner atas ada tombol "Pilih Template Ini" dan "← Kembali" |
| `/u/[slug]` | Undangan publik yang diterima tamu. Bisa dengan `?to=NamaTamu` untuk sapa personal |
| `/sub/[prefix]` | Handler internal untuk subdomain (tidak diakses langsung) |

### Halaman User (butuh login)
| Route | Keterangan |
|---|---|
| `/app` | Dashboard: stat cards (undangan aktif, total RSVP, kunjungan, masa berlaku), daftar undangan |
| `/app/beli` | Pembelian 3-step: pilih paket → pilih template → checkout |
| `/app/pesanan` | Riwayat semua pesanan dengan status dan tombol retry jika gagal |
| `/app/profil` | Edit profil (nama) dan ganti password |
| `/app/undangan/[id]/edit` | Editor undangan dengan 6 tab |
| `/app/undangan/[id]/tamu` | Manajemen tamu: tambah, import CSV, template WA, kirim ke WhatsApp |
| `/app/undangan/[id]/rsvp` | Lihat semua konfirmasi RSVP dari tamu |

### Halaman Admin (butuh role ADMIN)
| Route | Keterangan |
|---|---|
| `/admin` | Dashboard admin: statistik total user, undangan, pesanan, revenue |
| `/admin/template` | CRUD template undangan |
| `/admin/paket` | CRUD paket dengan pengaturan fitur dan pembatasan template |
| `/admin/kupon` | Buat dan kelola kode diskon |
| `/admin/lagu` | Upload dan kelola library musik latar |
| `/admin/pengguna` | Lihat semua user |
| `/admin/pesanan` | Lihat semua pesanan dengan status |
| `/admin/undangan` | Lihat semua undangan + tombol extend masa berlaku per baris |
| `/admin/preview` | Konfigurasi data demo yang tampil di preview template |

---

## 8. API Endpoints

### Autentikasi
| Method | Path | Keterangan |
|---|---|---|
| POST | `/api/auth/register` | Registrasi user baru dengan email + password |
| * | `/api/auth/[...nextauth]` | NextAuth handler (login, session, callback) |

### Paket & Template (Publik)
| Method | Path | Keterangan |
|---|---|---|
| GET | `/api/packages` | Daftar paket aktif + `templateIds` per paket |
| GET | `/api/templates` | Daftar template aktif + `packages` (nama paket yang membatasi) |
| GET | `/api/songs` | Daftar lagu aktif untuk music picker |
| GET | `/api/coupons/validate?code=XXX` | Validasi kode kupon (cek aktif, belum expired, belum habis kuota) |

### Order & Pembayaran
| Method | Path | Keterangan |
|---|---|---|
| POST | `/api/orders` | Buat pesanan baru, validasi template-paket, hitung diskon, buat Midtrans token |
| POST | `/api/orders/[id]/retry` | Buat ulang Midtrans token untuk pesanan PENDING yang belum dibayar |
| POST | `/api/payment/webhook` | Terima notifikasi dari Midtrans, verifikasi signature, update status, buat undangan |

### Undangan (User)
| Method | Path | Keterangan |
|---|---|---|
| GET | `/api/invitations/[id]` | Ambil data undangan lengkap + packageFeatures |
| PUT | `/api/invitations/[id]` | Simpan perubahan data undangan (hanya pemilik) |
| POST | `/api/invitations/[id]/publish` | Toggle publish/unpublish |
| PUT | `/api/invitations/[id]/slug` | Ubah slug dari nama pengantin (auto-generate, unique) |
| PUT | `/api/invitations/[id]/custom-domain` | Set/hapus subdomain custom (validasi paket Exclusive) |
| GET | `/api/invitations/[id]/qrcode` | Generate QR code PNG (400×400) |
| POST | `/api/invitations/[id]/extend` | **Admin only** — perpanjang masa berlaku N hari |

### Tamu (Guest Management)
| Method | Path | Keterangan |
|---|---|---|
| GET | `/api/invitations/[id]/guests` | Daftar semua tamu |
| POST | `/api/invitations/[id]/guests` | Tambah satu tamu baru |
| DELETE | `/api/invitations/[id]/guests` | Hapus satu tamu (body: `{ guestId }`) |
| POST | `/api/invitations/[id]/guests/import` | Import banyak tamu dari parsing CSV |

### Undangan Publik
| Method | Path | Keterangan |
|---|---|---|
| GET | `/api/u/[slug]` | Ambil data undangan publik (validasi published + not expired), catat kunjungan |
| POST | `/api/u/[slug]/rsvp` | Kirim konfirmasi RSVP dari tamu |
| POST | `/api/u/[slug]/guestbook` | Kirim ucapan ke buku tamu |

### User Profil
| Method | Path | Keterangan |
|---|---|---|
| GET | `/api/user/profile` | Ambil data profil sendiri |
| PUT | `/api/user/profile` | Update nama |
| POST | `/api/user/change-password` | Ganti password (verifikasi password lama) |

### Upload
| Method | Path | Keterangan |
|---|---|---|
| GET | `/api/upload` | Ambil Cloudinary config untuk upload dari browser |

### Admin
| Method | Path | Keterangan |
|---|---|---|
| GET/POST | `/api/admin/templates` | List/buat template |
| PATCH/DELETE | `/api/admin/templates/[id]` | Update/hapus template |
| GET/POST | `/api/admin/packages` | List/buat paket (termasuk `templateIds`) |
| PATCH/DELETE | `/api/admin/packages/[id]` | Update paket (set template restrictions) / hapus |
| GET/POST | `/api/admin/songs` | List/create song entry |
| POST | `/api/admin/songs/presign` | Dapatkan presigned URL Supabase untuk upload audio |
| PATCH/DELETE | `/api/admin/songs/[id]` | Update/hapus lagu |
| GET/POST | `/api/admin/coupons` | List/buat kupon |
| DELETE | `/api/admin/coupons` | Hapus kupon (body: `{ id }`) |
| GET | `/api/admin/preview` | Ambil preview config |
| PUT | `/api/admin/preview` | Update data demo untuk preview |
| POST | `/api/admin/preview/upload` | Upload foto ke preview config |

### Internal & Cron
| Method | Path | Keterangan |
|---|---|---|
| GET | `/api/_internal/resolve-domain` | Resolve custom domain ke invitation (dipakai middleware lama, sekarang tidak aktif) |
| GET | `/api/cron/cleanup-expired` | Hapus/nonaktifkan undangan kadaluarsa (dipanggil Vercel Cron) |
| POST | `/api/dev/seed-invitation` | Buat undangan demo (hanya dev, cek `MIDTRANS_IS_PRODUCTION !== 'true'`) |

---

## 9. Fitur Lengkap

### Autentikasi & Akun
- Login dengan **email + password** (bcrypt hash)
- Login dengan **Google OAuth**
- Registrasi akun baru
- Edit nama profil
- Ganti password (verifikasi password lama dulu)
- Role system: `USER` dan `ADMIN`
- Session berbasis JWT (NextAuth), id + role tersimpan di token

### Pembelian Paket
- 3-step flow: **Pilih Paket → Pilih Template → Checkout**
- Setiap paket tampil fitur detail (max foto, musik, livestream, manajemen tamu, subdomain)
- Template difilter per paket (jika paket membatasi template)
- Badge "Template terbatas (X pilihan)" atau "Semua template tersedia"
- Input kode kupon dengan validasi real-time (cek aktif, expired, max uses)
- Diskon PERCENT atau FIXED amount
- State dipertahankan saat buka preview di tab baru: URL `/app/beli?templateId=X&packageId=Y` restore langsung ke Step 3

### Editor Undangan (6 Tab)
**Tab Mempelai:**
- Nama lengkap, nama panggilan, anak ke-, nama ayah, nama ibu, Instagram
- Upload foto mempelai (via Cloudinary)
- Urutan tampil: pria duluan atau wanita duluan

**Tab Acara:**
- Tambah/hapus acara (Akad Nikah, Resepsi, dll)
- Nama acara, tanggal, waktu mulai-selesai
- Nama lokasi, alamat lengkap, URL Google Maps

**Tab Galeri & Musik:**
- Upload foto galeri (grid, hover untuk hapus)
- Music Picker: pilih dari library lagu, preview audio, toggle autoplay
- Upload musik custom (opsional)

**Tab Kisah & Quote:**
- Timeline Love Story (tahun, judul, cerita) — tambah/hapus bebas
- Kutipan Ayat/Quote dengan sumber

**Tab Amplop Digital:**
- Toggle aktif/nonaktif
- Tambah rekening bank (bank, nomor, nama)
- Tambah e-wallet (jenis, nomor, URL QR opsional)
- Alamat pengiriman kado fisik (opsional)

**Tab Pengaturan (Setelan):**
- Toggle RSVP on/off
- Toggle Buku Tamu on/off
- Toggle Livestream + input platform + URL
- Toggle Protokol Kesehatan + catatan
- **Masa Berlaku**: tampil tanggal kadaluarsa + sisa hari (hijau/amber/merah), tidak bisa self-extend
- **Link Undangan**: tampil URL, salin, publikasikan/sembunyikan, lihat undangan
- **Buat link dari nama pengantin** (non-Exclusive): generate slug `nama-pria-nama-wanita`
- **QR Code**: tampil + download PNG
- **Link Eksklusif (Subdomain)**: hanya muncul untuk paket Exclusive, input nama subdomain

### Manajemen Tamu
- Tambah tamu (nama + kelompok: keluarga/teman/rekan kerja)
- **Import CSV**: upload file → preview konfirmasi → import batch
- **Export CSV**: download daftar tamu + link undangan personal
- **Download template CSV** untuk format yang benar
- Template pesan WhatsApp yang bisa dikustomisasi (collapsible)
  - Placeholder `{nama}` dan `{link}` untuk personalisasi
  - Reset ke default
- Per tamu: salin link personal, kirim ke WhatsApp langsung
- **Pencarian** real-time by nama/kelompok
- **Stats cards**: total tamu, per kelompok (keluarga/teman/rekan kerja)
- Link personal: `/u/[slug]?to=NamaTamu` — template menyapa dengan nama tamu

### Halaman Undangan Publik (`/u/[slug]`)
- Hanya tampil jika `isPublished = true` dan belum kadaluarsa
- Sapa personal jika ada query `?to=NamaTamu`
- Tracking kunjungan (satu Visit per buka)
- Semua fitur yang diaktifkan: RSVP, Buku Tamu, Livestream, Amplop Digital, Musik, QR Code, Share

### Galeri Template Publik (`/template`)
- Filter by kategori: Semua, Elegan, Minimalis, Islami
- Setiap kartu template tampilkan:
  - Badge kategori
  - **PackageBadge**: "Tersedia di semua paket" (hijau) atau "Tersedia di Paket X & Y" (amber dengan ikon gembok)
- Tombol "Lihat Preview" (buka tab baru) dan "Pilih Template Ini" → `/app/beli`

### Preview Template
- Data demo dikonfigurasi admin via `/admin/preview`
- Banner atas: nama template + badge PREVIEW
- Tombol "Pilih Template Ini" → `/app/beli?templateId=X&packageId=Y` (jika ada packageId dari beli flow)
- Tombol "← Kembali" → kembali ke beli flow dengan package tetap terpilih

### Sistem Kupon
- Kode unik huruf kapital
- Tipe: PERCENT (persentase) atau FIXED (nominal)
- Batas penggunaan opsional (`maxUses`)
- Tanggal kadaluarsa opsional
- Validasi real-time di checkout
- `usedCount` bertambah saat order dibuat (bukan saat bayar)

### RSVP & Buku Tamu
- Form RSVP: nama, konfirmasi (hadir/tidak/ragu), jumlah orang
- Form Buku Tamu: nama + pesan
- Admin dan user pemilik bisa lihat semua response
- Terpisah per undangan

### QR Code
- Generate otomatis untuk setiap undangan
- URL: `/api/invitations/[id]/qrcode` (PNG 400×400)
- Download langsung dari editor
- Mengarah ke URL undangan yang benar (customDomain atau /u/slug)

### Masa Berlaku
- Ditentukan oleh `durationDays` paket yang dibeli
- Dihitung dari tanggal pembayaran berhasil
- **User tidak bisa self-extend** (sudah dihapus dari UI)
- **Hanya admin** yang bisa extend via tabel di `/admin/undangan`
- Visual: hijau (>14 hari), amber (7–14 hari), merah (<7 hari atau expired)

---

## 10. Template Undangan

Lima template sudah tersedia, semua komponen React dalam `src/components/templates/`:

### 1. Elegan Gold (`EleganGold.tsx`)
- Warna: coklat keemasan (#8B5E3C) dengan aksen krem
- Font: Playfair Display + Inter
- Gaya: elegan klasik, cocok untuk pernikahan formal

### 2. Minimalis Putih (`MinimalisPutih.tsx`)
- Warna: putih bersih dengan aksen abu dan hitam tipis
- Gaya: modern minimalis, bersih, cocok untuk semua segmen

### 3. Islami (`Islami.tsx`)
- Warna: hijau teal + krem dengan ornamen arabesque
- Elemen: kaligrafi, pattern islami, bismillah
- Gaya: religius, cocok untuk pasangan muslim

### 4. Gelap Romantis (`GelapRomantis.tsx`)
- Warna: latar gelap (#1a1a2e) dengan aksen emas
- Animasi: Framer Motion (fade in, slide)
- Gaya: dramatis, romantis, elegan malam

### 5. Romantis Pink (`RomantisPink.tsx`)
- Warna: pink muda (#FFF0F3) dengan aksen rose gold
- Animasi: Framer Motion ornamen bunga
- Gaya: feminin, hangat, cocok untuk wanita

### Template Props Interface
```typescript
interface TemplateProps {
  data: InvitationData;
  guestName?: string;
  slug: string;
  onRsvpSubmit: (data: RsvpData) => Promise<void>;
  onGuestbookSubmit: (data: GuestbookData) => Promise<void>;
  rsvps: Rsvp[];
  guestbook: Guestbook[];
}
```

### Registry
```typescript
// src/components/templates/registry.ts
export const TEMPLATE_REGISTRY = {
  'EleganGold': EleganGold,
  'MinimalisPutih': MinimalisPutih,
  'Islami': Islami,
  'GelapRomantis': GelapRomantis,
  'RomantisPink': RomantisPink,
};
```
`componentKey` di database harus cocok dengan key di registry ini.

### Komponen Invitation (shared)
- `CountdownTimer` — hitung mundur ke tanggal acara pertama
- `RsvpForm` — form konfirmasi kehadiran
- `GuestbookForm` — form ucapan
- `AmplopDigital` — tampilan rekening + e-wallet + alamat kado
- `MusicPlayer` — pemutar musik dengan toggle mute
- `ShareButton` — tombol bagikan (WhatsApp, copy link, native share)

---

## 11. Admin Panel

### Akses
- URL: `/admin`
- Butuh login dengan akun `role = ADMIN`
- Set role via Supabase SQL: `UPDATE "User" SET role = 'ADMIN' WHERE email = 'admin@email.com';`

### Manajemen Template (`/admin/template`)
- CRUD template
- Field: nama, slug, deskripsi, thumbnail, kategori, componentKey
- Toggle isActive

### Manajemen Paket (`/admin/paket`)
- CRUD paket dengan harga, durasi hari, dan fitur
- **Pembatasan template**: checklist template mana yang tersedia per paket
- Jika 0 template dipilih → semua template tersedia (backward compatible)
- Tampilkan jumlah template tersedia di kartu paket

### Manajemen Kupon (`/admin/kupon`)
- Buat kupon dengan kode, tipe diskon, nilai, batas pakai, tanggal expired
- Hapus kupon
- Lihat usedCount vs maxUses

### Manajemen Lagu (`/admin/lagu`)
- Upload file audio ke Supabase Storage via presigned URL
- Isi metadata: judul, artis, kategori
- Toggle isActive (tampil/sembunyikan di music picker)
- Hapus lagu

### Manajemen Pengguna (`/admin/pengguna`)
- Lihat semua user: nama, email, role, tanggal daftar

### Manajemen Pesanan (`/admin/pesanan`)
- Lihat semua pesanan: user, paket, template, status, nominal, tanggal
- Status badge: PENDING/PAID/EXPIRED/FAILED

### Manajemen Undangan (`/admin/undangan`)
- Lihat semua undangan: nama pengantin, pemilik, template, nama paket + durationDays, status, RSVP count
- **ExtendButton**: per baris, dropdown pilih hari (7/14/30/60/90/180/365), klik extend
- Tampil sisa hari + highlight merah jika kadaluarsa

### Konfigurasi Preview (`/admin/preview`)
- Edit data demo (InvitationData) yang tampil di semua halaman `/preview/[slug]`
- Upload foto untuk preview

---

## 12. Sistem Pembayaran (Midtrans)

### Flow
1. User submit checkout → `POST /api/orders`
2. Backend buat `Order` dengan status `PENDING`
3. Backend panggil Midtrans Snap API → dapatkan `snapToken`
4. Frontend load Snap.js dan panggil `window.snap.pay(snapToken, callbacks)`
5. Popup Midtrans muncul, user bayar
6. Midtrans kirim notifikasi ke `POST /api/payment/webhook`
7. Backend verifikasi signature (SHA-512 hash)
8. Jika `transaction_status === 'settlement'` atau `'capture'`:
   - Update `Order.status = 'PAID'`
   - Buat `Invitation` baru dengan `emptyInvitationData()`
   - Kirim email konfirmasi via Resend
9. Jika `expire` → `Order.status = 'EXPIRED'`
10. Jika `cancel`/`deny` → `Order.status = 'FAILED'`

### Retry Pembayaran
- Di halaman `/app/pesanan`, pesanan PENDING bisa retry
- `POST /api/orders/[id]/retry` — buat Midtrans token baru untuk order yang sama

### Catatan Dev Mode
- Jika `MIDTRANS_IS_PRODUCTION = false`, webhook tanpa server key akan ditolak (403)
- Gunakan `DevSeedButton` di dashboard untuk buat undangan demo tanpa bayar

### Validasi Template-Paket di Order
```
Saat POST /api/orders:
- Fetch template dan package dari DB
- Jika package.templates.length > 0:
    Cek apakah templateId ada di package.templates
    Jika tidak → error 400 "Template tidak tersedia untuk paket ini"
```

---

## 13. Sistem Subdomain

### Cara Kerja
```
DNS: *.ratnaoffset.com → Vercel
NEXT_PUBLIC_APP_DOMAIN=ratnaoffset.com
```

1. Tamu buka `ilhamica.ratnaoffset.com`
2. `middleware.ts` mendeteksi host berakhiran `.ratnaoffset.com`
3. Ekstrak prefix: `ilhamica`
4. Rewrite internal ke `/sub/ilhamica` (URL di browser tetap `ilhamica.ratnaoffset.com`)
5. Server Component `src/app/sub/[prefix]/page.tsx` query:
   ```prisma
   Invitation.findUnique({ where: { customDomain: 'ilhamica' } })
   ```
6. Jika ditemukan dan published → render `InvitationClient` dengan data undangan
7. Jika tidak → tampil 404

### Pengaturan
- User paket **Exclusive** bisa set subdomain di tab Setelan editor
- `PUT /api/invitations/[id]/custom-domain` — validasi paket, cek unique, simpan
- Format: huruf kecil, angka, tanda hubung (-), minimal 3 karakter

### Vercel Setup
Di Vercel dashboard:
- Add domain: `ratnaoffset.com`
- Add wildcard: `*.ratnaoffset.com`
- Arahkan DNS nameserver ke Vercel

---

## 14. Email Notifikasi

Menggunakan **Resend** dengan domain `nikahyuk.id`.

### 1. Order Confirmation (`sendOrderConfirmation`)
Dikirim saat webhook menerima payment success.

Konten email:
- Nomor pesanan (8 karakter terakhir dari order ID)
- Nama template yang dibeli
- Nama paket
- Total bayar
- Tombol "Edit Undangan Sekarang →" ke `/app/undangan/[id]/edit`

### 2. Invitation Published (`sendInvitationPublished`)
Dikirim saat user mempublikasikan undangan.

Konten email:
- URL undangan
- Slug undangan
- Tombol "Lihat Undangan →"

---

## 15. Deployment (Vercel + Supabase)

### Vercel
- Branch produksi: `main` (atau sesuai konfigurasi)
- Build command: `prisma generate && next build`
- Output: Next.js serverless functions

### Supabase
- PostgreSQL sebagai database utama
- Storage bucket untuk file audio lagu
- Connection pooling via PgBouncer (`DATABASE_URL` dengan `?pgbouncer=true`)
- `DIRECT_URL` untuk Prisma migrate (tanpa pooler)

### Cron Job (Vercel Cron)
```json
// vercel.json
{
  "crons": [{
    "path": "/api/cron/cleanup-expired",
    "schedule": "0 2 * * *"
  }]
}
```
Berjalan setiap hari pukul 02.00 UTC untuk membersihkan undangan kadaluarsa.

---

## 16. SQL Migration Manual

Beberapa perubahan schema tidak bisa dilakukan via `prisma db push` di produksi karena tidak ada direct DB connection dari Vercel. Jalankan SQL ini secara manual di **Supabase SQL Editor** (`ratnaoffset.com` → Supabase dashboard → SQL Editor).

### Join Table Package ↔ Template
```sql
CREATE TABLE IF NOT EXISTS "_PackageToTemplate" (
  "A" TEXT NOT NULL,
  "B" TEXT NOT NULL,
  CONSTRAINT "_PackageToTemplate_AB_unique" UNIQUE ("A", "B"),
  CONSTRAINT "_PackageToTemplate_A_fkey" FOREIGN KEY ("A")
    REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "_PackageToTemplate_B_fkey" FOREIGN KEY ("B")
    REFERENCES "Template"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "_PackageToTemplate_B_index" ON "_PackageToTemplate"("B");
```

Jalankan migration ini **sebelum** deploy kode yang menggunakan fitur pembatasan template per paket.

---

## Catatan Penting & Keputusan Teknis

### 1. emptyInvitationData vs defaultInvitationData
- `emptyInvitationData()` → untuk undangan baru setelah pembelian. Semua field user kosong.
- `defaultInvitationData()` → hanya untuk preview template dan admin config. Berisi data "Ahmad Rizki & Siti Aminah".
- Jika salah pakai, undangan baru akan muncul terisi data demo.

### 2. Middleware Edge Runtime
- Next.js middleware berjalan di Edge Runtime yang tidak support Prisma.
- Solusi: middleware hanya lakukan `rewrite` path ke `/sub/[prefix]`.
- Query database dilakukan di Server Component `/sub/[prefix]/page.tsx` (Node.js runtime).
- Jangan pernah import `@prisma/client` di middleware.

### 3. Folder `_sub` vs `sub`
- Folder dengan prefix `_` di App Router Next.js adalah **private** (di-opt out dari routing).
- Subdomain handler harus di `src/app/sub/[prefix]/page.tsx`, **bukan** `_sub`.

### 4. Order tidak punya relasi ke Package
- Di schema Prisma, `Order.packageId` hanya skalar, tidak ada `@relation` ke `Package`.
- Untuk query package dari order, lakukan query terpisah dan lookup manual via `Map`.
- Jangan coba `include: { order: { select: { package: ... } } }` — akan error TypeScript.

### 5. Extend Masa Berlaku = Admin Only
- User tidak bisa self-extend (bypass sistem durationDays paket).
- API `POST /api/invitations/[id]/extend` hanya bisa dipanggil user dengan `role = 'ADMIN'`.
- Admin extend dari UI di `/admin/undangan` via `ExtendButton` component.

### 6. Template Restriction Backward Compatible
- Jika `Package.templates` kosong → semua template bisa dipakai paket itu.
- Hanya jika ada template terdaftar di join table → template dibatasi.
- Cek di API: `if (pkg.templates.length > 0 && !pkg.templates.some(t => t.id === templateId))`

### 7. Preview Link dengan State Preservation
- Saat user di `/app/beli` Step 2 buka preview, link preview menyertakan `?packageId=X`.
- Preview page teruskan packageId ke link "Pilih Template Ini": `/app/beli?templateId=T&packageId=P`.
- Beli page baca URL params saat mount dan restore state (template, package, lompat ke Step 3).

### 8. window.location.hostname Tidak Bisa Dipakai untuk appDomain
- Dari subdomain `ilhamica.ratnaoffset.com`, `window.location.hostname` return `ilhamica.ratnaoffset.com`.
- Selalu gunakan `process.env.NEXT_PUBLIC_APP_DOMAIN` untuk construct URL undangan yang benar.

---

*Dokumentasi ini mencakup seluruh sistem per commit `465bce0` di branch `claude/bangun-phase-1-6mfx0w`.*
