'use client';

import { usePathname } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/penduduk': 'Data Penduduk',
  '/chatbot': 'Chatbot AI',
  '/pengaduan': 'Pengaduan Masyarakat',
  '/layanan': 'Formulir Layanan',
  '/status': 'Status Layanan',
  '/info-publik': 'Info Publik',
  '/opd': 'Dashboard OPD',
};

const pageDescriptions: Record<string, string> = {
  '/dashboard': 'Monitoring data dan statistik',
  '/penduduk': 'Manajemen data penduduk terintegrasi DUKCAPIL',
  '/chatbot': 'Asisten virtual AI untuk konsultasi layanan masyarakat',
  '/pengaduan': 'Sistem pelaporan dan penanganan pengaduan warga',
  '/layanan': 'Ajukan permohonan layanan kependudukan',
  '/status': 'Pantau status pengajuan layanan Anda',
  '/info-publik': 'Transparansi informasi dan anggaran',
  '/opd': 'Monitoring pengaduan per OPD',
};

export default function Header() {
  const pathname = usePathname();
  const { user, token } = useAppSelector((state) => state.auth);
  const title = pageTitles[pathname] || 'Smart System';
  const description = pageDescriptions[pathname] || '';

  const getRoleBadge = (role: string) => {
    const badges: Record<string, { bg: string; text: string }> = {
      admin: { bg: 'bg-blue-100 text-blue-700', text: 'Administrator' },
      warga: { bg: 'bg-green-100 text-green-700', text: 'Warga' },
      opd: { bg: 'bg-purple-100 text-purple-700', text: user?.opd || 'OPD' },
    };
    return badges[role] || badges.admin;
  };

  const roleBadge = user ? getRoleBadge(user.role) : { bg: 'bg-gray-100 text-gray-700', text: 'Guest' };

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
            <svg
              className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="text-right hidden md:block">
              <p className="text-sm font-medium text-gray-900">{user?.name || 'Guest'}</p>
              <span className={`inline-block px-2 py-0.5 rounded text-xs ${roleBadge.bg}`}>
                {roleBadge.text}
              </span>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
              {user?.avatar || 'U'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
