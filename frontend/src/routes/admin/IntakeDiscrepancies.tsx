import React, { useState, useEffect } from 'react';
import { AlertTriangle, Send, CheckCircle2, FileText, X, ShieldAlert, Building2, Calendar, Scale, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNotifications } from '../../hooks/useNotifications';

interface DiscrepancyItem {
  id: string;
  institution: string;
  collegeCode: string;
  programme: string;
  approved: number;
  enrolled: number;
  delta: string;
  flag: string;
  state: string;
}

const INITIAL_DISCREPANCIES: DiscrepancyItem[] = [
  { id: 'INC-101', institution: 'Delhi Technological University', collegeCode: 'C-41209', programme: 'B.Tech IT', approved: 120, enrolled: 142, delta: '+22 (+18.3%)', flag: 'High Over-Intake', state: 'Delhi' },
  { id: 'INC-102', institution: 'Bengal College of Engineering', collegeCode: 'C-44109', programme: 'B.Tech CSE', approved: 180, enrolled: 222, delta: '+42 (+23.3%)', flag: 'High Over-Intake', state: 'West Bengal' },
  { id: 'INC-103', institution: 'St. Mary Technical Institute', collegeCode: 'C-53104', programme: 'MBA Fin', approved: 60, enrolled: 72, delta: '+12 (+20.0%)', flag: 'Moderate Over-Intake', state: 'Karnataka' },
  { id: 'INC-104', institution: 'Apex Institute of Science & Technology', collegeCode: 'C-62840', programme: 'B.Tech AI & Data', approved: 60, enrolled: 78, delta: '+18 (+30.0%)', flag: 'Severe Over-Intake', state: 'Maharashtra' }
];

interface IssuedNotice {
  noticeRef: string;
  discrepancyId: string;
  institution: string;
  collegeCode: string;
  programme: string;
  issuedAt: string;
  issuedBy: string;
  legalClause: string;
  deadlineDays: number;
  remarks: string;
}

