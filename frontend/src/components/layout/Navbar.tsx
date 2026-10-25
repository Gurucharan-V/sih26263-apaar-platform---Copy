import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Bell, 
  LogOut, 
  Globe, 
  User, 
  CheckCheck, 
  Building2, 
  ShieldCheck, 
  ChevronDown, 
  X,
  FileCheck2,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

export const Navbar: React.FC<{ portal: 'college' | 'admin' }> = ({ portal }) => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'Batch #EEC-2024-9921 Processed',
      description: '146 student records validated and ingested. 4 records flagged for checksum correction.',
      time: '10m ago',
      unread: true,
      type: 'warning'
    },
    {
      id: 'notif-2',
      title: 'Anna University Intake Quota Synced',
      description: 'Easwari Engineering College 2024-25 sanctioned intake capacity confirmed (1,450 seats).',
      time: '1h ago',
      unread: true,
      type: 'success'
    },
    {
      id: 'notif-3',
      title: 'Verhoeff Algorithm Engine v3.2',
      description: 'High-speed APAAR deduplication engine updated with biometric SHA-256 hash checks.',
      time: '1d ago',
      unread: false,
      type: 'info'
    }
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Close menus on outside click or Esc
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowNotifications(false);
        setShowProfile(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const toggleLang = () => {
    const nextLang = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(nextLang);
    toast.success(
      nextLang === 'hi' 
        ? 'भाषा बदलकर हिन्दी कर दी गई है' 
        : 'Language switched to English',
      { icon: '🌐' }
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    toast.success(t('nav.markAllRead', 'All notifications marked as read'));
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const institutionName = portal === 'college' 
    ? 'Easwari Engineering College (EEC)' 
    : 'Ministry of Education (MoE)';
  const officerName = portal === 'college' 
    ? 'Dr. R. Rajesh (EEC Nodal Officer)' 
    : 'Dr. V. K. Sharma (State Admin)';
  const officerEmail = user?.email || (portal === 'college' ? 'nodal@srmeaswari.ac.in' : 'admin@education.gov.in');

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      {/* Brand & Portal Badge */}
      <div className="flex items-center gap-3">
        <img
          src="/assets/eec_college_logo.png"
          alt="Easwari Engineering College Official Seal"
          className="w-11 h-11 object-contain bg-white rounded-full p-0.5 border border-slate-200 shadow-xs"
        />
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 text-sm tracking-tight">
              {t('nav.systemTitle', 'APAAR System')}
            </span>
            <span className="hidden sm:inline-flex text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200 capitalize">
              {portal === 'college' ? t('nav.collegePortal', 'College Portal') : t('nav.adminPortal', 'Admin Portal')}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium truncate max-w-[220px] sm:max-w-xs">
            {institutionName}
          </p>
        </div>
      </div>

      {/* Right Action Icons & Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* 1. Language Toggle Button */}
        <button
          onClick={toggleLang}
          title={i18n.language === 'en' ? 'हिन्दी में बदलें (Switch to Hindi)' : 'Switch to English'}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-blue-700 bg-slate-50 hover:bg-blue-50/60 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-blue-300 transition active:scale-95 shadow-sm"
        >
          <Globe className="w-3.5 h-3.5 text-blue-600" />
          <span>{i18n.language === 'en' ? 'हिन्दी' : 'English'}</span>
        </button>

        {/* 2. Notification Bell with Dropdown */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
            title={t('nav.notifications', 'Notifications')}
            className={`relative p-2 rounded-lg border transition active:scale-95 ${
              showNotifications 
                ? 'bg-blue-50 text-blue-600 border-blue-300 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border-slate-200'
            }`}
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow ring-2 ring-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-blue-400" />
                  <span className="font-semibold text-sm">
                    {t('nav.notifications', 'Notifications')}
                  </span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] bg-blue-500/30 text-blue-300 border border-blue-400/30 px-1.5 py-0.5 rounded-full font-mono">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[11px] text-blue-300 hover:text-white flex items-center gap-1 hover:underline transition"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    {t('nav.markAllRead', 'Mark all read')}
                  </button>
                )}
              </div>

              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3.5 hover:bg-slate-50 transition cursor-pointer flex gap-3 ${
                      item.unread ? 'bg-blue-50/40' : ''
                    }`}
                    onClick={() => {
                      setNotifications((prev) =>
                        prev.map((n) => (n.id === item.id ? { ...n, unread: false } : n))
                      );
                    }}
                  >
                    <div className="mt-0.5">
                      {item.type === 'warning' ? (
                        <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                          <AlertCircle className="w-4 h-4" />
                        </div>
                      ) : item.type === 'success' ? (
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                          <FileCheck2 className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-xs font-semibold text-slate-800">
                          {item.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">
                          {item.time}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    navigate(portal === 'college' ? '/college/history' : '/admin/audit');
                  }}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                >
                  View Complete Audit Trail <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-slate-200 mx-0.5" />

        {/* 3. User Profile Button & Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
            title={t('nav.profile', 'Institutional Profile')}
            className={`flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border transition active:scale-95 ${
              showProfile
                ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-100'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
            }`}
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              EEC
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-slate-800 leading-none">
                Dr. R. Rajesh
              </p>
              <p className="text-[10px] text-slate-500 font-medium mt-0.5 leading-none">
                EEC Nodal Officer
              </p>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showProfile ? 'rotate-180' : ''}`} />
          </button>

          {/* User Profile Modal Dropdown */}
          {showProfile && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              {/* Profile Card Header */}
              <div className="p-4 bg-gradient-to-br from-slate-900 to-blue-950 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-lg font-bold text-blue-200 shadow-inner">
                    🏛️
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-100">{officerName}</h3>
                    <p className="text-xs text-blue-300 font-mono mt-0.5">{officerEmail}</p>
                    <div className="mt-1.5 inline-flex items-center gap-1.5 text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 font-medium">
                      <ShieldCheck className="w-3 h-3" /> Verified Nodal Officer
                    </div>
                  </div>
                </div>
              </div>

              {/* Institution Metadata */}
              <div className="p-3.5 bg-slate-50/80 border-b border-slate-100 space-y-1.5 text-xs">
                <div className="flex justify-between items-center text-slate-600">
                  <span className="text-slate-400">Institution:</span>
                  <span className="font-semibold text-slate-800 text-right">{institutionName}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span className="text-slate-400">AISHE Code:</span>
                  <span className="font-mono font-semibold text-slate-800">C-16622</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span className="text-slate-400">Affiliation:</span>
                  <span className="font-medium text-slate-700">Anna University, Chennai</span>
                </div>
              </div>

              {/* Actions List */}
              <div className="p-2 space-y-1">
                <button
                  onClick={() => {
                    setShowProfile(false);
                    toast('AISHE Code: C-16622\nAffiliation: Anna University\nAccreditation: NBA & NAAC A+', {
                      icon: '🏛️',
                      duration: 4000
                    });
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-blue-700 hover:bg-blue-50/70 rounded-xl transition text-left"
                >
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span>{t('nav.profile', 'View Institution Profile')}</span>
                </button>

                <button
                  onClick={() => {
                    setShowProfile(false);
                    toast('Session secured via 256-bit TLS and Verhoeff validation.', { icon: '🔒' });
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-blue-700 hover:bg-blue-50/70 rounded-xl transition text-left"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{t('nav.settings', 'Security & Preferences')}</span>
                </button>

                <div className="my-1 border-t border-slate-100" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t('nav.logout', 'Sign Out')}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
