export interface Penduduk {
  id: string;
  nik: string;
  nama: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: 'Laki-laki' | 'Perempuan';
  alamat: string;
  rt: string;
  rw: string;
  desa: string;
  kecamatan: string;
  agama: string;
  status: 'Kawin' | 'Belum Kawin' | 'Cerai Hidup' | 'Cerai Mati';
  pekerjaan: string;
  pendidikan: string;
  namaAyah: string;
  namaIbu: string;
}

export interface Statistik {
  totalPenduduk: number;
  lakiLaki: number;
  perempuan: number;
  kelahiran: number;
  kematian: number;
  perpindahan: number;
 kk: number;
}

export interface Pengaduan {
  id: string;
  judul: string;
  deskripsi: string;
  kategori: string;
  lokasi: string;
  status: 'Baru' | 'Diproses' | 'Selesai' | 'Ditolak';
  tanggal: string;
  pelapor: string;
  noTelp: string;
  lampiran?: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: string;
}

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'warga' | 'opd';
  avatar?: string;
}

export interface Kecamatan {
  id: string;
  nama: string;
  jumlahPenduduk: number;
}
