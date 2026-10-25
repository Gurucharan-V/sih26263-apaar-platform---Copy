import React from 'react';
import { FileDown, Printer, Filter } from 'lucide-react';

export default function Reports() {
  const reports = [
    { title: 'National Intake Reconciliation Report 2024', generated: '2024-10-22', format: 'PDF (2.4 MB)', type: 'Annual Audit' },
    { title: 'Cross-College Duplicate Student Registry', generated: '2024-10-21', format: 'CSV (850 KB)', type: 'Deduplication' },
    { title: 'AICTE Capacity Breach & Non-Compliance Notice List', generated: '2024-10-20', format: 'PDF (1.1 MB)', type: 'Compliance' },
    { title: 'Monthly Batch Ingestion Error Analysis', generated: '2024-10-15', format: 'XLSX (5.2 MB)', type: 'Operations' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-900">National Compliance Reports</h1>
          <p className="text-sm text-slate-500">Export regulatory filings and analytics digests</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {reports.map((rep, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl border flex justify-between items-center shadow-sm">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">{rep.type}</span>
              <h3 className="font-semibold text-slate-800 text-sm mt-1">{rep.title}</h3>
              <p className="text-xs text-slate-400 mt-1">Generated: {rep.generated} • {rep.format}</p>
            </div>
            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200">
              <FileDown className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
