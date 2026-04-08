# NikahReady

Alat bantu membuat CV Taaruf profesional untuk Muslim Indonesia. Bukan platform kencan. Bukan layanan matching. Hanya alat yang membantu kamu memperkenalkan diri dengan bermartabat.

## Apa itu NikahReady?

NikahReady adalah aplikasi web yang membantu Muslim Indonesia membuat dokumen perkenalan diri (CV Taaruf) yang profesional, sopan, dan bermartabat. Dengan NikahReady, kamu bisa mengisi data diri secara terstruktur melalui 22 langkah, memilih template desain, lalu mengunduhnya sebagai PDF yang siap dibagikan kepada wali, murabbi, atau calon pasangan.

## Latar Belakang

Proses taaruf dalam Islam memerlukan perkenalan yang teratur dan bermartabat. Banyak Muslim yang kesulitan menyusun informasi tentang diri mereka secara sistematis untuk dibagikan kepada calon pasangan atau perantara (wali/murabbi). NikahReady hadir sebagai solusi — sebuah alat yang memudahkan proses perkenalan tanpa mengubah esensi taaruf itu sendiri.

## Fitur Utama

### 22 Langkah Pengenalan Diri
Langkah-langkah terstruktur untuk mengisi data secara menyeluruh:

| # | Langkah | Plan |
|---|---------|------|
| 1 | Data Pribadi | Gratis |
| 2 | Fisik & Kesehatan | Gratis |
| 3 | Riwayat Pendidikan | Gratis |
| 4 | Riwayat Pekerjaan | Gratis |
| 5 | Perjalanan Hidup | Premium |
| 6 | Riwayat Organisasi | Premium |
| 7 | Karakter & Kepribadian | Gratis |
| 8 | Ibadah & Keislaman | Gratis |
| 9 | Gaya Hidup | Premium |
| 10 | Visi & Misi Pernikahan | Gratis |
| 11 | Kriteria Pasangan | Gratis |
| 12 | Financial Planning | Premium |
| 13 | Pandangan Isu | Premium |
| 14 | Anggota Keluarga | Gratis |
| 15 | Rencana Masa Depan | Premium |
| 16 | Sosial Media | Gratis |
| 17 | Galeri Foto | Premium |
| 18 | Foto & Template | Gratis |
| 19-21 | Surat Taaruf, Referensi, Harapan & Doa | Premium |
| 22 | Review & Simpan | Gratis |

### 6 Template CV Profesional

| Template | Subtitle | Halaman | Plan |
|----------|----------|---------|------|
| Ringkas | Clean | 1 | Gratis |
| Qonaah | Simple | 2 | Gratis |
| Sakinah | Soft | 1 | Gratis |
| Amanah | Pro | 5 | Premium |
| Syar'i | Elegant | 4 | Premium |
| Modern Dark | Bold | 4 | Premium |

### Keamanan Data
- Enkripsi SSL/TLS
- Autentikasi berlapis (Supabase Auth)
- Data hanya bisa diakses oleh pemilik akun
- Fitur berbagi dengan link unik yang dapat dikontrol

### Fitur Premium
- Template premium (Amanah Pro, Syar'i Elegant, Modern Dark Bold)
- Financial Planning & alokasi keuangan
- Pandangan Isu (parenting, poligami, karir istri)
- Perjalanan Hidup & Riwayat Organisasi
- Galeri Foto untuk CV
- Tanpa watermark pada PDF

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Database & Auth**: Supabase (PostgreSQL)
- **PDF Generation**: html2canvas + jsPDF
- **Font**: Inter (body), Amiri (Arabic)
- **Testing**: Vitest + React Testing Library
- **Deployment**: Vercel

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Landing page
│   ├── create/            # Form creation flow
│   ├── preview/           # PDF preview
│   ├── cv/[shareId]/      # Shared CV view
│   ├── upgrade/           # Premium upgrade
│   ├── privacy/           # Kebijakan Privasi
│   └── terms/             # Syarat Penggunaan
├── components/
│   ├── templates/         # 6 PDF templates
│   ├── form/              # 22 form step components
│   ├── ui/                # Reusable UI components
│   └── share/             # Share menu
├── context/               # React contexts (Auth, Form, Theme)
├── hooks/                 # Custom React hooks
├── lib/
│   ├── constants.ts       # Form options, step definitions
│   ├── design-system.ts   # Design tokens
│   ├── pdf-tokens.ts      # PDF theme tokens
│   ├── pdf-shared-components.tsx  # Shared PDF components
│   ├── generatePdf.ts     # PDF generator
│   ├── supabase/          # Supabase client & queries
│   ├── validators/        # Form validation schemas
│   └── mappers/           # DB ↔ form state mappers
└── types/                 # TypeScript type definitions
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

```bash
git clone https://github.com/[org]/nikahready.git
cd nikahready
npm install
```

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Development

```bash
npm run dev
```

### Testing

```bash
# Run all tests
npm test

# Run with coverage
npx vitest run --coverage
```

### Build

```bash
npm run build
```

## License

Hak cipta © 2025 NikahReady. Semua hak dilindungi.