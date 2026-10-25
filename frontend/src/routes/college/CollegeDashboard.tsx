import React from 'react';
import { Link } from 'react-router-dom';
import { UploadCloud, UserPlus, AlertTriangle, CheckCircle, FileText } from 'lucide-react';
import { StatCard } from '../../components/charts/StatCard';

export default function CollegeDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">College Ingestion Portal</h1>
          <p className="text-sm text-slate-500">Vellore Institute of Technology (AISHE: C-36965)</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/college/upload"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition"
          >
            <UploadCloud className="w-4 h-4" /> Bulk Upload CSV
          </Link>
          <Link
            to="/college/students/new"
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition"
          >
            <UserPlus className="w-4 h-4" /> Add Student
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Approved Intake (2024-25)" value="2,400" change="AICTE Approved" icon={CheckCircle} color="blue" />
        <StatCard title="Total Enrolled" value="2,280" change="95% Utilization" icon={FileText} color="emerald" />
        <StatCard title="Pending Validation" value="48" change="In BullMQ worker queue" icon={UploadCloud} color="amber" />
        <StatCard title="Flagged Anomalies" value="12" change="Requires Correction" icon={AlertTriangle} color="rose" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-base font-semibold text-slate-900 mb-4">Quick Batch Actions & Guidelines</h2>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="font-semibold text-blue-900 mb-1">APAAR Format Requirements</h3>
            <p className="text-blue-700 text-xs">Ensure 12-digit APAAR numbers are formatted with Verhoeff/Luhn checksum validation.</p>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
            <h3 className="font-semibold text-amber-900 mb-1">Intake Capping Alert</h3>
            <p className="text-amber-700 text-xs">B.Tech Computer Engineering is at 98% of sanctioned capacity (705/720).</p>
          </div>
          <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
            <h3 className="font-semibold text-emerald-900 mb-1">Automated Resolution</h3>
            <p className="text-emerald-700 text-xs">Fuzzy-matched duplicates within 2% string edit distance are highlighted for review.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
