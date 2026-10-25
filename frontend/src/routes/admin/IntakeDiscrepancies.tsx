import React from 'react';
import { AlertTriangle, ArrowUpRight } from 'lucide-react';

export default function IntakeDiscrepancies() {
  const discrepancies = [
    { id: 'INC-101', institution: 'Delhi Technological University', programme: 'B.Tech IT', approved: 120, enrolled: 142, delta: '+22 (+18.3%)', flag: 'High Over-Intake' },
    { id: 'INC-102', institution: 'Bengal College of Engineering', programme: 'B.Tech CSE', approved: 180, enrolled: 222, delta: '+42 (+23.3%)', flag: 'High Over-Intake' },
    { id: 'INC-103', institution: 'St. Mary Technical Institute', programme: 'MBA Fin', approved: 60, enrolled: 72, delta: '+12 (+20.0%)', flag: 'Moderate Over-Intake' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Intake Discrepancy Matrix</h1>
        <p className="text-sm text-slate-500">Autonomous detection of AICTE ceiling limits exceeded by institutions</p>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-medium border-b">
            <tr>
              <th className="p-3">Case ID</th>
              <th className="p-3">Institution</th>
              <th className="p-3">Programme</th>
              <th className="p-3">Approved Limit</th>
              <th className="p-3">Actual Intake</th>
              <th className="p-3">Discrepancy (Delta)</th>
              <th className="p-3">Severity</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {discrepancies.map((d) => (
              <tr key={d.id} className="hover:bg-slate-50">
                <td className="p-3 font-mono text-xs">{d.id}</td>
                <td className="p-3 font-medium text-slate-800">{d.institution}</td>
                <td className="p-3 text-slate-600">{d.programme}</td>
                <td className="p-3 font-semibold text-slate-700">{d.approved}</td>
                <td className="p-3 font-bold text-rose-700">{d.enrolled}</td>
                <td className="p-3 text-rose-600 font-mono text-xs font-semibold">{d.delta}</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded text-xs font-medium">{d.flag}</span>
                </td>
                <td className="p-3">
                  <button className="px-3 py-1 bg-rose-600 text-white rounded text-xs font-medium hover:bg-rose-700">
                    Issue Notice
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
