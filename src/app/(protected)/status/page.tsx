'use client';

import { useAppSelector } from '@/store/hooks';

interface StatusItem {
  id: string;
  jenis: string;
  nomor: string;
  tanggal: string;
  status: 'menunggu' | 'diproses' | 'selesai' | 'ditolak';
  estimasi?: string;
  catatan?: string;
}

const mockStatusData: StatusItem[] = [
  {
    id: '1',
    jenis: 'KTP (Kartu Tanda Penduduk)',
    nomor: 'REG-2026031501',
    tanggal: '15 Mar 2026',
    status: 'diproses',
    estimasi: '7 hari lagi',
  },
  {
    id: '2',
    jenis: 'KK (Kartu Keluarga)',
    nomor: 'REG-2026030802',
    tanggal: '8 Mar 2026',
    status: 'selesai',
    estimasi: 'Siap diambil',
    catatan: 'Silakan datang ke Kantor DUKCAPIL dengan membawa FC KTP',
  },
  {
    id: '3',
    jenis: 'Akta Kelahiran',
    nomor: 'REG-2026022803',
    tanggal: '28 Feb 2026',
    status: 'ditolak',
    estimasi: 'Ditolak',
    catatan: 'Dokumen tidak lengkap - perlu upload FC Akta Kelahiran dari RS',
  },
];

const statusConfig = {
  menunggu: { label: 'Menunggu', color: 'bg-yellow-100 text-yellow-700', icon: '⏳' },
  diproses: { label: 'Sedang Diproses', color: 'bg-blue-100 text-blue-700', icon: '⚙️' },
  selesai: { label: 'Selesai', color: 'bg-green-100 text-green-700', icon: '✅' },
  ditolak: { label: 'Ditolak', color: 'bg-red-100 text-red-700', icon: '❌' },
};

const progressSteps = [
  { label: 'Pengajuan', done: true },
  { label: 'Verifikasi', done: true },
  { label: 'Validasi', done: true },
  { label: 'Pencetakan', done: false },
  { label: 'Selesai', done: false },
];

export default function StatusPage() {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Status Layanan</h1>
        <p className="text-gray-500 mt-1">Pantau status pengajuan layanan Anda</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">{user?.name}</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {mockStatusData.map((item) => {
          const status = statusConfig[item.status];
          return (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">{item.nomor}</p>
                    <h3 className="font-semibold text-gray-900">{item.jenis}</h3>
                    <p className="text-sm text-gray-500 mt-1">Diajukan: {item.tanggal}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                    {status.icon} {status.label}
                  </span>
                </div>

                {item.status !== 'ditolak' && (
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      {progressSteps.map((step, idx) => (
                        <div key={idx} className="flex flex-col items-center flex-1">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium mb-1 ${
                              step.done
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-200 text-gray-500'
                            }`}
                          >
                            {step.done ? '✓' : idx + 1}
                          </div>
                          <span className="text-xs text-gray-500 text-center">{step.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {item.catatan && (
                  <div className={`p-4 rounded-lg ${
                    item.status === 'ditolak' ? 'bg-red-50' : 'bg-blue-50'
                  }`}>
                    <p className="text-sm font-medium text-gray-700 mb-1">Catatan:</p>
                    <p className={`text-sm ${item.status === 'ditolak' ? 'text-red-700' : 'text-blue-700'}`}>
                      {item.catatan}
                    </p>
                  </div>
                )}

                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Estimasi: <strong>{item.estimasi}</strong>
                  </span>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Lihat Detail →
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h3 className="font-semibold mb-2">Butuh Bantuan?</h3>
        <p className="text-sm text-white/80 mb-4">
          Hubungi kami jika ada pertanyaan tentang status pengajuan Anda
        </p>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors">
            📞 Telepon
          </button>
          <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors">
            💬 WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
