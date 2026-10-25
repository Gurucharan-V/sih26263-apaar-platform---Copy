import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Building2, 
  ShieldCheck, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  Globe, 
  ArrowRight, 
  Sparkles,
  HelpCircle,
  FileCheck2,
  Landmark,
  AlertCircle,
  CheckCircle2,
  QrCode,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { PrototypeBanner } from '../../components/ui/PrototypeBanner';
import toast from 'react-hot-toast';

export default function Login() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState('student@srmeaswari.ac.in');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ identifier?: string; password?: string }>({});

  const handleDemoFill = (type: 'student' | 'nodal' | 'invalid') => {
    setErrorMessage(null);
    setFieldErrors({});
    if (type === 'student') {
      setIdentifier('student@srmeaswari.ac.in');
      setPassword('password123');
      toast.success('Loaded Easwari Engineering College (EEC) Student credentials');
    } else if (type === 'nodal') {
      setIdentifier('nodal@srmeaswari.ac.in');
      setPassword('password123');
      toast.success('Loaded EEC Nodal Officer credentials');
    } else {
      setIdentifier('unknown.student@test.edu');
      setPassword('wrongpassword');
      toast('Loaded sample invalid credentials to test error state', { icon: '⚠️' });
    }
  };

  const validate = () => {
    const errors: { identifier?: string; password?: string } = {};
    if (!identifier.trim()) {
      errors.identifier = 'Email address or Student ID is required';
    } else if (
      !identifier.includes('@') && 
      !/^[A-Za-z0-9]{8,15}$/.test(identifier.trim())
    ) {
      errors.identifier = 'Please enter a valid institutional email or Student ID';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
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

    // Mock Authentication Logic
    setTimeout(async () => {
      // If user deliberately entered test invalid credentials
      if (identifier.includes('unknown') || password === 'wrongpassword') {
        setIsLoading(false);
        setErrorMessage(
          'Invalid login credentials. The Institutional Student ID or password entered does not match AICTE/EEC academic records.'
        );
        return;
      }

      try {
        await login(identifier, password);
        toast.success('Authenticated successfully! Redirecting to upload portal...');
        navigate('/upload');
      } catch {
        setErrorMessage('Authentication gateway error. Please verify your connection.');
      } finally {
        setIsLoading(false);
      }
    }, 800);
  };

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(nextLang);
    toast.success(
      nextLang === 'hi' 
        ? 'भाषा बदलकर हिन्दी कर दी गई है' 
        : 'Language switched to English',
      { icon: '🌐' }
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface font-sans selection:bg-blue-200 selection:text-slate-900">
      {/* Top Prototype Navigation Banner */}
      <PrototypeBanner />

      {/* Top Header Bar */}
      <header className="w-full bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <img
            src="/assets/eec_college_logo.png"
            alt="Easwari Engineering College Official Seal"
            className="w-11 h-11 object-contain bg-white rounded-full p-0.5 border border-slate-200 shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm tracking-tight">
                Student Data Verification Portal
              </span>
              <span className="hidden sm:inline-flex text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-navy-50 text-navy-800 border border-navy-200">
                AICTE Approved
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Easwari Engineering College (EEC) • One Nation • One Student ID
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-navy-800 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 transition"
          >
            <Globe className="w-3.5 h-3.5 text-navy-700" />
            <span>{i18n.language === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>

          <a
            href="#help"
            onClick={(e) => {
              e.preventDefault();
              toast('Helpline: 1800-111-678 | support-apaar@srmeaswari.ac.in', { icon: 'ℹ️' });
            }}
            className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Helpdesk</span>
          </a>
        </div>
      </header>

      {/* Main Container - Desktop-first at 1440x900 */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Graphic & Academic Integrity Architecture (6 Cols) */}
          <div className="lg:col-span-6 space-y-6">
            {/* Institution Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-50 border border-navy-200 text-navy-800 text-xs font-semibold shadow-xs">
              <Landmark className="w-4 h-4 text-navy-700" />
              <span>Easwari Engineering College (EEC), Chennai</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-navy-950 leading-tight">
                Student Data Verification & Academic Records Gateway
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
                National portal for APAAR (Automated Permanent Academic Account Registry) ID reconciliation, biometric checksum verification, and AICTE sanctioned intake validation.
              </p>
            </div>

            {/* Academic Technology Graphic Card with Real 3D Graphic */}
            <div className="relative rounded-2xl bg-gradient-to-br from-navy-950 via-navy-900 to-slate-900 text-white shadow-xl overflow-hidden border border-navy-700/60 group">
              <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-slate-950">
                <img
                  src="/assets/academic_tech_graphic.jpg"
                  alt="APAAR Academic Technology and Cryptographic Verification Engine"
                  className="w-full h-full object-cover object-center opacity-95 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/20 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs">
                  <span className="font-bold text-white drop-shadow font-mono text-[11px] bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur-sm border border-white/10 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                    <span>APAAR Verhoeff Cryptographic Engine</span>
                  </span>
                  <span className="text-[10px] font-mono bg-emerald-500/90 text-white px-2.5 py-0.5 rounded-full font-bold shadow">
                    AICTE VALIDATED
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-3 bg-navy-950/80 backdrop-blur-sm border-t border-navy-800/80">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-navy-900/80 border border-navy-700/80">
                    <div className="flex items-center gap-1.5 text-blue-300 font-semibold mb-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Zero-Duplication</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug">
                      Cross-checks AICTE database to prevent multi-seat locking.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-navy-900/80 border border-navy-700/80">
                    <div className="flex items-center gap-1.5 text-emerald-300 font-semibold mb-1">
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>EEC Affiliated</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug">
                      Anna University Chennai verified institutional node.
                    </p>
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>AISHE Code: C-16622</span>
                  <span>NBA & NAAC A+ Accredited</span>
                </div>
              </div>
            </div>

            {/* Quick Demo Fill Pills */}
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-700 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-navy-700" />
                  Quick Demo Login (Mock Auth Only):
                </span>
                <span className="text-slate-400 font-mono text-[10px]">1-Click Autofill</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoFill('student')}
                  className="text-xs px-2.5 py-1 rounded-lg font-medium transition border bg-slate-50 hover:bg-navy-50 text-slate-700 hover:text-navy-800 border-slate-200 hover:border-navy-300 cursor-pointer"
                >
                  🎓 EEC Student
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoFill('nodal')}
                  className="text-xs px-2.5 py-1 rounded-lg font-medium transition border bg-slate-50 hover:bg-navy-50 text-slate-700 hover:text-navy-800 border-slate-200 hover:border-navy-300 cursor-pointer"
                >
                  🏛️ EEC Nodal Officer
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoFill('invalid')}
                  className="text-xs px-2.5 py-1 rounded-lg font-medium transition border bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200 hover:border-rose-300 cursor-pointer"
                >
                  ⚠️ Test Invalid Credentials (Error State)
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Polished Login Card (6 Cols) */}
          <div className="lg:col-span-6 w-full max-w-md mx-auto">
            <Card className="p-6 sm:p-8 shadow-lg border-slate-200 bg-white">
              <div className="mb-6 space-y-1">
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src="/assets/eec_college_logo.png"
                    alt="Easwari Engineering College Official Seal"
                    className="w-12 h-12 object-contain bg-white rounded-full p-0.5 border border-slate-200 shadow-xs"
                  />
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                      Student Data Verification Portal
                    </h2>
                  </div>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Secure access to your academic records
                </p>
              </div>

              {/* Login Error State Alert */}
              {errorMessage && (
                <div className="mb-5 animate-in fade-in slide-in-from-top-1 duration-200">
                  <Alert
                    variant="error"
                    title="Authentication Failed"
                    message={errorMessage}
                    actionText="Try Again"
                    onAction={() => {
                      setErrorMessage(null);
                      setIdentifier('student@srmeaswari.ac.in');
                      setPassword('password123');
                    }}
                    onClose={() => setErrorMessage(null)}
                  />
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email / Student ID Field */}
                <Input
                  label="Email address or Student ID"
                  placeholder="student@srmeaswari.ac.in or EEC2024CS042"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (fieldErrors.identifier) {
                      setFieldErrors((prev) => ({ ...prev, identifier: undefined }));
                    }
                  }}
                  error={fieldErrors.identifier}
                  leftIcon={<Mail className="w-4 h-4" />}
                  required
                />

                {/* Password Field with Show/Hide Toggle */}
                <div>
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
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
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    }
                    required
                  />
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-xs pt-0.5">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-navy-800 border-slate-300 focus:ring-navy-600 focus:ring-offset-0 cursor-pointer"
                    />
                    <span>Remember me</span>
                  </label>

                  <a
                    href="#forgot-password"
                    onClick={(e) => {
                      e.preventDefault();
                      toast('Please contact Easwari Engineering College IT cell (nodal@srmeaswari.ac.in) for password reset.', {
                        icon: 'ℹ️',
                        duration: 4000
                      });
                    }}
                    className="font-semibold text-navy-700 hover:text-navy-900 hover:underline transition"
                  >
                    Forgot password?
                  </a>
                </div>

                {/* Primary Sign In Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isLoading}
                  className="w-full mt-2"
                  style={{ backgroundColor: '#163A70', color: '#FFFFFF' }}
                  rightIcon={<ArrowRight className="w-4 h-4 text-white" />}
                >
                  {isLoading ? 'Verifying Credentials...' : 'Sign In'}
                </Button>
              </form>

              {/* Informative Mock Authentication Notice */}
              <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-navy-600" />
                  <span>Prototype only: Uses mock authentication for SIH evaluation.</span>
                </p>
              </div>
            </Card>

            {/* Small Footer Notice */}
            <div className="text-center mt-4">
              <p className="text-xs text-slate-500">
                Authorized access only | Student Data Management System
              </p>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                Easwari Engineering College • AICTE Institution Code: 1-10971201
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
