import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
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
  Award
} from 'lucide-react';
import { useAuth, UserRole } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { Navbar } from '../../components/layout/Navbar';
import toast from 'react-hot-toast';

export type PortalType = 'student' | 'college' | 'moderator';

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
      setIdentifier('nodal@srmeaswari.ac.in'); // College Nodal Officer
      setPassword('college@eec2024');
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
      toast.success('Loaded EEC Student credentials (Rohan Sundaram)');
    } else if (portal === 'college') {
      toast.success('Loaded EEC Nodal Officer credentials (Dr. R. Rajesh)');
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
          ? 'AISHE Code or Institutional Email is required'
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
        await login(identifier, password, activePortal);

        if (activePortal === 'student') {
          toast.success('Authenticated as Student! Opening Student Portal...');
          navigate('/student');
        } else if (activePortal === 'college') {
          toast.success('Authenticated as College Nodal Officer! Opening College Portal...');
          navigate('/college');
        } else {
          toast.success('Authenticated as National Moderator! Opening Control Center...');
          navigate('/admin');
        }
      } catch (err) {
        setErrorMessage('Authentication gateway error. Please verify your connection.');
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
      inputPlaceholder: '9842-1083-4912 or student@srmeaswari.ac.in',
      destination: 'Student APAAR Digital Card & ABC Credits',
      buttonBg: '#059669', // Emerald 600
      accentBorder: 'border-emerald-500',
      feature1: 'View Verified APAAR Card with QR',
      feature2: 'Track Academic Bank of Credits (ABC)',
      feature3: 'Submit and track Grievance Queries'
    },
    college: {
      title: 'College & University Portal Login',
      badge: 'Institution Access',
      badgeClass: 'bg-blue-50 text-blue-800 border-blue-200',
      icon: Building2,
      color: 'blue',
      inputLabel: 'AISHE Code or Institutional Nodal Email',
      inputPlaceholder: 'nodal@srmeaswari.ac.in or C-16622',
      destination: 'Bulk Ingestion & Sanctioned Intake Validation',
      buttonBg: '#1D4ED8', // Blue 700
      accentBorder: 'border-blue-500',
      feature1: 'Bulk Student Ingestion (CSV / Excel)',
      feature2: 'AICTE Sanctioned Intake Reconciliation',
      feature3: 'Automated Verhoeff Algorithm Deduplication'
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
                Automated Permanent Academic Account Registry (APAAR) verification engine. Authenticate through your dedicated portal to access certified student records, intake validation, and grievance moderation.
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
                    APAAR Card & ABC
                  </div>
                  {activePortal === 'student' && (
                    <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
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
                    Ingestion & Intake
                  </div>
                  {activePortal === 'college' && (
                    <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-blue-100" />
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
                    Queries & Control
                  </div>
                  {activePortal === 'moderator' && (
                    <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-purple-500 ring-4 ring-purple-100" />
                  )}
                </button>
              </div>
            </div>

            {/* Portal Highlights Card */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>{config.title} Features</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{config.feature1}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{config.feature2}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{config.feature3}</span>
                </li>
              </ul>
            </div>

            {/* 1-Click Demo Fill Autofill */}
            <div className="p-3.5 rounded-2xl bg-slate-900 text-white shadow-md flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-medium text-slate-200">
                  Quick Demo Autofill:
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handleDemoFill('student')}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition active:scale-95"
                >
                  🎓 Student
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoFill('college')}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition active:scale-95"
                >
                  🏛️ College
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoFill('moderator')}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white transition active:scale-95"
                >
                  🛡️ Moderator
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Active Portal Login Card (6 cols) */}
          <div className="lg:col-span-6 w-full max-w-md mx-auto">
            <Card className="p-6 sm:p-8 shadow-xl border-slate-200 bg-white rounded-3xl">
              <div className="mb-6 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold shadow-xs ${
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
                          ? 'Easwari Engineering College (EEC)'
                          : activePortal === 'college'
                          ? 'AISHE Node C-16622 • Anna University'
                          : 'State & Central National Moderation Gateway'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full border bg-slate-50 text-slate-700 border-slate-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Secured with Verhoeff Checksum & TLS</span>
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
                  leftIcon={activePortal === 'student' ? <GraduationCap className="w-4 h-4" /> : activePortal === 'college' ? <Building2 className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                  required
                />

                <div>
                  <Input
                    label={activePortal === 'moderator' ? 'Govt Passkey / Password' : 'Password'}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your secure password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (fieldErrors.password) {
                        setFieldErrors((prev) => ({ ...prev, password: undefined }));
                      }
                    }}
                    error={fieldErrors.password}
                    leftIcon={<Lock className="w-4 h-4" />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-slate-400 hover:text-slate-700 transition focus:outline-none"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    }
                    required
                  />
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

              {/* Footer info */}
              <div className="mt-5 pt-4 border-t border-slate-100 text-center">
                <p className="text-[11px] text-slate-400 font-medium">
                  {activePortal === 'moderator'
                    ? 'State Moderator has authority to resolve all student queries & review anomalies.'
                    : activePortal === 'college'
                    ? 'College Nodal Officer can ingest batch datasets & monitor sanctioned quotas.'
                    : 'Students can view official APAAR ID card, ABC credits, and raise queries.'}
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
