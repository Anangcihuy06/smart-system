import { statistikData, kecamatanData, pendudukData, pengaduanData } from '@/data/dukcapil';

export interface DataContext {
  statistik: typeof statistikData;
  kecamatan: typeof kecamatanData;
  penduduk: typeof pendudukData;
  pengaduan: typeof pengaduanData;
}

export async function getSystemData(): Promise<DataContext> {
  return {
    statistik: statistikData,
    kecamatan: kecamatanData,
    penduduk: pendudukData,
    pengaduan: pengaduanData,
  };
}

function formatStatistik() {
  const s = statistikData;
  return `
## 📊 STATISTIK KEPENDUDUKAN KABUPATEN KEBUMEN
- **Total Penduduk:** ${s.totalPenduduk.toLocaleString('id-ID')} jiwa
- **Laki-laki:** ${s.lakiLaki.toLocaleString('id-ID')} (${((s.lakiLaki / s.totalPenduduk) * 100).toFixed(1)}%)
- **Perempuan:** ${s.perempuan.toLocaleString('id-ID')} (${((s.perempuan / s.totalPenduduk) * 100).toFixed(1)}%)
- **Total KK (Kartu Keluarga):** ${s.kk.toLocaleString('id-ID')}
- **Kelahiran bulan ini:** ${s.kelahiran.toLocaleString('id-ID')}
- **Kematian bulan ini:** ${s.kematian.toLocaleString('id-ID')}
- **Perpindahan bulan ini:** ${s.perpindahan.toLocaleString('id-ID')}
`;
}

function formatKecamatan() {
  const sorted = [...kecamatanData].sort((a, b) => b.jumlahPenduduk - a.jumlahPenduduk);
  const top10 = sorted.slice(0, 10);
  
  return `
## 🏘️ DATA KECAMATAN (Top 10 Jumlah Penduduk)
${top10.map((k, i) => `${i + 1}. **${k.nama}:** ${k.jumlahPenduduk.toLocaleString('id-ID')} jiwa`).join('\n')}

**Total Kecamatan:** ${kecamatanData.length}
`;
}

function formatPenduduk() {
  const summary = {
    total: pendudukData.length,
    laki: pendudukData.filter(p => p.jenisKelamin === 'Laki-laki').length,
    perempuan: pendudukData.filter(p => p.jenisKelamin === 'Perempuan').length,
    kawin: pendudukData.filter(p => p.status === 'Kawin').length,
    belumKawin: pendudukData.filter(p => p.status === 'Belum Kawin').length,
    cerai: pendudukData.filter(p => p.status.includes('Cerai')).length,
    pns: pendudukData.filter(p => p.pekerjaan === 'PNS').length,
    petani: pendudukData.filter(p => p.pekerjaan === 'Petani').length,
    wiraswasta: pendudukData.filter(p => p.pekerjaan === 'Wiraswasta').length,
    guru: pendudukData.filter(p => p.pekerjaan === 'Guru').length,
  };

  return `
## 👥 SAMPEL DATA PENDUDUK (${pendudukData.length} Record)
- **Total Sample:** ${pendudukData.length} jiwa
- **Laki-laki:** ${summary.laki} | **Perempuan:** ${summary.perempuan}
- **Status Perkawinan:**
  - Kawin: ${summary.kawin}
  - Belum Kawin: ${summary.belumKawin}
  - Cerai: ${summary.cerai}
- **Pekerjaan:**
  - PNS: ${summary.pns}
  - Petani: ${summary.petani}
  - Wiraswasta: ${summary.wiraswasta}
  - Guru: ${summary.guru}

**Data Penduduk Terbaru:**
${pendudukData.slice(0, 5).map((p, i) => `
${i + 1}. ${p.nama} (${p.nik})
   - Jenis Kelamin: ${p.jenisKelamin}
   - Alamat: ${p.alamat}, ${p.desa}, Kec. ${p.kecamatan}
   - Pekerjaan: ${p.pekerjaan}
   - Status: ${p.status}`).join('')}
`;
}

