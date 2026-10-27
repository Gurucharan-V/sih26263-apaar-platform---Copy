import React, { useState, useEffect } from 'react';
import {
  Award,
  FileCheck2,
  CheckCircle2,
  Download,
  UploadCloud,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  GraduationCap,
  FileText,
  X,
  AlertCircle,
  Clock
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

export interface SemesterMarkRecord {
  id: string;
  sem: string;
  year: string;
  creditsEarned: number;
  totalCredits: number;
  sgpa: string;
  status: 'LOCKED & VERIFIED' | 'SELF_SUBMITTED' | 'IN PROGRESS';
  marksheetFilename?: string;
  uploadedAt?: string;
}

export default function StudentCredits() {
  const { user } = useAuth();
  const studentApaar = user?.apaarId || '9842-1083-4912';
  const storageKey = `apaar_student_semesters_${studentApaar.replace(/[^0-9]/g, '') || 'default'}`;

  const [semesters, setSemesters] = useState<SemesterMarkRecord[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        // If student still has the legacy mock sample data (sem-1 to sem-5), purge it so it starts empty
        if (
          Array.isArray(parsed) &&
          parsed.some((p) => p.id === 'sem-1' || p.id === 'sem-2') &&
          parsed.every((p) => typeof p.id === 'string' && p.id.startsWith('sem-')) &&
          !parsed.some((p) => p.marksheetFilename)
        ) {
          try {
            localStorage.removeItem(storageKey);
          } catch {}
          return [];
        }
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    } catch {
      return [];
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State for Adding / Uploading Semester Marks
  const [formSem, setFormSem] = useState('Semester 1');
  const [formYear, setFormYear] = useState('2024-25');
  const [formCreditsEarned, setFormCreditsEarned] = useState(24);
  const [formTotalCredits, setFormTotalCredits] = useState(24);
  const [formSgpa, setFormSgpa] = useState('');
  const [formStatus, setFormStatus] = useState<SemesterMarkRecord['status']>('SELF_SUBMITTED');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Save to localStorage whenever semesters change
  const persistSemesters = (updated: SemesterMarkRecord[]) => {
    setSemesters(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('apaar_student_semesters_updated', { detail: { apaarId: studentApaar } }));
    } catch (e) {
      console.error('Failed to save semester credits', e);
    }
  };

  // Dynamic calculations for this student
  const totalCreditsEarned = semesters.reduce((acc, s) => acc + (Number(s.creditsEarned) || 0), 0);
  const degreeCompletionPercent = Math.min(100, Math.round((totalCreditsEarned / 160) * 100));

  // Compute actual mathematical Cumulative CGPA from student's entered SGPA
  const calculatedCgpa = (() => {
    if (semesters.length === 0 || totalCreditsEarned === 0) return '0.00';
    let weightedSum = 0;
    let countedCredits = 0;
    for (const s of semesters) {
      const gpa = parseFloat(s.sgpa);
      const credits = Number(s.creditsEarned) || 0;
      if (!isNaN(gpa) && credits > 0) {
        weightedSum += gpa * credits;
        countedCredits += credits;
      }
    }
    if (countedCredits === 0) return '0.00';
    return (weightedSum / countedCredits).toFixed(2);
  })();

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormSem(`Semester ${Math.min(8, semesters.length + 1)}`);
    setFormYear('2024-25');
    setFormCreditsEarned(24);
    setFormTotalCredits(24);
    setFormSgpa('');
    setFormStatus('SELF_SUBMITTED');
    setUploadedFile(null);
    setIsModalOpen(true);
  };

  const handleClearAllSemesters = () => {
    if (window.confirm('Are you sure you want to clear all semester marks? You can re-upload them anytime.')) {
      persistSemesters([]);
      toast.success('All semester marks cleared.');
    }
  };

  const handleEditSemester = (rec: SemesterMarkRecord) => {
    setEditingId(rec.id);
    setFormSem(rec.sem);
    setFormYear(rec.year);
    setFormCreditsEarned(rec.creditsEarned);
    setFormTotalCredits(rec.totalCredits);
    setFormSgpa(rec.sgpa);
    setFormStatus(rec.status);
    setUploadedFile(null);
    setIsModalOpen(true);
  };

  const handleDeleteSemester = (id: string) => {
    const updated = semesters.filter((s) => s.id !== id);
    persistSemesters(updated);
    toast.success('Semester grade record deleted.');
  };

  const handleSubmitSemester = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedSgpa = parseFloat(formSgpa);
    if (isNaN(parsedSgpa) || parsedSgpa < 0 || parsedSgpa > 10) {
      toast.error('Please enter a valid SGPA between 0.00 and 10.00');
      return;
    }

    if (formCreditsEarned <= 0) {
      toast.error('Please enter valid credits earned (greater than 0)');
      return;
    }

    if (editingId) {
      // Update existing
      const updated = semesters.map((s) =>
        s.id === editingId
          ? {
              ...s,
              sem: formSem,
              year: formYear,
              creditsEarned: Number(formCreditsEarned),
              totalCredits: Number(formTotalCredits),
              sgpa: parsedSgpa.toFixed(2),
              status: formStatus,
              marksheetFilename: uploadedFile ? uploadedFile.name : s.marksheetFilename,
              uploadedAt: new Date().toISOString().slice(0, 10)
            }
          : s
      );
      persistSemesters(updated);
      toast.success(`${formSem} marks updated! New CGPA: ${calculatedCgpa}`);
    } else {
      // Add new
      const newRec: SemesterMarkRecord = {
        id: `sem-${Date.now()}`,
        sem: formSem,
        year: formYear,
        creditsEarned: Number(formCreditsEarned),
        totalCredits: Number(formTotalCredits),
        sgpa: parsedSgpa.toFixed(2),
        status: uploadedFile ? 'SELF_SUBMITTED' : formStatus,
        marksheetFilename: uploadedFile?.name,
        uploadedAt: new Date().toISOString().slice(0, 10)
      };
      persistSemesters([...semesters, newRec]);
      toast.success(`Marks & grade sheet for ${formSem} uploaded successfully!`);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <Award className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Academic Bank of Credits (ABC)
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Student-managed semester credit depository. Upload grade cards & marks for institution verification under NEP 2020 NCrF.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Semester Marks</span>
          </button>

          <button
            onClick={() => toast.success('Downloaded official ABC Transcript!')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export ABC Transcript</span>
          </button>
        </div>
      </div>

      {/* Credit Summary Cards - Dynamically calculated per student */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-400 font-medium">Accumulated Credits</span>
          <div className="text-2xl font-black text-blue-900 mt-1">
            {totalCreditsEarned} / 160 Credits
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            {degreeCompletionPercent}% Degree Complete
          </span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-400 font-medium">Calculated Cumulative CGPA</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {calculatedCgpa} / 10.00
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">
            Calculated across {semesters.length} {semesters.length === 1 ? 'semester' : 'semesters'}
          </span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-400 font-medium">National ABC ID</span>
          <div className="text-lg font-mono font-bold text-slate-800 mt-1 truncate">
            {user?.abcId || `ABC-${studentApaar.replace(/[^0-9]/g, '').slice(0, 9)}`}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">
            Bound to APAAR: {studentApaar}
          </span>
        </div>
      </div>

      {/* Breakdown Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="font-bold text-xs uppercase text-slate-700 tracking-wider">
              Semester-Wise Credit & Marks Record
            </span>
            <span className="ml-2 text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
              {semesters.length} {semesters.length === 1 ? 'Entry' : 'Entries'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {semesters.length > 0 && (
              <button
                onClick={handleClearAllSemesters}
                className="text-xs font-semibold text-rose-600 hover:text-rose-800 transition cursor-pointer flex items-center gap-1"
                title="Clear all records"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}
            <button
              onClick={handleOpenAddModal}
              className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>+ Add / Upload Semester Marks</span>
            </button>
          </div>
        </div>

        {semesters.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <GraduationCap className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-base">No Semester Marks Uploaded Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Upload your semester marksheets and enter your SGPA to dynamically build your Academic Bank of Credits profile.
            </p>
            <button
              onClick={handleOpenAddModal}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Upload Semester Marks
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/50 text-slate-500 text-xs uppercase border-b">
                <tr>
                  <th className="p-3.5">Semester</th>
                  <th className="p-3.5">Academic Session</th>
                  <th className="p-3.5">Credits Completed</th>
                  <th className="p-3.5">Semester SGPA</th>
                  <th className="p-3.5">Marksheet File</th>
                  <th className="p-3.5">Verification Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {semesters.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 transition">
                    <td className="p-3.5 font-bold text-slate-900">{s.sem}</td>
                    <td className="p-3.5 font-mono text-xs text-slate-600">{s.year}</td>
                    <td className="p-3.5 font-bold text-blue-700">{s.creditsEarned} Credits</td>
                    <td className="p-3.5 font-mono font-extrabold text-slate-900 text-base">
                      {s.sgpa}
                    </td>
                    <td className="p-3.5">
                      {s.marksheetFilename ? (
                        <span className="inline-flex items-center gap-1.5 text-xs text-blue-700 font-semibold bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                          <FileText className="w-3.5 h-3.5" />
                          <span className="truncate max-w-[140px]">{s.marksheetFilename}</span>
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium italic">Direct SGPA Entry</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-bold ${
                          s.status === 'LOCKED & VERIFIED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : s.status === 'SELF_SUBMITTED'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {s.status === 'LOCKED & VERIFIED' ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        {s.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleEditSemester(s)}
                          title="Edit semester marks"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteSemester(s.id)}
                          title="Delete semester record"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Upload / Edit Semester Marks Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                  <UploadCloud className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    {editingId ? 'Edit Semester Marks' : 'Upload Semester Marksheet & SGPA'}
                  </h3>
                  <p className="text-xs text-slate-500">Record grades for verified credit accumulation</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitSemester} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Semester</label>
                  <select
                    value={formSem}
                    onChange={(e) => setFormSem(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                  >
                    <option value="Semester 1">Semester 1</option>
                    <option value="Semester 2">Semester 2</option>
                    <option value="Semester 3">Semester 3</option>
                    <option value="Semester 4">Semester 4</option>
                    <option value="Semester 5">Semester 5</option>
                    <option value="Semester 6">Semester 6</option>
                    <option value="Semester 7">Semester 7</option>
                    <option value="Semester 8">Semester 8</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Academic Session Year</label>
                  <input
                    type="text"
                    value={formYear}
                    onChange={(e) => setFormYear(e.target.value)}
                    placeholder="e.g. 2024-25"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">
                    Semester SGPA (0.00 - 10.00) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={formSgpa}
                    onChange={(e) => setFormSgpa(e.target.value)}
                    placeholder="e.g. 8.75"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-extrabold text-emerald-700 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">
                    Credits Earned <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    value={formCreditsEarned}
                    onChange={(e) => setFormCreditsEarned(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold text-blue-800 font-mono"
                    required
                  />
                </div>
              </div>

              {/* File Upload Section */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-2">
                <label className="block text-slate-700 font-bold">
                  Upload Marksheet / Grade Card (Optional PDF or Image)
                </label>
                <input
                  type="file"
                  accept=".pdf,image/png,image/jpeg"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setUploadedFile(file);
                      toast.success(`Attached marksheet: ${file.name}`);
                    }
                  }}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                />
                {uploadedFile && (
                  <p className="text-[11px] text-emerald-700 font-bold">
                    ✓ Selected: {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(1)} KB)
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingId ? 'Update Marks' : 'Save & Calculate CGPA'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
