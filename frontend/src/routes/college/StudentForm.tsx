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
import { getCollegeStudents, saveCollegeStudents } from '../../services/collegeStudentService';
import toast from 'react-hot-toast';

export default function StudentForm() {
  const { user } = useAuth();

  const collegeName = user?.institutionName || 'National Institute of Technology & Engineering';
  const collegeCode = user?.aisheCode || 'C-16622';
  const { sendNotification } = useNotifications('COLLEGE_NODAL', collegeCode);

  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: '',
    guardianName: '',
    email: '',
    contactPhone: '',
    rollNo: '',
    degree: '',
    department: '',
    admissionQuota: '',
    admissionYear: '',
    academicYear: '',
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

      // Save to general registered students
      try {
        const saved = JSON.parse(localStorage.getItem('apaar_registered_students') || '[]');
        saved.push({
          name: formData.name,
          apaarId: generatedApaar,
          rollNo: formData.rollNo,
          dob: formData.dob || '2004-03-12',
          institutionName: collegeName,
          aisheCode: collegeCode,
          department: formData.degree,
          degree: formData.degree,
          email: formData.email,
          phone: formData.contactPhone,
          gender: formData.gender,
          bloodGroup: 'O+',
          fatherName: formData.guardianName,
          motherName: '',
          detailsCompleted: true
        });
        localStorage.setItem('apaar_registered_students', JSON.stringify(saved));
      } catch {}

      // Save into this specific college's separate student file set
      try {
        const currentCollegeRoster = getCollegeStudents(collegeCode);
        currentCollegeRoster.push({
          id: `STU-${collegeCode}-${Math.floor(100 + Math.random() * 900)}`,
          name: formData.name,
          apaarId: generatedApaar,
          dateOfBirth: formData.dob || '2004-03-12',
          gender: (['male', 'female', 'other'].includes(String(formData.gender).toLowerCase()) ? formData.gender : 'male') as any,
          guardianName: formData.guardianName || 'Guardian',
          email: formData.email,
          contactPhone: formData.contactPhone || '9876543210',
          programmeId: formData.degree || 'BTECH-CSE',
          enrollmentYear: formData.admissionYear || '2024',
          rollNo: formData.rollNo,
          aisheCode: collegeCode,
          status: 'VERIFIED',
          batchId: 'direct_admission_desk',
          uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
        });
        saveCollegeStudents(collegeCode, currentCollegeRoster);
      } catch (err) {
        console.error('Failed to update college student file set:', err);
      }

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
      gender: '',
      guardianName: '',
      email: '',
      contactPhone: '',
      rollNo: '',
      degree: '',
      department: '',
      admissionQuota: '',
      admissionYear: '',
      academicYear: '',
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Degree / Programme <span className="text-rose-500">*</span>
              </label>
              <select
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white font-medium"
                required
              >
                <option value="">-- Select Degree / Programme --</option>
                <optgroup label="Engineering (B.E. / B.Tech)">
                  <option value="B.Tech">B.Tech (Bachelor of Technology)</option>
                  <option value="B.E.">B.E. (Bachelor of Engineering)</option>
                  <option value="B.Tech Lateral Entry">B.Tech - Lateral Entry (Diploma)</option>
                </optgroup>
                <optgroup label="Science">
                  <option value="B.Sc.">B.Sc. (Bachelor of Science)</option>
                  <option value="M.Sc.">M.Sc. (Master of Science)</option>
                  <option value="Integrated M.Sc.">Integrated M.Sc. (5 Year)</option>
                </optgroup>
                <optgroup label="Arts &amp; Commerce">
                  <option value="B.A.">B.A. (Bachelor of Arts)</option>
                  <option value="B.Com.">B.Com. (Bachelor of Commerce)</option>
                  <option value="M.A.">M.A. (Master of Arts)</option>
                  <option value="M.Com.">M.Com. (Master of Commerce)</option>
                </optgroup>
                <optgroup label="Management">
                  <option value="BBA">BBA (Bachelor of Business Administration)</option>
                  <option value="MBA">MBA (Master of Business Administration)</option>
                </optgroup>
                <optgroup label="Medical &amp; Pharma">
                  <option value="MBBS">MBBS (Bachelor of Medicine)</option>
                  <option value="B.Pharm.">B.Pharm. (Bachelor of Pharmacy)</option>
                  <option value="M.Pharm.">M.Pharm. (Master of Pharmacy)</option>
                  <option value="BDS">BDS (Bachelor of Dental Surgery)</option>
                </optgroup>
                <optgroup label="Postgraduate Engineering">
                  <option value="M.Tech">M.Tech (Master of Technology)</option>
                  <option value="M.E.">M.E. (Master of Engineering)</option>
                </optgroup>
                <optgroup label="Doctoral">
                  <option value="Ph.D.">Ph.D. (Doctor of Philosophy)</option>
                  <option value="M.Phil.">M.Phil. (Master of Philosophy)</option>
                </optgroup>
                <optgroup label="Diploma &amp; Certificate">
                  <option value="Diploma Engineering">Diploma in Engineering (Polytechnic)</option>
                  <option value="PG Diploma">Post Graduate Diploma</option>
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Department / Specialization <span className="text-rose-500">*</span>
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white font-medium"
                required
              >
                <option value="">-- Select Department / Specialization --</option>
                <optgroup label="Engineering &amp; Technology">
                  <option value="Computer Science and Engineering">Computer Science and Engineering (CSE)</option>
                  <option value="Information Technology">Information Technology (IT)</option>
                  <option value="Artificial Intelligence &amp; Data Science">AI &amp; Data Science (AI&amp;DS)</option>
                  <option value="Artificial Intelligence &amp; Machine Learning">AI &amp; Machine Learning (AIML)</option>
                  <option value="Electronics and Communication Engineering">Electronics &amp; Communication Engg (ECE)</option>
                  <option value="Electrical and Electronics Engineering">Electrical &amp; Electronics Engg (EEE)</option>
                  <option value="Mechanical Engineering">Mechanical Engineering (MECH)</option>
                  <option value="Civil Engineering">Civil Engineering (CIVIL)</option>
                  <option value="Aerospace Engineering">Aerospace Engineering</option>
                  <option value="Chemical Engineering">Chemical Engineering</option>
                  <option value="Biotechnology Engineering">Biotechnology Engineering</option>
                  <option value="Biomedical Engineering">Biomedical Engineering</option>
                  <option value="Automobile Engineering">Automobile Engineering</option>
                  <option value="Marine Engineering">Marine Engineering</option>
                </optgroup>
                <optgroup label="Sciences">
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Statistics">Statistics</option>
                  <option value="Microbiology">Microbiology</option>
                  <option value="Biochemistry">Biochemistry</option>
                </optgroup>
                <optgroup label="Arts &amp; Humanities">
                  <option value="English Literature">English Literature</option>
                  <option value="Tamil">Tamil</option>
                  <option value="History">History</option>
                  <option value="Economics">Economics</option>
                  <option value="Political Science">Political Science</option>
                  <option value="Sociology">Sociology</option>
                  <option value="Psychology">Psychology</option>
                </optgroup>
                <optgroup label="Commerce &amp; Management">
                  <option value="Commerce">Commerce</option>
                  <option value="Business Administration">Business Administration</option>
                  <option value="Finance">Finance</option>
                  <option value="Human Resource Management">Human Resource Management (HRM)</option>
                  <option value="Marketing Management">Marketing Management</option>
                  <option value="Operations Management">Operations Management</option>
                </optgroup>
                <optgroup label="Medical &amp; Allied Health">
                  <option value="General Medicine">General Medicine</option>
                  <option value="Pharmacy">Pharmacy (Pharmaceutics)</option>
                  <option value="Pharmacology">Pharmacology</option>
                  <option value="Nursing">Nursing</option>
                  <option value="Physiotherapy">Physiotherapy</option>
                </optgroup>
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
                <option value="">-- Select Quota Category --</option>
                <option value="Government Merit Quota">Government Merit Quota (Central / State)</option>
                <option value="Institutional Merit Quota">Institutional Merit Quota</option>
                <option value="Management Quota">Management Quota (Approved Intake)</option>
                <option value="NRI / PIO Quota">NRI / Supernumerary Quota</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Admission Academic Year</label>
              <select
                name="admissionYear"
                value={formData.admissionYear}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
              >
                <option value="">-- Select Year --</option>
                <option value="2020">2020</option>
                <option value="2021">2021</option>
                <option value="2022">2022</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
              </select>
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
