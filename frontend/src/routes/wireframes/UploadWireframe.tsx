import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { UploadArea } from '../../components/ui/UploadArea';
import { PrototypeBanner } from '../../components/ui/PrototypeBanner';
import toast from 'react-hot-toast';

export default function UploadWireframe() {
  const navigate = useNavigate();
  const [apaarId, setApaarId] = useState('9842 1083 4912');
  const [studentName, setStudentName] = useState('Rohan Sundaram');
  const [institution, setInstitution] = useState('Easwari Engineering College (EEC)');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [course, setCourse] = useState('B.E. Computer Science');
  const [selectedFile, setSelectedFile] = useState<File | null>(() => {
    return new File(['mock content'], 'EEC_Academic_Transcript.pdf', { type: 'application/pdf' });
  });
  const [status, setStatus] = useState<'pending' | 'verified'>('pending');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('verified');
    toast.success('[WIREFRAME ACTION]: Simulated verification status: VERIFIED');
  };

  return (
    <div className="min-h-screen bg-gray-100 font-mono text-gray-900 flex flex-col">
      {/* Top Prototype Navigation Banner */}
      <PrototypeBanner />

      {/* Wireframe Canvas Toolbar */}
      <div className="bg-gray-200 border-b-2 border-gray-400 px-6 py-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className="bg-black text-white px-2 py-0.5 text-[10px] font-bold uppercase">
            FIGMA LOW-FI WIREFRAME
          </span>
          <span className="font-bold">SCREEN 02: UPLOAD & VERIFICATION PAGE</span>
          <span className="text-gray-500 hidden sm:inline">| Canvas: 1440 × 900 Desktop</span>
        </div>
        <Button
          variant="wireframe"
          size="sm"
          onClick={() => navigate('/upload')}
        >
          [SWITCH TO POLISHED HIGH-FI UPLOAD]
        </Button>
      </div>

      <main className="flex-1 p-6 sm:p-10 max-w-5xl mx-auto w-full">
        <div className="border-4 border-gray-400 bg-white p-6 sm:p-8 space-y-6 relative">
          <div className="absolute top-0 right-0 bg-gray-300 border-b-2 border-l-2 border-gray-400 px-3 py-1 text-[11px] uppercase font-bold text-gray-700">
            FRAME: UPLOAD_VERIFY_1440
          </div>

          {/* Wireframe Header */}
          <div className="border-b-2 border-gray-300 pb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 border border-black flex items-center justify-center font-bold text-xs shrink-0">
              [INST]
            </div>
            <div>
              <h1 className="text-base font-bold uppercase">
                [TITLE]: Student Information & Document Upload
              </h1>
              <p className="text-xs text-gray-600 mt-0.5">
                [SUBTITLE]: Higher Education Institution • AICTE Approved
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column: Form Fields Wireframe */}
              <div className="border-2 border-gray-400 p-4 space-y-3 bg-gray-50">
                <div className="text-[10px] uppercase font-bold text-gray-500 border-b pb-1">
                  [CONTAINER: STUDENT ACADEMIC FIELDS]
                </div>

                <Input
                  isWireframe
                  label="APAAR ID (12-Digit)"
                  value={apaarId}
                  onChange={(e) => setApaarId(e.target.value)}
                  placeholder="[INPUT: 12-DIGIT APAAR ID]"
                  required
                />

                <Input
                  isWireframe
                  label="Student Full Name"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="[INPUT: STUDENT NAME]"
                  required
                />

                <Input
                  isWireframe
                  label="Institution"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="[INPUT: INSTITUTION NAME]"
                  required
                />

                <Input
                  isWireframe
                  label="Department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="[INPUT: DEPARTMENT]"
                  required
                />

                <Input
                  isWireframe
                  label="Course / Program"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  placeholder="[INPUT: COURSE]"
                  required
                />
              </div>

              {/* Right Column: Upload Area & Status Wireframe */}
              <div className="border-2 border-gray-400 p-4 space-y-4 bg-gray-50">
                <div className="text-[10px] uppercase font-bold text-gray-500 border-b pb-1">
                  [CONTAINER: DOCUMENT UPLOAD & STATUS]
                </div>

                <UploadArea
                  isWireframe
                  onFileSelect={(f) => setSelectedFile(f)}
                  selectedFile={selectedFile}
                  allowedFormats={['PDF', 'JPG', 'PNG', 'CSV', 'XLSX']}
                  maxSizeMB={5}
                  progress={100}
                />

                {/* Status Box */}
                <div className="border-2 border-gray-400 p-3 bg-white space-y-1">
                  <div className="text-xs font-bold uppercase">
                    [SUBMISSION STATUS AREA]:{' '}
                    <span className={status === 'verified' ? 'text-green-700' : 'text-gray-600'}>
                      {status === 'verified' ? '[STATUS: VERIFIED & REGISTERED]' : '[STATUS: PENDING SUBMISSION]'}
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-600">
                    Calculates Verhoeff checksum & validates against AICTE intake cap for Easwari Engineering College.
                  </div>
                </div>
              </div>
            </div>

            {/* Wireframe Action Buttons */}
            <div className="border-2 border-gray-400 p-4 bg-gray-50 flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="wireframe"
                  size="sm"
                  onClick={() => navigate('/login')}
                >
                  [BUTTON: BACK TO LOGIN]
                </Button>
                <Button
                  type="button"
                  variant="wireframe"
                  size="sm"
                  onClick={() => {
                    setSelectedFile(null);
                    setStatus('pending');
                  }}
                >
                  [BUTTON: CANCEL]
                </Button>
              </div>

              <Button
                type="submit"
                variant="wireframe"
                size="md"
                className="font-bold bg-gray-300"
              >
                [PRIMARY BUTTON: SUBMIT FOR VERIFICATION]
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
