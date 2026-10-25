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
  ShieldCheck
} from 'lucide-react';

export const Sidebar: React.FC<{ portal: 'college' | 'admin' }> = ({ portal }) => {
  const { t } = useTranslation();

  const collegeLinks = [
    { to: '/college', label: t('nav.dashboard', 'Dashboard'), icon: LayoutDashboard, end: true },
    { to: '/college/upload', label: t('nav.bulkUpload', 'Bulk Ingestion'), icon: UploadCloud },
    { to: '/college/students/new', label: t('nav.registerStudent', 'Register Student'), icon: UserPlus },
    { to: '/college/history', label: t('nav.uploadHistory', 'Upload History'), icon: History },
  ];

  const adminLinks = [
    { to: '/admin', label: t('nav.commandCenter', 'Command Center'), icon: LayoutDashboard, end: true },
    { to: '/admin/institutions', label: t('nav.institutions', 'Institutions'), icon: Building2 },
    { to: '/admin/intake', label: t('nav.intakeDiscrepancy', 'Intake Discrepancy'), icon: AlertTriangle },
    { to: '/admin/cases', label: t('nav.caseQueue', 'Case Queue'), icon: Layers },
    { to: '/admin/verify', label: t('nav.apaarLookup', 'APAAR Lookup'), icon: Search },
    { to: '/admin/reports', label: t('nav.reports', 'Reports'), icon: FileText },
    { to: '/admin/audit', label: t('nav.auditTrail', 'Audit Trail'), icon: ShieldCheck },
  ];

  const links = portal === 'college' ? collegeLinks : adminLinks;

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between">
      <nav className="space-y-1">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-2">
          {portal === 'college' ? (t('nav.collegePortal', 'College Portal') + ' • EEC') : t('nav.adminPortal', 'National Oversight')}
        </div>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-3 bg-slate-800/60 rounded-xl text-xs text-slate-400 border border-slate-700/50">
        <div className="font-semibold text-slate-200 mb-0.5">SIH Team 26263</div>
        <div>Automated APAAR Verifier v1.0.0</div>
      </div>
    </aside>
  );
};
