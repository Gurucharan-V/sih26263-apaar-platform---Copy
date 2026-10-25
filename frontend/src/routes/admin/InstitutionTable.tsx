import React, { useState } from 'react';
import { Search, Filter, ExternalLink } from 'lucide-react';

export default function InstitutionTable() {
  const [query, setQuery] = useState('');
  const institutions = [
    { code: 'C-36965', name: 'Vellore Institute of Technology', state: 'Tamil Nadu', approved: 4200, actual: 4180, status: 'Compliant' },
    { code: 'C-18491', name: 'Delhi Technological University', state: 'Delhi', approved: 2800, actual: 2840, status: 'Excess Intake' },
    { code: 'C-09122', name: 'Pune Institute of Computer Technology', state: 'Maharashtra', approved: 960, actual: 955, status: 'Compliant' },
    { code: 'C-44109', name: 'Bengal College of Engineering', state: 'West Bengal', approved: 600, actual: 642, status: 'Excess Intake' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Registered Institutions</h1>
          <p className="text-sm text-slate-500">Monitor sanctioned vs ingested student capacity</p>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search AISHE code or name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 pr-4 py-2 border rounded-lg text-sm bg-white"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-medium border-b">
            <tr>
              <th className="p-3">AISHE Code</th>
              <th className="p-3">Institution Name</th>
              <th className="p-3">State</th>
              <th className="p-3">Approved Limit</th>
              <th className="p-3">Actual Enrolled</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {institutions.map((inst) => (
              <tr key={inst.code} className="hover:bg-slate-50">
                <td className="p-3 font-mono text-xs">{inst.code}</td>
                <td className="p-3 font-medium text-slate-800">{inst.name}</td>
                <td className="p-3 text-slate-600">{inst.state}</td>
                <td className="p-3">{inst.approved}</td>
                <td className="p-3">{inst.actual}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${inst.status === 'Compliant' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                    {inst.status}
                  </span>
                </td>
                <td className="p-3">
                  <button className="text-xs text-blue-600 hover:underline">View Intake</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
