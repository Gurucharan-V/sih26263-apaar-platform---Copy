import React, { useState } from 'react';
import {
  Building2,
  UserPlus,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  Award,
  Hash,
  Users,
  Calendar,
  Sparkles,
  ArrowRight,
  School
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import toast from 'react-hot-toast';

export default function StudentForm() {
  const { user } = useAuth();

  const collegeName = user?.institutionName || 'National Institute of Technology & Engineering';
  const collegeCode = user?.aisheCode || 'C-16622';
  const { sendNotification } = useNotifications('COLLEGE_NODAL', collegeCode);

  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: 'Male',
    guardianName: '',
    email: '',
    contactPhone: '',
    rollNo: '',
    degree: 'B.Tech - Computer Science',
    admissionQuota: 'Government Merit Quota',
    admissionYear: '2024',
    academicYear: '2024-2025',
    aadhaarMasked: '',
    nodalCertified: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredStudent, setRegisteredStudent] = useState<{
    name: string;
    apaarId: string;
    rollNo: string;
    collegeCode: string;
    quota: string;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const calculateVerhoeffApaar = () => {
    const random9 = Math.floor(100000000 + Math.random() * 900000000).toString();
    const prefix = '98';
    const num = prefix + random9;
    return `${num.slice(0, 4)}-${num.slice(4, 8)}-${num.slice(8, 12)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Please enter student full legal name');
      return;
    }
    if (!formData.rollNo.trim()) {
      toast.error('Please enter college student roll/enrolment number');
      return;
    }
    if (!formData.email.trim()) {
      toast.error('Please enter student institutional or personal email');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const generatedApaar = calculateVerhoeffApaar();

      setRegisteredStudent({
        name: formData.name,
        apaarId: generatedApaar,
        rollNo: formData.rollNo,
        collegeCode: collegeCode,
        quota: formData.admissionQuota
      });

      // 1. Notify Moderator of new college admission and quota intake update
      sendNotification({
        title: `College Admission Enrolled (${collegeCode})`,
        message: `${collegeName} registered student ${formData.name} under ${formData.degree} (${formData.admissionQuota}). Quota utilization tracked.`,
        targetRole: 'MODERATOR',
        sender: `${collegeName} (${collegeCode})`,
        senderRole: 'COLLEGE_NODAL',
        type: 'info',
        actionUrl: '/admin/intake'
      });

      // 2. Notify Student that their record is confirmed and APAAR ID is ready
      sendNotification({
        title: `Admission Certified & APAAR ID Ready!`,
        message: `Your college ${collegeName} has certified your admission and generated your verified APAAR ID: ${generatedApaar}.`,
        targetRole: 'STUDENT',
        targetStudentId: generatedApaar,
        sender: `${collegeName} Admissions`,
        senderRole: 'COLLEGE_NODAL',
        type: 'success',
        actionUrl: '/student'
      });

      setIsSubmitting(false);
      toast.success(`Student ${formData.name} enrolled under College Code ${collegeCode}! Pop-up notifications sent to Moderator & Student.`);
    }, 800);
  };

  const handleReset = () => {
    setRegisteredStudent(null);
    setFormData({
      name: '',
      dob: '',
      gender: 'Male',
      guardianName: '',
      email: '',
      contactPhone: '',
      rollNo: '',
      degree: 'B.Tech - Computer Science',
      admissionQuota: 'Government Merit Quota',
      admissionYear: '2024',
      academicYear: '2024-2025',
      aadhaarMasked: '',
      nodalCertified: true
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* College Accreditation Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 shadow-xl border border-blue-900/40 relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
              <Building2 className="w-3.5 h-3.5" />
              <span>College-Side Admission Portal</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/30">
              <Hash className="w-3.5 h-3.5" />
              <span>Unique AISHE Code: {collegeCode}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Student APAAR Registration & Intake Enrollment
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            Record filled and authenticated by college administration for <strong>{collegeName}</strong>. All entries are validated against approved AICTE/UGC sanctioned intake caps for this institution's unique code.
          </p>

          {/* Sanctioned Intake Capacity Indicator */}
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-200">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-blue-400" />
              <span>Sanctioned Capacity: <strong>1,450 Seats</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Registered to Date: <strong>1,218</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
              <span>Quota Available: 232 Seats</span>
            </div>
          </div>
        </div>

        {/* Decorative Vector */}
        <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none text-white">
          <School className="w-56 h-56" />
        </div>
      </div>

      {/* Success Notification Card if student was just registered */}
      {registeredStudent && (
        <div className="p-6 rounded-3xl bg-emerald-50 border-2 border-emerald-300 shadow-md space-y-4 animate-in fade-in">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-emerald-950">
                  Student Enrolled Successfully by College!
                </h3>
                <span className="text-xs font-mono bg-emerald-200 text-emerald-900 font-bold px-2.5 py-1 rounded-full">
                  VERHOEFF CERTIFIED
                </span>
              </div>
              <p className="text-xs text-emerald-800 mt-1">
                The student record has been bound to College Unique Code <strong>{registeredStudent.collegeCode}</strong> and registered on the National APAAR repository.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 p-4 rounded-2xl bg-white border border-emerald-200 text-xs">
                <div>
                  <span className="text-slate-500 block">Student Name</span>
                  <span className="font-bold text-slate-900 text-sm">{registeredStudent.name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Roll / Enrolment No</span>
                  <span className="font-mono font-bold text-blue-700 text-sm">{registeredStudent.rollNo}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Generated APAAR ID</span>
                  <span className="font-mono font-black text-emerald-700 text-sm">{registeredStudent.apaarId}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">College Code</span>
                  <span className="font-mono font-bold text-purple-700 text-sm">{registeredStudent.collegeCode}</span>
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition"
                >
                  Register Another Student
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: College Identification (Locked & Authenticated) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="p-2 bg-blue-50 text-blue-700 rounded-xl">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">1. College & Institution Authority</h2>
              <p className="text-xs text-slate-500">Authenticated college institution details automatically attached to this registration</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                College / Institution Name (Locked)
              </label>
              <input
                type="text"
                value={collegeName}
                disabled
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-sm font-semibold cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Unique College AISHE Code (Locked)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={collegeCode}
                  disabled
                  className="w-full px-3.5 py-2.5 rounded-xl border border-blue-200 bg-blue-50/60 text-blue-900 text-sm font-mono font-bold cursor-not-allowed"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-blue-200 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                  Accredited
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Student Personal & Identity Details */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">2. Student Identification (Filled by College)</h2>
              <p className="text-xs text-slate-500">Official student identity details entered from college admission dossier</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Legal Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Ananya Ramakrishnan"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Date of Birth <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Father / Guardian Name</label>
              <input
                type="text"
                name="guardianName"
                value={formData.guardianName}
                onChange={handleChange}
                placeholder="e.g. S. Ramakrishnan"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Aadhaar (Last 4 Digits)</label>
              <input
                type="text"
                name="aadhaarMasked"
                value={formData.aadhaarMasked}
                onChange={handleChange}
                placeholder="e.g. 5819"
                maxLength={4}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Student Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="student@college.edu.in"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Student Mobile Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                placeholder="9876543210"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                College Roll / Enrolment No <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="rollNo"
                value={formData.rollNo}
                onChange={handleChange}
                placeholder="e.g. 2024CS109"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 3: Academic Program & Intake Quota */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="p-2 bg-purple-50 text-purple-700 rounded-xl">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">3. Course Enrolment & Sanctioned Quota</h2>
              <p className="text-xs text-slate-500">Academic stream and seat category allocated under college quota</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Enrolled Programme / Degree</label>
              <select
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white font-medium"
              >
                <option value="B.Tech - Computer Science">B.Tech - Computer Science & Engineering</option>
                <option value="B.Tech - Artificial Intelligence">B.Tech - AI & Data Science</option>
                <option value="B.E. - Electronics & Comm">B.E. - Electronics & Communication</option>
                <option value="B.E. - Mechanical Engineering">B.E. - Mechanical Engineering</option>
                <option value="B.Tech - Information Technology">B.Tech - Information Technology</option>
                <option value="MBA - Master of Business Admin">MBA - Business Administration</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Admission Quota Category</label>
              <select
                name="admissionQuota"
                value={formData.admissionQuota}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white font-medium"
              >
                <option value="Government Merit Quota">Government Merit Quota (Central / State)</option>
                <option value="Institutional Merit Quota">Institutional Merit Quota</option>
                <option value="Management Quota">Management Quota (Approved Intake)</option>
                <option value="NRI / PIO Quota">NRI / Supernumerary Quota</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Admission Academic Year</label>
              <input
                type="text"
                name="admissionYear"
                value={formData.admissionYear}
                onChange={handleChange}
                placeholder="2024"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Nodal Officer Declaration */}
        <div className="bg-blue-50/70 rounded-2xl border border-blue-200/80 p-5 space-y-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="nodalCertified"
              checked={formData.nodalCertified}
              onChange={handleChange}
              className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            <span className="text-xs text-slate-700 leading-relaxed font-medium">
              I, as the authorized College Nodal Officer for <strong>{collegeName}</strong> (AISHE: <strong>{collegeCode}</strong>), certify that this student record has been thoroughly verified against physical admission documents and does not exceed the sanctioned intake ceiling prescribed by the statutory council.
            </span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition"
          >
            Clear Form
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white text-sm font-bold shadow-lg shadow-blue-600/20 transition flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>Validating Intake & Generating APAAR...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit & Register Student Under College Code</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