export default function IntakeDiscrepancies() {
  const { sendNotification } = useNotifications('MODERATOR');
  const [discrepancies] = useState<DiscrepancyItem[]>(INITIAL_DISCREPANCIES);
  
  // Track issued notices
  const [issuedNotices, setIssuedNotices] = useState<Record<string, IssuedNotice>>(() => {
    try {
      const saved = localStorage.getItem('apaar_issued_notices');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Modal state
  const [activeModalItem, setActiveModalItem] = useState<DiscrepancyItem | null>(null);
  const [viewingNotice, setViewingNotice] = useState<IssuedNotice | null>(null);
  const [deadlineDays, setDeadlineDays] = useState(7);
  const [customRemarks, setCustomRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('apaar_issued_notices', JSON.stringify(issuedNotices));
  }, [issuedNotices]);

  const handleOpenNoticeModal = (item: DiscrepancyItem) => {
    setActiveModalItem(item);
    setDeadlineDays(7);
    setCustomRemarks(`Institution ceiling of ${item.approved} students in ${item.programme} has been exceeded by ${item.delta}. Dual enrollments and unapproved seats beyond AICTE sanction must be justified with formal council approval within ${deadlineDays} calendar days.`);
  };

  const handleDispatchNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalItem) return;

    setIsSubmitting(true);
    const noticeRef = `AICTE/REG/NOTC/2026/${activeModalItem.id}`;

    setTimeout(() => {
      const noticeRecord: IssuedNotice = {
        noticeRef,
        discrepancyId: activeModalItem.id,
        institution: activeModalItem.institution,
        collegeCode: activeModalItem.collegeCode,
        programme: activeModalItem.programme,
        issuedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        issuedBy: 'Dr. V. K. Sharma (AICTE Oversight Cell)',
        legalClause: 'Section 10(k) and 14(1) of AICTE Act, 1987 (Sanctioned Intake Compliance)',
        deadlineDays,
        remarks: customRemarks
      };

      // 1. Update state
      setIssuedNotices((prev) => ({
        ...prev,
        [activeModalItem.id]: noticeRecord
      }));

      // 2. Dispatch cross-portal notification to the specific college nodal officer
      sendNotification({
        title: `URGENT: Statutory Notice Issued (${noticeRef})`,
        message: `AICTE Discrepancy Notice issued to ${activeModalItem.institution} for ${activeModalItem.programme} (${activeModalItem.delta}). Submit explanation within ${deadlineDays} days.`,
        targetRole: 'COLLEGE_NODAL',
        targetCollegeCode: activeModalItem.collegeCode,
        sender: 'National Moderator (AICTE Oversight Cell)',
        senderRole: 'MODERATOR',
        type: 'alert',
        actionUrl: '/college'
      });

      // 3. Dispatch confirmation to Moderator
      sendNotification({
        title: `Notice Dispatched to ${activeModalItem.institution}`,
        message: `Statutory order ${noticeRef} sent to Nodal Officer of ${activeModalItem.institution} (${activeModalItem.collegeCode}).`,
        targetRole: 'MODERATOR',
        sender: 'AICTE Enforcement Engine',
        senderRole: 'MODERATOR',
        type: 'info',
        actionUrl: '/admin/intake'
      });

      setIsSubmitting(false);
      setActiveModalItem(null);
      toast.success(`Statutory Notice ${noticeRef} dispatched to ${activeModalItem.institution}! Pop-up alert sent to College Portal.`);
    }, 500);
  };

  const handleDownloadNotice = (notice: IssuedNotice) => {
    const noticeContent = `
================================================================================
                    ALL INDIA COUNCIL FOR TECHNICAL EDUCATION
                        MINISTRY OF EDUCATION, GOI
                 STATUTORY NOTICE UNDER SECTION 10(k) AICTE ACT
================================================================================

Notice Reference: ${notice.noticeRef}
Date of Issuance: ${notice.issuedAt}
Dispatched By:    ${notice.issuedBy}

RECIPIENT INSTITUTION:
Name:       ${notice.institution}
AISHE Code: ${notice.collegeCode}
Programme:  ${notice.programme}

SUBJECT: MANDATORY SHOW CAUSE NOTICE FOR AICTE SANCTIONED CEILING BREACH

Whereas the National APAAR Automated Intake Registry detected an unauthorized excess
of enrolled students beyond the sanctioned limit:

Programme:          ${notice.programme}
Statutory Baseline: Approved ceiling exceeded under automated intake audit.

LEGAL CLAUSE:
${notice.legalClause}

DIRECTIVE & MANDATORY REMARKS:
${notice.remarks}

COMPLIANCE DEADLINE:
The institution is required to submit their certified admission roster and
written justification within ${notice.deadlineDays} calendar days. Failure to comply
may result in suspension of APAAR generation authority and AICTE approval review.

Issued by Order of:
Member Secretary / Oversight Cell
AICTE & Ministry of Education, Government of India
================================================================================
    `.trim();

    const blob = new Blob([noticeContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${notice.noticeRef.replace(/\//g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Statutory Notice text document downloaded!');
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-100 text-rose-700">
              <AlertTriangle className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Intake Discrepancy Matrix</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Autonomous detection of AICTE ceiling limits exceeded by accredited institutions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold border border-slate-200">
            Total Flagged: {discrepancies.length} Institutions
          </span>
          <span className="text-xs px-3 py-1.5 rounded-xl bg-rose-100 text-rose-800 font-bold border border-rose-200">
            Notices Issued: {Object.keys(issuedNotices).length}
          </span>
        </div>
      </div>

      {/* Main Discrepancy Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-bold border-b border-slate-200 tracking-wider">
              <tr>
                <th className="p-3.5">Case ID</th>
                <th className="p-3.5">Institution</th>
                <th className="p-3.5">Programme</th>
                <th className="p-3.5 text-center">Approved Limit</th>
                <th className="p-3.5 text-center">Actual Intake</th>
                <th className="p-3.5">Discrepancy (Delta)</th>
                <th className="p-3.5">Severity</th>
                <th className="p-3.5 text-right">Regulatory Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {discrepancies.map((d) => {
                const notice = issuedNotices[d.id];
                return (
                  <tr key={d.id} className="hover:bg-slate-50/70 transition">
                    <td className="p-3.5 font-mono text-xs font-bold text-slate-700">{d.id}</td>
                    <td className="p-3.5">
                      <div className="font-semibold text-slate-900">{d.institution}</div>
                      <div className="text-[11px] font-mono text-slate-400">{d.collegeCode} • {d.state}</div>
                    </td>
                    <td className="p-3.5 text-slate-700 font-medium">{d.programme}</td>
                    <td className="p-3.5 font-semibold text-center text-slate-700">{d.approved}</td>
                    <td className="p-3.5 font-bold text-center text-rose-700">{d.enrolled}</td>
                    <td className="p-3.5 text-rose-600 font-mono text-xs font-bold">{d.delta}</td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-xs font-bold whitespace-nowrap">
                        {d.flag}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      {notice ? (
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Notice Dispatched
                          </span>
                          <button
                            onClick={() => setViewingNotice(notice)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1"
                            title="View Issued Notice"
                          >
                            <FileText className="w-3.5 h-3.5" /> View
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleOpenNoticeModal(d)}
                          className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs transition active:scale-95 inline-flex items-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Issue Notice</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Issue Statutory Notice */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <span className="p-2.5 bg-rose-100 text-rose-700 rounded-2xl">
                  <Scale className="w-6 h-6" />
                </span>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
                    Issue AICTE Statutory Notice
                  </h3>
                  <p className="text-xs text-slate-500">
                    Mandatory show-cause directive under Section 10(k) of AICTE Act, 1987
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveModalItem(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDispatchNotice} className="space-y-4">
              {/* Institution and Programme Snapshot */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Target Institution</span>
                  <span className="font-bold text-slate-900 block truncate">{activeModalItem.institution}</span>
                  <span className="font-mono text-slate-500 text-[11px]">{activeModalItem.collegeCode}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Breach Details</span>
                  <span className="font-bold text-rose-700 block">{activeModalItem.programme} ({activeModalItem.delta})</span>
                  <span className="text-slate-500 text-[11px]">Approved: {activeModalItem.approved} | Enrolled: {activeModalItem.enrolled}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notice Reference Number</label>
                <input
                  type="text"
                  readOnly
                  value={`AICTE/REG/NOTC/2026/${activeModalItem.id}`}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono font-bold text-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Compliance Response Window</label>
                <select
                  value={deadlineDays}
                  onChange={(e) => setDeadlineDays(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-rose-500"
                >
                  <option value={3}>3 Calendar Days (Urgent Sanction Freeze)</option>
                  <option value={7}>7 Calendar Days (Standard Statutory Window)</option>
                  <option value={14}>14 Calendar Days (Extended Inquiry)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Directives & Legal Remarks</label>
                <textarea
                  rows={4}
                  value={customRemarks}
                  onChange={(e) => setCustomRemarks(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Dispatches an instant pop-up notification directly to the college's portal dashboard.</span>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setActiveModalItem(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition flex items-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Dispatching...' : 'Confirm & Dispatch Notice'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: View Dispatched Notice */}
      {viewingNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base text-slate-900">Dispatched Notice: {viewingNotice.noticeRef}</h3>
              </div>
              <button
                onClick={() => setViewingNotice(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <div><strong>Institution:</strong> {viewingNotice.institution} ({viewingNotice.collegeCode})</div>
                <div><strong>Programme:</strong> {viewingNotice.programme}</div>
                <div><strong>Dispatched At:</strong> {viewingNotice.issuedAt} by {viewingNotice.issuedBy}</div>
                <div><strong>Statutory Clause:</strong> {viewingNotice.legalClause}</div>
              </div>

              <div>
                <strong className="block text-slate-900 mb-1">Directives Text:</strong>
                <p className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-950 font-mono text-[11px] leading-relaxed whitespace-pre-wrap">
                  {viewingNotice.remarks}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                onClick={() => handleDownloadNotice(viewingNotice)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
              >
                <Download className="w-3.5 h-3.5" /> Download Notice File
              </button>
              <button
                onClick={() => setViewingNotice(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
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
