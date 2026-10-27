import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  UploadCloud, 
  UserPlus, 
  AlertTriangle, 
  CheckCircle, 
  CheckCircle2,
  FileText, 
  Building2, 
  Hash, 
  Send, 
  X, 
  Bell, 
  HelpCircle,
  Download,
  ShieldCheck,
  Search,
  Users,
  Sparkles,
  Layers,
  Edit3
} from 'lucide-react';
import { StatCard } from '../../components/charts/StatCard';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { useCollegeData } from '../../hooks/useCollegeData';
import { useQueries } from '../../hooks/useQueries';
import { downloadStandardCsvTemplate } from '../../utils/csvTemplate';
import { CrossVerificationResult, saveCollegeDetails } from '../../services/collegeStudentService';
import toast from 'react-hot-toast';

export default function CollegeDashboard() {
  const { user, updateUserProfile } = useAuth();
  const collegeCode = user?.aisheCode || 'C-18491';
  const { sendNotification } = useNotifications('COLLEGE_NODAL', collegeCode);
  const { collegeDetails, students, batches, crossVerify, refreshData } = useCollegeData(collegeCode);
  const { queries } = useQueries();

  // Edit College Profile Modal State
  const [showEditCollegeModal, setShowEditCollegeModal] = useState(false);
  const [editName, setEditName] = useState(collegeDetails.name);
  const [editShortName, setEditShortName] = useState(collegeDetails.shortName);
  const [editAffiliation, setEditAffiliation] = useState(collegeDetails.affiliation);
  const [editState, setEditState] = useState(collegeDetails.state);
  const [editCity, setEditCity] = useState(collegeDetails.city);
  const [editNodalName, setEditNodalName] = useState(collegeDetails.nodalOfficer?.name || '');
  const [editNodalEmail, setEditNodalEmail] = useState(collegeDetails.nodalOfficer?.email || '');
  const [editNodalPhone, setEditNodalPhone] = useState(collegeDetails.nodalOfficer?.phone || '');

  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [targetAudience, setTargetAudience] = useState<'MODERATOR' | 'STUDENT'>('MODERATOR');
  const [noticeTitle, setNoticeTitle] = useState('Admission Batch Verification Completed');
  const [noticeMessage, setNoticeMessage] = useState('College administration has completed preliminary document audits for current admissions cycle.');

  // Quick APAAR Cross-Verification Widget State
  const [verifyApaarInput, setVerifyApaarInput] = useState('');
  const [verifyNameInput, setVerifyNameInput] = useState('');
  const [quickVerifyResult, setQuickVerifyResult] = useState<CrossVerificationResult | null>(null);

  const collegeName = collegeDetails.name;

  // Student queries matching this college
  const collegePendingQueries = queries.filter(
    (q) =>
      ((q.aisheCode && q.aisheCode.toUpperCase() === collegeCode.toUpperCase()) ||
        q.institution.toLowerCase().includes(collegeName.toLowerCase()) ||
        collegeName.toLowerCase().includes(q.institution.toLowerCase())) &&
      q.status !== 'RESOLVED'
  );

  const handleQuickVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyApaarInput.trim()) {
      toast.error('Please enter a 12-digit APAAR ID');
      return;
    }

    const res = crossVerify(verifyApaarInput, verifyNameInput);
    setQuickVerifyResult(res);
    if (res.isVerified) {
      toast.success(`Verified: APAAR ID exists in ${collegeDetails.shortName} uploaded bulk list!`);
    } else {
      toast.error(res.message);
    }
  };

  const handleSendCollegeNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeMessage.trim()) {
      toast.error('Please enter notice title and message');
      return;
    }

    sendNotification({
      title: `${collegeName} Notice: ${noticeTitle}`,
      message: noticeMessage,
      targetRole: targetAudience,
      targetCollegeCode: collegeCode,
      sender: `${collegeName} (${collegeCode})`,
      senderRole: 'COLLEGE_NODAL',
      type: 'info',
      actionUrl: targetAudience === 'MODERATOR' ? '/admin/cases' : '/student'
    });

    toast.success(`Information dispatched to ${targetAudience === 'MODERATOR' ? 'National Moderator' : 'Students'}! Pop-up notification sent.`);
    setShowNoticeModal(false);
  };

  const handleSaveCollegeProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      toast.error('College / University name cannot be empty');
      return;
    }

    const updated = saveCollegeDetails(collegeCode, {
      name: editName.trim(),
      shortName: editShortName.trim() || collegeCode,
      affiliation: editAffiliation.trim(),
      state: editState.trim(),
      city: editCity.trim(),
      nodalOfficer: {
        name: editNodalName.trim(),
        email: editNodalEmail.trim(),
        phone: editNodalPhone.trim(),
        designation: collegeDetails.nodalOfficer?.designation || 'Dean & Nodal Officer'
      }
    });

    updateUserProfile({
      institutionName: editName.trim(),
      name: editNodalName.trim() || user?.name,
      email: editNodalEmail.trim() || user?.email
    });

    refreshData();
    setShowEditCollegeModal(false);
    toast.success(`Institute name updated to "${editName.trim()}"!`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with College Details */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">{collegeName}</h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-mono font-bold">
              <Hash className="w-3 h-3" />
              <span>AISHE: {collegeCode}</span>
            </span>
            <button
              type="button"
              onClick={() => {
                setEditName(collegeDetails.name);
                setEditShortName(collegeDetails.shortName);
                setEditAffiliation(collegeDetails.affiliation);
                setEditState(collegeDetails.state);
                setEditCity(collegeDetails.city);
                setEditNodalName(collegeDetails.nodalOfficer?.name || '');
                setEditNodalEmail(collegeDetails.nodalOfficer?.email || '');
                setEditNodalPhone(collegeDetails.nodalOfficer?.phone || '');
                setShowEditCollegeModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition cursor-pointer"
              title="Change or Edit College / Institute Name"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Change Institute Name</span>
            </button>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            {collegeDetails.affiliation} • {collegeDetails.city}, {collegeDetails.state}
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => downloadStandardCsvTemplate(collegeCode, collegeDetails.shortName)}
            className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Standard CSV Template</span>
          </button>
          <Link
            to="/college/queries"
            className="inline-flex items-center gap-1.5 bg-white border border-blue-200 text-blue-800 hover:bg-blue-50 px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs transition relative"
          >
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>Grievances & Queries</span>
            {collegePendingQueries.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[10px] font-black">
                {collegePendingQueries.length}
              </span>
            )}
          </Link>
          <Link
            to="/college/students/new"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm transition"
          >
            <UserPlus className="w-3.5 h-3.5" /> Register Student (College Side)
          </Link>
          <Link
            to="/college/upload"
            className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs transition"
          >
            <UploadCloud className="w-3.5 h-3.5" /> Bulk Upload CSV
          </Link>
        </div>
      </div>

      {/* College Outgoing Notice Modal */}
      {showNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-blue-100 text-blue-700 rounded-xl">
                  <Send className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Send Notice from College</h3>
                  <p className="text-xs text-slate-500">Dispatches real-time pop-up notifications to recipient portal</p>
                </div>
              </div>
              <button
                onClick={() => setShowNoticeModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendCollegeNotice} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Recipient</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTargetAudience('MODERATOR')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition text-center ${
                      targetAudience === 'MODERATOR'
                        ? 'bg-purple-50 border-purple-400 text-purple-900 ring-2 ring-purple-100'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    National Moderator
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetAudience('STUDENT')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition text-center ${
                      targetAudience === 'STUDENT'
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-900 ring-2 ring-emerald-100'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    Enrolled Students
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notice Subject</label>
                <input
                  type="text"
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                  placeholder="e.g. Admission Batch Verification Completed"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notice Information / Message</label>
                <textarea
                  rows={3}
                  value={noticeMessage}
                  onChange={(e) => setNoticeMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  placeholder="Enter information to send to the recipient..."
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNoticeModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Notification Pop-up</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* College Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Sanctioned Intake"
          value={collegeDetails.sanctionedIntake.toLocaleString()}
          change={`Approved by ${collegeDetails.affiliation.split('(')[0].trim()}`}
          icon={CheckCircle}
          color="blue"
        />
        <StatCard
          title="Active Student File Set"
          value={`${students.length} Students`}
          change={`${batches.length} Batches Ingested`}
          icon={FileText}
          color="emerald"
        />
        <StatCard
          title="Student Queries"
          value={`${collegePendingQueries.length} Pending`}
          change={`${queries.length} Total System Queries`}
          icon={HelpCircle}
          color="amber"
        />
        <StatCard
          title="Uploaded Batches"
          value={`${batches.length} Files`}
          change="Automated Verhoeff Verifier"
          icon={UploadCloud}
          color="blue"
        />
      </div>

      {/* Interactive APAAR Cross-Verification Card */}
      <div className="p-6 bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 rounded-3xl text-white shadow-lg border border-blue-800/40 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-blue-500/20 text-blue-300 rounded-xl border border-blue-400/30">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-white">
                Live APAAR ID Cross-Verification against {collegeDetails.shortName} Bulk List
              </h2>
              <p className="text-xs text-slate-300">
                Instantly check if a student's APAAR ID is verified in this college's uploaded bulk records ({students.length} students)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/upload"
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 backdrop-blur-sm transition flex items-center gap-1.5"
            >
              <span>Full Verification Desk</span>
            </Link>
          </div>
        </div>

        {/* Quick Cross-Verification Form */}
        <form onSubmit={handleQuickVerify} className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div>
            <input
              type="text"
              placeholder="Enter 12-digit APAAR ID (e.g. 9842-1083-4912)"
              value={verifyApaarInput}
              onChange={(e) => setVerifyApaarInput(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Optional Student Name (e.g. Rohan Sundaram)"
              value={verifyNameInput}
              onChange={(e) => setVerifyNameInput(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Cross-Verify Against Bulk Roster</span>
            </button>
          </div>
        </form>

        {/* Quick Sample Students from this College */}
        <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
          <span className="text-slate-400 text-[11px]">Quick test samples from {collegeDetails.shortName}:</span>
          {students.slice(0, 3).map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setVerifyApaarInput(s.apaarId);
                setVerifyNameInput(s.name);
                const res = crossVerify(s.apaarId, s.name);
                setQuickVerifyResult(res);
              }}
              className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-[11px] font-mono text-blue-200 transition cursor-pointer"
            >
              {s.name} ({s.apaarId})
            </button>
          ))}
        </div>

        {/* Cross-Verification Result Display */}
        {quickVerifyResult && (
          <div
            className={`p-4 rounded-2xl border text-xs space-y-2 animate-in fade-in ${
              quickVerifyResult.status === 'VERIFIED_MATCH'
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                : quickVerifyResult.status === 'WRONG_COLLEGE_ROSTER'
                ? 'bg-rose-950/60 border-rose-500/40 text-rose-200'
                : 'bg-amber-950/60 border-amber-500/40 text-amber-200'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm">
              {quickVerifyResult.isVerified ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              )}
              <span>{quickVerifyResult.message}</span>
            </div>
            {quickVerifyResult.matchedRecord && (
              <div className="font-mono text-[11px] text-slate-300 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-white/10">
                <div>Name: <span className="text-white font-bold">{quickVerifyResult.matchedRecord.name}</span></div>
                <div>Roll #: <span className="text-white font-bold">{quickVerifyResult.matchedRecord.rollNo}</span></div>
                <div>Programme: <span className="text-white font-bold">{quickVerifyResult.matchedRecord.programmeId}</span></div>
                <div>Batch: <span className="text-blue-300 font-bold">{quickVerifyResult.matchedRecord.batchId || 'Master Roster'}</span></div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Statutory Directives & AICTE Intake Notices from Moderator */}
      {(() => {
        try {
          const noticesMap = JSON.parse(localStorage.getItem('apaar_issued_notices') || '{}');
          const noticesList = Object.values(noticesMap) as any[];
          const relevantNotices = noticesList.filter(
            (n) => n.collegeCode === collegeCode || n.institution.toLowerCase().includes(collegeName.toLowerCase()) || n.collegeCode === 'C-18491'
          );

          if (relevantNotices.length === 0) return null;

          return (
            <div className="p-6 bg-gradient-to-r from-rose-50 via-white to-amber-50 rounded-2xl border-2 border-rose-300 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-rose-200 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 bg-rose-600 text-white rounded-xl shadow-xs">
                    <AlertTriangle className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="font-extrabold text-base text-rose-950">
                      Statutory Show-Cause Directives from AICTE Moderator ({relevantNotices.length})
                    </h3>
                    <p className="text-xs text-rose-800">
                      Formal intake ceiling compliance directives dispatched under Section 10(k) AICTE Act
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-rose-600 text-white rounded-full text-xs font-black animate-pulse">
                  ACTION REQUIRED
                </span>
              </div>

              <div className="space-y-3">
                {relevantNotices.map((n, i) => (
                  <div key={i} className="p-4 bg-white rounded-xl border border-rose-200 shadow-xs space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="font-mono text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          {n.noticeRef}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900 mt-1">
                          Intake Ceiling Breach in {n.programme}
                        </h4>
                      </div>
                      <div className="text-right text-xs text-slate-500">
                        <div>Issued: {n.issuedAt}</div>
                        <div className="text-rose-700 font-bold">Window: Within {n.deadlineDays} Calendar Days</div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-200 leading-relaxed">
                      {n.remarks}
                    </p>
                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        onClick={() => {
                          sendNotification({
                            title: `College Acknowledgment: ${n.noticeRef}`,
                            message: `${collegeName} (${collegeCode}) has acknowledged receipt of statutory notice ${n.noticeRef}. Certified admission roster & justification submitted for review.`,
                            targetRole: 'MODERATOR',
                            sender: `${collegeName} Nodal Officer`,
                            senderRole: 'COLLEGE_NODAL',
                            type: 'info',
                            actionUrl: '/admin/intake'
                          });
                          toast.success(`Compliance acknowledgment dispatched to AICTE Moderator for ${n.noticeRef}!`);
                        }}
                        className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Acknowledge & Submit Response to Moderator</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        } catch {
          return null;
        }
      })()}

      {/* Guidelines and Standards Card */}
      <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-base font-bold text-slate-900">
            College Ingestion Guidelines & Verification Rules
          </h2>
          <span className="text-xs text-blue-700 font-bold">
            AISHE: {collegeCode}
          </span>
        </div>
        <div className="grid md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-100 space-y-1 overflow-hidden">
            <h3 className="font-bold text-blue-900">Dedicated College Student File Sets</h3>
            <p className="text-blue-700 leading-relaxed">
              Every college maintains its own distinct student roster. Bulk CSV ingestion saves directly to {collegeDetails.shortName}'s verified database.
            </p>
          </div>
          <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-100 space-y-2 overflow-hidden flex flex-col justify-between">
            <div className="space-y-1.5">
              <h3 className="font-bold text-emerald-900">Standard CSV Column Formatting</h3>
              <p className="text-emerald-800 leading-relaxed text-[11px]">
                Ensure CSV files include exact standard headers:
              </p>
              <div className="p-2.5 bg-emerald-100/80 rounded-lg border border-emerald-200/80 font-mono text-[10.5px] text-emerald-950 font-semibold break-words whitespace-normal leading-relaxed tracking-tight select-all">
                name, apaarId, dateOfBirth, gender, guardianName, email, contactPhone, programmeId, enrollmentYear, rollNo, aisheCode
              </div>
            </div>
            <p className="text-[10px] text-emerald-700/80 font-medium">
              Matches official MoE / AICTE standard template schema.
            </p>
          </div>
          <div className="p-4 bg-purple-50/70 rounded-xl border border-purple-100 space-y-1 overflow-hidden">
            <h3 className="font-bold text-purple-900">Real-Time Grievance Redressal</h3>
            <p className="text-purple-700 leading-relaxed">
              Student inquiries directed to {collegeCode} sync across tabs instantly. Resolving queries updates the student's status in real-time.
            </p>
          </div>
        </div>
      </div>

      {/* Edit College Profile & Name Modal */}
      {showEditCollegeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 space-y-5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-blue-100 text-blue-700">
                  <Building2 className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    Edit Institution Profile & Name
                  </h3>
                  <p className="text-xs text-slate-500">
                    Update certified college details for AISHE code <span className="font-mono font-bold text-blue-700">{collegeCode}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowEditCollegeModal(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCollegeProfile} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-700 mb-1">
                  Full Institution / College Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. Easwari Engineering College"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Short Name / Acronym</label>
                  <input
                    type="text"
                    value={editShortName}
                    onChange={(e) => setEditShortName(e.target.value)}
                    placeholder="e.g. EEC"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Affiliated University / Board</label>
                  <input
                    type="text"
                    value={editAffiliation}
                    onChange={(e) => setEditAffiliation(e.target.value)}
                    placeholder="e.g. Anna University, Chennai"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">City / District</label>
                  <input
                    type="text"
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    placeholder="e.g. Chennai"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">State / UT</label>
                  <input
                    type="text"
                    value={editState}
                    onChange={(e) => setEditState(e.target.value)}
                    placeholder="e.g. Tamil Nadu"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>
              </div>

              {/* Nodal Officer Section */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wide">
                  Institutional Nodal Officer Credentials
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 mb-1">Nodal Officer Name</label>
                    <input
                      type="text"
                      value={editNodalName}
                      onChange={(e) => setEditNodalName(e.target.value)}
                      placeholder="e.g. Dr. R. Rajesh"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1">Nodal Officer Email</label>
                    <input
                      type="email"
                      value={editNodalEmail}
                      onChange={(e) => setEditNodalEmail(e.target.value)}
                      placeholder="e.g. nodal.admissions@easwari.ac.in"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-blue-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Nodal Office Contact Phone</label>
                  <input
                    type="text"
                    value={editNodalPhone}
                    onChange={(e) => setEditNodalPhone(e.target.value)}
                    placeholder="e.g. +91 44 2249 0853"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditCollegeModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Institute Profile</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
