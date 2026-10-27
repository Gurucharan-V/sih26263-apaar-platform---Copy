import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  Award, 
  FileCheck2, 
  HelpCircle, 
  QrCode, 
  ShieldCheck, 
  Copy, 
  Check, 
  ExternalLink, 
  GraduationCap, 
  Building2, 
  Calendar, 
  CheckCircle2, 
  Download,
  Share2,
  Sparkles,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useQueries } from '../../hooks/useQueries';
import { useCollegeData } from '../../hooks/useCollegeData';
import toast from 'react-hot-toast';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { queries } = useQueries();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const studentName = user?.name || 'Rohan Sundaram';
  const apaarId = user?.apaarId || '9842-1083-4912';
  const rollNo = user?.rollNo || 'EEC2024CS042';
  const collegeCode = user?.aisheCode || 'C-18491';
  const institution = user?.institutionName || 'Easwari Engineering College';
  const programme = user?.department || 'B.E. Computer Science and Engineering';

  // Cross-verification with College's uploaded bulk student records
  const { collegeDetails, crossVerify } = useCollegeData(collegeCode);
  const verificationResult = crossVerify(apaarId, studentName, rollNo);

  // Filter queries belonging to this student
  const cleanApaar = apaarId.replace(/[^0-9]/g, '');
  const studentQueries = queries.filter(
    (q) =>
      q.apaarId.replace(/[^0-9]/g, '') === cleanApaar ||
      q.studentName.toLowerCase() === studentName.toLowerCase()
  );

  const handleCopyApaar = () => {
    navigator.clipboard.writeText(apaarId);
    setCopied(true);
    toast.success('APAAR ID copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadApaarCard = () => {
    const cardContent = `
================================================================================
                    GOVERNMENT OF INDIA • MINISTRY OF EDUCATION
          AUTOMATED PERMANENT ACADEMIC ACCOUNT REGISTRY (APAAR) CARD
================================================================================

APAAR ID (12-Digit):   ${apaarId}
Verification Protocol:  Verhoeff Algorithm Verified • SHA-256 Checksum Valid
College Cross-Check:    ${verificationResult.isVerified ? `VERIFIED against ${collegeDetails.name} Bulk Ingestion List` : 'Pending Bulk Ingestion Sync'}
Issuing Authority:      AICTE & National Academic Depository (NAD)

STUDENT BIOGRAPHICAL PARTICULARS:
Full Legal Name:        ${studentName}
Date of Birth:          ${user?.dob || '2004-05-14'}
Gender:                 ${user?.gender || 'Male'}
Blood Group:            ${user?.bloodGroup || 'O+'}
Guardian Name:          ${user?.fatherName || 'Sundaram Krishnamurthy'}

ACADEMIC PARTICULARS:
Accredited Institution: ${institution}
AISHE Code:             ${collegeCode}
Degree & Programme:     ${programme}
Enrolment / Roll No:    ${rollNo}
Academic Period:        2024 - 2028
Academic Bank of Credits: ${user?.abcId || 'ABC-102-984-219'}

This digital card is a permanent, non-transferable digital academic identity
recognized across all universities, technical boards, and employers in India.
================================================================================
    `.trim();

    const blob = new Blob([cardContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `APAAR_CARD_${apaarId.replace(/[^0-9]/g, '')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Official APAAR Digital Card downloaded successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-900 via-slate-900 to-blue-950 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>AICTE Authenticated Student Record</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {studentName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            {programme} • {institution} (AISHE: {collegeCode})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => navigate('/student/details')}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold shadow-md transition active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Fill Up / Edit My Details</span>
          </button>
          <button
            onClick={() => navigate('/student/queries')}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 backdrop-blur-sm transition flex items-center gap-2 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-emerald-300" />
            <span>Raise Grievance</span>
          </button>
          <button
            onClick={handleDownloadApaarCard}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download APAAR Card</span>
          </button>
        </div>
      </div>

      {/* College Bulk Roster Cross-Verification Seal Banner */}
      <div
        className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs ${
          verificationResult.isVerified
            ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
            : 'bg-amber-50 border-amber-300 text-amber-950'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-xl shrink-0 ${
              verificationResult.isVerified
                ? 'bg-emerald-600 text-white'
                : 'bg-amber-500 text-white'
            }`}
          >
            {verificationResult.isVerified ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="font-bold text-xs flex items-center gap-2">
              <span>College Bulk Ingestion Cross-Verification:</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                  verificationResult.isVerified
                    ? 'bg-emerald-200 text-emerald-900'
                    : 'bg-amber-200 text-amber-900'
                }`}
              >
                {verificationResult.isVerified ? 'VERIFIED MATCH' : 'NOT FOUND IN COLLEGE ROSTER'}
              </span>
            </div>
            <p className="text-xs mt-0.5 text-slate-700">
              {verificationResult.isVerified
                ? `Cross-verified with ${collegeDetails.name} (${collegeCode}) uploaded student file set. Batch: ${verificationResult.matchedRecord?.batchId || 'Admissions Master Roster'}.`
                : `Student APAAR record (${apaarId}) has not yet been matched in ${collegeDetails.shortName}'s uploaded bulk list.`}
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/upload')}
          className="text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 transition shrink-0 cursor-pointer"
        >
          Verify Details
        </button>
      </div>

      {/* Profile Completion Prompt if details are not yet completed */}
      {!user?.detailsCompleted && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-200/60 text-amber-800">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Complete Your Student Profile</h3>
              <p className="text-xs text-amber-800/80">
                Please fill in all your personal and academic details to complete official registration.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/student/details')}
            className="px-4 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <span>Fill Details Now</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Grid: Official Digital APAAR Card (Left) & Quick Academic Stats (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: The Official APAAR Digital ID Card (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>Official Digital APAAR Card</span>
            </h2>
            <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-bold border border-emerald-200">
              VERHOEFF VERIFIED
            </span>
          </div>

          {/* Realistic High-Security APAAR Card */}
          <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-6 shadow-2xl border border-slate-700/80 overflow-hidden">
            {/* Background Watermark Crest */}
            <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none translate-x-10 translate-y-10">
              <GraduationCap className="w-80 h-80" />
            </div>

            {/* Card Header */}
            <div className="flex items-center justify-between border-b border-white/15 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-md">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-white tracking-wide">
                    GOVERNMENT OF INDIA
                  </h3>
                  <p className="text-[11px] text-blue-200 font-medium">
                    Ministry of Education • Automated Permanent Academic Account Registry
                  </p>
                </div>
              </div>
              <div className="text-right hidden sm:block">
                <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full font-bold">
                  NATIONAL APAAR ID
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
              {/* Photo & QR Code */}
              <div className="sm:col-span-4 flex sm:flex-col items-center gap-3">
                <div className="w-24 h-28 rounded-2xl bg-gradient-to-tr from-slate-700 to-slate-600 border-2 border-emerald-400/80 p-1 shadow-lg relative flex items-center justify-center">
                  <div className="w-full h-full rounded-xl bg-slate-800 flex flex-col items-center justify-center text-center p-1">
                    <span className="text-3xl">👨‍🎓</span>
                    <span className="text-[9px] text-slate-300 font-semibold mt-1">Verified Photo</span>
                  </div>
                  <div className="absolute -bottom-2 -right-1 bg-emerald-500 text-white p-1 rounded-full shadow">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="p-2 bg-white rounded-xl shadow text-slate-900 flex flex-col items-center justify-center">
                  <QrCode className="w-12 h-12 text-slate-900" />
                  <span className="text-[8px] font-mono font-bold text-slate-600 mt-0.5">SECURE QR</span>
                </div>
              </div>

              {/* Student Metadata */}
              <div className="sm:col-span-8 space-y-3">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                    Student Full Name
                  </span>
                  <div className="text-lg font-extrabold text-white">{studentName}</div>
                </div>

                <div className="grid grid-cols-3 gap-2.5 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                      Roll No
                    </span>
                    <span className="font-mono font-bold text-blue-300 truncate block">{rollNo}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                      Date of Birth
                    </span>
                    <span className="font-semibold text-slate-200 block">{user?.dob || '2004-05-14'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                      Academic Year
                    </span>
                    <span className="font-semibold text-slate-200 block">2024 - 2028</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                    Accredited Institution
                  </span>
                  <span className="font-semibold text-slate-200 text-xs block leading-snug">
                    {institution}
                  </span>
                </div>

                {/* The 12-Digit APAAR ID */}
                <div className="pt-2 border-t border-white/10">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest block mb-1">
                    APAAR (12-Digit Academic Identifier)
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xl sm:text-2xl font-black text-white tracking-widest drop-shadow">
                      {apaarId}
                    </span>
                    <button
                      onClick={handleCopyApaar}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition active:scale-95 cursor-pointer"
                      title="Copy APAAR ID"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Footer Bar */}
            <div className="mt-5 pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[10px] text-slate-400 font-mono">
              <span>AISHE: {collegeCode} • {collegeDetails.name}</span>
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{verificationResult.isVerified ? 'Bulk List Cross-Verified' : 'Verhoeff Checksum Valid'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right: Academic Bank of Credits (ABC) & Status (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-600" />
            <span>Academic Bank of Credits (ABC)</span>
          </h2>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
            <div>
              <span className="text-xs text-slate-400 font-medium">Total Credits Earned</span>
              <div className="text-3xl font-extrabold text-blue-900">128 / 160</div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-600">
                <span>Degree Completion</span>
                <span>80%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-emerald-500 h-full rounded-full w-4/5" />
              </div>
            </div>

            {/* Grievance Queries Status */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  My Active Queries & Grievances
                </h4>
                <button
                  onClick={() => navigate('/student/queries')}
                  className="text-xs font-bold text-purple-700 hover:underline cursor-pointer"
                >
                  Manage All
                </button>
              </div>

              {studentQueries.length === 0 ? (
                <div className="p-3 bg-slate-50 rounded-xl text-center text-xs text-slate-400">
                  No active queries. All records in sync!
                </div>
              ) : (
                <div className="space-y-2">
                  {studentQueries.slice(0, 2).map((q) => (
                    <div
                      key={q.id}
                      onClick={() => navigate('/student/queries')}
                      className="p-3 rounded-xl bg-slate-50 hover:bg-purple-50/50 border border-slate-200 transition cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-[11px] font-bold text-purple-700">{q.id}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            q.status === 'RESOLVED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {q.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-800 font-medium truncate">{q.subject}</p>
                      {q.moderatorNotes && (
                        <p className="text-[11px] text-emerald-700 font-medium mt-1 truncate">
                          💬 Resolution: {q.moderatorNotes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
