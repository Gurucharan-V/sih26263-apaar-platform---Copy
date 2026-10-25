import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, AlertTriangle, Clock } from 'lucide-react';

export default function UploadHistory() {
  const history = [
    { id: 'upl_8812', filename: 'btech_cse_batch1.csv', date: '2024-10-21 14:30', total: 500, passed: 498, failed: 2, status: 'completed' },
    { id: 'upl_8813', filename: 'mtech_ece_batch.xlsx', date: '2024-10-20 09:15', total: 120, passed: 120, failed: 0, status: 'completed' },
    { id: 'upl_8814', filename: 'bca_supplementary.csv', date: '2024-10-18 16:45', total: 60, passed: 54, failed: 6, status: 'completed' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Upload History</h1>
        <p className="text-sm text-slate-500">Historical audit logs of CSV/XLSX file ingestion batches</p>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-medium border-b">
            <tr>
              <th className="p-3">Batch ID</th>
              <th className="p-3">File Name</th>
              <th className="p-3">Uploaded At</th>
              <th className="p-3">Total Rows</th>
              <th className="p-3">Passed</th>
              <th className="p-3">Failed</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {history.map((h) => (
              <tr key={h.id} className="hover:bg-slate-50">
                <td className="p-3 font-mono text-xs">{h.id}</td>
                <td className="p-3 font-medium text-slate-800">{h.filename}</td>
                <td className="p-3 text-slate-500 text-xs">{h.date}</td>
                <td className="p-3">{h.total}</td>
                <td className="p-3 text-emerald-600 font-medium">{h.passed}</td>
                <td className="p-3 text-rose-600 font-medium">{h.failed}</td>
                <td className="p-3">
                  <Link to={`/college/upload/errors/${h.id}`} className="text-xs text-blue-600 hover:underline">
                    View Details
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
