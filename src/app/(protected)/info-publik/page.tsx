'use client';

import { useState } from 'react';

const beritaData = [
  {
    id: 1,
    judul: 'Pelayanan DUKCAPIL Mobile di 5 Kecamatan',
    kategori: 'Pelayanan',
    tanggal: '20 Mar 2026',
    excerpt: 'DUKCAPIL Kebumen akan melayani pembuatan KTP dan KK di 5 kecamatan tertinggal.',
    isi: 'DUKCAPIL Kebumen membuka pelayanan mobile di 5 kecamatan yang sulit dijangkau. Masyarakat dapat mengurus dokumen kependudukan langsung di lokasi.',
    pembaca: 1250,
  },
  {
    id: 2,
    judul: 'Realisasi PAD 2025 Capai 98%',
    kategori: 'Keuangan',
    tanggal: '18 Mar 2026',
    excerpt: 'Pendapatan Asli Daerah Kabupaten Kebumen terealisasi 98% dari target.',
    isi: 'Pemkab Kebumen berhasil merealisasikan PAD sebesar Rp 892 miliar atau 98% dari target Rp 910 miliar. Pencapaian ini melampaui tahun sebelumnya.',
    pembaca: 890,
  },
  {
    id: 3,
    judul: 'Program Keluarga Harapan Berhasil Turunkan Kemiskinan',
    kategori: 'Sosial',
    tanggal: '15 Mar 2026',
    excerpt: 'Program bantuan sosial berhasil menurunkan angka kemiskinan di 12 desa.',
    isi: 'Program Keluarga Harapan dan Bantuan Langsung Tunai berhasil menurunkan jumlah penduduk miskin di 12 desa dengan total 2.500 keluarga penerima manfaat.',
    pembaca: 2100,
  },
  {
    id: 4,
    judul: 'Infrastruktur Jalan 2025: 75% Sudah Selesai',
    kategori: 'Pembangunan',
    tanggal: '12 Mar 2026',
    excerpt: 'Pembangunan jalan desa dan rehabilitasi jembatan mencapai 75% dari target.',
    isi: 'Total 125 km jalan desa telah diaspal dan 15 jembatan direhabilitasi. Target selesai akhir tahun 2026.',
    pembaca: 1560,
  },
];

const layananData = [
  {
    id: 1,
    nama: 'DUKCAPIL',
    icon: '🪪',
    deskripsi: 'Kartu Tanda Penduduk, Kartu Keluarga, Akta Pencatatan Sipil',
    jamPelayanan: 'Senin - Jumat, 08.00 - 15.00 WIB',
    lokasi: 'Jl. Pemuda No. 45, Kebumen',
    kontak: '(0287) 381234',
  },
  {
    id: 2,
    nama: 'Dinas Kesehatan',
    icon: '🏥',
    deskripsi: 'Pelayanan kesehatan, program imunisasi, posyandu',
    jamPelayanan: 'Senin - Jumat, 07.30 - 14.30 WIB',
    lokasi: 'Jl. Stadion No. 12, Kebumen',
    kontak: '(0287) 421567',
  },
  {
    id: 3,
    nama: 'Dinas PU & PR',
    icon: '🏗️',
    deskripsi: 'Izin mendirikan bangunan, pengelolaan jalan & jembatan',
    jamPelayanan: 'Senin - Jumat, 08.00 - 16.00 WIB',
    lokasi: 'Jl. Selomanik No. 8, Kebumen',
    kontak: '(0287) 381890',
  },
  {
    id: 4,
    nama: 'Dinas Sosial',
    icon: '🤝',
    deskripsi: 'Bantuan sosial, perlindungan anak, rehabilitasi',
    jamPelayanan: 'Senin - Jumat, 08.00 - 15.00 WIB',
    lokasi: 'Jl. Kemukus No. 22, Kebumen',
    kontak: '(0287) 385432',
  },
  {
    id: 5,
    nama: 'Dispermades',
    icon: '🏛️',
    deskripsi: 'Pelayanan desa, BUMDes, konsultasi pemerintah desa',
    jamPelayanan: 'Senin - Jumat, 08.00 - 15.00 WIB',
    lokasi: 'Jl. Jend. Sudirman No. 55, Kebumen',
    kontak: '(0287) 381765',
  },
];

const anggaranData = [
  { sektor: 'Pendidikan', total: 450000000000, realized: 380000000000, icon: '📚' },
  { sektor: 'Kesehatan', total: 320000000000, realized: 290000000000, icon: '💊' },
  { sektor: 'Pembangunan Jalan', total: 280000000000, realized: 210000000000, icon: '🛣️' },
  { sektor: 'Sosial & Perlindungan', total: 180000000000, realized: 150000000000, icon: '🤝' },
  { sektor: 'Administrasi', total: 120000000000, realized: 100000000000, icon: '📋' },
];

