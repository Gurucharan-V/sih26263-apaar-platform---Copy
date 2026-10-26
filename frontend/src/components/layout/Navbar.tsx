import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Bell, 
  LogOut, 
  User, 
  CheckCheck, 
  Building2, 
  ShieldCheck, 
  ChevronDown, 
  X,
  FileCheck2,
  AlertCircle,
  Menu,
  GraduationCap,
  Layers,
  HelpCircle,
  ExternalLink,
  Search,
  Sparkles,
  FileText,
  UploadCloud,
  History,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

export const Navbar: React.FC<{ portal: 'student' | 'college' | 'admin' | 'moderator' }> = ({ portal }) => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showNotifications, setShowNotifications] = useState(false);
  const [isMenuDrawerOpen, setIsMenuDrawerOpen] = useState(false);

  // Close menus on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowNotifications(false);
        setIsMenuDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Notifications
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'Batch #EEC-2024-9921 Ingestion Synced',
      description: '146 student records validated with Verhoeff checksum. 0 critical errors.',
      time: '5m ago',
      unread: true,
      type: 'success'
    },
    {
      id: 'notif-2',
      title: 'Anna University Intake Sanction Verified',
      description: 'Easwari Engineering College 2024-25 quota confirmed (1,450 seats).',
      time: '45m ago',
      unread: true,
      type: 'info'
    },
    {
      id: 'notif-3',
      title: 'Query Resolution Update',
      description: 'Moderator replied to Query #QRY-2024-8901 regarding APAAR name alignment.',
      time: '2h ago',
      unread: false,
      type: 'warning'
    }
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    toast.success('All notifications marked as read');
  };

  const handleLogout = () => {
    logout();
    setIsMenuDrawerOpen(false);
    toast.success('Signed out successfully');
    navigate('/login');
  };

  // Determine current display info based on portal or user session
  const effectiveRole = user?.role || (portal === 'student' ? 'STUDENT' : portal === 'college' ? 'COLLEGE_NODAL' : 'MODERATOR');
  
  const displayName = user?.name || (
    effectiveRole === 'STUDENT'
      ? 'Rohan Sundaram'
      : effectiveRole === 'COLLEGE_NODAL'
      ? 'Dr. R. Rajesh'
      : 'Dr. V. K. Sharma'
  );

  const displaySubtitle = effectiveRole === 'STUDENT'
    ? 'APAAR ID: 9842-1083-4912 • EEC Student'
    : effectiveRole === 'COLLEGE_NODAL'
    ? 'EEC Nodal Officer • AISHE: C-16622'
    : 'State Admin & National Moderator • AICTE/MoE';

  const portalBadge = effectiveRole === 'STUDENT'
    ? { title: 'Student Portal', color: 'bg-emerald-50 text-emerald-800 border-emerald-200', icon: GraduationCap }
    : effectiveRole === 'COLLEGE_NODAL'
    ? { title: 'College Portal', color: 'bg-blue-50 text-blue-800 border-blue-200', icon: Building2 }
    : { title: 'Moderator Portal', color: 'bg-purple-50 text-purple-800 border-purple-200', icon: ShieldCheck };

  const BadgeIcon = portalBadge.icon;

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        {/* Left: Brand & Portal Badge */}
        <div className="flex items-center gap-3">
          <img
            src="/assets/eec_college_logo.png"
            alt="Easwari Engineering College & APAAR Crest"
            className="w-10 h-10 object-contain bg-white rounded-full p-0.5 border border-slate-200 shadow-xs cursor-pointer"
            onClick={() => navigate(effectiveRole === 'STUDENT' ? '/student' : effectiveRole === 'COLLEGE_NODAL' ? '/college' : '/admin')}
          />
          <div>
            <div className="flex items-center gap-2">
              <span 
                onClick={() => navigate(effectiveRole === 'STUDENT' ? '/student' : effectiveRole === 'COLLEGE_NODAL' ? '/college' : '/admin')}
                className="font-bold text-slate-900 text-sm sm:text-base tracking-tight hover:text-blue-700 cursor-pointer"
              >
                APAAR Data Platform
              </span>
              <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-bold border ${portalBadge.color}`}>
                <BadgeIcon className="w-3 h-3" />
                <span>{portalBadge.title}</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium truncate max-w-[200px] sm:max-w-xs">
              Easwari Engineering College • Ministry of Education
            </p>
          </div>
        </div>

        {/* Center: Portal Switcher Tabs */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => navigate('/student')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
              location.pathname.startsWith('/student')
                ? 'bg-white text-emerald-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Student Portal</span>
          </button>
          <button
            onClick={() => navigate('/college')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
              location.pathname.startsWith('/college')
                ? 'bg-white text-blue-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>College Portal</span>
          </button>
          <button
            onClick={() => navigate('/admin')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
              location.pathname.startsWith('/admin')
                ? 'bg-white text-purple-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Moderator Portal</span>
          </button>
        </div>

        {/* Right: Notifications & "Three Line Style" Menu Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              title="Notifications"
              className={`relative p-2 rounded-xl border transition active:scale-95 ${
                showNotifications 
                  ? 'bg-blue-50 text-blue-600 border-blue-300 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border-slate-200'
              }`}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-blue-400" />
                    <span className="font-semibold text-sm">Notifications</span>
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
                      Mark read
                    </button>
                  )}
                </div>

                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
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
                        <div className="flex items-center justify-between mb-0.5">
                          <h4 className="text-xs font-semibold text-slate-800">{item.title}</h4>
                          <span className="text-[10px] text-slate-400">{item.time}</span>
                        </div>
                        <p className="text-xs text-slate-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-slate-200 mx-0.5" />

          {/* THE THREE LINE STYLE (☰ HAMBURGER MENU) BUTTON */}
          <button
            onClick={() => setIsMenuDrawerOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition active:scale-95 shadow-sm border border-slate-800 cursor-pointer"
            title="Open Profile, Navigation & Sign Out Menu"
          >
            {/* Three lines hamburger icon */}
            <Menu className="w-5 h-5 text-blue-300" />
            <span className="hidden sm:inline text-xs font-bold tracking-wide">
              Menu & Profile
            </span>
          </button>
        </div>
      </header>

      {/* THREE-LINE STYLE SLIDE-OVER DRAWER (Profile, Navigation & Signout) */}
      {isMenuDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMenuDrawerOpen(false)}
          />

          {/* Sliding Panel */}
          <div className="relative w-full max-w-sm sm:max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="p-4 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <Menu className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-base text-white">System Menu & Profile</h3>
              </div>
              <button
                onClick={() => setIsMenuDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Profile Card */}
            <div className="p-5 bg-gradient-to-b from-slate-900 to-slate-950 text-white border-b border-slate-800">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-extrabold text-xl flex items-center justify-center shadow-lg border-2 border-white/20">
                  {displayName.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-base text-white truncate">{displayName}</h4>
                  </div>
                  <p className="text-xs text-blue-300 font-mono truncate">
                    {user?.email || (effectiveRole === 'STUDENT' ? 'student@srmeaswari.ac.in' : effectiveRole === 'COLLEGE_NODAL' ? 'nodal@srmeaswari.ac.in' : 'moderator@education.gov.in')}
                  </p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      <ShieldCheck className="w-3 h-3" />
                      {effectiveRole === 'STUDENT' ? 'Verified Student' : effectiveRole === 'COLLEGE_NODAL' ? 'Verified Nodal Officer' : 'National Moderator'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Institution / APAAR Metadata */}
              <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1.5">
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-400">Institution:</span>
                  <span className="font-semibold text-slate-100 text-right">
                    {user?.institutionName || 'Easwari Engineering College (EEC)'}
                  </span>
                </div>
                {user?.apaarId && (
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="text-slate-400">APAAR ID:</span>
                    <span className="font-mono font-bold text-blue-300">{user.apaarId}</span>
                  </div>
                )}
                {user?.aisheCode && (
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="text-slate-400">AISHE Code:</span>
                    <span className="font-mono font-bold text-emerald-300">{user.aisheCode}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-400">Security:</span>
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> 256-bit TLS Encrypted
                  </span>
                </div>
              </div>
            </div>

            {/* Drawer Body: Navigation & Portals */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {/* 1. Portal Switcher */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1 mb-2 block">
                  Select Active Portal
                </label>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() => {
                      setIsMenuDrawerOpen(false);
                      navigate('/student');
                    }}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition ${
                      location.pathname.startsWith('/student')
                        ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900 ring-2 ring-emerald-100'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-sm">Student Portal</div>
                        <div className="text-xs text-slate-500">APAAR ID, ABC Credits & Grievances</div>
                      </div>
                    </div>
                    {location.pathname.startsWith('/student') && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white">Active</span>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setIsMenuDrawerOpen(false);
                      navigate('/college');
                    }}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition ${
                      location.pathname.startsWith('/college')
                        ? 'bg-blue-50/80 border-blue-300 text-blue-900 ring-2 ring-blue-100'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-sm">College Portal</div>
                        <div className="text-xs text-slate-500">Bulk Ingestion, Capacity & Intake</div>
                      </div>
                    </div>
                    {location.pathname.startsWith('/college') && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">Active</span>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setIsMenuDrawerOpen(false);
                      navigate('/admin');
                    }}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition ${
                      location.pathname.startsWith('/admin')
                        ? 'bg-purple-50/80 border-purple-300 text-purple-900 ring-2 ring-purple-100'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-sm">Moderator Portal</div>
                        <div className="text-xs text-slate-500">Control All Queries & Full System Access</div>
                      </div>
                    </div>
                    {location.pathname.startsWith('/admin') && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-600 text-white">Active</span>
                    )}
                  </button>
                </div>
              </div>

              {/* 2. Quick Navigation Links */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1 mb-2 block">
                  Quick Links
                </label>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setIsMenuDrawerOpen(false);
                      navigate('/admin/queries');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-purple-700 hover:bg-purple-50 rounded-xl transition text-left"
                  >
                    <HelpCircle className="w-4 h-4 text-purple-600" />
                    <span>Query & Grievance Control Center</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsMenuDrawerOpen(false);
                      navigate('/college/upload');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition text-left"
                  >
                    <UploadCloud className="w-4 h-4 text-blue-600" />
                    <span>Bulk Ingestion (CSV / Excel)</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsMenuDrawerOpen(false);
                      navigate('/admin/verify');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition text-left"
                  >
                    <Search className="w-4 h-4 text-blue-600" />
                    <span>Master APAAR Registry Lookup</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsMenuDrawerOpen(false);
                      navigate('/admin/intake');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-amber-700 hover:bg-amber-50 rounded-xl transition text-left"
                  >
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Intake Quota & Discrepancies</span>
                  </button>
                </div>
              </div>

              {/* Helpdesk */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                  National Helpdesk
                </div>
                <p className="text-[11px] text-slate-500">Toll-free: 1800-111-678 | apaar-support@gov.in</p>
              </div>
            </div>

            {/* Drawer Footer: Sign Out Button */}
            <div className="p-4 bg-slate-50 border-t border-slate-200">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-sm transition active:scale-95 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
