import React from 'react';
import { FileCheck2, Download, ExternalLink, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function StudentDocuments() {
  const docs = [
    { name: 'Class X Secondary School Certificate', issuer: 'CBSE / State Board', docId: 'DOC-CBSE-99120', date: '2020', status: 'VERIFIED_DIGILOCKER' },
    { name: 'Class XII Higher Secondary Marksheet', issuer: 'CBSE / State Board', docId: 'DOC-HSC-44912', date: '2022', status: 'VERIFIED_DIGILOCKER' },
    { name: 'Institution Admission Allotment Order', issuer: 'Central / State Admissions Authority', docId: 'DOC-ALLOT-2022-89', date: '2022', status: 'SANCTIONED_INTAKE_CONFIRMED' },
    { name: 'Consolidated Semester Marksheet (Sem 1-4)', issuer: 'Affiliated University Examinations Board', docId: 'DOC-UNIV-2024-SEM4', date: '2024', status: 'VERIFIED_DIGILOCKER' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <FileCheck2 className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              DigiLocker Academic Documents
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Government of India DigiLocker digital repository linked with your 12-digit APAAR ID.
          </p>
        </div>

        <button
          onClick={() => toast.success('DigiLocker credentials refreshed!')}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Sync with DigiLocker</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {docs.map((doc, idx) => (
          <div key={idx} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs text-blue-600 font-bold">{doc.docId}</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
                </span>
              </div>
              <h3 className="font-bold text-sm text-slate-900">{doc.name}</h3>
              <p className="text-xs text-slate-500 mt-1">Issuer: {doc.issuer} • Issued {doc.date}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-600" /> SHA-256 Checksum Intact
              </span>
              <button
                onClick={() => toast.success(`Downloaded ${doc.name} (Signed PDF)`)}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-900 hover:underline flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" /> Download PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
