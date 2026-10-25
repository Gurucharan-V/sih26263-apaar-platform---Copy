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
  ExternalLink
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { UploadArea } from '../../components/ui/UploadArea';
import { PrototypeBanner } from '../../components/ui/PrototypeBanner';
import toast from 'react-hot-toast';

export default function UploadPage() {
  const navigate = useNavigate();

  // Form fields
  const [apaarId, setApaarId] = useState('9842 1083 4912');
  const [studentName, setStudentName] = useState('Rohan Sundaram');
  const [institution, setInstitution] = useState('Easwari Engineering College (EEC)');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [course, setCourse] = useState('B.E. Computer Science and Engineering (4-Year)');

  // Upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(() => {
    // default sample mock file
    return new File(['sample academic transcript'], 'EEC_Academic_Transcript_2024.pdf', {
      type: 'application/pdf',
    });
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Submission / Verification Status
  const [submissionStatus, setSubmissionStatus] = useState<
    'idle' | 'in_progress' | 'verified' | 'failed'
  >('idle');
  const [verificationDetails, setVerificationDetails] = useState<{
    referenceId?: string;
    timestamp?: string;
    checksum?: string;
  }>({});

  const handleFileSelect = (file: File | null) => {
    setUploadError(null);
    if (!file) {
      setSelectedFile(null);
      setUploadProgress(0);
      return;
    }

    // Format check (allowed: pdf, jpg, png, csv, xlsx)
    const allowed = ['pdf', 'jpg', 'jpeg', 'png', 'csv', 'xlsx'];
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (!allowed.includes(ext)) {
      setUploadError(`Unsupported document format (.${ext}). Allowed: PDF, JPG, PNG, CSV, XLSX.`);
      return;
    }

    // Size check (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError(`File size (${(file.size / 1024 / 1024).toFixed(1)}MB) exceeds maximum 5MB limit.`);
      return;
    }

    setSelectedFile(file);
    // Simulate upload progress
    setUploadProgress(25);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 25;
      });
    }, 150);
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setUploadError(null);
    setSubmissionStatus('idle');
    toast('Upload draft cleared', { icon: '🧹' });
  };

  const triggerVerification = () => {
    setUploadError(null);

    // Validation
    const cleanApaar = apaarId.replace(/\s+/g, '');
    if (!cleanApaar || cleanApaar.length !== 12 || !/^\d+$/.test(cleanApaar)) {
      setUploadError('Invalid APAAR ID format. Must be an exact 12-digit numeric identifier.');
      return;
    }

    if (!studentName.trim() || !department.trim()) {
      setUploadError('Please fill in all mandatory student academic fields.');
      return;
    }

    if (!selectedFile) {
      setUploadError('Please select or upload a document before submitting.');
      return;
    }

    setIsSubmitting(true);
    setSubmissionStatus('in_progress');

    // Simulate multi-step verification against AICTE & Anna University database
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmissionStatus('verified');
      setVerificationDetails({
        referenceId: `EEC-APAAR-${Math.floor(100000 + Math.random() * 900000)}`,
        timestamp: new Date().toLocaleTimeString(),
        checksum: 'Verhoeff Algorithm Check: PASSED (Digit 9 Validated)',
      });
      toast.success('Document verified & linked with national APAAR registry!');
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerVerification();
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface font-sans selection:bg-blue-200 selection:text-slate-900">
      {/* Top Prototype Navigation Banner */}
      <PrototypeBanner />

      {/* Header Bar */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="p-1.5 rounded-lg text-slate-500 hover:text-navy-800 hover:bg-slate-100 transition"
            title="Back to Login"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <img
            src="/assets/eec_college_logo.png"
            alt="Easwari Engineering College Official Seal"
            className="w-11 h-11 object-contain bg-white rounded-full p-0.5 border border-slate-200 shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-slate-900 text-sm sm:text-base">
                Student Information & Document Upload
              </h1>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Portal Active
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Easwari Engineering College (EEC) • AICTE Institution Code: 1-10971201
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
            onClick={() => navigate('/login')}
          >
            Return to Login
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Verification Success Banner */}
        {submissionStatus === 'verified' && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <Alert
              variant="success"
              title="Verification Completed & Registered Successfully!"
              message={
                <div className="space-y-1 mt-1 text-xs">
                  <p>
                    APAAR ID <strong className="font-mono">{apaarId}</strong> has been verified against AICTE sanctioned intake quotas for Easwari Engineering College.
                  </p>
                  <p className="font-mono text-emerald-800 text-[11px]">
                    Reference ID: {verificationDetails.referenceId} • Timestamp: {verificationDetails.timestamp}
                  </p>
                  <p className="font-mono text-emerald-700 text-[10px]">
                    {verificationDetails.checksum}
                  </p>
                </div>
              }
              actionText="Upload Another Student Record"
              onAction={() => {
                setSubmissionStatus('idle');
                handleCancel();
              }}
            />
          </div>
        )}

        {/* Form Error Banner */}
        {uploadError && (
          <div className="animate-in fade-in duration-200">
            <Alert
              variant="error"
              title="Submission Validation Error"
              message={uploadError}
              actionText="Dismiss & Fix"
              onAction={() => setUploadError(null)}
              onClose={() => setUploadError(null)}
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Student Academic Metadata (6 Cols) */}
            <div className="lg:col-span-6 space-y-4">
              <Card className="p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-navy-800" />
                    <span>Academic & Student Identity</span>
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">Step 1 of 2</span>
                </div>

                {/* APAAR ID */}
                <Input
                  label="APAAR ID (12-Digit Numeric)"
                  placeholder="e.g. 9842 1083 4912"
                  value={apaarId}
                  onChange={(e) => setApaarId(e.target.value)}
                  helperText="Unique permanent academic account registry identifier."
                  leftIcon={<ShieldCheck className="w-4 h-4" />}
                  required
                />

                {/* Student Full Name */}
                <Input
                  label="Student Full Name (As per 10th/12th Marks)"
                  placeholder="e.g. Rohan Sundaram"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  required
                />

                {/* Institution (Read-Only / Fixed to EEC) */}
                <Input
                  label="Institution"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  leftIcon={<Landmark className="w-4 h-4" />}
                  required
                />

                {/* Department */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Department <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-navy-600 focus:border-navy-600 shadow-sm"
                  >
                    <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Electronics & Communication Engineering">Electronics & Communication Engineering</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Artificial Intelligence & Data Science">Artificial Intelligence & Data Science</option>
                    <option value="Electrical & Electronics Engineering">Electrical & Electronics Engineering</option>
                  </select>
                </div>

                {/* Course */}
                <Input
                  label="Enrolled Course / Degree Program"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  required
                />
              </Card>
            </div>

            {/* Right Column: Document Upload Section (6 Cols) */}
            <div className="lg:col-span-6 space-y-4">
              <Card className="p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-navy-800" />
                    <span>Document Upload Section</span>
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">Step 2 of 2</span>
                </div>

                {/* Upload Area Component */}
                <UploadArea
                  onFileSelect={handleFileSelect}
                  selectedFile={selectedFile}
                  progress={uploadProgress}
                  allowedFormats={['PDF', 'JPG', 'PNG', 'CSV', 'XLSX']}
                  maxSizeMB={5}
                />

                {/* Submission Status Box */}
                <div
                  className={`p-4 rounded-xl border space-y-2.5 transition-all ${
                    submissionStatus === 'verified'
                      ? 'bg-emerald-50/70 border-emerald-200'
                      : submissionStatus === 'in_progress'
                      ? 'bg-blue-50/70 border-blue-200'
                      : selectedFile && uploadProgress === 100
                      ? 'bg-emerald-50/50 border-emerald-300 shadow-xs'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">Verification Status:</span>
                    {submissionStatus === 'verified' ? (
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Verified & Recorded
                      </span>
                    ) : submissionStatus === 'in_progress' ? (
                      <span className="inline-flex items-center gap-1.5 font-bold text-blue-700 animate-pulse">
                        <Clock className="w-3.5 h-3.5 animate-spin text-blue-700" /> Verifying with AICTE...
                      </span>
                    ) : selectedFile && uploadProgress === 100 ? (
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Pre-Validated & Ready to Submit
                      </span>
                    ) : uploadProgress > 0 && uploadProgress < 100 ? (
                      <span className="inline-flex items-center gap-1 text-blue-700 font-medium">
                        <Clock className="w-3.5 h-3.5 animate-spin" /> Checksum Calculating ({uploadProgress}%)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-500 font-medium">
                        <Clock className="w-3.5 h-3.5" /> Awaiting Document Upload
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {submissionStatus === 'verified' ? (
                      'Document cryptographic hash confirmed. Record officially bound to AICTE intake quota for Easwari Engineering College.'
                    ) : selectedFile && uploadProgress === 100 && submissionStatus === 'idle' ? (
                      'Document uploaded and Verhoeff checksum pre-validation passed! Click "Submit for Verification" below or use the quick action button to complete AICTE registration.'
                    ) : (
                      'Submissions undergo instant Verhoeff checksum calculation, institutional deduplication, and AICTE intake capacity confirmation.'
                    )}
                  </p>

                  {/* Direct Quick Action when file is 100% pre-validated */}
                  {selectedFile && uploadProgress === 100 && submissionStatus === 'idle' && (
                    <div className="pt-2.5 border-t border-emerald-200/80 flex flex-col sm:flex-row items-center justify-between gap-2 animate-in fade-in">
                      <span className="text-[11px] font-semibold text-emerald-900">
                        Ready to link with national APAAR registry:
                      </span>
                      <button
                        type="button"
                        onClick={triggerVerification}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-navy-800 hover:bg-navy-900 transition shadow-sm cursor-pointer"
                        style={{ backgroundColor: '#163A70', color: '#FFFFFF' }}
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-white" />
                        <span>Run AICTE Verification Now</span>
                      </button>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => navigate('/login')}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                Back to Login
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={handleCancel}
                leftIcon={<RotateCcw className="w-4 h-4" />}
                className="w-full sm:w-auto text-slate-500 hover:text-slate-800"
              >
                Cancel Draft
              </Button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              className={`w-full sm:w-auto transition-all ${
                selectedFile && uploadProgress === 100 && submissionStatus === 'idle'
                  ? 'ring-4 ring-navy-200 shadow-md font-bold'
                  : ''
              }`}
              style={{ backgroundColor: '#163A70', color: '#FFFFFF' }}
              leftIcon={<Send className="w-4 h-4 text-white" />}
            >
              {isSubmitting ? 'Verifying with Registry...' : 'Submit for Verification'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
