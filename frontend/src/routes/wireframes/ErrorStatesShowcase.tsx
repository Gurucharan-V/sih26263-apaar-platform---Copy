import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertCircle, 
  CheckCircle2, 
  FileWarning, 
  WifiOff, 
  ShieldAlert, 
  ArrowLeft, 
  RotateCcw, 
  LogIn, 
  FileCheck2, 
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { PrototypeBanner } from '../../components/ui/PrototypeBanner';

type ErrorType = 
  | 'invalid_login'
  | 'invalid_apaar'
  | 'unsupported_format'
  | 'size_exceeded'
  | 'network_failure'
  | 'missing_fields'
  | 'upload_success';

export default function ErrorStatesShowcase() {
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState<ErrorType>('invalid_login');
  const [isWireframeMode, setIsWireframeMode] = useState(false);

  const errorScenarios: Record<
    ErrorType,
    {
      title: string;
      message: string;
      category: string;
      code: string;
      icon: React.ReactNode;
      primaryActionText: string;
      onPrimaryAction: () => void;
      secondaryActionText?: string;
      onSecondaryAction?: () => void;
    }
  > = {
    invalid_login: {
      category: 'Authentication Error',
      code: 'ERR_AUTH_401',
      title: 'Invalid Login Credentials',
      message: 'The institutional email or Student ID does not match any accredited records in the Easwari Engineering College (EEC) AICTE database.',
      icon: <ShieldAlert className="w-8 h-8 text-rose-600" />,
      primaryActionText: 'Try Again',
      onPrimaryAction: () => navigate('/login'),
      secondaryActionText: 'Reset Password',
      onSecondaryAction: () => navigate('/login'),
    },
    invalid_apaar: {
      category: 'Validation Violation',
      code: 'ERR_VERHOEFF_CHECKSUM',
      title: 'Invalid or Missing APAAR ID',
      message: 'The provided APAAR ID "98234-invalid" fails the national 12-digit Verhoeff cryptographic checksum validation.',
      icon: <AlertCircle className="w-8 h-8 text-rose-600" />,
      primaryActionText: 'Correct APAAR ID',
      onPrimaryAction: () => navigate('/upload'),
      secondaryActionText: 'View Verification Rules',
      onSecondaryAction: () => navigate('/wireframes/upload'),
    },
    unsupported_format: {
      category: 'Ingestion Error',
      code: 'ERR_FORMAT_UNSUPPORTED',
      title: 'Unsupported Document Format',
      message: 'The uploaded file (.zip/.exe) is not accepted. Please upload verified academic documentation in PDF, JPG, PNG, CSV, or XLSX formats.',
      icon: <FileWarning className="w-8 h-8 text-amber-600" />,
      primaryActionText: 'Upload Valid Format',
      onPrimaryAction: () => navigate('/upload'),
      secondaryActionText: 'Download CSV Template',
      onSecondaryAction: () => navigate('/college/upload'),
    },
    size_exceeded: {
      category: 'Ingestion Error',
      code: 'ERR_PAYLOAD_TOO_LARGE',
      title: 'File Size Exceeding Maximum Limit',
      message: 'Selected document file size (14.2 MB) exceeds the allowable upload threshold of 5 MB per student certificate.',
      icon: <FileWarning className="w-8 h-8 text-amber-600" />,
      primaryActionText: 'Compress & Re-Upload',
      onPrimaryAction: () => navigate('/upload'),
      secondaryActionText: 'Go Back',
      onSecondaryAction: () => navigate('/upload'),
    },
    network_failure: {
      category: 'System & Connectivity Error',
      code: 'ERR_AICTE_REGISTRY_TIMEOUT',
      title: 'Upload Failure & Network Error',
      message: 'The connection to the central APAAR verification cluster timed out after 30 seconds. Your submission draft has been cached locally.',
      icon: <WifiOff className="w-8 h-8 text-rose-600" />,
      primaryActionText: 'Retry Connection',
      onPrimaryAction: () => navigate('/upload'),
      secondaryActionText: 'Return to Login',
      onSecondaryAction: () => navigate('/login'),
    },
    missing_fields: {
      category: 'Form Validation Error',
      code: 'ERR_SCHEMA_INCOMPLETE',
      title: 'Missing Required Academic Fields',
      message: 'Mandatory parameters missing: Student Full Name, Department Code, and Intake Year are required for AICTE admission intake cross-check.',
      icon: <AlertCircle className="w-8 h-8 text-rose-600" />,
      primaryActionText: 'Complete Required Fields',
      onPrimaryAction: () => navigate('/upload'),
      secondaryActionText: 'Go Back',
      onSecondaryAction: () => navigate('/upload'),
    },
    upload_success: {
      category: 'Ingestion Verified',
      code: 'SUCCESS_200_REGISTERED',
      title: 'Student Record Successfully Verified & Ingested',
      message: 'Student record and academic certificates successfully authenticated with Verhoeff Checksum. Registered under Easwari Engineering College (EEC) intake quota.',
      icon: <CheckCircle2 className="w-8 h-8 text-emerald-600" />,
      primaryActionText: 'View Upload Receipt',
      onPrimaryAction: () => navigate('/upload'),
      secondaryActionText: 'Return to Login',
      onSecondaryAction: () => navigate('/login'),
    },
  };

  const currentScenario = errorScenarios[selectedState];

  return (
    <div className="min-h-screen flex flex-col bg-surface font-sans selection:bg-blue-200 selection:text-slate-900">
      {/* Top Prototype Navigation Banner */}
      <PrototypeBanner />

      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="p-1.5 rounded-lg text-slate-500 hover:text-navy-800 hover:bg-slate-100 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold text-slate-900 text-sm sm:text-base">
              Reusable Error Screens & Validation States Simulator
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">
              Aaroh • Smart India Hackathon SIH 26263 Interactive Error Handler
            </p>
          </div>
        </div>

        {/* Wireframe vs Polished Toggle */}
        <button
          onClick={() => setIsWireframeMode(!isWireframeMode)}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition border flex items-center gap-1.5 ${
            isWireframeMode
              ? 'bg-gray-800 text-emerald-400 border-gray-700'
              : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{isWireframeMode ? '[VIEW: LOW-FI WIREFRAME]' : 'View: Polished High-Fi'}</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Scenario Selector Pills */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-navy-700" />
              Select Error / Success Scenario to Preview:
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              7 Specification States
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {(Object.keys(errorScenarios) as ErrorType[]).map((key) => {
              const isSelected = selectedState === key;
              const isSuccess = key === 'upload_success';
              return (
                <button
                  key={key}
                  onClick={() => setSelectedState(key)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-medium transition border cursor-pointer ${
                    isSelected
                      ? isSuccess
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                        : 'bg-navy-800 text-white border-navy-900 shadow-sm'
                      : isSuccess
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {isSuccess ? '✅ ' : '⚠️ '}
                  {errorScenarios[key].title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Standalone Error Screen Presentation Card */}
        {isWireframeMode ? (
          /* LOW-FI WIREFRAME ERROR SCREEN */
          <div className="border-4 border-gray-500 bg-white p-8 max-w-2xl mx-auto font-mono text-center space-y-5 rounded-none shadow-none">
            <div className="inline-block bg-gray-200 px-3 py-1 text-xs uppercase border border-gray-400 font-bold">
              [WIREFRAME COMPONENT: ERROR SCREEN / STATE]
            </div>

            <div className="w-16 h-16 border-2 border-black flex items-center justify-center mx-auto bg-gray-100 text-xs font-bold uppercase">
              [ICON]
            </div>

            <div className="space-y-1">
              <div className="text-[11px] text-gray-500 uppercase">
                [{currentScenario.category} • {currentScenario.code}]
              </div>
              <h2 className="text-lg font-bold text-black uppercase">
                {currentScenario.title}
              </h2>
            </div>

            <p className="text-xs text-gray-700 max-w-md mx-auto leading-relaxed border p-3 bg-gray-50">
              {currentScenario.message}
            </p>

            <div className="flex items-center justify-center gap-3 pt-3">
              <Button
                variant="wireframe"
                size="md"
                onClick={currentScenario.onPrimaryAction}
              >
                [{currentScenario.primaryActionText}]
              </Button>
              {currentScenario.secondaryActionText && (
                <Button
                  variant="wireframe"
                  size="md"
                  onClick={currentScenario.onSecondaryAction}
                >
                  [{currentScenario.secondaryActionText}]
                </Button>
              )}
            </div>

            <div className="text-[10px] text-gray-400 border-t pt-3 uppercase">
              [FOOTER: Easwari Engineering College • APAAR ID Error Handling Framework]
            </div>
          </div>
        ) : (
          /* POLISHED HIGH-FI ERROR SCREEN */
          <div className="max-w-2xl mx-auto space-y-6">
            <Card className="p-8 text-center space-y-6 shadow-md border-slate-200 bg-white">
              {/* Error Icon Pill */}
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-sm ${
                  selectedState === 'upload_success'
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                    : 'bg-rose-50 text-rose-600 border border-rose-100'
                }`}
              >
                {currentScenario.icon}
              </div>

              {/* Error Heading & Category */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold font-mono tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  {currentScenario.category} • {currentScenario.code}
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {currentScenario.title}
                </h2>
                <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
                  {currentScenario.message}
                </p>
              </div>

              {/* Inline Callout Alert Preview */}
              <div className="text-left">
                <Alert
                  variant={selectedState === 'upload_success' ? 'success' : 'error'}
                  title={currentScenario.title}
                  message={currentScenario.message}
                  actionText={currentScenario.primaryActionText}
                  onAction={currentScenario.onPrimaryAction}
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  variant={selectedState === 'upload_success' ? 'primary' : 'primary'}
                  size="md"
                  className="w-full sm:w-auto"
                  style={
                    selectedState === 'upload_success'
                      ? { backgroundColor: '#059669', color: '#FFFFFF' }
                      : { backgroundColor: '#163A70', color: '#FFFFFF' }
                  }
                  onClick={currentScenario.onPrimaryAction}
                >
                  {currentScenario.primaryActionText}
                </Button>

                {currentScenario.secondaryActionText && (
                  <Button
                    variant="outline"
                    size="md"
                    className="w-full sm:w-auto"
                    onClick={currentScenario.onSecondaryAction}
                  >
                    {currentScenario.secondaryActionText}
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="md"
                  className="w-full sm:w-auto text-slate-500 hover:text-slate-800"
                  onClick={() => navigate('/login')}
                  leftIcon={<LogIn className="w-4 h-4" />}
                >
                  Return to Login
                </Button>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-slate-100 text-slate-400 text-[11px] flex items-center justify-between">
                <span>Easwari Engineering College (EEC)</span>
                <span>AICTE Code: 1-10971201</span>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