function formatPengaduan() {
  const summary = {
    total: pengaduanData.length,
    baru: pengaduanData.filter(p => p.status === 'Baru').length,
    proses: pengaduanData.filter(p => p.status === 'Diproses').length,
    selesai: pengaduanData.filter(p => p.status === 'Selesai').length,
    ditolak: pengaduanData.filter(p => p.status === 'Ditolak').length,
    pupr: pengaduanData.filter(p => p.kategori === 'PUPR').length,
    dinkes: pengaduanData.filter(p => p.kategori === 'Dinkes').length,
    dlh: pengaduanData.filter(p => p.kategori === 'Dinas LH').length,
    perumda: pengaduanData.filter(p => p.kategori === 'Perumda Air').length,
    bkd: pengaduanData.filter(p => p.kategori === 'BKD').length,
  };

  return `
## 📢 DATA PENGADUAN MASYARAKAT
- **Total Pengaduan:** ${summary.total}
- **Status:**
  - Baru: ${summary.baru}
  - Diproses: ${summary.proses}
  - Selesai: ${summary.selesai}
  - Ditolak: ${summary.ditolak}
- **Berdasarkan OPD:**
  - PUPR: ${summary.pupr}
  - Dinkes: ${summary.dinkes}
  - Dinas LH: ${summary.dlh}
  - Perumda Air: ${summary.perumda}
  - BKD: ${summary.bkd}

**Detail Pengaduan:**
${pengaduanData.map((p, i) => `
${i + 1}. **${p.judul}**
   - Kategori: ${p.kategori}
   - Status: ${p.status}
   - Lokasi: ${p.lokasi}
   - Tanggal: ${p.tanggal}
   - Pelapor: ${p.pelapor}`).join('')}
`;
}

function formatProgram() {
  return `
## 💰 PROGRAM PENANGANAN KEMISKINAN & KESEHATAN
- **Program Keluarga Harapan (PKH):**
  - Aktif di 12 desa
  - 2.500 keluarga penerima manfaat
  - Setiap bulan memberikan bantuan uang untuk keluarga kurang mampu

- **Bantuan Langsung Tunai (BLT):**
  - Diberikan setiap bulan kepada keluarga yang membutuhkan
  - Diprioritaskan untuk warga di daerah tertinggal

- **Program Stunting:**
  - Prevalensi stunting rata-rata: 12.5%
  - 5 desa di Kec. Prembun memerlukan intervensi program
  - Program intervensi: Pemberian Makanan Tambah (PMT) untuk balita

- **Program Layanan Kesehatan:**
  - Mobile layanan di 5 kecamatan sulit dijangkau
  - Klinik kesehatan tersedia di setiap kecamatan
`;
}

function formatLayanan() {
  return `
## 📋 LAYANAN DUKCAPIL TERSEDIA
1. **KTP (Kartu Tanda Penduduk)**
   - Proses: 14 hari kerja
   - Gratis untuk pembuatan baru

2. **KK (Kartu Keluarga)**
   - Proses: 7 hari kerja
   - Gratis

3. **Akta Kelahiran**
   - Proses: 30 hari kerja
   - Batas waktu: 60 hari sejak kelahiran

4. **Akta Kematian**
   - Proses: 7 hari kerja

5. **Surat Pindah**
   - Proses: 7 hari kerja
   - Jenis: Dalam kecamatan, antar kecamatan, antar kabupaten

6. **Izin Usaha**
   - Proses: 30 hari kerja

**Lokasi Kantor:**
- Kantor Utama DUKCAPIL: Jl. Veteran No. 1, Kebumen
- Mobile layanan: Prembun, Kutowinangun, Rowokele, Buluspesantren, Puring
`;
}

function formatApbd() {
  return `
## 💵 ANGGARAN APBDesA PRIORITAS
- Infrastruktur jalan: 35%
- Pendidikan: 25%
- Kesehatan: 20%
- Perlindungan Sosial: 15%
- Lainnya: 5%
`;
}

function formatOPD() {
  return `
## 🏛️ ORGANISASI PERANGKAT DAERAH (OPD)
| OPD | Layanan |
|-----|---------|
| DUKCAPIL | Kependudukan dan pencatatan sipil |
| DISDUKCAPIL | Dinas Kependudukan dan Pencatatan Sipil |
| DINKES | Dinas Kesehatan |
| DISDIKBUD | Dinas Pendidikan dan Budaya |
| DINAS SOSIAL | Perlindungan dan jaminan sosial |
| BAPPEDA | Perencanaan pembangunan |
| DISPERINDAG | Perindustrian dan perdagangan |
| DINAS PUPR | Pekerjaan umum dan penataan ruang |
| DINAS LH | Lingkungan Hidup |
| PERUMDA AIR | Perusahaan daerah air |
| BKD | Badan Kepegawaian Daerah |
`;
}

export function formatSystemContext(): string {
  return `# Smart System Kebumen - Ringkasan Data Sistem

Berikut adalah data lengkap dari Sistem Smart Kebumen yang dapat Anda gunakan untuk menjawab pertanyaan user:

${formatStatistik()}
${formatKecamatan()}
${formatPenduduk()}
${formatPengaduan()}
${formatProgram()}
${formatLayanan()}
${formatApbd()}
${formatOPD()}

---
**CATATAN PENTING:**
- Gunakan data di atas untuk menjawab pertanyaan user
- Jika ada pertanyaan tentang analisis, berikan insight berdasarkan data yang tersedia
- Jika ditanya data spesifik yang TIDAK ada di list, katakan bahwa data tersebut dapat dicek di dashboard resmi
- Jawab dalam Bahasa Indonesia yang sopan dan informatif`;
}
