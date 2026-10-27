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
  ArrowLeft,
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
  ChevronDown,
  AlertTriangle,
  Search,
  X
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

export interface AccreditedCollege {
  code: string;
  name: string;
  shortName?: string;
  state?: string;
  city?: string;
  email: string;
}

export const ACCREDITED_COLLEGES: AccreditedCollege[] = [
  { code: 'C-18491', name: 'Easwari Engineering College', shortName: 'EEC', state: 'Tamil Nadu', city: 'Chennai', email: 'nodal.admissions@easwari.ac.in' },
  { code: 'C-16622', name: 'Chennai Institute of Technology & Engineering', shortName: 'CIT', state: 'Tamil Nadu', city: 'Chennai', email: 'nodal.officer@citchennai.edu.in' },
  { code: 'C-24891', name: 'National Institute of Technology (NIT Trichy)', shortName: 'NITT', state: 'Tamil Nadu', city: 'Tiruchirappalli', email: 'academic.nodal@nitt.edu' },
  { code: 'C-41209', name: 'Delhi Technological University', shortName: 'DTU', state: 'Delhi', city: 'New Delhi', email: 'admissions.nodal@dtu.ac.in' },
  { code: 'C-53104', name: 'Bangalore Technological University', shortName: 'BTU', state: 'Karnataka', city: 'Bengaluru', email: 'nodal.btu@vtu.ac.in' },
  { code: 'C-62840', name: 'Apex Institute of Science & Technology', shortName: 'AIST', state: 'Maharashtra', city: 'Mumbai', email: 'nodal@apextech.edu.in' },
  { code: 'C-36965', name: 'Vellore Institute of Technology', shortName: 'VIT', state: 'Tamil Nadu', city: 'Vellore', email: 'director.admissions@vit.ac.in' },
  { code: 'C-09122', name: 'Pune Institute of Computer Technology', shortName: 'PICT', state: 'Maharashtra', city: 'Pune', email: 'nodal@pict.edu' },
  { code: 'C-44109', name: 'Bengal College of Engineering', shortName: 'BCE', state: 'West Bengal', city: 'Durgapur', email: 'nodal@bengalcollege.ac.in' },
  { code: 'C-26120', name: 'Anna University (College of Engineering Guindy)', shortName: 'AU-CEG', state: 'Tamil Nadu', city: 'Chennai', email: 'nodal.ceg@annauniv.edu' },
  { code: 'C-59123', name: 'Indian Institute of Technology Madras (IITM)', shortName: 'IITM', state: 'Tamil Nadu', city: 'Chennai', email: 'academic.nodal@iitm.ac.in' },
  { code: 'C-31402', name: 'Indian Institute of Science (IISc Bangalore)', shortName: 'IISc', state: 'Karnataka', city: 'Bengaluru', email: 'nodal.officer@iisc.ac.in' },
  { code: 'C-49381', name: 'Indian Institute of Technology Delhi (IITD)', shortName: 'IITD', state: 'Delhi', city: 'New Delhi', email: 'nodal.academic@iitd.ac.in' },
  { code: 'C-11204', name: 'Indian Institute of Technology Bombay (IITB)', shortName: 'IITB', state: 'Maharashtra', city: 'Mumbai', email: 'dean.nodal@iitb.ac.in' }
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

  // College-specific state for searchable institution and AISHE code
  const [selectedCollegeCode, setSelectedCollegeCode] = useState('C-18491');
  const [selectedCollegeName, setSelectedCollegeName] = useState('Easwari Engineering College');
  const [collegeSearchInput, setCollegeSearchInput] = useState('Easwari Engineering College');
  const [collegeInputCode, setCollegeInputCode] = useState('C-18491');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  // Modal to switch to other portals (Institute Login & Moderate Login)
  const [showRoleModal, setShowRoleModal] = useState(false);

  // Keep activePortal in sync with URL
  useEffect(() => {
    if (defaultPortal) {
      setActivePortal(defaultPortal);
    } else if (location.pathname.includes('/college')) {
      setActivePortal('college');
    } else if (location.pathname.includes('/moderator') || location.pathname.includes('/admin')) {
      setActivePortal('moderator');
    } else {
      setActivePortal('student');
    }
  }, [location.pathname, defaultPortal]);

  // Email Mismatch Popup Modal state
  const [emailMismatchModal, setEmailMismatchModal] = useState<{
    isOpen: boolean;
    enteredEmail: string;
    expectedEmail: string;
    collegeName: string;
    collegeCode: string;
  } | null>(null);

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

  // Filter colleges based on letters typed in the searchable dropdown
  const filteredColleges = ACCREDITED_COLLEGES.filter((col) => {
    const q = collegeSearchInput.trim().toLowerCase();
    if (!q) return true;
    return (
      col.name.toLowerCase().includes(q) ||
      col.code.toLowerCase().includes(q) ||
      (col.shortName && col.shortName.toLowerCase().includes(q)) ||
      (col.city && col.city.toLowerCase().includes(q)) ||
      (col.state && col.state.toLowerCase().includes(q))
    );
  });

  const activeCollege = ACCREDITED_COLLEGES.find(
    (c) =>
      c.code.toLowerCase() === (collegeInputCode || selectedCollegeCode).trim().toLowerCase() ||
      c.name.toLowerCase() === (collegeSearchInput || selectedCollegeName).trim().toLowerCase()
  );

  const handleSelectCollege = (col: AccreditedCollege) => {
    setSelectedCollegeCode(col.code);
    setSelectedCollegeName(col.name);
    setCollegeSearchInput(col.name);
    setCollegeInputCode(col.code);
    setIsDropdownOpen(false);
    setIdentifier(col.email);
    setErrorMessage(null);
    setFieldErrors({});
    toast.success(`Selected ${col.name} (${col.code})`);
  };

  const handleCodeChange = (codeVal: string) => {
    setCollegeInputCode(codeVal);
    const upper = codeVal.trim().toUpperCase();
    const match = ACCREDITED_COLLEGES.find((c) => c.code.toUpperCase() === upper);
    if (match) {
      setSelectedCollegeCode(match.code);
      setSelectedCollegeName(match.name);
      setCollegeSearchInput(match.name);
      setIdentifier(match.email);
      setErrorMessage(null);
    }
  };

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
      const match = ACCREDITED_COLLEGES.find((c) => c.code.toUpperCase() === activeCode);
      const specificEmail = match?.email || getCollegeNodalEmail(activeCode);
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
      const match = ACCREDITED_COLLEGES.find((c) => c.code.toUpperCase() === activeCode);
      const specificEmail = match?.email || getCollegeNodalEmail(activeCode);
      setIdentifier(specificEmail);
      toast.success(`Loaded Nodal credentials for ${match ? match.name : activeCode} (${specificEmail})`);
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

    // Strict Institutional Email Verification for College Login
    if (activePortal === 'college') {
      const finalCollegeCode = (collegeInputCode || selectedCollegeCode).trim().toUpperCase();
      const matchingCollege = ACCREDITED_COLLEGES.find((c) => c.code.toLowerCase() === finalCollegeCode.toLowerCase());
      const finalCollegeName = matchingCollege ? matchingCollege.name : (selectedCollegeName || 'Affiliated Higher Education Institution');
      const expectedEmail = matchingCollege?.email || getCollegeNodalEmail(finalCollegeCode, finalCollegeName);

      // Check if email strictly matches
      if (identifier.trim().toLowerCase() !== expectedEmail.trim().toLowerCase()) {
        setEmailMismatchModal({
          isOpen: true,
          enteredEmail: identifier.trim(),
          expectedEmail,
          collegeName: finalCollegeName,
          collegeCode: finalCollegeCode
        });
        const errorMsg = `Institutional Email Mismatch: The entered email "${identifier.trim()}" does not match the registered Nodal Officer email for ${finalCollegeName} (${expectedEmail}).`;
        setErrorMessage(errorMsg);
        toast.error('Email mismatch: Please enter the official registered email for this college.', {
          id: 'email-mismatch'
        });
        return;
      }
    }

    setIsLoading(true);

    setTimeout(async () => {
      try {
        const finalCollegeCode = (collegeInputCode || selectedCollegeCode).trim().toUpperCase();
        const matchingCollege = ACCREDITED_COLLEGES.find((c) => c.code.toLowerCase() === finalCollegeCode.toLowerCase());
        const finalCollegeName = matchingCollege ? matchingCollege.name : (selectedCollegeName || 'Affiliated Higher Education Institution');

        await login(identifier, password, activePortal, finalCollegeCode, finalCollegeName);

        if (activePortal === 'student') {
          toast.success('Authenticated as Student! Please fill in your details.');
          navigate('/student/details'); // Direct to fill up all student details
        } else if (activePortal === 'college') {
          toast.success(`Authenticated for ${finalCollegeName} (${finalCollegeCode})! Opening College Portal...`);
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
      {/* Top Navbar */}
      <Navbar portal={activePortal === 'moderator' ? 'admin' : activePortal} />

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Portal Overview & Back Button (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center justify-between">
              {activePortal === 'student' ? (
                <button
                  type="button"
                  onClick={() => setShowRoleModal(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 hover:text-blue-900 hover:bg-blue-100 text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Not a student? Switch to Institute / Moderate Portal</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setActivePortal('student');
                    navigate('/login/student');
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 hover:text-emerald-950 hover:bg-emerald-100 text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-emerald-600" />
                  <span>← Back to Student Login</span>
                </button>
              )}

              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Aaroh</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-800 text-xs font-semibold shadow-xs">
                  <Landmark className="w-3.5 h-3.5 text-purple-700" />
                  <span>Ministry of Education</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                {config.title}
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
                {activePortal === 'student'
                  ? 'Authenticate to access your verified 12-digit APAAR ID card, deposit semester marks in the Academic Bank of Credits, or update registration particulars.'
                  : activePortal === 'college'
                  ? 'Accredited institution access. Enter your college code and institutional nodal credentials to manage student rosters and bulk ingestion.'
                  : 'National administrative oversight gateway for monitoring intake quotas, resolving dispute queues, and performing audit checks.'}
              </p>
            </div>

            {/* Role Lockdown Banner */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-1 shadow-md border border-slate-800">
              <div className="font-bold text-xs flex items-center gap-2 text-emerald-400">
                <Lock className="w-3.5 h-3.5" />
                <span>Dedicated Role-Isolated Login</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                You are accessing the <strong>{config.title}</strong>. For security, cross-portal switching between student, college, and moderator is disabled after login.
              </p>
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

            {/* One-Click Quick Demo Autofill (Specific to this active portal) */}
            <div className="pt-1 flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Quick Demo Autofill:</span>
              <button
                type="button"
                onClick={() => handleDemoFill(activePortal)}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 font-semibold transition cursor-pointer"
              >
                Autofill {config.title} Credentials
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

                <div className="flex items-center gap-3">
                  <div className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border bg-slate-50 text-slate-700 border-slate-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verhoeff Verified</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="text-xs text-blue-700 hover:text-blue-900 font-semibold hover:underline cursor-pointer"
                  >
                    Change Role
                  </button>
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
                {/* For College Portal: Searchable Institution Name and Unique AISHE Code */}
                {activePortal === 'college' && (
                  <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/90 space-y-3.5 relative">
                    
                    {/* Institution Name (College / University) Searchable Dropdown */}
                    <div className="relative">
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-blue-950 uppercase tracking-wide">
                          College / University Name <span className="text-rose-500">*</span>
                        </label>
                        <span className="text-[11px] text-blue-700 font-medium flex items-center gap-1">
                          <Search className="w-3 h-3" />
                          <span>Type first few letters</span>
                        </span>
                      </div>

                      <div className="relative flex items-center">
                        <div className="absolute left-3 text-slate-400 pointer-events-none">
                          <Building2 className="w-4 h-4 text-blue-600" />
                        </div>
                        <input
                          type="text"
                          value={collegeSearchInput}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCollegeSearchInput(val);
                            setIsDropdownOpen(true);
                            // Auto-match exact name
                            const exact = ACCREDITED_COLLEGES.find(
                              (c) => c.name.toLowerCase() === val.trim().toLowerCase()
                            );
                            if (exact) {
                              setSelectedCollegeCode(exact.code);
                              setSelectedCollegeName(exact.name);
                              setCollegeInputCode(exact.code);
                              setIdentifier(exact.email);
                              setErrorMessage(null);
                            }
                          }}
                          onFocus={() => setIsDropdownOpen(true)}
                          placeholder="Type first few letters (e.g. Easwari, CIT, NIT, DTU...)"
                          className="w-full pl-9 pr-20 py-2.5 rounded-xl border border-blue-300 text-xs font-semibold bg-white text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs"
                        />

                        {/* Right Buttons: Clear & Dropdown Chevron */}
                        <div className="absolute right-1.5 flex items-center gap-1">
                          {collegeSearchInput && (
                            <button
                              type="button"
                              onClick={() => {
                                setCollegeSearchInput('');
                                setIsDropdownOpen(true);
                              }}
                              title="Clear search"
                              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            title="Toggle college directory list"
                            className="p-1.5 rounded-lg text-slate-600 hover:text-blue-700 hover:bg-blue-100 transition cursor-pointer"
                          >
                            <ChevronDown
                              className={`w-4 h-4 transition-transform duration-200 ${
                                isDropdownOpen ? 'rotate-180 text-blue-700' : ''
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Dropdown Menu matching first few letters */}
                      {isDropdownOpen && (
                        <div className="absolute z-40 left-0 right-0 mt-1.5 max-h-64 overflow-y-auto bg-white rounded-xl border border-blue-200 shadow-2xl divide-y divide-slate-100 animate-in fade-in slide-in-from-top-1">
                          <div className="px-3 py-1.5 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                            <span>Accredited Institutions ({filteredColleges.length})</span>
                            <span className="text-[10px] lowercase font-normal text-slate-400">click to select & autofill</span>
                          </div>

                          {filteredColleges.length === 0 ? (
                            <div className="p-3 text-xs text-slate-500">
                              <p>No accredited institution matching "{collegeSearchInput}".</p>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedCollegeName(collegeSearchInput);
                                  setIsDropdownOpen(false);
                                  toast.success(`Set custom college: ${collegeSearchInput}`);
                                }}
                                className="mt-1.5 text-blue-700 font-bold hover:underline block"
                              >
                                Use "{collegeSearchInput}" as custom institution
                              </button>
                            </div>
                          ) : (
                            filteredColleges.map((col) => {
                              const isSelected = selectedCollegeCode === col.code;
                              return (
                                <div
                                  key={col.code}
                                  onClick={() => handleSelectCollege(col)}
                                  className={`p-2.5 hover:bg-blue-50/80 transition flex items-start justify-between cursor-pointer text-xs ${
                                    isSelected ? 'bg-blue-50 font-semibold' : ''
                                  }`}
                                >
                                  <div className="flex-1 pr-2 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <span className="font-mono font-bold text-blue-800 bg-blue-100 px-1.5 py-0.5 rounded text-[11px] shrink-0">
                                        {col.code}
                                      </span>
                                      <span className="font-semibold text-slate-900 text-xs truncate">
                                        {col.name}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                                      {col.state && <span>{col.city ? `${col.city}, ` : ''}{col.state}</span>}
                                      <span>•</span>
                                      <span className="font-mono text-emerald-700 truncate">{col.email}</span>
                                    </div>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCopyCode(col.code, e);
                                    }}
                                    title={`Copy code ${col.code}`}
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

                    {/* College Unique Code (AISHE Code) */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-blue-950 uppercase tracking-wide">
                          College Unique Code (AISHE Code) <span className="text-rose-500">*</span>
                        </label>
                        <button
                          type="button"
                          onClick={(e) => handleCopyCode(collegeInputCode || selectedCollegeCode, e)}
                          className="text-[11px] text-blue-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy AISHE Code</span>
                        </button>
                      </div>

                      <div className="relative flex items-center">
                        <div className="absolute left-3 text-slate-400 pointer-events-none">
                          <Hash className="w-4 h-4 text-blue-600" />
                        </div>
                        <input
                          type="text"
                          value={collegeInputCode}
                          onChange={(e) => handleCodeChange(e.target.value)}
                          placeholder="e.g. C-18491"
                          className="w-full pl-9 pr-24 py-2.5 rounded-xl border border-blue-300 text-xs font-mono font-bold bg-white text-blue-950 focus:ring-2 focus:ring-blue-500/20 uppercase shadow-xs"
                        />
                        <div className="absolute right-2">
                          <span className="text-[10px] font-bold text-blue-700 bg-blue-100/80 px-2 py-1 rounded-md">
                            AISHE Code
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick College Switcher Chips */}
                    <div className="pt-1">
                      <span className="text-[11px] font-semibold text-blue-900 block mb-1.5">
                        Quick Pick Accredited Institutions:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {ACCREDITED_COLLEGES.slice(0, 6).map((col) => {
                          const isCurrent = selectedCollegeCode === col.code;
                          return (
                            <button
                              key={col.code}
                              type="button"
                              onClick={() => handleSelectCollege(col)}
                              className={`text-[10px] px-2.5 py-1 rounded-lg border font-semibold transition cursor-pointer flex items-center gap-1 ${
                                isCurrent
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                  : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400 hover:bg-blue-50'
                              }`}
                            >
                              <span>{col.shortName || col.name.split(' ')[0]}</span>
                              <span className="opacity-70 font-mono">({col.code})</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Active Selected College Summary Card */}
                    {activeCollege && (
                      <div className="p-3 bg-white rounded-xl border border-blue-200 shadow-xs space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 min-w-0">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span className="font-bold text-slate-900 truncate">
                              {activeCollege.name}
                            </span>
                          </div>
                          <span className="font-mono text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded text-[11px] shrink-0">
                            {activeCollege.code}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                          <span>{activeCollege.city ? `${activeCollege.city}, ` : ''}{activeCollege.state}</span>
                          <span className="text-emerald-700 font-mono font-medium truncate ml-2">
                            Official Nodal: {activeCollege.email}
                          </span>
                        </div>
                      </div>
                    )}

                    <p className="text-[10px] text-blue-800">
                      Intake quotas and student records will be certified under this unique college code and registered nodal officer.
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

              {/* Not a Student? Blue Link */}
              <div className="mt-4 pt-3.5 border-t border-slate-100 text-center">
                {activePortal === 'student' ? (
                  <button
                    type="button"
                    onClick={() => setShowRoleModal(true)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline transition inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Not a student? Institute login or Moderate login portal →</span>
                  </button>
                ) : (
                  <div className="flex items-center justify-between text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => {
                        setActivePortal('student');
                        navigate('/login/student');
                      }}
                      className="text-emerald-700 hover:text-emerald-900 hover:underline transition inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>← Student Login</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowRoleModal(true)}
                      className="text-blue-600 hover:text-blue-800 hover:underline transition inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Switch Portal</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Special Prompt for Student Portal: Direct Fill Details option */}
              {activePortal === 'student' && (
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={async () => {
                      await login('9842-1083-4912', 'student@2024', 'student');
                      toast.success('Logged in as Student! Opening details form...');
                      navigate('/student/details');
                    }}
                    className="w-full py-2.5 px-4 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <GraduationCap className="w-4 h-4 text-emerald-700" />
                    <span>First-time Student? Click to Fill Up Your Details</span>
                  </button>
                </div>
              )}

              {/* Footer info */}
              <div className="mt-4 pt-3 border-t border-slate-100 text-center">
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
                Aaroh Platform v3.2 • APAAR Verification Engine • SIH 26263
              </p>
            </div>
          </div>
        </div>

        {/* Not a Student? Institute / Moderate Login Portal Selection Modal */}
        {showRoleModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full border border-slate-200 p-6 sm:p-7 space-y-5 animate-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 bg-blue-100 text-blue-700 rounded-xl">
                    <Building2 className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      Not a Student? Choose Your Portal
                    </h3>
                    <p className="text-xs text-slate-500">
                      Select your institutional or governmental access role
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowRoleModal(false)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3.5">
                {/* 1. Institute Login */}
                <button
                  type="button"
                  onClick={() => {
                    setActivePortal('college');
                    navigate('/login/college');
                    setShowRoleModal(false);
                  }}
                  className="w-full text-left p-4 rounded-2xl border-2 border-blue-200 hover:border-blue-600 bg-blue-50/50 hover:bg-blue-50 transition group flex items-start gap-3.5 cursor-pointer"
                >
                  <div className="p-3 bg-blue-600 text-white rounded-xl shadow-xs group-hover:scale-105 transition shrink-0">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-700 transition">
                        Institute Login (College Portal)
                      </h4>
                      <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition" />
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      For accredited colleges, universities & AISHE nodal officers. Fill and ingest student records and manage intake quota.
                    </p>
                    <span className="inline-block mt-2 text-[10px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full">
                      AISHE Institution Credentials
                    </span>
                  </div>
                </button>

                {/* 2. Moderate Login */}
                <button
                  type="button"
                  onClick={() => {
                    setActivePortal('moderator');
                    navigate('/login/moderator');
                    setShowRoleModal(false);
                  }}
                  className="w-full text-left p-4 rounded-2xl border-2 border-purple-200 hover:border-purple-600 bg-purple-50/50 hover:bg-purple-50 transition group flex items-start gap-3.5 cursor-pointer"
                >
                  <div className="p-3 bg-purple-700 text-white rounded-xl shadow-xs group-hover:scale-105 transition shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-sm group-hover:text-purple-700 transition">
                        Moderate Login (Moderator Portal)
                      </h4>
                      <ArrowRight className="w-4 h-4 text-purple-600 group-hover:translate-x-1 transition" />
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      For Ministry of Education & national regulators. Full control over student dispute queues, registry lookups and multi-college audits.
                    </p>
                    <span className="inline-block mt-2 text-[10px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-full">
                      National Administrative Credentials
                    </span>
                  </div>
                </button>

                {/* Return to Student Portal */}
                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setActivePortal('student');
                      navigate('/login/student');
                      setShowRoleModal(false);
                    }}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-900 hover:underline transition cursor-pointer"
                  >
                    Are you a student after all? Return to Student Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Email Mismatch Alert Popup Modal */}
        {emailMismatchModal?.isOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-rose-200 p-6 space-y-4 animate-in zoom-in-95">
              <div className="flex items-start gap-3.5">
                <div className="p-3 bg-rose-100 text-rose-700 rounded-xl shrink-0">
                  <AlertTriangle className="w-6 h-6 text-rose-600" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-slate-900">
                    Institutional Email Mismatch
                  </h3>
                  <p className="text-xs text-slate-500">
                    Authentication rejected. The email entered does not match the registered nodal officer for this institution.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Target Institution</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-bold text-slate-900">{emailMismatchModal.collegeName}</span>
                    <span className="font-mono text-blue-700 font-bold bg-blue-100 px-1.5 py-0.5 rounded text-[10px] shrink-0">
                      {emailMismatchModal.collegeCode}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Entered Email:</span>
                    <span className="font-mono text-xs text-rose-600 line-through font-semibold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      {emailMismatchModal.enteredEmail || '(empty)'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Registered Nodal Email:</span>
                    <span className="font-mono text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {emailMismatchModal.expectedEmail}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-600 leading-relaxed">
                For institutional security and role isolation, each accredited college or university can only be accessed using its designated Institutional Nodal Officer email registered in the AISHE database.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIdentifier(emailMismatchModal.expectedEmail);
                    setErrorMessage(null);
                    setEmailMismatchModal(null);
                    toast.success(`Populated registered email: ${emailMismatchModal.expectedEmail}`);
                  }}
                  className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Use Registered Email</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEmailMismatchModal(null)}
                  className="w-full sm:w-auto py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs transition cursor-pointer"
                >
                  Edit Manually
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
