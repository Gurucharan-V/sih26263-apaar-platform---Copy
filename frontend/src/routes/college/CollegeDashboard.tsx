import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UploadCloud, UserPlus, AlertTriangle, CheckCircle, FileText, Building2, Hash, Send, X, Bell } from 'lucide-react';
import { StatCard } from '../../components/charts/StatCard';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import toast from 'react-hot-toast';

export default function CollegeDashboard() {
  const { user } = useAuth();
  const collegeName = user?.institutionName || 'National Institute of Technology & Engineering';
  const collegeCode = user?.aisheCode || 'C-16622';
  const { sendNotification } = useNotifications('COLLEGE_NODAL', collegeCode);

  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [targetAudience, setTargetAudience] = useState<'MODERATOR' | 'STUDENT'>('MODERATOR');
  const [noticeTitle, setNoticeTitle] = useState('Admission Batch Verification Completed');
  const [noticeMessage, setNoticeMessage] = useState('College administration has completed preliminary document audits for current admissions cycle.');

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">College Administration Portal</h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-mono font-bold">
              <Hash className="w-3 h-3" />
              <span>AISHE: {collegeCode}</span>
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">{collegeName}</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => setShowNoticeModal(true)}
            className="inline-flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm transition cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" /> Send Info to Moderator / Students
          </button>
          <Link
            to="/college/students/new"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm transition"
          >
            <UserPlus className="w-3.5 h-3.5" /> Register Student (College Side)
          </Link>
          <Link
            to="/college/upload"
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs transition"
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
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow transition flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Notification Pop-up</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Approved Intake (2024-25)" value="2,400" change="AICTE Approved" icon={CheckCircle} color="blue" />
        <StatCard title="Total Enrolled" value="2,280" change="95% Utilization" icon={FileText} color="emerald" />
        <StatCard title="Pending Validation" value="48" change="In BullMQ worker queue" icon={UploadCloud} color="amber" />
        <StatCard title="Flagged Anomalies" value="12" change="Requires Correction" icon={AlertTriangle} color="rose" />
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
                        className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs transition active:scale-95 flex items-center gap-1.5"
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

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-base font-semibold text-slate-900 mb-4">Quick Batch Actions & Guidelines</h2>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="font-semibold text-blue-900 mb-1">APAAR Format Requirements</h3>
            <p className="text-blue-700 text-xs">Ensure 12-digit APAAR numbers are formatted with Verhoeff/Luhn checksum validation.</p>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
            <h3 className="font-semibold text-amber-900 mb-1">Intake Capping Alert</h3>
            <p className="text-amber-700 text-xs">B.Tech Computer Engineering is at 98% of sanctioned capacity (705/720).</p>
          </div>
          <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
            <h3 className="font-semibold text-emerald-900 mb-1">Automated Resolution</h3>
            <p className="text-emerald-700 text-xs">Fuzzy-matched duplicates within 2% string edit distance are highlighted for review.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
