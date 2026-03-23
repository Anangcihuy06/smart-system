'use client';

import { useState, useCallback } from 'react';
import { useAppSelector } from '@/store/hooks';
import { useAppDispatch } from '@/store/hooks';
import { addToast } from '@/store/slices/toastSlice';

interface FormData {
  jenisLayanan: string;
  nama: string;
  nik: string;
  noTelp: string;
  alamat: string;
  kecamatan: string;
  deskripsi: string;
}

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  status: 'uploading' | 'scanning' | 'verified' | 'error';
}

const layananOptions = [
  { value: 'ktp', label: 'KTP (Kartu Tanda Penduduk)', icon: '🪪' },
  { value: 'kk', label: 'KK (Kartu Keluarga)', icon: '📋' },
  { value: 'akta_lahir', label: 'Akta Kelahiran', icon: '📜' },
  { value: 'akta_kematian', label: 'Akta Kematian', icon: '📝' },
  { value: 'pindah', label: 'Surat Pindah', icon: '🔄' },
  { value: 'akta_nikah', label: 'Akta Nikah', icon: '💍' },
];

export default function LayananPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [formData, setFormData] = useState<FormData>({
    jenisLayanan: '',
    nama: user?.name || '',
    nik: '',
    noTelp: '',
    alamat: '',
    kecamatan: '',
    deskripsi: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [ocrResults, setOcrResults] = useState<Record<string, { nama: string; nik: string; alamat: string; status: string }>>({});

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const fileId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      
      const newFile: UploadedFile = {
        id: fileId,
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        type: file.type,
        status: 'uploading',
      };

      setUploadedFiles((prev) => [...prev, newFile]);

      setTimeout(() => {
        setUploadedFiles((prev) =>
          prev.map((f) => (f.id === fileId ? { ...f, status: 'scanning' } : f))
        );

        setTimeout(() => {
          const mockOcrResult = {
            nama: 'Ahmad Wijaya',
            nik: '3309012301010001',
            alamat: 'Jl. Ahmad Yani No. 10',
            status: 'Tervalidasi ✓',
          };
          
          setUploadedFiles((prev) =>
            prev.map((f) => (f.id === fileId ? { ...f, status: 'verified' } : f))
          );
          setOcrResults((prev) => ({ ...prev, [fileId]: mockOcrResult }));

          dispatch(addToast({
            type: 'success',
            title: 'OCR Scan Selesai',
            message: `Dokumen ${file.name} berhasil di-scan dan tervalidasi.`,
          }));
        }, 2000);
      }, 1000);
    });
  }, [dispatch]);

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
    setOcrResults((prev) => {
      const newResults = { ...prev };
      delete newResults[id];
      return newResults;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    dispatch(addToast({
      type: 'info',
      title: 'Mengirim Permohonan',
      message: 'Permohonan Anda sedang diproses...',
    }));

    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setSubmitted(true);
    
    dispatch(addToast({
      type: 'success',
      title: 'Pengajuan Berhasil',
      message: `Permohonan ${layananOptions.find(l => l.value === formData.jenisLayanan)?.label} telah diterima.`,
    }));
  };

  const handleReset = () => {
    setFormData({
      jenisLayanan: '',
      nama: user?.name || '',
      nik: '',
      noTelp: '',
      alamat: '',
      kecamatan: '',
      deskripsi: '',
    });
    setSubmitted(false);
    setUploadedFiles([]);
    setOcrResults({});
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pengajuan Berhasil!</h2>
          <p className="text-gray-500 mb-6">
            Permohonan {layananOptions.find(l => l.value === formData.jenisLayanan)?.label} Anda telah diterima.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-gray-600 mb-1">Nomor Registrasi:</p>
            <p className="font-mono font-bold text-lg text-blue-600">REG-{Date.now().toString().slice(-8)}</p>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            Anda dapat memantau status pengajuan di menu <strong>Status Layanan</strong>.
            Estimasi waktu proses: 7-14 hari kerja.
          </p>
          <button
            onClick={handleReset}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Ajukan Permohonan Lain
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Formulir Layanan</h1>
        <p className="text-gray-500 mt-1">Ajukan permohonan layanan kependudukan dan pencatatan sipil</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jenis Layanan <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {layananOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, jenisLayanan: option.value })}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        formData.jenisLayanan === option.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-2xl mb-2 block">{option.icon}</span>
                      <span className="text-sm font-medium text-gray-700">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    NIK <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={16}
                    value={formData.nik}
                    onChange={(e) => setFormData({ ...formData, nik: e.target.value.replace(/\D/g, '') })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="16 digit NIK"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    No. Telepon <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.noTelp}
                    onChange={(e) => setFormData({ ...formData, noTelp: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="08xxxxxxxxxx"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kecamatan <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.kecamatan}
                    onChange={(e) => setFormData({ ...formData, kecamatan: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Pilih Kecamatan</option>
                    <option value="Kebumen">Kebumen</option>
                    <option value="Gombong">Gombong</option>
                    <option value="Buluspesantren">Buluspesantren</option>
                    <option value="Pejagoan">Pejagoan</option>
                    <option value="Sruweng">Sruweng</option>
                    <option value="Kutowinangun">Kutowinangun</option>
                    <option value="Alian">Alian</option>
                    <option value="Prembun">Prembun</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alamat Lengkap <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.alamat}
                  onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Masukkan alamat lengkap (JL/RT/RW/Desa)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📄 Upload Dokumen (OCR Scan)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    multiple
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleFileUpload}
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-sm text-gray-600 mb-1">Klik untuk upload atau drag file ke sini</p>
                    <p className="text-xs text-gray-400">JPG, PNG, atau PDF (maks. 5MB)</p>
                  </label>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {uploadedFiles.map((file) => (
                      <div key={file.id} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">📄</span>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{file.name}</p>
                              <p className="text-xs text-gray-500">{file.size}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {file.status === 'uploading' && (
                              <span className="text-xs text-gray-500">Uploading...</span>
                            )}
                            {file.status === 'scanning' && (
                              <div className="flex items-center gap-1">
                                <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                                <span className="text-xs text-blue-600">Scanning...</span>
                              </div>
                            )}
                            {file.status === 'verified' && (
                              <span className="text-xs text-green-600 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Tervalidasi
                              </span>
                            )}
                            <button
                              onClick={() => removeFile(file.id)}
                              className="p-1 hover:bg-gray-200 rounded"
                            >
                              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        {ocrResults[file.id] && (
                          <div className="bg-green-50 border border-green-200 rounded p-2 mt-2">
                            <p className="text-xs font-medium text-green-800 mb-1">Hasil OCR:</p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <p>Nama: <span className="font-medium">{ocrResults[file.id].nama}</span></p>
                              <p>NIK: <span className="font-medium">{ocrResults[file.id].nik}</span></p>
                              <p className="col-span-2">Alamat: <span className="font-medium">{ocrResults[file.id].alamat}</span></p>
                              <p className="col-span-2 text-green-700">{ocrResults[file.id].status}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Keterangan / Catatan
                </label>
                <textarea
                  rows={3}
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Tambahkan informasi tambahan jika diperlukan"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.jenisLayanan}
                  className="flex-1 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Mengirim...
                    </>
                  ) : (
                    'Ajukan Permohonan'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span>🤖</span> AI OCR Validation
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Sistem akan melakukan scan otomatis pada dokumen yang diupload untuk validasi keaslian.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                Deteksi NIK secara otomatis
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                Validasi keaslian dokumen
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                Ekstraksi data penduduk
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Persyaratan Umum</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                FC KTP-el asli (2 lembar)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                FC Kartu Keluarga (2 lembar)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                Pas foto 3x4 (2 lembar)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                Surat pengantar RT/RW
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
            <h3 className="font-semibold text-blue-900 mb-2">Waktu Proses</h3>
            <p className="text-sm text-blue-700">
              Estimasi waktu proses 7-14 hari kerja setelah dokumen lengkap.
            </p>
          </div>

          <div className="bg-green-50 rounded-xl p-6 border border-green-100">
            <h3 className="font-semibold text-green-900 mb-2">Gratis</h3>
            <p className="text-sm text-green-700">
              Seluruh layanan DUKCAPIL tidak dipungut biaya.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
