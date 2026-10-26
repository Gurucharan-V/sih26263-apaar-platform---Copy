import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Building2,
  Hash,
  Edit3
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useQueries, StudentQuery } from '../../hooks/useQueries';
import { useNotifications } from '../../hooks/useNotifications';
import { COLLEGE_DETAILS } from '../../services/collegeStudentService';
import toast from 'react-hot-toast';

export default function StudentQueries() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { queries, addQuery } = useQueries();
  const studentCollegeCode = user?.aisheCode || 'C-18491';
  const { sendNotification } = useNotifications('STUDENT', studentCollegeCode, user?.apaarId);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAishe, setSelectedAishe] = useState<string>(studentCollegeCode);
  const [category, setCategory] = useState<StudentQuery['category']>('APAAR_MISMATCH');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<StudentQuery['priority']>('MEDIUM');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const studentName = user?.name || 'Rohan Sundaram';
  const apaarId = user?.apaarId || '9842-1083-4912';

  // Current selected college info
  const collegeInfo = COLLEGE_DETAILS[selectedAishe] || {
    name: user?.institutionName || 'Easwari Engineering College',
    code: selectedAishe
  };

  // Filter queries for this student
  const cleanApaar = apaarId.replace(/[^0-9]/g, '');
  const myQueries = queries.filter((q) => {
    const qApaarClean = q.apaarId.replace(/[^0-9]/g, '');
    return (
      (cleanApaar && qApaarClean === cleanApaar) ||
      q.studentName.toLowerCase() === studentName.toLowerCase()
    );
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      toast.error('Please fill in both subject and description.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const targetInstitutionName = collegeInfo.name;
      const targetCode = selectedAishe;

      addQuery({
        studentName,
        apaarId,
        institution: `${targetInstitutionName} (${targetCode})`,
        aisheCode: targetCode,
        category,
        subject,
        description,
        priority
      });

      // 1. Notify National Moderator
      sendNotification({
        title: `Student Grievance Filed: ${subject}`,
        message: `${studentName} (${targetInstitutionName}) logged a ${priority} priority query: "${description.substring(0, 90)}..."`,
        targetRole: 'MODERATOR',
        sender: `Student: ${studentName}`,
        senderRole: 'STUDENT',
        type: priority === 'CRITICAL' || priority === 'HIGH' ? 'alert' : 'warning',
        actionUrl: '/admin/queries'
      });

      // 2. Notify College Nodal Office
      sendNotification({
        title: `Student Grievance Notice (${studentName})`,
        message: `Student filed grievance under category "${category}". Subject: ${subject}.`,
        targetRole: 'COLLEGE_NODAL',
        targetCollegeCode: targetCode,
        sender: `Student: ${studentName}`,
        senderRole: 'STUDENT',
        type: 'info',
        actionUrl: '/college/queries'
      });

      setIsSubmitting(false);
      setIsFormOpen(false);
      setSubject('');
      setDescription('');
      toast.success(`Query submitted to ${targetInstitutionName}! Updated in real-time on College & Moderator Portals.`);
    }, 400);
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
            Submit questions or corrections regarding your APAAR ID, academic records, or ABC credits directly to your college nodal officer.
          </p>

          {/* Active Student Username Badge */}
          <div className="flex items-center gap-2 mt-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-900 border border-purple-200 text-xs font-semibold">
              <User className="w-3.5 h-3.5 text-purple-600" />
              <span>Student: <strong className="font-bold text-purple-950">{user?.name || studentName}</strong></span>
              <span className="text-purple-400">•</span>
              <span className="font-mono text-purple-700 text-[11px]">{apaarId}</span>
            </div>
            <button
              onClick={() => navigate('/student/details')}
              className="text-xs text-purple-700 hover:text-purple-900 hover:underline font-bold flex items-center gap-1 transition cursor-pointer"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit Name</span>
            </button>
          </div>
        </div>

        <button
          onClick={() => {
            setSelectedAishe(user?.aisheCode || 'C-18491');
            setIsFormOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md transition active:scale-95 flex items-center gap-2 w-fit cursor-pointer"
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
              <div>
                <h3 className="font-bold text-lg text-slate-900">Raise Student Query / Grievance</h3>
                <p className="text-xs text-slate-500">Directly routed to your college grievance nodal desk</p>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* College Selection */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Target Institution / College <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedAishe}
                  onChange={(e) => setSelectedAishe(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                >
                  {Object.values(COLLEGE_DETAILS).map((col) => (
                    <option key={col.code} value={col.code}>
                      {col.name} ({col.code})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 mt-1">
                  Assigned AISHE Code: <span className="font-mono font-bold text-slate-600">{selectedAishe}</span>
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Query Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                >
                  <option value="APAAR_MISMATCH">APAAR ID Data Mismatch</option>
                  <option value="NAME_CORRECTION">Student Name / DOB Correction</option>
                  <option value="CREDIT_TRANSFER">Academic Bank of Credits (ABC) Discrepancy</option>
                  <option value="INTAKE_DISCREPANCY">Intake & Admission Status</option>
                  <option value="DIGILOCKER_SYNC">DigiLocker Document Sync Error</option>
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
                  Subject Line <span className="text-rose-500">*</span>
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
                  Detailed Explanation <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe the discrepancy in detail so the college admissions nodal officer can cross-verify against their bulk uploaded records..."
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
                  className="px-5 py-2 text-xs font-bold bg-purple-700 hover:bg-purple-800 text-white rounded-xl shadow-sm flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Submitting...' : 'Submit to College Nodal Desk'}</span>
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
              Your APAAR ID and academic records are in verified standing. If you notice any discrepancy, click "Raise New Query".
            </p>
          </div>
        ) : (
          myQueries.map((q) => (
            <div
              key={q.id}
              className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3 hover:border-purple-300 transition"
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

              <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-purple-50 text-purple-900 font-bold text-xs border border-purple-200/60">
                  <User className="w-3.5 h-3.5 text-purple-700" />
                  <span>Student: {user?.name || q.studentName}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium text-slate-700">{q.institution}</span>
                  {q.aisheCode && (
                    <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-mono">
                      AISHE: {q.aisheCode}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {user?.name && user.name !== 'Rohan Sundaram'
                  ? q.description.replace(/Rohan Sundaram/g, user.name)
                  : q.description}
              </p>

              {/* College / Moderator Response Callout */}
              {q.moderatorNotes ? (
                <div className="p-3.5 bg-emerald-50/80 rounded-xl border border-emerald-200 space-y-1">
                  <div className="flex items-center justify-between text-xs text-emerald-950 font-bold">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Resolution from College Nodal Cell
                    </span>
                    <span className="text-[10px] text-emerald-700 font-normal">
                      {q.resolvedBy}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-900">{q.moderatorNotes}</p>
                </div>
              ) : (
                <div className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200 flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-amber-600" />
                  <span>Pending review by {q.institution} admissions desk.</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
