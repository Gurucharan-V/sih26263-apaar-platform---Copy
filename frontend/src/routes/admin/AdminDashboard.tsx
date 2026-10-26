import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  AlertOctagon, 
  Building2, 
  Users, 
  FileBarChart, 
  HelpCircle, 
  ArrowRight, 
  Search, 
  AlertTriangle,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { StatCard } from '../../components/charts/StatCard';
import { IntakeChart } from '../../components/charts/IntakeChart';
import { useQueries } from '../../hooks/useQueries';

export default function AdminDashboard() {
  const { queries } = useQueries();
  const pendingQueries = queries.filter((q) => q.status === 'PENDING_REVIEW' || q.status === 'IN_PROGRESS');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            National APAAR Command & Moderator Center
          </h1>
          <p className="text-sm text-slate-500">
            Ministry of Education / AICTE Monitoring, Query Resolution & Sanctioned Intake Oversight
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/queries"
            className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Control All Queries ({pendingQueries.length} Active)</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Institutions" value="1,842" change="+12 this week" icon={Building2} color="blue" />
        <StatCard title="Verified APAAR IDs" value="4.2M" change="98.1% match rate" icon={ShieldCheck} color="emerald" />
        <StatCard title="Intake Violations" value="38" change="Excess admissions detected" icon={AlertOctagon} color="rose" />
        <StatCard title="Student Queries" value={`${pendingQueries.length} Pending`} change="Central grievance control" icon={HelpCircle} color="amber" />
      </div>

      {/* MODERATOR QUERY CONTROL SPOTLIGHT BANNER */}
      <div className="p-5 bg-gradient-to-r from-purple-900 via-slate-900 to-blue-950 rounded-2xl text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 shrink-0">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                Student & College Grievance Resolution Desk
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-400/30">
                {pendingQueries.length} Require Triage
              </span>
            </div>
            <h3 className="font-bold text-base text-white mt-0.5">
              You have full administrative authority to review, update, and resolve queries.
            </h3>
          </div>
        </div>

        <Link
          to="/admin/queries"
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition active:scale-95 flex items-center justify-center gap-2 shrink-0"
        >
          <span>Open Query Control Center</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Grid: Charts & Urgent Cases */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900">
              State-wise AICTE Sanctioned Intake vs. Actual Ingestion
            </h2>
            <Link to="/admin/intake" className="text-xs font-bold text-blue-600 hover:underline">
              View Discrepancies →
            </Link>
          </div>
          <IntakeChart />
        </div>

        {/* Urgent Flagged Cases & Quick Lookups */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-slate-900">Urgent Fraud Anomaly Cases</h2>
              <Link to="/admin/cases" className="text-xs font-bold text-purple-700 hover:underline">
                View Queue
              </Link>
            </div>
            <div className="space-y-2.5">
              {[
                { college: 'Apex Institute of Tech', reason: 'Sanctioned intake 300 exceeded by 42', sev: 'High' },
                { college: 'Modern University', reason: '14 duplicate APAAR IDs matched with Delhi Tech', sev: 'Critical' },
                { college: 'National Engineering College', reason: 'High rate of invalid Aadhaar checksum hashes', sev: 'Medium' }
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-slate-800">{item.college}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.sev === 'Critical' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {item.sev}
                    </span>
                  </div>
                  <p className="text-slate-600">{item.reason}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900">National Record Verification</div>
                <div className="text-[11px] text-slate-500">Lookup any 12-digit APAAR ID</div>
              </div>
            </div>
            <Link
              to="/admin/verify"
              className="text-xs font-bold text-blue-700 hover:underline"
            >
              Verify Record →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
