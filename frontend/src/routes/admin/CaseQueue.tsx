import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, GitMerge } from 'lucide-react';

export default function CaseQueue() {
  const cases = [
    { id: 'CASE-8821', type: 'Duplicate APAAR', candidate: 'Amitav Verma', matchScore: '96% (Fuzzy)', institutions: ['VIT', 'DTU'], status: 'PENDING_REVIEW' },
    { id: 'CASE-8822', type: 'Over-Intake Breach', candidate: 'Batch B.Tech CSE', matchScore: '124% Limit', institutions: ['Bengal College of Eng'], status: 'ACTION_REQUIRED' },
    { id: 'CASE-8823', type: 'Aadhaar Hash Collision', candidate: 'Sanya Malhotra', matchScore: '100% Exact', institutions: ['NIT Trichy', 'IIT Madras'], status: 'PENDING_REVIEW' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Fraud & Anomaly Case Queue</h1>
        <p className="text-sm text-slate-500">Triage multi-institution duplicate records and enrollment irregularities</p>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-medium border-b">
            <tr>
              <th className="p-3">Case ID</th>
              <th className="p-3">Anomaly Type</th>
              <th className="p-3">Subject / Student</th>
              <th className="p-3">Algorithmic Confidence</th>
              <th className="p-3">Involved Institutions</th>
              <th className="p-3">Status</th>
              <th className="p-3">Review</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {cases.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="p-3 font-mono text-xs">{c.id}</td>
                <td className="p-3 font-medium text-slate-800">{c.type}</td>
                <td className="p-3 text-slate-700">{c.candidate}</td>
                <td className="p-3 font-mono text-xs font-semibold text-blue-600">{c.matchScore}</td>
                <td className="p-3 text-xs text-slate-600">{c.institutions.join(' & ')}</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800">
                    {c.status}
                  </span>
                </td>
                <td className="p-3">
                  <Link to={`/admin/cases/${c.id}`} className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 inline-block">
                    Resolve
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
