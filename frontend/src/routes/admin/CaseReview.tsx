import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, X, GitMerge, AlertTriangle, ArrowLeft, ShieldCheck, Building2, Calendar, Hash, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNotifications } from '../../hooks/useNotifications';

interface CaseDetail {
  id: string;
  title: string;
  type: string;
  algorithmConfidence: string;
  recordA: {
    institution: string;
    studentName: string;
    apaarId: string;
    dob: string;
    guardianName: string;
    programme: string;
    state: string;
    enrolmentNo: string;
  };
  recordB: {
    institution: string;
    studentName: string;
    apaarId: string;
    dob: string;
    guardianName: string;
    programme: string;
    state: string;
    enrolmentNo: string;
  };
  discrepancySummary: string;
}

const CASE_DATABASE: Record<string, CaseDetail> = {
  'CASE-8821': {
    id: 'CASE-8821',
    title: 'Duplicate Identity Conflict',
    type: 'Duplicate APAAR',
    algorithmConfidence: '96% (Fuzzy Identity Match)',
    recordA: {
      institution: 'VIT Vellore (Tamil Nadu)',
      studentName: 'Amitav Verma',
      apaarId: '9823-4512-3490',
      dob: '2003-08-14',
      guardianName: 'Suresh K. Verma',
      programme: 'B.Tech Computer Science (2024)',
      state: 'Tamil Nadu',
      enrolmentNo: 'VIT2024CS0892'
    },
    recordB: {
      institution: 'Delhi Technological University (Delhi)',
      studentName: 'Amitabh Verma',
      apaarId: '9841-8923-1105',
      dob: '2003-11-22',
      guardianName: 'Suresh Verma',
      programme: 'B.Tech Information Technology (2024)',
      state: 'Delhi',
      enrolmentNo: 'DTU2024IT0314'
    },
    discrepancySummary: 'Fuzzy string distance on student name combined with overlapping 10th CBSE roll number flagged multi-institution dual enrollment.'
  },
  'CASE-8822': {
    id: 'CASE-8822',
    title: 'Sanctioned Quota Exceeded',
    type: 'Over-Intake Breach',
    algorithmConfidence: '124% Quota Limit Exceeded',
    recordA: {
      institution: 'Bengal College of Engineering',
      studentName: 'Rohan Sen',
      apaarId: '9812-6634-9021',
      dob: '2004-04-18',
      guardianName: 'Alok Sen',
      programme: 'B.Tech CSE (Batch Row #182)',
      state: 'West Bengal',
      enrolmentNo: 'BCE2024CSE182'
    },
    recordB: {
      institution: 'AICTE Central Sanction Registry',
      studentName: 'Ceiling Cap Allotment Roster',
      apaarId: '9855-3210-4498',
      dob: '2004-09-05',
      guardianName: 'State Joint Entrance Board',
      programme: 'B.Tech CSE (Approved Limit: 180 Seats)',
      state: 'National Central Portal',
      enrolmentNo: 'AICTE-REG-2024-CAP180'
    },
    discrepancySummary: 'Institution uploaded intake file exceeding AICTE ceiling limit of 180 by +42 unapproved admissions.'
  },
  'CASE-8823': {
    id: 'CASE-8823',
    title: 'Aadhaar Hash Collision Verification',
    type: 'Aadhaar Hash Collision',
    algorithmConfidence: '100% Exact Hash Match',
    recordA: {
      institution: 'NIT Trichy (Tamil Nadu)',
      studentName: 'Sanya Malhotra',
      apaarId: '9866-1123-5590',
      dob: '2004-01-25',
      guardianName: 'Rajiv Malhotra',
      programme: 'B.Tech Electronics & Communication (2024)',
      state: 'Tamil Nadu',
      enrolmentNo: 'NITT2024ECE041'
    },
    recordB: {
      institution: 'IIT Madras (Tamil Nadu)',
      studentName: 'Saniya M.',
      apaarId: '9877-4490-2211',
      dob: '2003-06-19',
      guardianName: 'M. Soundararajan',
      programme: 'B.Tech Electrical Engineering (2024)',
      state: 'Tamil Nadu',
      enrolmentNo: 'IITM2024EE018'
    },
    discrepancySummary: 'Aadhaar biometric salt collision detected across two independent premier engineering institutes.'
  }
};

