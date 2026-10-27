import React, { useState, useEffect } from 'react';
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
  Edit3,
  Sparkles,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  MapPin,
  RefreshCw
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

  // Keep target college in sync with profile updates
  useEffect(() => {
    if (user?.aisheCode) {
      setSelectedAishe(user.aisheCode);
    }
  }, [user?.aisheCode]);

  const hasCompletedDetails = Boolean(user?.detailsCompleted && user?.name?.trim());
  const studentName = user?.name || '';
  const apaarId = user?.apaarId || '9842-1083-4912';

  // Current selected college info
  const collegeInfo = COLLEGE_DETAILS[selectedAishe] || {
    name: user?.institutionName || 'Easwari Engineering College',
    code: selectedAishe
  };

  // Dynamic template generator based on latest student profile information
  const getAutoFillContent = (cat: StudentQuery['category']) => {
    const sName = user?.name || '';
    const sRoll = user?.rollNo || '';
    const sCollege = user?.institutionName || collegeInfo.name || '';
    const sDob = user?.dob || '';
    const sEmail = user?.email || '';
    const sPhone = user?.phone || '';
    const sDept = user?.department || '';

    switch (cat) {
      case 'NAME_CORRECTION':
        return {
          subject: sName ? `Correction of Legal Name / DOB - ${sName}` : 'Correction of Legal Name / DOB',
          description: `Requesting correction in registry records to match my official government identity.${sName ? ` Full Legal Name: "${sName}",` : ''}${sDob ? ` Date of Birth: ${sDob},` : ''}${user?.gender ? ` Gender: ${user.gender},` : ''} Student APAAR ID: ${apaarId}.${sRoll ? ` Roll No: ${sRoll}.` : ''}${sDept ? ` Department: ${sDept}.` : ''}${sCollege ? ` College: ${sCollege}.` : ''} Please synchronize with my DigiLocker & admission roster.`
        };
      case 'CREDIT_TRANSFER':
        return {
          subject: sName ? `Academic Bank of Credits (ABC) Discrepancy - ${sName}` : 'Academic Bank of Credits (ABC) Discrepancy',
          description: `Discrepancy observed in Academic Bank of Credits (ABC ID: ${user?.abcId || 'ABC Depository'}). Student: ${sName || 'Enrolled Student'}${sRoll ? ` (Roll No: ${sRoll})` : ''}, APAAR ID: ${apaarId}.${sCollege ? ` Institution: ${sCollege}.` : ''} Completed semester credits are not yet reflected in the national ABC depository.`
        };
      case 'INTAKE_DISCREPANCY':
        return {
          subject: sName ? `Admission & Sanctioned Quota Status - ${sName}` : 'Admission & Sanctioned Quota Status',
          description: `Verification requested for student ${sName || 'Enrolled Student'}${sRoll ? ` (Roll No: ${sRoll})` : ''}${sCollege ? ` at ${sCollege}` : ''}. Please verify my enrollment record against the approved AICTE sanctioned intake batch.`
        };
      case 'DIGILOCKER_SYNC':
        return {
          subject: sName ? `DigiLocker Document Sync Assistance - ${sName}` : 'DigiLocker Document Sync Assistance',
          description: `Encountered sync error linking APAAR ID ${apaarId} to DigiLocker for ${sName || 'Enrolled Student'}.${sPhone ? ` Registered Mobile: ${sPhone},` : ''}${sEmail ? ` Email: ${sEmail}.` : ''} Please refresh the national gateway verification token.`
        };
      case 'APAAR_MISMATCH':
      default:
        return {
          subject: sName ? `APAAR ID Record Verification - ${sName}` : 'APAAR ID Record Verification',
          description: `Requesting verification and correction of my APAAR credentials (${apaarId}) in the academic registry.${sName ? ` Student Name: ${sName}.` : ''}${sCollege ? ` Enrolled College: ${sCollege}.` : ''}`
        };
    }
  };

  // Open modal and prefill initial content from latest student profile
  const handleOpenModal = () => {
    setSelectedAishe(user?.aisheCode || 'C-18491');
    const template = getAutoFillContent(category);
    setSubject(template.subject);
    setDescription(template.description);
    setIsFormOpen(true);
  };

  // Filter queries for this student:
  // A student should ONLY see queries they actually created/submitted themselves!
  // Static demo samples (QRY-2024-8901 through QRY-2024-8904) must never be attributed to students.
  const cleanApaar = (apaarId || '').replace(/[^0-9]/g, '');
  const myQueries = queries.filter((q) => {
    if (['QRY-2024-8901', 'QRY-2024-8902', 'QRY-2024-8903', 'QRY-2024-8904'].includes(q.id)) {
      return false;
    }
    const qApaarClean = (q.apaarId || '').replace(/[^0-9]/g, '');
    const matchesApaar = Boolean(cleanApaar && qApaarClean && qApaarClean === cleanApaar);
    const matchesName = Boolean(user?.name && q.studentName && q.studentName.trim().toLowerCase() === user.name.trim().toLowerCase());
    return matchesApaar || matchesName;
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
        priority,
        studentEmail: user?.email || 'rohan.sundaram@institute.ac.in',
        studentPhone: user?.phone || '+91 98765 43210',
        rollNo: user?.rollNo || '2024CS014',
        dob: user?.dob || '2003-10-06',
        gender: user?.gender || 'Male',
        department: user?.department || 'Computer Science and Engineering',
        fatherName: user?.fatherName || ''
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
        </div>

        <button
          onClick={handleOpenModal}
          className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md transition active:scale-95 flex items-center gap-2 w-fit cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Raise New Query</span>
        </button>
      </div>

      {/* Prefilled Student Profile & Registry Card */}
      <div className="bg-gradient-to-br from-purple-900/90 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-xl border border-purple-800/40 relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className={`p-1.5 rounded-lg ${hasCompletedDetails ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'}`}>
                {hasCompletedDetails ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
              </span>
              <span className={`text-xs font-bold tracking-wide uppercase ${hasCompletedDetails ? 'text-emerald-300' : 'text-amber-300'}`}>
                {hasCompletedDetails ? 'Verified Student Identity & Linked Data' : 'Profile Incomplete • Details Not Filled Yet'}
              </span>
              <span className="text-[11px] text-purple-200/80 bg-purple-500/20 px-2.5 py-0.5 rounded-full border border-purple-400/30 flex items-center gap-1 font-semibold">
                <Sparkles className="w-3 h-3 text-purple-300" />
                {hasCompletedDetails ? 'Live-Synced from "Fill / Edit Details"' : 'Fill your details to synchronize'}
              </span>
            </div>

            <button
              onClick={() => navigate('/student/details')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs border border-white/20 transition cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-purple-300" />
              <span>{hasCompletedDetails ? 'Edit Details in Profile' : 'Fill Details in Profile →'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-xs space-y-1">
              <div className="text-[11px] text-purple-200/70 font-medium flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-purple-300" />
                <span>Full Legal Name</span>
              </div>
              <div className="text-sm font-extrabold text-white truncate">
                {user?.name ? user.name : <span className="text-slate-400 font-normal italic">Not Filled Yet</span>}
              </div>
              <div className="text-[11px] text-purple-300 font-mono">
                APAAR: {apaarId}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-xs space-y-1">
              <div className="text-[11px] text-purple-200/70 font-medium flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-purple-300" />
                <span>Enrolled Institution</span>
              </div>
              <div className="text-sm font-extrabold text-white truncate">
                {user?.institutionName ? user.institutionName : <span className="text-slate-400 font-normal italic">Not Selected</span>}
              </div>
              <div className="text-[11px] text-purple-300 font-mono">
                AISHE: {user?.aisheCode || selectedAishe}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-xs space-y-1">
              <div className="text-[11px] text-purple-200/70 font-medium flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-purple-300" />
                <span>Roll No & Department</span>
              </div>
              <div className="text-sm font-extrabold text-white truncate">
                {user?.rollNo ? user.rollNo : <span className="text-slate-400 font-normal italic">Pending Input</span>}
              </div>
              <div className="text-[11px] text-purple-300 truncate">
                {user?.department ? user.department : <span className="text-slate-400 font-normal italic">Pending Department</span>}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-xs space-y-1">
              <div className="text-[11px] text-purple-200/70 font-medium flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-purple-300" />
                <span>Contact & DOB</span>
              </div>
              <div className="text-xs font-bold text-white truncate">
                {user?.email ? user.email : <span className="text-slate-400 font-normal italic">No Email Linked</span>}
              </div>
              <div className="text-[11px] text-purple-300 truncate">
                {user?.phone ? `${user.phone} • ` : ''}{user?.dob ? `DOB: ${user.dob}` : 'DOB: Pending'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Query Modal Form */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-lg text-slate-900">Raise Student Query / Grievance</h3>
                <p className="text-xs text-slate-500">Directly routed to your college grievance nodal desk</p>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Prefilled Profile Data Preview */}
              <div className="p-3.5 bg-purple-50/80 border border-purple-200/80 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-purple-950 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-purple-700" />
                    Prefilled Student Profile Data
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Auto-synced
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px] text-slate-700 pt-1 border-t border-purple-100">
                  <div><span className="text-slate-400">Student:</span> <strong className="font-semibold text-slate-900 ml-1">{user?.name || studentName}</strong></div>
                  <div><span className="text-slate-400">APAAR:</span> <strong className="font-mono text-purple-800 ml-1">{apaarId}</strong></div>
                  <div><span className="text-slate-400">Roll No:</span> <strong className="font-semibold text-slate-900 ml-1">{user?.rollNo || '2024CS014'}</strong></div>
                  <div><span className="text-slate-400">DOB:</span> <strong className="font-semibold text-slate-900 ml-1">{user?.dob || '2003-10-06'}</strong></div>
                  <div className="col-span-2 truncate"><span className="text-slate-400">Email:</span> <span className="font-semibold ml-1">{user?.email || 'rohan.sundaram@institute.ac.in'}</span></div>
                  <div className="col-span-2 truncate"><span className="text-slate-400">College:</span> <span className="font-semibold ml-1">{user?.institutionName || collegeInfo.name}</span></div>
                </div>
              </div>

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
                  onChange={(e) => {
                    const newCat = e.target.value as any;
                    setCategory(newCat);
                    const filled = getAutoFillContent(newCat);
                    setSubject(filled.subject);
                    setDescription(filled.description);
                  }}
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
                      className={`py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
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
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Subject Line <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const filled = getAutoFillContent(category);
                      setSubject(filled.subject);
                      setDescription(filled.description);
                      toast.success('Prefilled with your student profile details!');
                    }}
                    className="text-[11px] text-purple-700 hover:text-purple-900 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Auto-Prefill My Details</span>
                  </button>
                </div>
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
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
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
          <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">No Grievances or Queries Raised</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {!hasCompletedDetails
                ? 'You haven\'t completed your details or raised any queries yet. You can complete your profile in "Fill / Edit Details" or click "Raise New Query" below if you have an inquiry for your college nodal officer.'
                : 'You have not submitted any grievance queries. If you notice any discrepancy in your APAAR ID, academic records, or semester marks, click "Raise New Query" above.'}
            </p>
            <button
              onClick={handleOpenModal}
              className="mt-2 px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Raise New Query</span>
            </button>
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

              {/* Prefilled Student Info Row in Query Item */}
              <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-900 font-bold text-xs border border-purple-200/60">
                  <User className="w-3.5 h-3.5 text-purple-700" />
                  <span>Student: {user?.name || q.studentName}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 font-mono text-xs border border-slate-200">
                  <span>Roll: {q.rollNo || user?.rollNo || '2024CS014'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium text-slate-700">{user?.institutionName || q.institution}</span>
                  {(user?.aisheCode || q.aisheCode) && (
                    <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-mono">
                      AISHE: {user?.aisheCode || q.aisheCode}
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
                  <span>Pending review by {user?.institutionName || q.institution} admissions desk.</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
