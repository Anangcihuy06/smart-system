'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchPengaduan, submitPengaduan, updateStatus } from '@/store/slices/pengaduanSlice';
import { Pengaduan } from '@/types';

export default function PengaduanPage() {
  const dispatch = useAppDispatch();
  const { data, loading, submitting } = useAppSelector((state) => state.pengaduan);
  const { user } = useAppSelector((state) => state.auth);
  const [showForm, setShowForm] = useState(false);
  const [selectedPengaduan, setSelectedPengaduan] = useState<Pengaduan | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [formData, setFormData] = useState({
    judul: '',
    deskripsi: '',
    kategori: '',
    lokasi: '',
    pelapor: '',
    noTelp: '',
  });

  useEffect(() => {
    dispatch(fetchPengaduan());
  }, [dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(submitPengaduan(formData));
    setFormData({ judul: '', deskripsi: '', kategori: '', lokasi: '', pelapor: user?.name || '', noTelp: '' });
    setShowForm(false);
  };

  const handleStatusChange = (id: string, status: Pengaduan['status']) => {
    dispatch(updateStatus({ id, status }));
  };

  const filteredData = filterStatus === 'all' ? data : data.filter(p => p.status === filterStatus);

  const getStatusBadge = (status: Pengaduan['status']) => {
    const statusStyles: Record<Pengaduan['status'], { bg: string; text: string }> = {
      'Baru': { bg: 'bg-blue-100', text: 'text-blue-700' },
      'Diproses': { bg: 'bg-yellow-100', text: 'text-yellow-700' },
      'Selesai': { bg: 'bg-green-100', text: 'text-green-700' },
      'Ditolak': { bg: 'bg-red-100', text: 'text-red-700' },
    };
    return statusStyles[status];
  };

  const getKategoriColor = (kategori: string) => {
    const colors: Record<string, string> = {
      'PUPR': 'bg-orange-100 text-orange-700',
      'Perumda Air': 'bg-blue-100 text-blue-700',
      'Dinas LH': 'bg-green-100 text-green-700',
      'BKD': 'bg-purple-100 text-purple-700',
      'Dinkes': 'bg-red-100 text-red-700',
    };
    return colors[kategori] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pengaduan Masyarakat</h1>
          <p className="text-gray-500 mt-1">Total {filteredData.length} pengaduan</p>
        </div>
        {user?.role === 'warga' && (
          <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Pengaduan Baru
          </button>
        )}
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {['all', 'Baru', 'Diproses', 'Selesai', 'Ditolak'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === status
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {status === 'all' ? `Semua (${data.length})` : `${status} (${data.filter(p => p.status === status).length})`}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {['Baru', 'Diproses', 'Selesai', 'Ditolak'].map((status) => {
          const count = data.filter((p) => p.status === status).length;
          const colors = {
            'Baru': 'from-blue-500 to-blue-600',
            'Diproses': 'from-yellow-500 to-yellow-600',
            'Selesai': 'from-green-500 to-green-600',
            'Ditolak': 'from-red-500 to-red-600',
          };
          return (
            <div key={status} className={`bg-gradient-to-r ${colors[status as keyof typeof colors]} rounded-xl p-4 text-white`}>
              <p className="text-sm opacity-80">Pengaduan {status}</p>
              <p className="text-3xl font-bold mt-1">{count}</p>
            </div>
          );
        })}
      </div>

      <div className="space-y-4">
        {filteredData.map((pengaduan) => {
          const statusStyle = getStatusBadge(pengaduan.status);
          return (
            <div key={pengaduan.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-sm text-gray-500">#{pengaduan.id}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getKategoriColor(pengaduan.kategori)}`}>{pengaduan.kategori}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>{pengaduan.status}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">{pengaduan.judul}</h3>
                  <p className="text-sm text-gray-500 mb-3">{pengaduan.deskripsi}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                    <span className="flex items-center gap-1">👤 {pengaduan.pelapor}</span>
                    <span className="flex items-center gap-1">📍 {pengaduan.lokasi}</span>
                    <span className="flex items-center gap-1">📅 {pengaduan.tanggal}</span>
                    <span className="flex items-center gap-1">📞 {pengaduan.noTelp}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <button onClick={() => setSelectedPengaduan(pengaduan)} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors whitespace-nowrap">
                    Detail
                  </button>
                  {(user?.role === 'admin' || user?.role === 'opd') && (
                    <>
                      <button onClick={() => handleStatusChange(pengaduan.id, 'Diproses')} disabled={pengaduan.status === 'Diproses'} className="px-3 py-1 bg-yellow-50 text-yellow-600 rounded text-xs font-medium hover:bg-yellow-100 disabled:opacity-50">
                        ⚡ Proses
                      </button>
                      <button onClick={() => handleStatusChange(pengaduan.id, 'Selesai')} disabled={pengaduan.status === 'Selesai'} className="px-3 py-1 bg-green-50 text-green-600 rounded text-xs font-medium hover:bg-green-100 disabled:opacity-50">
                        ✅ Selesai
                      </button>
                    </>
                  )}
                </div>
              </div>
              {(user?.role === 'admin' || user?.role === 'opd') && (
                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <select
                    value={pengaduan.status}
                    onChange={(e) => handleStatusChange(pengaduan.id, e.target.value as Pengaduan['status'])}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Baru">Ubah Status: Baru</option>
                    <option value="Diproses">Ubah Status: Diproses</option>
                    <option value="Selesai">Ubah Status: Selesai</option>
                    <option value="Ditolak">Ubah Status: Ditolak</option>
                  </select>
                  <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 flex items-center gap-1">
                    📤 Kirim Notifikasi
                  </button>
                  <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 flex items-center gap-1">
                    📄 Export
                  </button>
                  <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 flex items-center gap-1">
                    📍 Maps
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Pengaduan Baru</h3>
                <p className="text-sm text-gray-500">Laporkan masalah Anda</p>
              </div>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pelapor</label>
                  <input type="text" required value={formData.pelapor || user?.name || ''} onChange={(e) => setFormData({ ...formData, pelapor: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">No. Telepon</label>
                  <input type="tel" required value={formData.noTelp} onChange={(e) => setFormData({ ...formData, noTelp: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="08xxxxxxxxxx" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul Pengaduan</label>
                <input type="text" required value={formData.judul} onChange={(e) => setFormData({ ...formData, judul: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ringkasan masalah" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                  <select required value={formData.kategori} onChange={(e) => setFormData({ ...formData, kategori: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Pilih</option>
                    <option value="PUPR">PUPR</option>
                    <option value="Perumda Air">Perumda Air</option>
                    <option value="Dinas LH">Dinas LH</option>
                    <option value="BKD">BKD</option>
                    <option value="Dinkes">Dinkes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
                  <input type="text" required value={formData.lokasi} onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea required rows={4} value={formData.deskripsi} onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Jelaskan masalah secara detail..." />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50">Batal</button>
                <button type="submit" disabled={submitting} className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50">
                  {submitting ? 'Mengirim...' : 'Kirim Pengaduan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedPengaduan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-start sticky top-0 bg-white">
              <div>
                <span className="font-mono text-sm text-gray-500">ID: #{selectedPengaduan.id}</span>
                <h3 className="text-xl font-semibold text-gray-900 mt-1">{selectedPengaduan.judul}</h3>
              </div>
              <button onClick={() => setSelectedPengaduan(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Kategori</label>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getKategoriColor(selectedPengaduan.kategori)}`}>{selectedPengaduan.kategori}</span>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Status</label>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(selectedPengaduan.status).bg} ${getStatusBadge(selectedPengaduan.status).text}`}>{selectedPengaduan.status}</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Deskripsi</label>
                <p className="text-gray-900">{selectedPengaduan.deskripsi}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Lokasi</label>
                <p className="text-gray-900">{selectedPengaduan.lokasi}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Pelapor</label>
                  <p className="text-gray-900">{selectedPengaduan.pelapor}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-1">No. Telepon</label>
                  <p className="text-gray-900">{selectedPengaduan.noTelp}</p>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Tanggal</label>
                <p className="text-gray-900">{selectedPengaduan.tanggal}</p>
              </div>
              {(user?.role === 'admin' || user?.role === 'opd') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Update Status</label>
                  <div className="flex flex-wrap gap-2">
                    {(['Baru', 'Diproses', 'Selesai', 'Ditolak'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => { handleStatusChange(selectedPengaduan.id, status); setSelectedPengaduan({ ...selectedPengaduan, status }); }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedPengaduan.status === status ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium">📤 Kirim Notifikasi WA</button>
                    <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">📄 Generate Laporan</button>
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end">
              <button onClick={() => setSelectedPengaduan(null)} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