const formatRupiah = (num: number) => {
  if (num >= 1e12) return `Rp ${(num / 1e12).toFixed(1)} T`;
  if (num >= 1e9) return `Rp ${(num / 1e9).toFixed(1)} M`;
  return `Rp ${num.toLocaleString('id-ID')}`;
};

export default function InfoPublikPage() {
  const [activeTab, setActiveTab] = useState<'berita' | 'layanan' | 'anggaran'>('berita');
  const [selectedBerita, setSelectedBerita] = useState<typeof beritaData[0] | null>(null);

  return (
    <div className="h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Info Publik</h1>
        <p className="text-gray-500 mt-1">Transparansi informasi dan anggaran Kabupaten Kebumen</p>
      </div>

      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setActiveTab('berita')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'berita'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          📰 Berita
        </button>
        <button
          onClick={() => setActiveTab('layanan')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'layanan'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          🏢 Layanan OPD
        </button>
        <button
          onClick={() => setActiveTab('anggaran')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'anggaran'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          💰 Anggaran
        </button>
      </div>

      {activeTab === 'berita' ? (
        <div className="space-y-4">
          {beritaData.map((berita) => (
            <div 
              key={berita.id} 
              onClick={() => setSelectedBerita(berita)}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex justify-between items-start mb-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  berita.kategori === 'Pelayanan' ? 'bg-blue-100 text-blue-700' :
                  berita.kategori === 'Keuangan' ? 'bg-green-100 text-green-700' :
                  berita.kategori === 'Sosial' ? 'bg-purple-100 text-purple-700' :
                  'bg-orange-100 text-orange-700'
                }`}>
                  {berita.kategori}
                </span>
                <span className="text-sm text-gray-500">{berita.tanggal}</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{berita.judul}</h3>
              <p className="text-sm text-gray-500 mb-4">{berita.excerpt}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">👁 {berita.pembaca} pembaca</span>
                <span className="text-blue-600 text-sm font-medium">Baca Selengkapnya →</span>
              </div>
            </div>
          ))}
        </div>
      ) : activeTab === 'layanan' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {layananData.map((layanan) => (
            <div key={layanan.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl">
                  {layanan.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{layanan.nama}</h3>
                  <p className="text-sm text-gray-500 mb-3">{layanan.deskripsi}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <span>🕐</span>
                      <span>{layanan.jamPelayanan}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <span>📍</span>
                      <span>{layanan.lokasi}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <span>📞</span>
                      <span>{layanan.kontak}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                <button className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                  📝 Ajukan Online
                </button>
                <button className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                  🗺️ Lihat Maps
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Realisasi Anggaran 2025</h2>
            <p className="text-sm text-gray-500">Data per bulan Maret 2026</p>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {anggaranData.map((item) => {
                const percent = Math.round((item.realized / item.total) * 100);
                return (
                  <div key={item.sektor}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 flex items-center gap-2">
                        <span>{item.icon}</span> {item.sektor}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatRupiah(item.realized)} / {formatRupiah(item.total)}
                      </span>
                    </div>
                    <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-end pr-2"
                        style={{ width: `${percent}%` }}
                      >
                        <span className="text-xs text-white font-medium">{percent}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xl">📊</span>
                  </div>
                  <div>
                    <p className="font-medium text-blue-900">Total Realisasi</p>
                    <p className="text-xl font-bold text-blue-600">Rp 1.13 T</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-xl">✅</span>
                  </div>
                  <div>
                    <p className="font-medium text-green-900">Target</p>
                    <p className="text-xl font-bold text-green-600">Rp 1.45 T</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-xl">📈</span>
                  </div>
                  <div>
                    <p className="font-medium text-purple-900">% Capaian</p>
                    <p className="text-xl font-bold text-purple-600">78%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">📄 Download Laporan</h4>
              <div className="flex gap-2 flex-wrap">
                <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
                  📥 Laporan APBDes 2025
                </button>
                <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
                  📥 Realisasi Bulanan
                </button>
                <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
                  📥 Ringkasan Anggaran
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedBerita && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedBerita(null)}>
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex justify-between items-start sticky top-0 bg-white">
              <div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedBerita.kategori === 'Pelayanan' ? 'bg-blue-100 text-blue-700' :
                  selectedBerita.kategori === 'Keuangan' ? 'bg-green-100 text-green-700' :
                  selectedBerita.kategori === 'Sosial' ? 'bg-purple-100 text-purple-700' :
                  'bg-orange-100 text-orange-700'
                }`}>
                  {selectedBerita.kategori}
                </span>
              </div>
              <button onClick={() => setSelectedBerita(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-500 mb-2">{selectedBerita.tanggal} • 👁 {selectedBerita.pembaca} pembaca</p>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedBerita.judul}</h2>
              <p className="text-gray-700 leading-relaxed">{selectedBerita.isi}</p>
              <div className="mt-6 flex gap-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                  📤 Bagikan
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
                  🔖 Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
