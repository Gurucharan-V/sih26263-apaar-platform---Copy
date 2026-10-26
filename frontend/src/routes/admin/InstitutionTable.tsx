import React, { useState } from 'react';
import { Search, Filter, ExternalLink, X, Building2, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface InstitutionItem {
  code: string;
  name: string;
  state: string;
  approved: number;
  actual: number;
  status: 'Compliant' | 'Excess Intake';
  branches: { branch: string; approved: number; actual: number }[];
}

export default function InstitutionTable() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedInst, setSelectedInst] = useState<InstitutionItem | null>(null);

  const institutions: InstitutionItem[] = [
    {
      code: 'C-36965',
      name: 'Vellore Institute of Technology',
      state: 'Tamil Nadu',
      approved: 4200,
      actual: 4180,
      status: 'Compliant',
      branches: [
        { branch: 'Computer Science & Engineering', approved: 1200, actual: 1195 },
        { branch: 'Electronics & Communication', approved: 900, actual: 890 },
        { branch: 'Information Technology', approved: 600, actual: 595 },
        { branch: 'Mechanical Engineering', approved: 800, actual: 790 },
        { branch: 'Civil Engineering', approved: 700, actual: 710 }
      ]
    },
    {
      code: 'C-18491',
      name: 'Delhi Technological University',
      state: 'Delhi',
      approved: 2800,
      actual: 2842,
      status: 'Excess Intake',
      branches: [
        { branch: 'Computer Science & Engineering', approved: 480, actual: 480 },
        { branch: 'Information Technology', approved: 120, actual: 142 },
        { branch: 'Electronics & Comm', approved: 360, actual: 360 },
        { branch: 'Electrical Engineering', approved: 300, actual: 310 },
        { branch: 'Mechanical Engineering', approved: 400, actual: 405 }
      ]
    },
    {
      code: 'C-09122',
      name: 'Pune Institute of Computer Technology',
      state: 'Maharashtra',
      approved: 960,
      actual: 955,
      status: 'Compliant',
      branches: [
        { branch: 'Computer Engineering', approved: 360, actual: 360 },
        { branch: 'Information Technology', approved: 240, actual: 238 },
        { branch: 'Electronics & Telecomm', approved: 360, actual: 357 }
      ]
    },
    {
      code: 'C-44109',
      name: 'Bengal College of Engineering',
      state: 'West Bengal',
      approved: 600,
      actual: 642,
      status: 'Excess Intake',
      branches: [
        { branch: 'Computer Science & Engg', approved: 180, actual: 222 },
        { branch: 'Electronics & Comm', approved: 120, actual: 120 },
        { branch: 'Electrical Engineering', approved: 120, actual: 120 },
        { branch: 'Civil Engineering', approved: 180, actual: 180 }
      ]
    },
    {
      code: 'C-16622',
      name: 'Chennai Institute of Technology & Engineering',
      state: 'Tamil Nadu',
      approved: 1200,
      actual: 1180,
      status: 'Compliant',
      branches: [
        { branch: 'Computer Science & Engg', approved: 360, actual: 355 },
        { branch: 'Artificial Intelligence & DS', approved: 240, actual: 238 },
        { branch: 'Electronics & Comm', approved: 300, actual: 295 },
        { branch: 'Mechanical Engg', approved: 300, actual: 292 }
      ]
    }
  ];

  const filtered = institutions.filter(
    (i) => i.name.toLowerCase().includes(query.toLowerCase()) || i.code.toLowerCase().includes(query.toLowerCase()) || i.state.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Registered Institutions</h1>
          <p className="text-xs sm:text-sm text-slate-500">Monitor sanctioned vs ingested student capacity</p>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search AISHE code, name, state..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm bg-white w-64 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-bold border-b tracking-wider">
              <tr>
                <th className="p-3.5">AISHE Code</th>
                <th className="p-3.5">Institution Name</th>
                <th className="p-3.5">State</th>
                <th className="p-3.5 text-center">Approved Limit</th>
                <th className="p-3.5 text-center">Actual Enrolled</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((inst) => (
                <tr key={inst.code} className="hover:bg-slate-50 transition">
                  <td className="p-3.5 font-mono text-xs font-bold text-blue-700">{inst.code}</td>
                  <td className="p-3.5 font-semibold text-slate-900">{inst.name}</td>
                  <td className="p-3.5 text-slate-600 text-xs">{inst.state}</td>
                  <td className="p-3.5 text-center font-medium text-slate-700">{inst.approved.toLocaleString()}</td>
                  <td className={`p-3.5 text-center font-bold ${inst.status === 'Compliant' ? 'text-slate-800' : 'text-rose-700'}`}>
                    {inst.actual.toLocaleString()}
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${inst.status === 'Compliant' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
                      {inst.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => setSelectedInst(inst)}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition active:scale-95 inline-flex items-center gap-1"
                    >
                      <span>View Intake</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Institution Intake Details Modal */}
      {selectedInst && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="font-bold text-base text-slate-900">{selectedInst.name}</h3>
                  <p className="text-xs text-slate-500 font-mono">AISHE: {selectedInst.code} • {selectedInst.state}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedInst(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs p-3 bg-slate-50 rounded-xl">
                <div>
                  <span className="text-slate-400 block">Total Sanctioned</span>
                  <span className="font-bold text-slate-800 text-sm">{selectedInst.approved.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Total Enrolled</span>
                  <span className="font-bold text-rose-700 text-sm">{selectedInst.actual.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Compliance</span>
                  <span className={`font-bold text-xs ${selectedInst.status === 'Compliant' ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {selectedInst.status}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-700 mb-2">Programme-Wise Sanctioned Breakdown</h4>
                <div className="space-y-1.5 max-h-56 overflow-y-auto">
                  {selectedInst.branches.map((b, i) => (
                    <div key={i} className="p-2.5 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-800">{b.branch}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 font-mono">{b.actual} / {b.approved}</span>
                        {b.actual > b.approved ? (
                          <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.5 rounded">
                            +{b.actual - b.approved} Over
                          </span>
                        ) : (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                            OK
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t">
              <button
                onClick={() => {
                  setSelectedInst(null);
                  navigate('/admin/intake');
                }}
                className="text-xs font-bold text-rose-700 hover:underline flex items-center gap-1"
              >
                <span>Open Intake Discrepancies Matrix</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setSelectedInst(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
