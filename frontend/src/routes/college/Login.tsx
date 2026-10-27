import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Building2,
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  HelpCircle,
  FileCheck2,
  Landmark,
  AlertCircle,
  CheckCircle2,
  QrCode,
  GraduationCap,
  KeyRound,
  Layers,
  Menu,
  Check,
  Award,
  Hash,
  School,
  Copy,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { Navbar } from '../../components/layout/Navbar';
import { getCollegeNodalEmail } from '../../services/collegeStudentService';
import toast from 'react-hot-toast';

export type PortalType = 'student' | 'college' | 'moderator';

export const ACCREDITED_COLLEGES = [
  { code: 'C-18491', name: 'Easwari Engineering College' },
  { code: 'C-16622', name: 'Chennai Institute of Technology & Engineering' },
  { code: 'C-24891', name: 'National Institute of Technology (NIT Trichy)' },
  { code: 'C-41209', name: 'Delhi Technological University' },
  { code: 'C-53104', name: 'Bangalore Technological University' },
  { code: 'C-62840', name: 'Apex Institute of Science & Technology' },
  { code: 'C-36965', name: 'Vellore Institute of Technology' },
  { code: 'C-09122', name: 'Pune Institute of Computer Technology' },
  { code: 'C-44109', name: 'Bengal College of Engineering' }
];

