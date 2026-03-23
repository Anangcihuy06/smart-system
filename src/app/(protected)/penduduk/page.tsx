'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchPenduduk, setSearchTerm, setSelectedKecamatan, setSelectedStatus, clearFilters } from '@/store/slices/pendudukSlice';
import { kecamatanData } from '@/data/dukcapil';

export default function PendudukPage() {
  const dispatch = useAppDispatch();
  const { filteredData, loading, searchTerm, selectedKecamatan, selectedStatus } = useAppSelector((state) => state.penduduk);
  const [selectedPenduduk, setSelectedPenduduk] = useState<typeof filteredData[0] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(fetchPenduduk());
  }, [dispatch]);

  const handleSearch = (value: string) => {
    dispatch(setSearchTerm(value));
    setCurrentPage(1);
  };

  const handleKecamatanChange = (value: string) => {
    dispatch(setSelectedKecamatan(value));
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    dispatch(setSelectedStatus(value));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const getStatusBadge = (status: string) => {
    const statusStyles: Record<string, { bg: string; text: string }> = {
      'Kawin': { bg: 'bg-green-100', text: 'text-green-700' },
      'Belum Kawin': { bg: 'bg-blue-100', text: 'text-blue-700' },
      'Cerai Hidup': { bg: 'bg-orange-100', text: 'text-orange-700' },
      'Cerai Mati': { bg: 'bg-red-100', text: 'text-red-700' },
    };
    const style = statusStyles[status] || { bg: 'bg-gray-100', text: 'text-gray-700' };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>{status}</span>;
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="h-full">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Data Penduduk</h2>
            <p className="text-sm text-gray-500">Total {filteredData.length.toLocaleString('id-ID')} penduduk</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <input type="text" placeholder="Cari NIK atau Nama..." value={searchTerm} onChange={(e) => handleSearch(e.target.value)} className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-56" />
              <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <select value={selectedKecamatan} onChange={(e) => handleKecamatanChange(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Semua Kecamatan</option>
              {kecamatanData.map((kec) => <option key={kec.id} value={kec.nama}>{kec.nama}</option>)}
            </select>
            <select value={selectedStatus} onChange={(e) => handleStatusChange(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Semua Status</option>
              <option value="Kawin">Kawin</option>
              <option value="Belum Kawin">Belum Kawin</option>
              <option value="Cerai Hidup">Cerai Hidup</option>
              <option value="Cerai Mati">Cerai Mati</option>
            </select>
            {(searchTerm || selectedKecamatan || selectedStatus) && (
              <button onClick={handleClearFilters} className="px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">Reset</button>
            )}
            <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 flex items-center gap-2">
              📥 Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">NIK</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Nama</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">TTL</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">JK</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Kecamatan</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentItems.map((penduduk) => (
                <tr key={penduduk.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3"><span className="font-mono text-sm text-gray-900">{penduduk.nik}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">{penduduk.nama.charAt(0)}</div>
                      <span className="font-medium text-gray-900">{penduduk.nama}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{penduduk.tempatLahir}, {formatDate(penduduk.tanggalLahir)}</td>
                  <td className="px-4 py-3"><span className={`text-sm ${penduduk.jenisKelamin === 'Laki-laki' ? 'text-blue-600' : 'text-purple-600'}`}>{penduduk.jenisKelamin}</span></td>
                  <td className="px-4 py-3 text-sm text-gray-600">{penduduk.kecamatan}</td>
                  <td className="px-4 py-3">{getStatusBadge(penduduk.status)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => setSelectedPenduduk(penduduk)} className="px-3 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium hover:bg-blue-100">Detail</button>
                      <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium hover:bg-gray-200">🖨️</button>
                      <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium hover:bg-gray-200">✏️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">Menampilkan {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredData.length)} dari {filteredData.length} data</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">←</button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
              <button key={page} onClick={() => setCurrentPage(page)} className={`px-3 py-1 rounded-lg text-sm font-medium ${currentPage === page ? 'bg-blue-600 text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'}`}>{page}</button>
            ))}
            {totalPages > 5 && <span className="text-gray-500">...</span>}
            <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">→</button>
          </div>
        </div>
      </div>

      {selectedPenduduk && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Detail Penduduk</h3>
                <p className="text-sm text-gray-500">NIK: {selectedPenduduk.nik}</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100">🖨️ Cetak</button>
                <button className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-200">✏️ Edit</button>
                <button onClick={() => setSelectedPenduduk(null)} className="p-1.5 hover:bg-gray-100 rounded-lg"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-semibold">{selectedPenduduk.nama.charAt(0)}</div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">{selectedPenduduk.nama}</h4>
                  <p className="text-gray-500">{selectedPenduduk.pekerjaan}</p>
                  {getStatusBadge(selectedPenduduk.status)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white border border-gray-100 rounded-lg">
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-1">NIK</label>
                  <p className="text-gray-900 font-mono text-sm">{selectedPenduduk.nik}</p>
                </div>
                <div className="p-3 bg-white border border-gray-100 rounded-lg">
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Jenis Kelamin</label>
                  <p className="text-gray-900 text-sm">{selectedPenduduk.jenisKelamin}</p>
                </div>
                <div className="p-3 bg-white border border-gray-100 rounded-lg">
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Tempat Lahir</label>
                  <p className="text-gray-900 text-sm">{selectedPenduduk.tempatLahir}</p>
                </div>
                <div className="p-3 bg-white border border-gray-100 rounded-lg">
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Tanggal Lahir</label>
                  <p className="text-gray-900 text-sm">{formatDate(selectedPenduduk.tanggalLahir)}</p>
                </div>
                <div className="p-3 bg-white border border-gray-100 rounded-lg">
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Agama</label>
                  <p className="text-gray-900 text-sm">{selectedPenduduk.agama}</p>
                </div>
                <div className="p-3 bg-white border border-gray-100 rounded-lg">
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Pendidikan</label>
                  <p className="text-gray-900 text-sm">{selectedPenduduk.pendidikan}</p>
                </div>
              </div>

              <div className="p-3 bg-white border border-gray-100 rounded-lg">
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Alamat Lengkap</label>
                <p className="text-gray-900 text-sm">{selectedPenduduk.alamat}, RT {selectedPenduduk.rt} RW {selectedPenduduk.rw}, Desa {selectedPenduduk.desa}, Kec. {selectedPenduduk.kecamatan}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white border border-gray-100 rounded-lg">
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Nama Ayah</label>
                  <p className="text-gray-900 text-sm">{selectedPenduduk.namaAyah}</p>
                </div>
                <div className="p-3 bg-white border border-gray-100 rounded-lg">
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Nama Ibu</label>
                  <p className="text-gray-900 text-sm">{selectedPenduduk.namaIbu}</p>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end gap-2 sticky bottom-0 bg-white">
              <button onClick={() => setSelectedPenduduk(null)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Tutup</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">📥 Download PDF</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
