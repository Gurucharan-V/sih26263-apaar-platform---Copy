import React from 'react';
import { Award, FileCheck2, CheckCircle2, Download, ExternalLink, Calendar, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';

export default function StudentCredits() {
  const semesters = [
    { sem: 'Semester 1', year: '2022-23', creditsEarned: 24, totalCredits: 24, sgpa: '8.85', status: 'LOCKED & VERIFIED' },
    { sem: 'Semester 2', year: '2022-23', creditsEarned: 26, totalCredits: 26, sgpa: '9.04', status: 'LOCKED & VERIFIED' },
    { sem: 'Semester 3', year: '2023-24', creditsEarned: 25, totalCredits: 25, sgpa: '8.90', status: 'LOCKED & VERIFIED' },
    { sem: 'Semester 4', year: '2023-24', creditsEarned: 27, totalCredits: 27, sgpa: '8.95', status: 'LOCKED & VERIFIED' },
    { sem: 'Semester 5', year: '2024-25', creditsEarned: 26, totalCredits: 26, sgpa: '8.88', status: 'IN PROGRESS' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <Award className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Academic Bank of Credits (ABC)
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            National Credit Transfer Framework (NCrF) repository verified by Anna University & EEC.
          </p>
        </div>

        <button
          onClick={() => toast.success('Downloaded official ABC Transcript!')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition"
        >
          <Download className="w-4 h-4" />
          <span>Export ABC Transcript</span>
        </button>
      </div>

      {/* Credit Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-400 font-medium">Accumulated Credits</span>
          <div className="text-2xl font-black text-blue-900 mt-1">128 Credits</div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">80% Degree Complete</span>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-400 font-medium">Cumulative CGPA</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">8.92 / 10</div>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">First Class with Distinction</span>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-400 font-medium">National ABC ID</span>
          <div className="text-xl font-mono font-bold text-slate-800 mt-1">ABC-984210834912</div>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">Authenticated National ABC Registry</span>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-400 font-medium">Credit Transfer Scheme</span>
          <div className="text-xl font-bold text-purple-700 mt-1">NEP 2020 NCrF</div>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">Autonomous Curriculum</span>
        </div>
      </div>

      {/* Breakdown Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-xs uppercase text-slate-600 tracking-wider">
          Semester-Wise Credit Audit
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50/50 text-slate-500 text-xs uppercase border-b">
            <tr>
              <th className="p-3.5">Semester</th>
              <th className="p-3.5">Academic Session</th>
              <th className="p-3.5">Credits Completed</th>
              <th className="p-3.5">SGPA</th>
              <th className="p-3.5">Verification Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {semesters.map((s, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition">
                <td className="p-3.5 font-bold text-slate-900">{s.sem}</td>
                <td className="p-3.5 font-mono text-xs text-slate-600">{s.year}</td>
                <td className="p-3.5 font-bold text-blue-700">{s.creditsEarned} Credits</td>
                <td className="p-3.5 font-mono font-bold text-slate-800">{s.sgpa}</td>
                <td className="p-3.5">
                  <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