export default function Login({ defaultPortal }: { defaultPortal?: PortalType }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Determine active portal tab from URL or prop
  const getInitialPortal = (): PortalType => {
    if (defaultPortal) return defaultPortal;
    if (location.pathname.includes('/student')) return 'student';
    if (location.pathname.includes('/college')) return 'college';
    if (location.pathname.includes('/moderator') || location.pathname.includes('/admin')) return 'moderator';
    return 'student'; // Default to Student Portal as requested
  };

  const [activePortal, setActivePortal] = useState<PortalType>(getInitialPortal);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ identifier?: string; password?: string }>({});

  // College-specific state for unique code
  const [selectedCollegeCode, setSelectedCollegeCode] = useState('C-18491');
  const [collegeInputCode, setCollegeInputCode] = useState('C-18491');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Copied college code "${code}" to clipboard!`);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const filteredColleges = ACCREDITED_COLLEGES.filter((col) => {
    const q = collegeInputCode.trim().toLowerCase();
    if (!q) return true;
    return col.code.toLowerCase().includes(q) || col.name.toLowerCase().includes(q);
  });

  const activeCollege = ACCREDITED_COLLEGES.find(
    (c) => c.code.toLowerCase() === (collegeInputCode || selectedCollegeCode).trim().toLowerCase()
  );

  // Sync state if URL changes
  useEffect(() => {
    const portal = getInitialPortal();
    setActivePortal(portal);
    loadDefaultCredentials(portal);
  }, [location.pathname, defaultPortal]);

  const loadDefaultCredentials = (portal: PortalType) => {
    setErrorMessage(null);
    setFieldErrors({});
    if (portal === 'student') {
      setIdentifier('9842-1083-4912'); // Student APAAR ID
      setPassword('student@2024');
    } else if (portal === 'college') {
      const activeCode = (collegeInputCode || selectedCollegeCode || 'C-18491').trim().toUpperCase();
      const specificEmail = getCollegeNodalEmail(activeCode);
      setIdentifier(specificEmail); // Specific institutional email!
      setPassword('college@2024');
    } else {
      setIdentifier('moderator@education.gov.in'); // National Moderator
      setPassword('admin@moe2024');
    }
  };

  const handlePortalChange = (portal: PortalType) => {
    setActivePortal(portal);
    loadDefaultCredentials(portal);
    navigate(`/login/${portal}`, { replace: true });
  };

  const handleDemoFill = (portal: PortalType) => {
    setActivePortal(portal);
    loadDefaultCredentials(portal);
    if (portal === 'student') {
      toast.success('Loaded Student credentials (Rohan Sundaram)');
    } else if (portal === 'college') {
      const activeCode = (collegeInputCode || selectedCollegeCode || 'C-18491').trim().toUpperCase();
      const specificEmail = getCollegeNodalEmail(activeCode);
      toast.success(`Loaded Nodal credentials for ${activeCode} (${specificEmail})`);
    } else {
      toast.success('Loaded AICTE / MoE Moderator credentials (Dr. V. K. Sharma)');
    }
  };

  const validate = () => {
    const errors: { identifier?: string; password?: string } = {};
    if (!identifier.trim()) {
      errors.identifier =
        activePortal === 'student'
          ? 'APAAR ID or Student Institutional Email is required'
          : activePortal === 'college'
          ? 'Nodal Officer Email is required'
          : 'Moderator Official ID or MoE Email is required';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 4) {
      errors.password = 'Password must be at least 4 characters';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    setTimeout(async () => {
      try {
        const finalCollegeCode = (collegeInputCode || selectedCollegeCode).trim().toUpperCase();
        const matchingCollege = ACCREDITED_COLLEGES.find((c) => c.code.toLowerCase() === finalCollegeCode.toLowerCase());
        const finalCollegeName = matchingCollege ? matchingCollege.name : 'Affiliated Higher Education Institution';

        await login(identifier, password, activePortal, finalCollegeCode, finalCollegeName);

        if (activePortal === 'student') {
          toast.success('Authenticated as Student! Please fill in your details.');
          navigate('/student/details'); // Direct to fill up all student details
        } else if (activePortal === 'college') {
          toast.success(`Authenticated for College Code ${finalCollegeCode}! Opening College Portal...`);
          navigate('/college');
        } else {
          toast.success('Authenticated as National Moderator! Opening Control Center...');
          navigate('/admin');
        }
      } catch (err: any) {
        const errorMsg = err?.message || 'Invalid credentials: The password you entered is incorrect. Please check your credentials and try again.';
        setErrorMessage(errorMsg);
        toast.error(errorMsg, {
          duration: 5000,
          id: 'auth-invalid-credentials'
        });
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  // Portal-specific theme colors and copy
  const portalConfig = {
    student: {
      title: 'Student Portal Login',
      badge: 'Student Access',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: GraduationCap,
      color: 'emerald',
      inputLabel: '12-Digit APAAR ID or Student Email',
      inputPlaceholder: '9842-1083-4912 or student@institute.ac.in',
      destination: 'Student APAAR Digital Card & ABC Credits',
      buttonBg: '#059669', // Emerald 600
      accentBorder: 'border-emerald-500',
      feature1: 'Fill & Review All Your Student Details',
      feature2: 'Instant Verhoeff-Verified Digital APAAR Card',
      feature3: 'Academic Bank of Credits & Grievance Queries'
    },
    college: {
      title: 'College & University Portal Login',
      badge: 'Institution Access',
      badgeClass: 'bg-blue-50 text-blue-800 border-blue-200',
      icon: Building2,
      color: 'blue',
      inputLabel: 'Institutional Nodal Officer Email',
      inputPlaceholder: 'nodal@college.ac.in',
      destination: 'College-Side Student Enrollment & AISHE Quota',
      buttonBg: '#1D4ED8', // Blue 700
      accentBorder: 'border-blue-500',
      feature1: 'Login with Unique College Code (AISHE)',
      feature2: 'College-Side Student Enrollment Form',
      feature3: 'Sanctioned Intake Capacity Reconciliation'
    },
    moderator: {
      title: 'Moderator & State Admin Portal Login',
      badge: 'National Oversight',
      badgeClass: 'bg-purple-50 text-purple-800 border-purple-200',
      icon: ShieldCheck,
      color: 'purple',
      inputLabel: 'Government Moderator ID or Official Email',
      inputPlaceholder: 'moderator@education.gov.in',
      destination: 'Full Query Control & Master National Registry',
      buttonBg: '#7E22CE', // Purple 700
      accentBorder: 'border-purple-500',
      feature1: 'Central Query & Dispute Resolution Center',
      feature2: 'Full Access to All Institutions & Records',
      feature3: 'Multi-College Fraud & Duplicate Anomaly Review'
    }
  };

  const config = portalConfig[activePortal];
  const PortalIcon = config.icon;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-purple-200 selection:text-slate-900">
      {/* Top Navbar with the Three-Line Style Hamburger Menu */}
      <Navbar portal={activePortal === 'moderator' ? 'admin' : activePortal} />

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Portal Overview & Dynamic Features (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            {/* National AICTE & MoE Crest Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-800 text-xs font-semibold shadow-xs">
              <Landmark className="w-4 h-4 text-purple-700" />
              <span>Ministry of Education • Government of India</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                One Nation, One Student ID Platform
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
                Automated Permanent Academic Account Registry (APAAR) verification engine. Authenticate through your dedicated portal to access certified student records, college intake validation, and grievance moderation.
              </p>
            </div>

            {/* THREE SEPARATE PORTAL SELECTOR CARDS */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Choose Your Login Portal
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. Student Portal Option */}
                <button
                  type="button"
                  onClick={() => handlePortalChange('student')}
                  className={`p-4 rounded-2xl border text-left transition relative cursor-pointer ${
                    activePortal === 'student'
                      ? 'bg-emerald-50/90 border-emerald-400 ring-2 ring-emerald-200 shadow-md'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2 font-bold">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div className="font-bold text-sm text-slate-900">Student</div>
                  <div className="text-[11px] text-slate-500 leading-tight mt-0.5">
                    Sign in & fill details
                  </div>
                  {activePortal === 'student' && (
                    <span className="absolute top-3 right-3 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                    </span>
                  )}
                </button>

                {/* 2. College Portal Option */}
                <button
                  type="button"
                  onClick={() => handlePortalChange('college')}
                  className={`p-4 rounded-2xl border text-left transition relative cursor-pointer ${
                    activePortal === 'college'
                      ? 'bg-blue-50/90 border-blue-400 ring-2 ring-blue-200 shadow-md'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-2 font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="font-bold text-sm text-slate-900">College</div>
                  <div className="text-[11px] text-slate-500 leading-tight mt-0.5">
                    Unique college code
                  </div>
                  {activePortal === 'college' && (
                    <span className="absolute top-3 right-3 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                    </span>
                  )}
                </button>

                {/* 3. Moderator Portal Option */}
                <button
                  type="button"
                  onClick={() => handlePortalChange('moderator')}
                  className={`p-4 rounded-2xl border text-left transition relative cursor-pointer ${
                    activePortal === 'moderator'
                      ? 'bg-purple-50/90 border-purple-400 ring-2 ring-purple-200 shadow-md'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-2 font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="font-bold text-sm text-slate-900">Moderator</div>
                  <div className="text-[11px] text-slate-500 leading-tight mt-0.5">
                    Full control & queries
                  </div>
                  {activePortal === 'moderator' && (
                    <span className="absolute top-3 right-3 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600"></span>
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Portal Features Checklist */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Capabilities in {config.title}</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{config.feature1}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{config.feature2}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{config.feature3}</span>
                </li>
              </ul>
            </div>

            {/* One-Click Quick Demo Autofill */}
            <div className="pt-1 flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Quick Demo Autofill:</span>
              <button
                type="button"
                onClick={() => handleDemoFill('student')}
                className="text-xs px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 font-semibold transition"
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('college')}
                className="text-xs px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 hover:bg-blue-200 font-semibold transition"
              >
                College
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('moderator')}
                className="text-xs px-2.5 py-1 rounded-lg bg-purple-100 text-purple-800 hover:bg-purple-200 font-semibold transition"
              >
                Moderator
              </button>
            </div>
          </div>

          {/* Right Column: Portal Login Card (6 cols) */}
          <div className="lg:col-span-6">
            <Card className="p-6 sm:p-8 shadow-xl border-slate-200/90 relative overflow-hidden">
              
              {/* Dynamic portal top header */}
              <div className="flex items-center justify-between pb-5 mb-5 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2.5 rounded-xl ${
                      activePortal === 'student'
                        ? 'bg-emerald-100 text-emerald-700'
                        : activePortal === 'college'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      <PortalIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                        {config.title}
                      </h2>
                      <p className="text-xs text-slate-500">
                        {activePortal === 'student'
                          ? 'Login to view your APAAR ID card or fill all your student details'
                          : activePortal === 'college'
                          ? 'College-side access with unique AISHE code verification'
                          : 'State & Central National Moderation Gateway'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full border bg-slate-50 text-slate-700 border-slate-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Secured with Verhoeff & TLS</span>
                </div>
              </div>

              {/* Error Alert if any */}
              {errorMessage && (
                <div className="mb-4">
                  <Alert
                    variant="error"
                    title="Authentication Failed"
                    message={errorMessage}
                    onClose={() => setErrorMessage(null)}
                  />
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* For College Portal: Select or Enter Unique College Code with Dropdown & Copy */}
                {activePortal === 'college' && (
                  <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 space-y-2.5 relative">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-blue-950 uppercase tracking-wide">
                        College Unique Code (AISHE Code) <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[11px] text-blue-700 font-medium">
                        Type or pick code to copy
                      </span>
                    </div>

                    {/* Interactive Code Input with Dropdown Button & Copy Button */}
                    <div className="relative">
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={collegeInputCode}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCollegeInputCode(val);
                            setIsDropdownOpen(true);
                            const match = ACCREDITED_COLLEGES.find(
                              (c) => c.code.toLowerCase() === val.trim().toLowerCase()
                            );
                            if (match) {
                              setSelectedCollegeCode(match.code);
                              setIdentifier(getCollegeNodalEmail(match.code, match.name));
                            }
                          }}
                          onFocus={() => setIsDropdownOpen(true)}
                          placeholder="Type or select college code (e.g. C-18491)"
                          className="w-full pl-3.5 pr-24 py-2.5 rounded-xl border border-blue-300 text-xs font-mono font-bold bg-white text-blue-900 focus:ring-2 focus:ring-blue-500/20 uppercase shadow-xs"
                        />

                        {/* Action buttons inside input */}
                        <div className="absolute right-1.5 flex items-center gap-1">
                          {/* Copy Button */}
                          <button
                            type="button"
                            onClick={(e) => handleCopyCode(collegeInputCode || selectedCollegeCode, e)}
                            title="Copy active college code"
                            className="px-2 py-1.5 rounded-lg text-slate-600 hover:text-blue-700 hover:bg-blue-100 transition flex items-center gap-1 text-[11px] font-bold cursor-pointer"
                          >
                            {copiedCode === (collegeInputCode || selectedCollegeCode) ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-700 text-[10px]">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-blue-600" />
                                <span className="text-[10px] text-blue-800">Copy</span>
                              </>
                            )}
                          </button>

                          {/* Dropdown Toggle Button */}
                          <button
                            type="button"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            title="Toggle college code dropdown"
                            className="p-1.5 rounded-lg text-slate-600 hover:text-blue-700 hover:bg-blue-100 transition cursor-pointer"
                          >
                            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-blue-700' : ''}`} />
                          </button>
                        </div>
                      </div>

                      {/* Dropdown Menu showing matching colleges with Copy button */}
                      {isDropdownOpen && (
                        <div className="absolute z-30 left-0 right-0 mt-1.5 max-h-60 overflow-y-auto bg-white rounded-xl border border-blue-200 shadow-xl divide-y divide-slate-100 animate-in fade-in slide-in-from-top-1">
                          {filteredColleges.length === 0 ? (
                            <div className="p-3 text-xs text-slate-500">
                              <div>No accredited college matching "{collegeInputCode}".</div>
                              <button
                                type="button"
                                onClick={() => {
                                  const customCode = collegeInputCode.trim().toUpperCase();
                                  setSelectedCollegeCode(customCode);
                                  setIdentifier(getCollegeNodalEmail(customCode));
                                  setIsDropdownOpen(false);
                                  toast.success(`Selected custom code: ${customCode}`);
                                }}
                                className="mt-1.5 text-blue-700 font-bold hover:underline block"
                              >
                                Use "{collegeInputCode.trim().toUpperCase()}" as custom code
                              </button>
                            </div>
                          ) : (
                            filteredColleges.map((col) => {
                              const isSelected = selectedCollegeCode === col.code;
                              return (
                                <div
                                  key={col.code}
                                  onClick={() => {
                                    setSelectedCollegeCode(col.code);
                                    setCollegeInputCode(col.code);
                                    setIdentifier(getCollegeNodalEmail(col.code, col.name));
                                    setIsDropdownOpen(false);
                                  }}
                                  className={`p-2.5 hover:bg-blue-50/80 transition flex items-center justify-between cursor-pointer text-xs ${
                                    isSelected ? 'bg-blue-50/70 font-semibold' : ''
                                  }`}
                                >
                                  <div className="flex-1 pr-2 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <span className="font-mono font-bold text-blue-800 bg-blue-100 px-1.5 py-0.5 rounded text-[11px] shrink-0">
                                        {col.code}
                                      </span>
                                      <span className="font-semibold text-slate-800 text-xs truncate">
                                        {col.name}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Individual Copy Button in Dropdown */}
                                  <button
                                    type="button"
                                    onClick={(e) => handleCopyCode(col.code, e)}
                                    title={`Copy ${col.code}`}
                                    className="px-2 py-1 bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 rounded-md text-[10px] font-bold flex items-center gap-1 transition shrink-0"
                                  >
                                    {copiedCode === col.code ? (
                                      <>
                                        <Check className="w-3 h-3 text-emerald-600" />
                                        <span className="text-emerald-700">Copied</span>
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="w-3 h-3 text-slate-500" />
                                        <span>Copy Code</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                              );
                            })
                          )}
                        </div>
                      )}
                    </div>

                    {/* Matched College Badge Card */}
                    {activeCollege && (
                      <div className="p-2.5 bg-white rounded-lg border border-blue-200 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <div className="truncate">
                            <span className="font-bold text-slate-900">{activeCollege.name}</span>
                            <span className="text-slate-400 mx-1.5">•</span>
                            <span className="font-mono text-blue-700 font-bold">{activeCollege.code}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => handleCopyCode(activeCollege.code, e)}
                          className="text-[11px] font-bold text-blue-700 hover:underline shrink-0 ml-2 flex items-center gap-0.5"
                        >
                          <Copy className="w-3 h-3" /> Copy
                        </button>
                      </div>
                    )}

                    <p className="text-[10px] text-blue-800">
                      Intake quotas and student records will be certified under this unique college code.
                    </p>
                  </div>
                )}

                <Input
                  label={config.inputLabel}
                  placeholder={config.inputPlaceholder}
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (fieldErrors.identifier) {
                      setFieldErrors((prev) => ({ ...prev, identifier: undefined }));
                    }
                  }}
                  error={fieldErrors.identifier}
                  leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                />

                <div className="space-y-1">
                  <div className="relative">
                    <Input
                      label="Password / Security PIN"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (fieldErrors.password) {
                          setFieldErrors((prev) => ({ ...prev, password: undefined }));
                        }
                      }}
                      error={fieldErrors.password}
                      leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-[34px] text-slate-400 hover:text-slate-600 focus:outline-hidden"
                      tabIndex={-1}
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <p className="text-[11px] text-slate-500 font-medium mt-1">
                      Demo password: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 font-mono font-bold">
                        {activePortal === 'student' ? 'student@2024' : activePortal === 'college' ? 'college@2024' : 'admin@moe2024'}
                      </code>
                    </p>
                  </div>
                </div>

                {/* Remember Me & Help */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-purple-700 border-slate-300 focus:ring-purple-600 cursor-pointer"
                    />
                    <span>Remember me</span>
                  </label>

                  <a
                    href="#help"
                    onClick={(e) => {
                      e.preventDefault();
                      toast(`Support for ${config.title}: Call 1800-111-678 or email support@apaar.gov.in`, {
                        icon: 'ℹ️'
                      });
                    }}
                    className="font-semibold text-purple-700 hover:text-purple-900 hover:underline transition"
                  >
                    Forgot credentials?
                  </a>
                </div>

                {/* Submit Sign In Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isLoading}
                  className="w-full mt-2 font-bold shadow-md cursor-pointer"
                  style={{ backgroundColor: config.buttonBg, color: '#FFFFFF' }}
                  rightIcon={<ArrowRight className="w-4 h-4 text-white" />}
                >
                  {isLoading ? 'Authenticating...' : `Sign In to ${config.badge}`}
                </Button>
              </form>

              {/* Special Prompt for Student Portal: Direct Fill Details option */}
              {activePortal === 'student' && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={async () => {
                      await login('9842-1083-4912', 'student@2024', 'student');
                      toast.success('Logged in as Student! Opening details form...');
                      navigate('/student/details');
                    }}
                    className="w-full py-2.5 px-4 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold transition flex items-center justify-center gap-2"
                  >
                    <GraduationCap className="w-4 h-4 text-emerald-700" />
                    <span>First-time Student? Click to Fill Up Your Details</span>
                  </button>
                </div>
              )}

              {/* Footer info */}
              <div className="mt-5 pt-4 border-t border-slate-100 text-center">
                <p className="text-[11px] text-slate-400 font-medium">
                  {activePortal === 'moderator'
                    ? 'State Moderator has authority to resolve all student queries & review anomalies.'
                    : activePortal === 'college'
                    ? 'College side fills student records with unique AISHE code & validates intake quotas.'
                    : 'Students can sign in, fill all personal & academic details, and download APAAR card.'}
                </p>
              </div>
            </Card>

            <div className="text-center mt-4">
              <p className="text-xs text-slate-500">
                Ministry of Education • Government of India
              </p>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                APAAR Engine v3.2 • AICTE Smart India Hackathon
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
