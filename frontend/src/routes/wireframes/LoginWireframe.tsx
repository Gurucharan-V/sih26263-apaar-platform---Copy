import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Layers, Eye, EyeOff } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { PrototypeBanner } from '../../components/ui/PrototypeBanner';
import toast from 'react-hot-toast';

export default function LoginWireframe() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('student@srmeaswari.ac.in');
  const [password, setPassword] = useState('password123');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      setError('[VALIDATION ERROR]: Both fields are required');
      return;
    }
    toast.success('[WIREFRAME ACTION]: Sign In validated. Navigating to Upload...');
    navigate('/upload');
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
          <span className="font-bold">SCREEN 01: LOGIN PAGE</span>
          <span className="text-gray-500 hidden sm:inline">| Canvas: 1440 × 900 Desktop</span>
        </div>
        <Button
          variant="wireframe"
          size="sm"
          onClick={() => navigate('/login')}
        >
          [SWITCH TO POLISHED HIGH-FI DESIGN]
        </Button>
      </div>

      {/* Main Canvas Frame */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-10">
        <div className="w-full max-w-5xl border-4 border-gray-400 bg-white p-6 sm:p-12 shadow-none relative">
          {/* Blueprint Meta Tag */}
          <div className="absolute top-0 right-0 bg-gray-300 border-b-2 border-l-2 border-gray-400 px-3 py-1 text-[11px] uppercase font-bold text-gray-700">
            FRAME: AUTH_LOGIN_DESKTOP_1440
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Graphic & Brand Blueprint (6 Cols) */}
            <div className="lg:col-span-6 space-y-4 border-2 border-dashed border-gray-300 p-6 bg-gray-50">
              <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                [SECTION: BRAND & ACADEMIC TECH ILLUSTRATION]
              </div>

              {/* Logo & Header Box */}
              <div className="border-2 border-gray-400 p-3 bg-white space-y-1">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/assets/eec_college_logo.png"
                    alt="EEC Logo Seal"
                    className="w-9 h-9 rounded-full object-contain bg-white border border-black filter grayscale"
                  />
                  <div className="text-sm font-bold uppercase">
                    Student Data Verification Portal
                  </div>
                </div>
                <div className="text-[11px] text-gray-600">
                  Easwari Engineering College (EEC) • AICTE Approved
                </div>
              </div>

              {/* Abstract Illustration Box with Real Image Wireframe */}
              <div className="border-2 border-gray-400 bg-white overflow-hidden">
                <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
                  <img
                    src="/assets/academic_tech_graphic.jpg"
                    alt="Academic Tech Illustration Blueprint"
                    className="w-full h-full object-cover filter grayscale contrast-125 opacity-85"
                  />
                  <div className="absolute inset-0 bg-black/15 pointer-events-none" />
                  <div className="absolute bottom-2 left-2 right-2 bg-white/90 border border-black p-1 text-center text-[10px] uppercase font-bold text-black">
                    [WIREFRAME ASSET: ACADEMIC TECHNOLOGY 3D GRAPHIC]
                  </div>
                </div>
              </div>

              {/* Wireframe Annotations */}
              <div className="border border-gray-300 p-2.5 text-[10px] text-gray-500 space-y-1">
                <div>• Institution: Easwari Engineering College (EEC)</div>
                <div>• Responsive: 1440x900 desktop grid, stacking on mobile</div>
                <div>• Primary Color Target: Navy Blue (#163A70)</div>
              </div>
            </div>

            {/* Right Column: Login Card Wireframe (6 Cols) */}
            <div className="lg:col-span-6 border-2 border-gray-400 p-6 sm:p-8 bg-white space-y-5">
              <div className="space-y-1 border-b-2 border-gray-300 pb-3">
                <div className="text-base font-bold uppercase">
                  [FORM CONTAINER: LOGIN]
                </div>
                <div className="text-xs text-gray-600">
                  Secure access to your academic records
                </div>
              </div>

              {error && (
                <div className="p-3 border-2 border-red-500 bg-red-50 text-red-700 text-xs">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  isWireframe
                  label="Email address or Student ID"
                  placeholder="[INPUT: EMAIL / STUDENT ID]"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />

                <Input
                  isWireframe
                  label="Password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="[INPUT: PASSWORD]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="text-gray-500 hover:text-black font-bold text-[10px]"
                    >
                      {showPass ? '[HIDE]' : '[SHOW]'}
                    </button>
                  }
                  required
                />

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-3.5 h-3.5 rounded-none" />
                    <span>[REMEMBER ME]</span>
                  </label>
                  <a href="#forgot" onClick={(e) => e.preventDefault()} className="underline text-gray-700">
                    [FORGOT PASSWORD?]
                  </a>
                </div>

                <Button
                  type="submit"
                  variant="wireframe"
                  size="md"
                  className="w-full mt-2 font-bold"
                >
                  [PRIMARY BUTTON: SIGN IN]
                </Button>
              </form>

              {/* Footer Note */}
              <div className="border-t-2 border-gray-300 pt-3 text-center text-[11px] text-gray-600 uppercase">
                Authorized access only | Student Data Management System
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
