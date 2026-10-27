import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  UploadCloud,
  UserPlus,
  History,
  Building2,
  AlertTriangle,
  Layers,
  Search,
  FileText,
  ShieldCheck,
  GraduationCap,
  HelpCircle,
  Award,
  FileCheck2,
  CreditCard
} from 'lucide-react';

export const Sidebar: React.FC<{ portal: 'student' | 'college' | 'admin' | 'moderator' }> = ({ portal }) => {
  const { t } = useTranslation();

  const studentLinks = [
    { to: '/student', label: 'APAAR Digital Card', icon: CreditCard, end: true },
    { to: '/student/details', label: 'Fill / Edit Details', icon: GraduationCap },
    { to: '/student/credits', label: 'Academic Bank of Credits', icon: Award },
    { to: '/student/queries', label: 'Grievance & Queries', icon: HelpCircle },
  ];

  const collegeLinks = [
    { to: '/college', label: t('nav.dashboard', 'Dashboard'), icon: LayoutDashboard, end: true },
    { to: '/college/students/new', label: 'Register Student (College Side)', icon: UserPlus },
    { to: '/college/upload', label: t('nav.bulkUpload', 'Bulk Ingestion'), icon: UploadCloud },
    { to: '/college/history', label: t('nav.uploadHistory', 'Upload History'), icon: History },
    { to: '/college/queries', label: 'Grievance & Queries', icon: HelpCircle },
  ];

  const adminLinks = [
    { to: '/admin', label: t('nav.commandCenter', 'Command Center'), icon: LayoutDashboard, end: true },
    { to: '/admin/queries', label: 'Query Control Center', icon: HelpCircle },
    { to: '/admin/institutions', label: t('nav.institutions', 'Institutions'), icon: Building2 },
    { to: '/admin/intake', label: t('nav.intakeDiscrepancy', 'Intake Discrepancy'), icon: AlertTriangle },
    { to: '/admin/cases', label: t('nav.caseQueue', 'Case Queue'), icon: Layers },
    { to: '/admin/verify', label: t('nav.apaarLookup', 'APAAR Lookup'), icon: Search },
    { to: '/admin/reports', label: t('nav.reports', 'Reports'), icon: FileText },
    { to: '/admin/audit', label: t('nav.auditTrail', 'Audit Trail'), icon: ShieldCheck },
  ];

  const links = portal === 'student' ? studentLinks : portal === 'college' ? collegeLinks : adminLinks;

  const headerTitle = portal === 'student'
    ? 'Student Portal'
    : portal === 'college'
    ? 'College Portal'
    : 'National Moderator Cell';

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between hidden md:flex">
      <nav className="space-y-1">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-2 flex items-center gap-1.5">
          {portal === 'student' ? <GraduationCap className="w-3.5 h-3.5 text-emerald-400" /> : portal === 'college' ? <Building2 className="w-3.5 h-3.5 text-blue-400" /> : <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />}
          <span>{headerTitle}</span>
        </div>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? portal === 'student'
                      ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                      : portal === 'college'
                      ? 'bg-blue-600 text-white font-semibold shadow-sm'
                      : 'bg-purple-600 text-white font-semibold shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-3 bg-slate-800/60 rounded-xl text-xs text-slate-400 border border-slate-700/50">
        <div className="font-semibold text-slate-200 mb-0.5">Aaroh • SIH Team 26263</div>
        <div className="text-[11px]">Automated APAAR Verifier v1.0.0</div>
      </div>
    </aside>
  );
};
