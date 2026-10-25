import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Sparkles, Layers, AlertCircle, UploadCloud, LogIn, ChevronDown, ChevronUp } from 'lucide-react';

export const PrototypeBanner: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="bg-slate-900 text-white border-b border-slate-800 text-xs z-50 sticky top-0 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-mono font-medium text-slate-300">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-600/30 text-blue-300 border border-blue-500/40 text-[11px] font-bold">
            SIH 26263 PROTOTYPE
          </span>
          <span className="hidden md:inline text-slate-400">
            • APAAR ID Verification Platform (Easwari Engineering College - EEC)
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-0.5">
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `px-2.5 py-1 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`
            }
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Polished Login</span>
          </NavLink>

          <NavLink
            to="/upload"
            className={({ isActive }) =>
              `px-2.5 py-1 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`
            }
          >
            <UploadCloud className="w-3.5 h-3.5 text-blue-400" />
            <span>Upload Page</span>
          </NavLink>

          <span className="text-slate-700 hidden sm:inline">|</span>

          <NavLink
            to="/wireframes/login"
            className={({ isActive }) =>
              `px-2 py-1 rounded-lg text-xs font-mono inline-flex items-center gap-1 transition whitespace-nowrap ${
                isActive
                  ? 'bg-slate-700 text-emerald-300 font-bold border border-slate-600'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`
            }
          >
            <Layers className="w-3 h-3 text-slate-400" />
            <span>[Wireframe: Login]</span>
          </NavLink>

          <NavLink
            to="/wireframes/upload"
            className={({ isActive }) =>
              `px-2 py-1 rounded-lg text-xs font-mono inline-flex items-center gap-1 transition whitespace-nowrap ${
                isActive
                  ? 'bg-slate-700 text-emerald-300 font-bold border border-slate-600'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`
            }
          >
            <Layers className="w-3 h-3 text-slate-400" />
            <span>[Wireframe: Upload]</span>
          </NavLink>

          <NavLink
            to="/wireframes/errors"
            className={({ isActive }) =>
              `px-2 py-1 rounded-lg text-xs font-mono inline-flex items-center gap-1 transition whitespace-nowrap ${
                isActive
                  ? 'bg-slate-700 text-rose-300 font-bold border border-slate-600'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`
            }
          >
            <AlertCircle className="w-3 h-3 text-amber-400" />
            <span>[Wireframe: Errors]</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
};
