<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Smart System Kebumen - Agent Guidelines

## Project Overview
Pembangunan Aplikasi Terintegrasi & Implementasi Smart System Berbasis AI untuk Kabupaten Kebumen Transformasi Digital Menuju Smart Regency.

**Teknologi:** React Native (Mobile), Next.js (Web), Laravel/Node.js (Backend), PostgreSQL, Python FastAPI (AI), Firebase FCM

**Proposal File:** `C:\Users\ATI-User\smart-system\proposal-smart-system.pdf`

---

## Fitur Utama Aplikasi (sesuai proposal)

### A. Layanan Masyarakat (Mobile React Native & Web)
- [x] Portal Layanan Terpadu - Permohonan KTP, KK, izin usaha, layanan kesehatan & sosial
- [x] Chatbot AI 24/7 - Menjawab pertanyaan persyaratan, status dokumen, jadwal layanan
- [x] Pengaduan Pintar - Masyarakat lapor (foto+GPS), AI klasifikasi otomatis ke OPD
- [x] Info Publik & Anggaran - Transparansi realisasi pembangunan dan APBD
- [ ] Notifikasi Push Real-time - Firebase Cloud Messaging untuk update status layanan

### B. Layanan Aparatur & Pemerintah Daerah
- [x] Dashboard Monitoring Eksekutif - Visualisasi capaian kinerja, peta potensi stunting, kemiskinan, rekomendasi AI
- [x] Sistem Manajemen Data Terpadu - Sinkronisasi data adminduk, desa, kesehatan, pendidikan
- [x] Predictive Analytics - Prediksi lonjakan permohonan layanan dan potensi bencana
- [x] Manajemen Pengguna & Keamanan - Hierarki akses (kabupaten, kecamatan, desa) dengan autentikasi JWT

### C. AI Engine
- [x] NLP Chatbot Interaktif - Menjawab pertanyaan warga terkait layanan publik (OpenRouter GPT-4o-mini)
- [x] OCR + Computer Vision Validasi Dokumen - Deteksi keaslian KTP, KK, Akta (simulasi)
- [x] Supervised Learning Klasifikasi Pengaduan - Kategori OPD otomatis
- [ ] Time Series Forecasting - Prediksi data historis
- [x] Decision Support System Rekomendasi - Saran intervensi program
- [ ] Sentiment Analysis - Analisis opini publik

---

## Struktur Fitur

### Fitur Login & Auth
- Login dengan email/password
- Redux Persist untuk simpan state
- Token simulation (base64 encoded)
- 3 Role: Admin, Warga, OPD
- Logout dengan clear state

### Role-Based Access
| Fitur | Admin | Warga | OPD |
|-------|-------|-------|-----|
| Dashboard | ✅ | ✅ (Warga) | ✅ |
| Data Penduduk | ✅ | ❌ | ❌ |
| Chatbot AI | ✅ | ✅ | ✅ |
| Pengaduan | ✅ | ✅ (Create) | ✅ (Manage) |
| Formulir Layanan | ❌ | ✅ | ❌ |
| Status Layanan | ❌ | ✅ | ❌ |
| Info Publik | ✅ | ✅ | ✅ |
| Kelola OPD | ✅ | ❌ | ✅ |

### Page Structure
```
/login - Halaman login
/(protected)
  /dashboard - Dashboard utama
  /penduduk - Data penduduk (Admin only)
  /chatbot - Chatbot AI
  /pengaduan - Sistem pengaduan
  /layanan - Formulir layanan (Warga)
  /status - Status layanan (Warga)
  /info-publik - Berita & anggaran
  /opd - Kelola OPD (Admin)
```

---

## Tech Stack
- **Frontend:** Next.js 16, React, TypeScript, Tailwind CSS
- **State Management:** Redux Toolkit, Redux Persist
- **AI:** OpenRouter API (GPT-4o-mini)
- **Data Service:** `src/lib/dataService.ts` - Dynamic RAG system
- **Mock Data:** Simulated API responses dengan delay

---

## AI Chatbot Integration

### Configuration
- **API:** OpenRouter (`https://openrouter.ai/api/v1/chat/completions`)
- **Model:** `openai/gpt-4o-mini` (gratis)
- **Environment:** `.env.local`
  ```
  OPENROUTER_API_KEY=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
  ```

### API Route
- **Endpoint:** `/api/chat`
- **Method:** POST
- **Body:** `{ messages: [{ role: 'user' | 'assistant', content: string }], maxHistory: number }`
- **Response:** `{ response: string }`

### Dynamic Context System (RAG)
Data di-oleh secara dynamic dari system dan di-convert ke markdown sebelum dikirim ke AI.

**Data Sources:**
| Source | File | Data Included |
|--------|------|----------------|
| `statistikData` | `src/data/dukcapil.ts` | Total penduduk, JK, KK, kelahiran, kematian, perpindahan |
| `kecamatanData` | `src/data/dukcapil.ts` | 25 kecamatan dengan jumlah penduduk |
| `pendudukData` | `src/data/dukcapil.ts` | 15 sample data penduduk |
| `pengaduanData` | `src/data/dukcapil.ts` | 6 pengaduan masyarakat |

**Data Service:** `src/lib/dataService.ts`
- `formatSystemContext()` - Convert semua data ke markdown format
- Include: Statistik, Kecamatan, Penduduk, Pengaduan, Program Kemiskinan, Layanan, APBD, OPD

**System Prompt:**
```
Anda adalah AI Assistant resmi Pemerintah Kabupaten Kebumen.
Nama Anda "Smart AI Kebumen".

[DATA CONTEXT DISINI - BERDASARKAN formatSystemContext()]

Guidelines:
1. Selalu jawab dalam Bahasa Indonesia yang sopan
2. Gunakan format markdown jika perlu (bold, list, dll)
3. Gunakan data di atas untuk menjawab pertanyaan user
4. Berikan analisis jika ditanya tentang data (tingkat kemiskinan, stunting, dll)
5. Jika ditanya data spesifik yang TIDAK ada di list, katakan bahwa data tersebut dapat dicek di dashboard resmi
6. Berikan informasi akurat tentang prosedur layanan pemerintah
```

### Chat History
- Max 20 messages terakhir disimpan sebagai context
- Conversation bertahan selama session (belum persistent)

---

## Catatan Development
- Demo MVP untuk presentation purposes
- Data menggunakan mock/static data dari `src/data/dukcapil.ts`
- AI Chatbot menggunakan OpenRouter GPT-4o-mini dengan Dynamic Context (RAG)
- OCR menggunakan simulasi di halaman layanan
- Chat history max 20 messages
- Real implementation akan memerlukan backend API dan database

---

## Estimasi Biaya (dari proposal)
| Komponen | Estimasi (Rp) |
|----------|---------------|
| Analisis & Perancangan | 50.000.000 |
| Pengembangan Aplikasi | 350.000.000 |
| Mobile App (React Native) | 180.000.000 |
| AI Model Training | 250.000.000 |
| Integrasi Sistem Eksisting | 100.000.000 |
| QA & Security Test | 50.000.000 |
| Pelatihan Operator | 30.000.000 |
| Pendampingan 6 Bulan | 60.000.000 |
| **TOTAL** | **1.070.000.000** |
