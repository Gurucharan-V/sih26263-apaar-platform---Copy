import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, X, GitMerge, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CaseReview() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const [notes, setNotes] = useState('');

  const handleResolve = (action: 'approve' | 'reject' | 'merge') => {
    toast.success(`Case ${caseId} marked as ${action.toUpperCase()}`);
    navigate('/admin/cases');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Case Investigation: {caseId}</h1>
          <p className="text-sm text-slate-500">Cross-Institution Conflict Resolution & Verification Engine</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Record A */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-xs font-bold text-blue-600 uppercase">Institution Record A</span>
            <span className="text-xs bg-slate-100 px-2 py-0.5 rounded font-mono">VIT Vellore</span>
          </div>
          <div><p className="text-xs text-slate-400">Student Name</p><p className="font-semibold text-slate-800">Amitav Verma</p></div>
          <div><p className="text-xs text-slate-400">APAAR ID</p><p className="font-mono text-sm">9823-4512-3490</p></div>
          <div><p className="text-xs text-slate-400">Date of Birth</p><p className="text-sm">2003-08-14</p></div>
          <div><p className="text-xs text-slate-400">Guardian Name</p><p className="text-sm">Suresh K. Verma</p></div>
          <div><p className="text-xs text-slate-400">Enrolled Programme</p><p className="text-sm">B.Tech Computer Science (2024)</p></div>
        </div>

        {/* Record B */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-xs font-bold text-purple-600 uppercase">Institution Record B</span>
            <span className="text-xs bg-slate-100 px-2 py-0.5 rounded font-mono">DTU Delhi</span>
          </div>
          <div><p className="text-xs text-slate-400">Student Name</p><p className="font-semibold text-slate-800">Amitabh Verma</p></div>
          <div><p className="text-xs text-slate-400">APAAR ID</p><p className="font-mono text-sm">9823-4512-3490</p></div>
          <div><p className="text-xs text-slate-400">Date of Birth</p><p className="text-sm">2003-08-14</p></div>
          <div><p className="text-xs text-slate-400">Guardian Name</p><p className="text-sm">Suresh Verma</p></div>
          <div><p className="text-xs text-slate-400">Enrolled Programme</p><p className="text-sm">B.Tech Information Technology (2024)</p></div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border space-y-4">
        <h3 className="font-semibold text-sm text-slate-800">Auditor Adjudication & Action</h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Enter investigation remarks and evidence references..."
          className="w-full h-24 p-3 border rounded-lg text-sm"
        />
        <div className="flex justify-end gap-3">
          <button onClick={() => handleResolve('reject')} className="inline-flex items-center gap-1.5 px-4 py-2 border border-rose-300 text-rose-700 rounded-lg text-sm font-medium hover:bg-rose-50">
            <X className="w-4 h-4" /> Reject Both (Fraud)
          </button>
          <button onClick={() => handleResolve('merge')} className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50">
            <GitMerge className="w-4 h-4" /> Merge Records
          </button>
          <button onClick={() => handleResolve('approve')} className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 shadow">
            <Check className="w-4 h-4" /> Confirm & Retain Primary
          </button>
        </div>
      </div>
    </div>
  );
}