export default function CaseReview() {
  const { caseId = 'CASE-8821' } = useParams();
  const navigate = useNavigate();
  const [notes, setNotes] = useState('');
  const { sendNotification } = useNotifications('MODERATOR');

  // Load from database or generate unique records for any arbitrary case ID
  const activeCase: CaseDetail = CASE_DATABASE[caseId] || {
    id: caseId,
    title: `Investigation: ${caseId}`,
    type: 'Enrollment Discrepancy',
    algorithmConfidence: '92% Algorithmic Match',
    recordA: {
      institution: 'Institute of Engineering & Tech A',
      studentName: 'Kavitha R.',
      apaarId: '9833-2190-7714',
      dob: '2003-05-12',
      guardianName: 'R. Ramakrishnan',
      programme: 'B.Tech Computer Science (2024)',
      state: 'State A',
      enrolmentNo: `ENR-${caseId}-A`
    },
    recordB: {
      institution: 'Institute of Advanced Science B',
      studentName: 'Kavita Kumari',
      apaarId: '9845-6671-8892',
      dob: '2003-10-28',
      guardianName: 'S. K. Ram',
      programme: 'B.Tech Information Science (2024)',
      state: 'State B',
      enrolmentNo: `ENR-${caseId}-B`
    },
    discrepancySummary: 'Multi-institution registration cross-verification required under AICTE Section 10(k).'
  };

  const handleResolve = (action: 'approve' | 'reject' | 'merge') => {
    const actionLabel = action === 'approve' 
      ? 'Primary Record Confirmed' 
      : action === 'reject' 
      ? 'Dual Registration Rejected (Fraud Prevention)' 
      : 'Records Merged into Single Unified APAAR';

    // 1. Notify College A
    sendNotification({
      title: `Case ${caseId} Adjudicated: ${action.toUpperCase()}`,
      message: `Moderator reviewed case for ${activeCase.recordA.studentName} (${activeCase.recordA.apaarId}). Action: ${actionLabel}. Remarks: ${notes || 'Verified against DigiLocker registry.'}`,
      targetRole: 'COLLEGE_NODAL',
      sender: 'National Moderator (AICTE Oversight Cell)',
      senderRole: 'MODERATOR',
      type: action === 'reject' ? 'alert' : 'info',
      actionUrl: '/college'
    });

    // 2. Notify Student
    sendNotification({
      title: `APAAR Registry Case ${caseId} Status Update`,
      message: `Your APAAR verification investigation has concluded: ${actionLabel}. Your academic record has been updated.`,
      targetRole: 'STUDENT',
      targetStudentId: activeCase.recordA.apaarId,
      sender: 'Ministry of Education Moderator',
      senderRole: 'MODERATOR',
      type: 'info',
      actionUrl: '/student'
    });

    // 3. Save resolution in localStorage
    const saved = JSON.parse(localStorage.getItem('apaar_resolved_cases') || '[]');
    saved.push({
      caseId,
      action,
      adjudicatedAt: new Date().toISOString(),
      notes: notes || 'Adjudicated by National Moderator'
    });
    localStorage.setItem('apaar_resolved_cases', JSON.stringify(saved));

    toast.success(`Case ${caseId} resolved: ${actionLabel}! Notifications dispatched.`);
    setTimeout(() => {
      navigate('/admin/cases');
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/admin/cases')}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5 mb-2 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Case Queue
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Case Investigation: {activeCase.id}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
              {activeCase.type}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Cross-Institution Conflict Resolution & Verhoeff Identity Verification Engine
          </p>
        </div>

        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 space-y-0.5">
          <div className="font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            Confidence: {activeCase.algorithmConfidence}
          </div>
          <p className="text-[11px] text-blue-700">{activeCase.discrepancySummary}</p>
        </div>
      </div>

      {/* Two Comparative Record Cards with Distinct APAAR & DOB */}
      <div className="grid md:grid-cols-2 gap-5">
        {/* Record A */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-blue-200 shadow-sm space-y-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-600" />
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Institution Record A</span>
            </div>
            <span className="text-xs bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              {activeCase.recordA.institution}
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Student Name</p>
              <p className="font-bold text-base text-slate-900">{activeCase.recordA.studentName}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                  <Hash className="w-3 h-3 text-blue-600" /> APAAR ID
                </p>
                <p className="font-mono text-xs font-black text-blue-700">{activeCase.recordA.apaarId}</p>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-emerald-600" /> Date of Birth
                </p>
                <p className="font-semibold text-xs text-slate-800">{activeCase.recordA.dob}</p>
              </div>
            </div>

            <div>
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Guardian Name</p>
              <p className="text-xs font-medium text-slate-700">{activeCase.recordA.guardianName}</p>
            </div>

            <div>
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Enrolled Programme & Batch</p>
              <p className="text-xs font-semibold text-slate-800">{activeCase.recordA.programme}</p>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">Roll No: {activeCase.recordA.enrolmentNo}</p>
            </div>
          </div>
        </div>

        {/* Record B */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-purple-200 shadow-sm space-y-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-purple-600" />
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-600" />
              <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">Institution Record B</span>
            </div>
            <span className="text-xs bg-purple-50 text-purple-800 border border-purple-200 px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              {activeCase.recordB.institution}
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Student Name</p>
              <p className="font-bold text-base text-slate-900">{activeCase.recordB.studentName}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                  <Hash className="w-3 h-3 text-purple-600" /> APAAR ID
                </p>
                <p className="font-mono text-xs font-black text-purple-700">{activeCase.recordB.apaarId}</p>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-emerald-600" /> Date of Birth
                </p>
                <p className="font-semibold text-xs text-slate-800">{activeCase.recordB.dob}</p>
              </div>
            </div>

            <div>
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Guardian Name</p>
              <p className="text-xs font-medium text-slate-700">{activeCase.recordB.guardianName}</p>
            </div>

            <div>
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Enrolled Programme & Batch</p>
              <p className="text-xs font-semibold text-slate-800">{activeCase.recordB.programme}</p>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">Roll No: {activeCase.recordB.enrolmentNo}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Auditor Adjudication & Action */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div>
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-blue-600" />
            <span>Auditor Adjudication & Action</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Record findings, select resolution order, and notify involved universities and student.
          </p>
        </div>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Enter investigation remarks, biometric evidence, or regulatory citations (e.g. DigiLocker verified identity on Record A)..."
          className="w-full h-24 p-3 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
        />

        <div className="flex flex-wrap justify-end gap-3 pt-2 border-t border-slate-100">
          <button
            onClick={() => handleResolve('reject')}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-rose-300 text-rose-700 bg-rose-50/50 hover:bg-rose-100 rounded-xl text-xs font-bold transition active:scale-95"
          >
            <X className="w-4 h-4" /> Reject Both (Fraud Invalidation)
          </button>
          <button
            onClick={() => handleResolve('merge')}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 rounded-xl text-xs font-bold transition active:scale-95 shadow-xs"
          >
            <GitMerge className="w-4 h-4" /> Merge Records
          </button>
          <button
            onClick={() => handleResolve('approve')}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 shadow-md transition active:scale-95"
          >
            <Check className="w-4 h-4" /> Confirm & Retain Primary
          </button>
        </div>
      </div>
    </div>
  );
}
