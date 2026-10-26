import React, { useState } from 'react';
import {
  HelpCircle,
  Plus,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  User,
  Hash,
  ShieldAlert,
  Search,
  Filter,
  MessageSquare,
  FileText,
  AlertTriangle,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useQueries, StudentQuery } from '../../hooks/useQueries';
import { useNotifications } from '../../hooks/useNotifications';
import toast from 'react-hot-toast';

export default function CollegeQueries() {
  const { user } = useAuth();
  const collegeName = user?.institutionName || 'Easwari Engineering College';
  const collegeCode = user?.aisheCode || 'C-18491';

  const { queries, addQuery, updateQueryStatus } = useQueries();
  const { sendNotification } = useNotifications('COLLEGE_NODAL', collegeCode);

  const [activeTab, setActiveTab] = useState<'student_queries' | 'submit_grievance' | 'moderator_notices'>('student_queries');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING_REVIEW' | 'IN_PROGRESS' | 'RESOLVED'>('ALL');
  
  // Response modal
  const [selectedQuery, setSelectedQuery] = useState<StudentQuery | null>(null);
  const [replyText, setReplyText] = useState('');
  const [newStatus, setNewStatus] = useState<StudentQuery['status']>('RESOLVED');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  // New college grievance to moderator form
  const [instCategory, setInstCategory] = useState<'INTAKE_DISCREPANCY' | 'APAAR_MISMATCH' | 'CREDIT_TRANSFER'>('INTAKE_DISCREPANCY');
  const [instSubject, setInstSubject] = useState('');
  const [instDescription, setInstDescription] = useState('');
  const [instPriority, setInstPriority] = useState<StudentQuery['priority']>('HIGH');
  const [instReferenceId, setInstReferenceId] = useState('');
  const [isSubmittingInst, setIsSubmittingInst] = useState(false);

  // Filter queries relevant to this college
  const relevantQueries = queries.filter((q) => {
    const isThisCollege =
      q.institution.toLowerCase().includes(collegeName.toLowerCase()) ||
      q.institution.includes(collegeCode) ||
      (collegeCode === 'C-18491' && q.institution.toLowerCase().includes('easwari')) ||
      (collegeCode === 'C-16622' && q.institution.toLowerCase().includes('chennai'));

    // Also include general queries if searching specifically
    const matchesSearch =
      q.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.apaarId.includes(searchQuery) ||
      q.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || q.status === statusFilter;

    return (isThisCollege || searchQuery.length > 2) && matchesSearch && matchesStatus;
  });

  // Notices sent to this college from Moderator
  const noticesMap = (() => {
    try {
      return JSON.parse(localStorage.getItem('apaar_issued_notices') || '{}');
    } catch {
      return {};
    }
  })();
  const issuedNotices = (Object.values(noticesMap) as any[]).filter(
    (n) => n.collegeCode === collegeCode || n.institution.toLowerCase().includes(collegeName.toLowerCase()) || n.collegeCode === 'ALL' || n.collegeCode === 'C-18491'
  );

  // Handle responding to a student grievance
  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuery) return;
    if (!replyText.trim()) {
      toast.error('Please enter the college resolution or remarks.');
      return;
    }

    setIsSubmittingReply(true);
    setTimeout(() => {
      const updatedNotes = `[${collegeName} Admissions Nodal Cell]: ${replyText}`;
      updateQueryStatus(selectedQuery.id, newStatus, updatedNotes, `${collegeName} (${collegeCode})`);

      // 1. Notify Student
      sendNotification({
        title: `College Resolution: ${selectedQuery.subject.substring(0, 40)}`,
        message: `${collegeName} has updated your grievance status to ${newStatus}. Resolution: "${replyText}"`,
        targetRole: 'STUDENT',
        targetCollegeCode: collegeCode,
        sender: `${collegeName} Administration`,
        senderRole: 'COLLEGE_NODAL',
        type: newStatus === 'RESOLVED' ? 'info' : 'warning',
        actionUrl: '/student/queries'
      });

      // 2. Notify Moderator
      sendNotification({
        title: `College Handled Query ${selectedQuery.id}`,
        message: `${collegeName} (${collegeCode}) resolved student query for ${selectedQuery.studentName} (${selectedQuery.apaarId}).`,
        targetRole: 'MODERATOR',
        sender: `${collegeName} (${collegeCode})`,
        senderRole: 'COLLEGE_NODAL',
        type: 'info',
        actionUrl: '/admin/queries'
      });

      setIsSubmittingReply(false);
      setSelectedQuery(null);
      setReplyText('');
      toast.success('Grievance updated! Real-time notifications dispatched to Student & AICTE Moderator.');
    }, 450);
  };

  // Handle submitting college grievance to Moderator
  const handleSubmitCollegeGrievance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!instSubject.trim() || !instDescription.trim()) {
      toast.error('Please enter subject and description for the institutional grievance.');
      return;
    }

    setIsSubmittingInst(true);
    setTimeout(() => {
      const newGrievance = addQuery({
        studentName: `[Institution Nodal Officer] ${collegeName}`,
        apaarId: `AISHE:${collegeCode}`,
        institution: `${collegeName} (${collegeCode})`,
        category: instCategory,
        subject: `[${collegeCode}] ${instSubject}`,
        description: `Ref ID: ${instReferenceId || 'N/A'}\n\n${instDescription}`,
        priority: instPriority
      });

      // Notify National Moderator
      sendNotification({
        title: `Institutional Grievance: ${collegeName}`,
        message: `${collegeName} (${collegeCode}) submitted an institutional grievance: "${instSubject}". Priority: ${instPriority}`,
        targetRole: 'MODERATOR',
        sender: `${collegeName} (${collegeCode})`,
        senderRole: 'COLLEGE_NODAL',
        type: instPriority === 'CRITICAL' || instPriority === 'HIGH' ? 'alert' : 'warning',
        actionUrl: '/admin/queries'
      });

      setIsSubmittingInst(false);
      setInstSubject('');
      setInstDescription('');
      setInstReferenceId('');
      setActiveTab('student_queries');
      toast.success('Institutional grievance logged! Pop-up notification sent to National Moderator Cell.');
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-100 text-blue-800">
              <HelpCircle className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Grievance & Query Redressal Cell
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-mono font-bold">
              AISHE: {collegeCode}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Resolve student discrepancies and lodge official institutional petitions with the National Moderator
          </p>
        </div>

        <button
          onClick={() => setActiveTab('submit_grievance')}
          className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Raise Grievance to AICTE</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('student_queries')}
          className={`pb-3 px-3.5 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'student_queries'
              ? 'border-blue-700 text-blue-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Student Inquiries for {collegeName} ({relevantQueries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('submit_grievance')}
          className={`pb-3 px-3.5 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'submit_grievance'
              ? 'border-blue-700 text-blue-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Lodge Institutional Grievance to AICTE</span>
        </button>

        <button
          onClick={() => setActiveTab('moderator_notices')}
          className={`pb-3 px-3.5 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'moderator_notices'
              ? 'border-rose-600 text-rose-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-rose-600" />
          <span>Moderator Directives & Notices ({issuedNotices.length})</span>
        </button>
      </div>

      {/* TAB 1: Student Queries Assigned to this College */}
      {activeTab === 'student_queries' && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search student name, APAAR ID, subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs text-slate-500 font-medium">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold bg-white"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING_REVIEW">Pending Review</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
              </select>
            </div>
          </div>

          {/* List of queries */}
          {relevantQueries.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <h3 className="font-bold text-slate-800 text-sm">No Pending Student Grievances</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                All student inquiries for {collegeName} have been reviewed and resolved.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {relevantQueries.map((q) => {
                const isResolved = q.status === 'RESOLVED';
                const isPending = q.status === 'PENDING_REVIEW';
                const isCritical = q.priority === 'CRITICAL' || q.priority === 'HIGH';

                return (
                  <div
                    key={q.id}
                    className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 shadow-xs transition space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                          {q.id}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            isCritical ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {q.priority} Priority
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isResolved
                              ? 'bg-emerald-100 text-emerald-800'
                              : isPending
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {q.status.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Logged {q.createdAt}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{q.subject}</h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                        {q.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                      <div className="flex items-center gap-3 text-slate-500">
                        <span className="flex items-center gap-1 font-semibold text-slate-700">
                          <User className="w-3.5 h-3.5 text-blue-600" />
                          {q.studentName}
                        </span>
                        <span className="font-mono text-slate-600">
                          APAAR: {q.apaarId}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedQuery(q);
                          setNewStatus(q.status === 'RESOLVED' ? 'RESOLVED' : 'IN_PROGRESS');
                          setReplyText(q.moderatorNotes || '');
                        }}
                        className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold rounded-lg transition inline-flex items-center gap-1.5 cursor-pointer text-xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{q.moderatorNotes ? 'View / Edit Resolution' : 'Respond to Student'}</span>
                      </button>
                    </div>

                    {q.moderatorNotes && (
                      <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-emerald-950">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Official Resolution Note</span>
                        </div>
                        <p className="text-emerald-900">{q.moderatorNotes}</p>
                        {q.resolvedBy && (
                          <div className="text-[10px] text-emerald-700 font-medium">
                            Actioned by: {q.resolvedBy}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Submit Institutional Grievance to AICTE Moderator */}
      {activeTab === 'submit_grievance' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-2xl">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <Building2 className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="font-bold text-slate-900 text-base">
                Lodge Institutional Petition / Grievance to AICTE
              </h2>
              <p className="text-xs text-slate-500">
                Official institutional communication submitted directly to the National Ingestion & Moderation Oversight Cell
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmitCollegeGrievance} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Institution Name & AISHE
                </label>
                <input
                  type="text"
                  value={`${collegeName} (${collegeCode})`}
                  disabled
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-100 text-slate-600 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Grievance Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={instCategory}
                  onChange={(e) => setInstCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-semibold focus:ring-2 focus:ring-blue-500"
                >
                  <option value="INTAKE_DISCREPANCY">Sanctioned Intake Cap Adjustment</option>
                  <option value="APAAR_MISMATCH">Batch APAAR Ingestion Processing Error</option>
                  <option value="CREDIT_TRANSFER">Autonomous Curriculum / ABC Credit Transfer Dispute</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Directive Urgency / Priority <span className="text-rose-500">*</span>
                </label>
                <select
                  value={instPriority}
                  onChange={(e) => setInstPriority(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-semibold focus:ring-2 focus:ring-blue-500"
                >
                  <option value="LOW">Low (Routine Regulatory Query)</option>
                  <option value="MEDIUM">Medium (Standard Batch Verification)</option>
                  <option value="HIGH">High (Admission Quota Ceiling Overlap)</option>
                  <option value="CRITICAL">Critical (Statutory Show-Cause Appeal)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reference Batch / Allotment Order #
                </label>
                <input
                  type="text"
                  placeholder="e.g. BATCH-2024-EEC-09 or INC-101"
                  value={instReferenceId}
                  onChange={(e) => setInstReferenceId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Grievance Subject <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Request for AICTE verification of supernumerary intake under PMSSS quota"
                value={instSubject}
                onChange={(e) => setInstSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Detailed Regulatory Justification / Evidentiary Grounds <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                placeholder="State the regulatory basis, affiliation letter numbers, or university approvals supporting this correction..."
                value={instDescription}
                onChange={(e) => setInstDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-blue-500 leading-relaxed"
                required
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('student_queries')}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingInst}
                className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmittingInst ? 'Submitting to AICTE...' : 'Dispatch Petition to Moderator'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: Moderator Directives & Show Cause Notices */}
      {activeTab === 'moderator_notices' && (
        <div className="space-y-4">
          {issuedNotices.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <h3 className="font-bold text-slate-800 text-sm">No Show-Cause Directives Pending</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No statutory notices or over-intake show-cause orders have been issued to {collegeName} ({collegeCode}).
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {issuedNotices.map((n, i) => (
                <div
                  key={i}
                  className="p-5 bg-gradient-to-r from-rose-50 via-white to-amber-50 rounded-2xl border border-rose-300 shadow-sm space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-200 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 bg-rose-600 text-white rounded-lg">
                        <AlertTriangle className="w-4 h-4" />
                      </span>
                      <div>
                        <span className="font-mono text-xs font-black text-rose-900">{n.noticeRef}</span>
                        <div className="text-[11px] text-rose-800 font-bold">{n.institution} (AISHE: {n.collegeCode})</div>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-rose-700">
                      Dispatched {n.issuedAt}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-white p-3 rounded-xl border border-rose-100">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Programme</span>
                      <div className="font-bold text-slate-800">{n.programme}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Statutory Clause</span>
                      <div className="font-bold text-rose-800">{n.legalClause}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Response Window</span>
                      <div className="font-bold text-amber-700">{n.deadlineDays} Business Days</div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200 italic">
                    "{n.remarks}"
                  </p>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() => {
                        setInstSubject(`Formal Response to Show-Cause Order ${n.noticeRef}`);
                        setInstReferenceId(n.noticeRef);
                        setInstDescription(`Regarding ${n.noticeRef} issued under ${n.legalClause} for ${n.programme}:\n\nCollege admissions board hereby submits verified intake rosters confirming compliance.`);
                        setActiveTab('submit_grievance');
                      }}
                      className="px-3.5 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Compliance Response</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Reply Modal */}
      {selectedQuery && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-blue-700">{selectedQuery.id}</span>
                <h3 className="font-bold text-slate-900 text-sm mt-0.5">
                  Resolution for {selectedQuery.studentName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedQuery(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm px-2 py-1 rounded-md"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 border border-slate-100">
              <div className="font-bold text-slate-800">{selectedQuery.subject}</div>
              <div className="text-slate-600">{selectedQuery.description}</div>
              <div className="text-[11px] text-slate-400 font-mono pt-1">
                APAAR: {selectedQuery.apaarId} • Category: {selectedQuery.category}
              </div>
            </div>

            <form onSubmit={handleSendReply} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Update Query Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                >
                  <option value="RESOLVED">Resolved (Grievance Rectified)</option>
                  <option value="IN_PROGRESS">In Progress (Under Academic Cell Review)</option>
                  <option value="REJECTED">Rejected (Non-compliant with Guidelines)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  College Response / Resolution Notes <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="e.g. Academic records verified against university master database. APAAR credential updated in batch #EEC-2024."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setSelectedQuery(null)}
                  className="px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReply}
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmittingReply ? 'Dispatching...' : 'Dispatch Resolution'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
