import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  ShieldCheck,
  Building2,
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Award,
  CheckCircle2,
  FileCheck2,
  ArrowRight,
  BookOpen,
  Sparkles,
  Info
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

export default function StudentDetailsForm() {
  const navigate = useNavigate();
  const { user, updateUserProfile } = useAuth();

  // Pre-fill with existing user session data or defaults
  const [formData, setFormData] = useState({
    name: user?.name || '',
    dob: user?.dob || '2004-05-14',
    gender: user?.gender || 'Male',
    bloodGroup: user?.bloodGroup || 'O+',
    fatherName: user?.fatherName || '',
    motherName: user?.motherName || '',
    phone: user?.phone || '+91 98765 43210',
    email: user?.email || '',
    address: user?.address || '',
    city: user?.city || 'Chennai',
    state: user?.state || 'Tamil Nadu',
    pincode: user?.pincode || '600040',
    institutionName: user?.institutionName || 'National Institute of Technology & Higher Education',
    aisheCode: user?.aisheCode || 'C-16622',
    degree: user?.degree || 'B.Tech - Computer Science',
    department: user?.department || 'Computer Science and Engineering',
    admissionYear: user?.admissionYear || '2024',
    semester: user?.semester || 'Semester 4',
    rollNo: user?.rollNo || '2024CS042',
    abcId: user?.abcId || 'ABC-102-984-219',
    aadhaarMasked: user?.aadhaarMasked || 'XXXX-XXXX-4912',
    consentDigiLocker: true
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Please enter your full legal name');
      return;
    }
    if (!formData.institutionName.trim()) {
      toast.error('Please enter your college name');
      return;
    }
    if (!formData.rollNo.trim()) {
      toast.error('Please enter your roll number / registration ID');
      return;
    }

    setIsSaving(true);

    setTimeout(() => {
      updateUserProfile({
        name: formData.name,
        dob: formData.dob,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        fatherName: formData.fatherName,
        motherName: formData.motherName,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        institutionName: formData.institutionName,
        aisheCode: formData.aisheCode,
        degree: formData.degree,
        department: formData.department,
        admissionYear: formData.admissionYear,
        semester: formData.semester,
        rollNo: formData.rollNo,
        abcId: formData.abcId,
        aadhaarMasked: formData.aadhaarMasked,
        detailsCompleted: true
      });

      setIsSaving(false);
      toast.success('Student Profile & Academic Details saved successfully!');
      navigate('/student');
    }, 700);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-blue-950 text-white p-6 sm:p-8 shadow-xl border border-emerald-900/40 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            <GraduationCap className="w-4 h-4" />
            <span>Student Registry & APAAR ID Profile</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Fill Up Your Student Details
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            Please enter your personal, academic, and institution details. Your information is securely bound to your APAAR ID and Academic Bank of Credits (ABC) repository.
          </p>
        </div>

        {/* Decorative Badge */}
        <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none text-white">
          <BookOpen className="w-56 h-56" />
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Personal Information */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">1. Personal Information</h2>
              <p className="text-xs text-slate-500">Legal name and identity as recorded in government certificates</p>
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
                placeholder="e.g. Rohan Sundaram"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
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
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium bg-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Transgender">Transgender</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Blood Group</label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium bg-white"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Masked Aadhaar Number</label>
              <input
                type="text"
                name="aadhaarMasked"
                value={formData.aadhaarMasked}
                onChange={handleChange}
                placeholder="XXXX-XXXX-4912"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div className="sm:col-span-1 md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Father's / Guardian's Full Name</label>
              <input
                type="text"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                placeholder="e.g. Sundaram Krishnamurthy"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mother's Full Name</label>
              <input
                type="text"
                name="motherName"
                value={formData.motherName}
                onChange={handleChange}
                placeholder="e.g. Lakshmi Sundaram"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* 2. Contact & Address */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="p-2 bg-blue-50 text-blue-700 rounded-xl">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">2. Contact & Address</h2>
              <p className="text-xs text-slate-500">Communication details for notifications and academic registry updates</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Student Mobile Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full pl-3.5 pr-20 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                  required
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  OTP Verified
                </span>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Student Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="student@institute.ac.in"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                required
              />
            </div>

            <div className="sm:col-span-2 md:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Permanent Residential Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Door No, Street Name, Locality"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">City / District</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Chennai"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">State / UT</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="e.g. Tamil Nadu"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">PIN Code</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="e.g. 600040"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* 3. Academic & College Information */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="p-2 bg-purple-50 text-purple-700 rounded-xl">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">3. College & Academic Enrollment</h2>
              <p className="text-xs text-slate-500">Your current higher education institution and enrolled degree program</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                College / University Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="institutionName"
                value={formData.institutionName}
                onChange={handleChange}
                placeholder="e.g. National Institute of Technology & Engineering"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                College Unique AISHE Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="aisheCode"
                value={formData.aisheCode}
                onChange={handleChange}
                placeholder="e.g. C-16622"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono font-bold text-blue-700 bg-blue-50/50 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Degree / Programme <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                placeholder="e.g. B.Tech / B.E."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Department / Specialization <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="e.g. Computer Science and Engineering"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Roll No / Student Registration ID <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="rollNo"
                value={formData.rollNo}
                onChange={handleChange}
                placeholder="e.g. 2024CS042"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono font-bold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Admission Year</label>
              <input
                type="text"
                name="admissionYear"
                value={formData.admissionYear}
                onChange={handleChange}
                placeholder="2024"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Current Semester</label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
              >
                <option value="Semester 1">Semester 1 (1st Year)</option>
                <option value="Semester 2">Semester 2 (1st Year)</option>
                <option value="Semester 3">Semester 3 (2nd Year)</option>
                <option value="Semester 4">Semester 4 (2nd Year)</option>
                <option value="Semester 5">Semester 5 (3rd Year)</option>
                <option value="Semester 6">Semester 6 (3rd Year)</option>
                <option value="Semester 7">Semester 7 (4th Year)</option>
                <option value="Semester 8">Semester 8 (4th Year)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Academic Bank of Credits (ABC) ID</label>
              <input
                type="text"
                name="abcId"
                value={formData.abcId}
                onChange={handleChange}
                placeholder="ABC-102-984-219"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* 4. Consent & Submission */}
        <div className="bg-emerald-50/70 rounded-2xl border border-emerald-200/80 p-5 space-y-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="consentDigiLocker"
              checked={formData.consentDigiLocker}
              onChange={handleChange}
              className="mt-1 w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
            />
            <span className="text-xs text-slate-700 leading-relaxed font-medium">
              I certify that the information entered above is correct. I hereby provide my consent to synchronize and authenticate my academic credentials with the <strong>Automated Permanent Academic Account Registry (APAAR)</strong>, <strong>DigiLocker</strong>, and <strong>Academic Bank of Credits (ABC)</strong> under Ministry of Education guidelines.
            </span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/student')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition"
          >
            Cancel & Return to Dashboard
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-sm font-bold shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <span>Saving Details & Generating APAAR...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Details & Update APAAR Card</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
