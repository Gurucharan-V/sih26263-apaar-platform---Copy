import React, { useState } from 'react';
import { 
  HelpCircle, 
  Plus, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ShieldCheck, 
  MessageSquare,
  FileText,
  User,
  Building2
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useQueries, StudentQuery } from '../../hooks/useQueries';
import toast from 'react-hot-toast';

export default function StudentQueries() {
  const { user } = useAuth();
  const { queries, addQuery } = useQueries();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [category, setCategory] = useState<StudentQuery['category']>('APAAR_MISMATCH');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<StudentQuery['priority']>('MEDIUM');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const studentName = user?.name || 'Rohan Sundaram';
  const apaarId = user?.apaarId || '9842-1083-4912';
  const institution = user?.institutionName || 'Easwari Engineering College (EEC)';

  // Filter queries for this student
  const myQueries = queries.filter(
    (q) => q.apaarId === apaarId || q.studentName.toLowerCase() === studentName.toLowerCase()
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      toast.error('Please fill in both subject and description.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      addQuery({
        studentName,
        apaarId,
        institution,
        category,
        subject,
        description,
        priority
      });
      setIsSubmitting(false);
      setIsFormOpen(false);
      setSubject('');
      setDescription('');
      toast.success('Query submitted to National Moderator Desk!');
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <HelpCircle className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Student Grievance & Query Desk
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Submit questions or corrections regarding your APAAR ID, DigiLocker certificates, or ABC credits.
          </p>
        </div>

        <button
          onClick={() => setIsFormOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md transition active:scale-95 flex items-center gap-2 w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Raise New Query</span>
        </button>
      </div>

      {/* New Query Modal Form */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-slate-900">Raise Student Query / Grievance</h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Query Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                >
                  <option value="APAAR_MISMATCH">APAAR ID Data Mismatch</option>
                  <option value="NAME_CORRECTION">Student Name / DOB Correction</option>
                  <option value="CREDIT_TRANSFER">Academic Bank of Credits (ABC) Discrepancy</option>
                  <option value="DIGILOCKER_SYNC">DigiLocker Verification Issue</option>
                  <option value="INTAKE_DISCREPANCY">Intake & Admission Status</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Urgency / Priority
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['LOW', 'MEDIUM', 'HIGH'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`py-1.5 rounded-lg text-xs font-bold border transition ${
                        priority === p
                          ? 'bg-purple-50 border-purple-400 text-purple-700'
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Subject Line
                </label>
                <input
                  type="text"
                  placeholder="e.g. Middle name initial missing in APAAR digital card"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Detailed Explanation
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe the discrepancy in detail so the moderator can cross-verify against AICTE records..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold bg-purple-700 hover:bg-purple-800 text-white rounded-xl shadow-sm flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Submitting...' : 'Submit to Moderator'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Queries List */}
      <div className="space-y-3">
        {myQueries.length === 0 ? (
          <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="font-bold text-slate-800 text-sm">No Active Grievance Queries</h3>
            <p className="text-xs text-slate-500">
              Your APAAR ID and academic records are in verified standing.
            </p>
          </div>
        ) : (
          myQueries.map((q) => (
            <div
              key={q.id}
              className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-200">
                    {q.id}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900">{q.subject}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${
                      q.status === 'RESOLVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : q.status === 'IN_PROGRESS'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {q.status === 'RESOLVED' ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    ) : q.status === 'IN_PROGRESS' ? (
                      <Clock className="w-3 h-3 text-blue-600" />
                    ) : (
                      <AlertCircle className="w-3 h-3 text-amber-600" />
                    )}
                    {q.status.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{q.createdAt}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{q.description}</p>

              {/* Moderator Response Callout */}
              {q.moderatorNotes && (
                <div className="p-3.5 bg-purple-50/70 rounded-xl border border-purple-200 space-y-1">
                  <div className="flex items-center justify-between text-xs text-purple-900 font-bold">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                      Official Moderator Resolution Notes
                    </span>
                    <span className="text-[10px] text-purple-600 font-normal">
                      {q.resolvedBy}
                    </span>
                  </div>
                  <p className="text-xs text-purple-800">{q.moderatorNotes}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
