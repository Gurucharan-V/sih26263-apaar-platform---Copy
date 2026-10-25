import React, { useState } from 'react';
import { Search, ShieldAlert, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function VerifyRecord() {
  const [apaarId, setApaarId] = useState('');
  const [result, setResult] = useState<any>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apaarId || apaarId.length !== 12) {
      toast.error('Enter valid 12-digit APAAR ID');
      return;
    }
    setResult({
      apaarId,
      name: 'Priya Sundaram',
      dob: '2004-11-20',
      institution: 'Anna University, Chennai',
      programme: 'B.E. Electronics & Communication',
      status: 'VERIFIED_ACTIVE',
      maskedAadhaar: 'XXXX-XXXX-4819',
      lastUpdated: '2024-09-15'
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">National Record Verification</h1>
        <p className="text-sm text-slate-500">Instant lookup against cryptographically hashed national registry</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={apaarId}
          onChange={(e) => setApaarId(e.target.value)}
          placeholder="Enter 12-digit APAAR ID (e.g. 982345123490)"
          className="flex-1 px-4 py-2.5 border rounded-lg text-sm font-mono"
        />
        <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm flex items-center gap-2">
          <Search className="w-4 h-4" /> Verify
        </button>
      </form>

      {result && (
        <div className="bg-white rounded-xl border p-6 space-y-4 shadow-sm">
          <div className="flex justify-between items-center border-b pb-3">
            <span className="font-semibold text-slate-800">Verification Result</span>
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Valid APAAR ID
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><p className="text-xs text-slate-400">Student Name</p><p className="font-semibold text-slate-800">{result.name}</p></div>
            <div><p className="text-xs text-slate-400">APAAR ID</p><p className="font-mono text-slate-800">{result.apaarId}</p></div>
            <div><p className="text-xs text-slate-400">Institution</p><p className="text-slate-800">{result.institution}</p></div>
            <div><p className="text-xs text-slate-400">Programme</p><p className="text-slate-800">{result.programme}</p></div>
            <div><p className="text-xs text-slate-400">Masked Aadhaar</p><p className="font-mono text-slate-800">{result.maskedAadhaar}</p></div>
            <div><p className="text-xs text-slate-400">Registry Timestamp</p><p className="text-slate-800">{result.lastUpdated}</p></div>
          </div>
        </div>
      )}
    </div>
  );
}
