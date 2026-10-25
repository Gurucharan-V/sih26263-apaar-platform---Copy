import React from 'react';
import { ShieldCheck, AlertOctagon, Building2, Users, FileBarChart } from 'lucide-react';
import { StatCard } from '../../components/charts/StatCard';
import { IntakeChart } from '../../components/charts/IntakeChart';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">National APAAR Command Center</h1>
        <p className="text-sm text-slate-500">Ministry of Education / AICTE Monitoring & Intake Reconciliation System</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Institutions" value="1,842" change="+12 this week" icon={Building2} color="blue" />
        <StatCard title="Verified APAAR IDs" value="4.2M" change="98.1% match rate" icon={ShieldCheck} color="emerald" />
        <StatCard title="Intake Violations" value="38" change="Excess admissions detected" icon={AlertOctagon} color="rose" />
        <StatCard title="Pending Case Queue" value="124" change="Duplicates & anomalies" icon={Users} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border shadow-sm">
          <h2 className="text-base font-semibold text-slate-900 mb-4">State-wise AICTE Intake vs. Actual Ingestion</h2>
          <IntakeChart />
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h2 className="text-base font-semibold text-slate-900 mb-4">Urgent Flagged Cases</h2>
          <div className="space-y-3">
            {[
              { college: 'Apex Institute of Tech', reason: 'Sanctioned intake 300 exceeded by 42', sev: 'High' },
              { college: 'Modern University', reason: '14 duplicate APAAR IDs matched with Delhi Tech', sev: 'Critical' },
              { college: 'National Engineering College', reason: 'High rate of invalid Aadhaar checksum hashes', sev: 'Medium' }
            ].map((item, idx) => (
              <div key={idx} className="p-3 rounded-lg border bg-slate-50 text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-slate-800">{item.college}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.sev === 'Critical' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>{item.sev}</span>
                </div>
                <p className="text-slate-600">{item.reason}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
