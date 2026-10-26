import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, AlertTriangle, Clock, Download, UploadCloud, Building2, FileSpreadsheet } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCollegeData } from '../../hooks/useCollegeData';
import { downloadStandardCsvTemplate } from '../../utils/csvTemplate';

export default function UploadHistory() {
  const { user } = useAuth();
  const collegeCode = user?.aisheCode || 'C-18491';
  const { collegeDetails, batches } = useCollegeData(collegeCode);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Upload & Ingestion History</h1>
            <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800">
              {collegeCode}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Historical audit logs of CSV/XLSX file ingestion batches for <span className="font-semibold text-slate-700">{collegeDetails.name}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => downloadStandardCsvTemplate(collegeCode, collegeDetails.shortName)}
            className="px-3.5 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Standard CSV Template</span>
          </button>
          <Link
            to="/college/upload"
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload New Batch</span>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <FileSpreadsheet className="w-4 h-4 text-blue-600" />
            <span>Batches Uploaded by {collegeDetails.shortName} ({batches.length} Records)</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            College Identity: {collegeDetails.name} ({collegeCode})
          </span>
        </div>

        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-medium border-b">
            <tr>
              <th className="p-3">Batch ID</th>
              <th className="p-3">File Name</th>
              <th className="p-3">Uploaded At</th>
              <th className="p-3">Total Rows</th>
              <th className="p-3">Passed</th>
              <th className="p-3">Failed</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {batches.map((h) => (
              <tr key={h.id} className="hover:bg-slate-50">
                <td className="p-3 font-mono text-xs font-bold text-blue-700">{h.id}</td>
                <td className="p-3 font-medium text-slate-800">{h.filename}</td>
                <td className="p-3 text-slate-500 text-xs">{h.uploadedAt}</td>
                <td className="p-3 font-semibold text-slate-800">{h.total}</td>
                <td className="p-3 text-emerald-600 font-medium">{h.passed}</td>
                <td className="p-3 text-rose-600 font-medium">{h.failed}</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {h.status}
                  </span>
                </td>
                <td className="p-3">
                  <Link to={`/college/upload/errors/${h.id}`} className="text-xs text-blue-600 hover:underline font-bold">
                    View Audit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
