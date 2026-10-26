import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ShieldCheck, 
  Send, 
  RotateCcw,
  Landmark,
  FileText,
  Sparkles,
  ExternalLink,
  Users,
  Download,
  Search,
  AlertTriangle,
  Hash,
  Check
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { UploadArea } from '../../components/ui/UploadArea';
import { Navbar } from '../../components/layout/Navbar';
import { useAuth } from '../../hooks/useAuth';
import { useCollegeData } from '../../hooks/useCollegeData';
import { COLLEGE_DETAILS, CrossVerificationResult } from '../../services/collegeStudentService';
import { downloadStandardCsvTemplate } from '../../utils/csvTemplate';
import toast from 'react-hot-toast';

export default function UploadPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Selected college for verification
  const initialCode = user?.aisheCode || 'C-18491';
  const [selectedCollegeCode, setSelectedCollegeCode] = useState<string>(initialCode);
  const { collegeDetails, students, crossVerify } = useCollegeData(selectedCollegeCode);

  // Form fields
  const [apaarId, setApaarId] = useState('9842-1083-4912');
  const [studentName, setStudentName] = useState('Rohan Sundaram');
  const [rollNo, setRollNo] = useState('EEC2024CS042');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [course, setCourse] = useState('B.E. Computer Science and Engineering (4-Year)');

  // Upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(() => {
    return new File(['sample academic transcript'], 'EEC_Academic_Transcript_2024.pdf', {
      type: 'application/pdf',
    });
  });
  const [uploadProgress, setUploadProgress] = useState(100);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Cross-verification result state
  const [verificationResult, setVerificationResult] = useState<CrossVerificationResult | null>(null);

  const handleFileSelect = (file: File | null) => {
    setUploadError(null);
    if (!file) {
      setSelectedFile(null);
      setUploadProgress(0);
      return;
    }

    const allowed = ['pdf', 'jpg', 'jpeg', 'png', 'csv', 'xlsx'];
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (!allowed.includes(ext)) {
      setUploadError(`Unsupported document format (.${ext}). Allowed: PDF, JPG, PNG, CSV, XLSX.`);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError(`File size (${(file.size / 1024 / 1024).toFixed(1)}MB) exceeds maximum 5MB limit.`);
      return;
    }

    setSelectedFile(file);
    setUploadProgress(100);
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setUploadError(null);
    setVerificationResult(null);
    toast('Verification form cleared', { icon: '🧹' });
  };

  const handleQuickSelectStudent = (s: any) => {
    setApaarId(s.apaarId);
    setStudentName(s.name);
    setRollNo(s.rollNo);
    setDepartment(s.programmeId);
    setVerificationResult(null);
    toast.success(`Loaded ${s.name} from ${collegeDetails.shortName} bulk list`);
  };

  const triggerVerification = () => {
    setUploadError(null);

    const cleanApaar = apaarId.replace(/[^0-9]/g, '');
    if (!cleanApaar || cleanApaar.length !== 12) {
      setUploadError('Invalid APAAR ID format. Must contain exactly 12 numeric digits.');
      return;
    }

    if (!studentName.trim()) {
      setUploadError('Please enter student full legal name.');
      return;
    }

    setIsSubmitting(true);

    // Cross-verify against this college's uploaded bulk list
    setTimeout(() => {
      const result = crossVerify(apaarId, studentName, rollNo);
      setVerificationResult(result);
      setIsSubmitting(false);

      if (result.isVerified) {
        toast.success(`APAAR ID Verified against ${collegeDetails.name} Bulk List!`);
      } else if (result.status === 'WRONG_COLLEGE_ROSTER') {
        toast.error('College mismatch detected! APAAR ID belongs to another college.');
      } else {
        toast.error('Cross-verification failed: Not found in college bulk upload.');
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar portal={user?.role === 'STUDENT' ? 'student' : user?.role === 'MODERATOR' ? 'moderator' : 'college'} />

      <main className="flex-1 max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 w-full">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadStandardCsvTemplate(selectedCollegeCode, collegeDetails.shortName)}
              className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Standard CSV Template</span>
            </button>
            <button
              onClick={() => navigate('/college/upload')}
              className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Manage College Bulk List</span>
            </button>
          </div>
        </div>

        {/* Title & Banner */}
        <div className="p-6 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-3xl shadow-xl border border-blue-900/50 space-y-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-400/30">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                APAAR ID Cross-Verification Engine
              </h1>
              <p className="text-xs text-slate-300">
                Cross-verifies individual student APAAR credentials directly against the institution's uploaded bulk ingestion file set
              </p>
            </div>
          </div>

          {/* College Selector */}
          <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-300" />
              <span className="text-slate-300">Verifying against College:</span>
              <select
                value={selectedCollegeCode}
                onChange={(e) => {
                  setSelectedCollegeCode(e.target.value);
                  setVerificationResult(null);
                }}
                className="bg-white/10 border border-white/20 text-white rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
              >
                {Object.values(COLLEGE_DETAILS).map((col) => (
                  <option key={col.code} value={col.code} className="text-slate-900 bg-white">
                    {col.name} ({col.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 text-slate-300">
              <span className="font-mono text-blue-300 font-bold">{students.length} students</span> in uploaded bulk roster
            </div>
          </div>
        </div>

        {/* Quick Sample Students from this College's Bulk List */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Quick Fill from {collegeDetails.shortName} Uploaded Bulk List:
            </span>
            <span className="text-[11px] text-slate-400">Click any student to test cross-verification</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {students.slice(0, 4).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => handleQuickSelectStudent(s)}
                className="px-3 py-1.5 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-blue-900 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3 h-3 text-blue-600" />
                <span>{s.name}</span>
                <span className="font-mono text-[10px] text-blue-700">({s.apaarId})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Verification Form & Upload Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Form: Student Input Particulars */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Student Academic Particulars to Cross-Verify</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  12-Digit APAAR ID <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={apaarId}
                  onChange={(e) => {
                    setApaarId(e.target.value);
                    setVerificationResult(null);
                  }}
                  placeholder="e.g. 9842-1083-4912"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold text-blue-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Student Full Legal Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => {
                    setStudentName(e.target.value);
                    setVerificationResult(null);
                  }}
                  placeholder="e.g. Rohan Sundaram"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Institutional Roll / Enrolment #
                </label>
                <input
                  type="text"
                  value={rollNo}
                  onChange={(e) => {
                    setRollNo(e.target.value);
                    setVerificationResult(null);
                  }}
                  placeholder="e.g. EEC2024CS042"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-700 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Academic Department / Programme
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. BTECH-CSE"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Document Verification Attachment */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Supporting Identity Document / Academic Transcript (Optional)
              </label>
              <UploadArea
                onFileSelect={handleFileSelect}
                selectedFile={selectedFile}
                progress={uploadProgress}
              />
            </div>

            {uploadError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={triggerVerification}
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
              >
                <Search className="w-4 h-4" />
                <span>{isSubmitting ? 'Cross-Verifying with College Roster...' : 'Cross-Verify with Bulk List'}</span>
              </button>
            </div>
          </div>

          {/* Right Column: College Bulk Roster Status & Verification Feedback */}
          <div className="space-y-4">
            {/* Institution Details Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <Building2 className="w-4 h-4 text-blue-600" />
                <h4 className="font-bold text-xs text-slate-900">Target College Profile</h4>
              </div>

              <div className="space-y-1.5 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Institution</span>
                  <div className="font-bold text-slate-800">{collegeDetails.name}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">AISHE Code</span>
                  <div className="font-mono text-blue-700 font-bold">{collegeDetails.code}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Affiliation</span>
                  <div className="text-slate-600">{collegeDetails.affiliation}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Uploaded Bulk Students</span>
                  <div className="font-bold text-emerald-700">{students.length} Records in Active File Set</div>
                </div>
              </div>
            </div>

            {/* Verification Result Card */}
            {verificationResult && (
              <div
                className={`p-5 rounded-3xl border shadow-md space-y-3 animate-in fade-in zoom-in-95 duration-150 ${
                  verificationResult.status === 'VERIFIED_MATCH'
                    ? 'bg-gradient-to-br from-emerald-50 via-white to-teal-50 border-emerald-300'
                    : verificationResult.status === 'WRONG_COLLEGE_ROSTER'
                    ? 'bg-gradient-to-br from-rose-50 via-white to-amber-50 border-rose-300'
                    : 'bg-gradient-to-br from-amber-50 via-white to-slate-50 border-amber-300'
                }`}
              >
                <div className="flex items-center gap-2 border-b pb-2">
                  {verificationResult.status === 'VERIFIED_MATCH' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : verificationResult.status === 'WRONG_COLLEGE_ROSTER' ? (
                    <AlertTriangle className="w-5 h-5 text-rose-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                  )}
                  <div>
                    <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-900">
                      {verificationResult.status === 'VERIFIED_MATCH'
                        ? 'Cross-Verification Successful'
                        : verificationResult.status === 'WRONG_COLLEGE_ROSTER'
                        ? 'College Ingestion Conflict'
                        : 'Bulk Ingestion Mismatch'}
                    </h4>
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {verificationResult.message}
                </p>

                {verificationResult.matchedRecord && (
                  <div className="p-3 bg-white/90 rounded-2xl border border-slate-200 text-xs space-y-1 font-mono">
                    <div className="text-[10px] text-slate-400 font-sans font-bold uppercase">
                      Matched College Bulk Record:
                    </div>
                    <div><span className="text-slate-400 font-sans">Name:</span> <span className="font-bold text-slate-900">{verificationResult.matchedRecord.name}</span></div>
                    <div><span className="text-slate-400 font-sans">APAAR:</span> <span className="text-blue-700 font-bold">{verificationResult.matchedRecord.apaarId}</span></div>
                    <div><span className="text-slate-400 font-sans">Roll #:</span> {verificationResult.matchedRecord.rollNo}</div>
                    <div><span className="text-slate-400 font-sans">Batch:</span> {verificationResult.matchedRecord.batchId || 'Admissions Master'}</div>
                  </div>
                )}

                {verificationResult.discrepancies && verificationResult.discrepancies.length > 0 && (
                  <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs space-y-1 text-rose-800">
                    <div className="font-bold text-rose-950">Field Discrepancies:</div>
                    {verificationResult.discrepancies.map((d, i) => (
                      <div key={i}>• {d}</div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
