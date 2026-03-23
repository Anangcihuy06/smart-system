'use client';

import { useState } from 'react';
import { useAppSelector } from '@/store/hooks';

const opdData = [
  { id: 1, nama: 'Dinas Kesehatan', icon: '🏥', pengaduan: 23, proses: 12, selesai: 8, ditolak: 3, avgHari: 5 },
  { id: 2, nama: 'Dinas PU & PR', icon: '🏗️', pengaduan: 45, proses: 28, selesai: 15, ditolak: 2, avgHari: 8 },
  { id: 3, nama: 'Dinas LH', icon: '🌿', pengaduan: 18, proses: 9, selesai: 7, ditolak: 2, avgHari: 4 },
  { id: 4, nama: 'Disdukcapil', icon: '🪪', pengaduan: 67, proses: 35, selesai: 30, ditolak: 2, avgHari: 3 },
  { id: 5, nama: 'Dinas Sosial', icon: '🤝', pengaduan: 15, proses: 8, selesai: 5, ditolak: 2, avgHari: 6 },
  { id: 6, nama: 'Dispermades', icon: '🏛️', pengaduan: 12, proses: 6, selesai: 5, ditolak: 1, avgHari: 7 },
];

export default function OPDPage() {
  const { user } = useAppSelector((state) => state.auth);
  const [selectedOPD, setSelectedOPD] = useState<typeof opdData[0] | null>(null);

  const totalPengaduan = opdData.reduce((acc, opd) => acc + opd.pengaduan, 0);
  const totalProses = opdData.reduce((acc, opd) => acc + opd.proses, 0);
  const totalSelesai = opdData.reduce((acc, opd) => acc + opd.selesai, 0);
  const avgPenyelesaian = Math.round((totalSelesai / totalPengaduan) * 100);

  return (
    <div className="h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Kelola OPD</h1>
        <p className="text-gray-500 mt-1">Monitoring pengaduan dan kinerja Organisasi Perangkat Daerah</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-xl">📋</div>
            <div>
              <p className="text-sm text-gray-500">Total Pengaduan</p>
              <p className="text-2xl font-bold text-gray-900">{totalPengaduan}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center text-xl">⏳</div>
            <div>
              <p className="text-sm text-gray-500">Sedang Diproses</p>
              <p className="text-2xl font-bold text-gray-900">{totalProses}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-xl">✅</div>
            <div>
              <p className="text-sm text-gray-500">Selesai</p>
              <p className="text-2xl font-bold text-gray-900">{totalSelesai}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-xl">📊</div>
            <div>
              <p className="text-sm text-gray-500">% Penyelesaian</p>
              <p className="text-2xl font-bold text-gray-900">{avgPenyelesaian}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-semibold text-gray-900">Rekap Pengaduan per OPD</h2>
          <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 flex items-center gap-2">
            📥 Export Semua
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">OPD</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Total</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Diproses</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Selesai</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Ditolak</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Avg Hari</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {opdData.map((opd) => {
                const percent = Math.round((opd.selesai / opd.pengaduan) * 100);
                return (
                  <tr key={opd.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{opd.icon}</span>
                        <span className="font-medium text-gray-900">{opd.nama}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">{opd.pengaduan}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">{opd.proses}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">{opd.selesai}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-sm">{opd.ditolak}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-600">{opd.avgHari} hari</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => setSelectedOPD(opd)} className="px-3 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium hover:bg-blue-100">
                          Detail
                        </button>
                        <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium hover:bg-gray-200">
                          📄
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-3">Top Performers</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2"><span>🏆</span> Disdukcapil</span>
              <span className="text-green-600 font-medium">92%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2"><span>🥈</span> Dinas LH</span>
              <span className="text-green-600 font-medium">85%</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-3">Perlu Perbaikan</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2"><span>⚠️</span> Dinas PU & PR</span>
              <span className="text-yellow-600 font-medium">72%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2"><span>⚠️</span> Dispermades</span>
              <span className="text-yellow-600 font-medium">75%</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-3">Aksi Cepat</h3>
          <div className="space-y-2">
            <button className="w-full text-left px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100">
              🚨 Pengaduan Melebihi 7 Hari
            </button>
            <button className="w-full text-left px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm hover:bg-blue-100">
              📊 Generate Laporan Bulanan
            </button>
          </div>
        </div>
      </div>

      {selectedOPD && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedOPD.icon}</span>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedOPD.nama}</h3>
                  <p className="text-sm text-gray-500">Detail Kinerja OPD</p>
                </div>
              </div>
              <button onClick={() => setSelectedOPD(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-4 gap-4 text-center">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{selectedOPD.pengaduan}</p>
                  <p className="text-xs text-gray-500">Total</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-600">{selectedOPD.proses}</p>
                  <p className="text-xs text-gray-500">Proses</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{selectedOPD.selesai}</p>
                  <p className="text-xs text-gray-500">Selesai</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{selectedOPD.avgHari}d</p>
                  <p className="text-xs text-gray-500">Avg Hari</p>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Tingkat Penyelesaian</span>
                  <span className="text-sm font-medium text-gray-700">{Math.round((selectedOPD.selesai / selectedOPD.pengaduan) * 100)}%</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full" style={{ width: `${Math.round((selectedOPD.selesai / selectedOPD.pengaduan) * 100)}%` }}></div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100">
                  📋 Lihat Semua Pengaduan
                </button>
                <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
                  📊 Generate Laporan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
