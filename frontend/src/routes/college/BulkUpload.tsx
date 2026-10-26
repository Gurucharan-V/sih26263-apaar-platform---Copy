import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Download,
  Building2,
  Users,
  Search,
  ShieldCheck,
  Check,
  AlertTriangle,
  Layers,
  Sparkles,
  ArrowRight,
  Eye,
  Trash2
} from 'lucide-react';
import Papa from 'papaparse';
import { useAuth } from '../../hooks/useAuth';
import { useCollegeData } from '../../hooks/useCollegeData';
import {
  STANDARD_CSV_COLUMNS,
  downloadStandardCsvTemplate,
  generateStandardCsvContent
} from '../../utils/csvTemplate';
import toast from 'react-hot-toast';

export default function BulkUpload() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const collegeCode = user?.aisheCode || 'C-18491';
  const { collegeDetails, students, batches, addBatch } = useCollegeData(collegeCode);

  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [parsedPreview, setParsedPreview] = useState<any[]>([]);
  const [previewErrors, setPreviewErrors] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'upload' | 'roster' | 'schema'>('upload');
  const [rosterSearch, setRosterSearch] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      parseFile(selected);
    }
  };

  const parseFile = (fileToParse: File) => {
    Papa.parse(fileToParse, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data as Record<string, any>[];
        const errors: string[] = [];

        if (rows.length === 0) {
          errors.push('The uploaded CSV file is empty.');
        } else {
          // Check standard columns
          const firstRow = rows[0];
          const missingCols = STANDARD_CSV_COLUMNS.filter(
            (c) => c.required && !(c.header in firstRow) && !(c.field in firstRow)
          );
          if (missingCols.length > 0) {
            errors.push(`Missing recommended headers: ${missingCols.map((c) => c.header).slice(0, 4).join(', ')}`);
          }
        }

        setPreviewErrors(errors);
        setParsedPreview(rows);
      },
      error: (err) => {
        setPreviewErrors([`Parsing failed: ${err.message}`]);
      }
    });
  };

  const handleUploadSubmit = () => {
    if (!file && parsedPreview.length === 0) {
      toast.error('Please select a CSV or XLSX file');
      return;
    }

    setIsUploading(true);
    setTimeout(() => {
      // Ingest into this college's separate student file set
      const filename = file?.name || `batch_${collegeDetails.shortName.toLowerCase()}_${Date.now()}.csv`;
      const result = addBatch(filename, parsedPreview);

      setIsUploading(false);
      setFile(null);
      setParsedPreview([]);
      setPreviewErrors([]);
      toast.success(
        `Successfully ingested ${result.addedStudents.length} students into ${collegeDetails.name} file set! Batch: ${result.batch.id}`
      );
      setActiveTab('roster');
    }, 900);
  };

  const handleLoadDemoRoster = () => {
    const demoCsv = generateStandardCsvContent(collegeCode, collegeDetails.shortName);
    Papa.parse(demoCsv, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setParsedPreview(results.data);
        setFile(new File([demoCsv], `${collegeDetails.shortName}_standard_admissions.csv`, { type: 'text/csv' }));
        setPreviewErrors([]);
        toast.success(`Loaded verified standard student dataset for ${collegeDetails.shortName}!`);
      }
    });
  };

  // Filter this college's student file set
  const filteredRoster = students.filter(
    (s) =>
      s.name.toLowerCase().includes(rosterSearch.toLowerCase()) ||
      s.apaarId.includes(rosterSearch) ||
      s.rollNo.toLowerCase().includes(rosterSearch.toLowerCase()) ||
      s.programmeId.toLowerCase().includes(rosterSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* College Details Banner */}
      <div className="p-6 bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white rounded-3xl shadow-lg border border-blue-800/40 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-mono font-bold border border-blue-400/30">
              <Building2 className="w-3.5 h-3.5" />
              <span>AISHE Code: {collegeCode}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {collegeDetails.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              {collegeDetails.affiliation} • {collegeDetails.city}, {collegeDetails.state}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => downloadStandardCsvTemplate(collegeCode, collegeDetails.shortName)}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 backdrop-blur-sm transition flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
            >
              <Download className="w-4 h-4 text-blue-300" />
              <span>Download Standard CSV Template</span>
            </button>
            <button
              onClick={() => navigate('/upload')}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Cross-Verify APAAR ID</span>
            </button>
          </div>
        </div>

        {/* College Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-white/10 text-xs">
          <div className="p-3 bg-white/5 rounded-xl">
            <div className="text-slate-400 text-[11px]">Sanctioned Intake</div>
            <div className="text-lg font-extrabold text-white">{collegeDetails.sanctionedIntake.toLocaleString()}</div>
          </div>
          <div className="p-3 bg-white/5 rounded-xl">
            <div className="text-slate-400 text-[11px]">Current Enrolled Roster</div>
            <div className="text-lg font-extrabold text-emerald-400">{students.length} Students</div>
          </div>
          <div className="p-3 bg-white/5 rounded-xl">
            <div className="text-slate-400 text-[11px]">Uploaded Batches</div>
            <div className="text-lg font-extrabold text-blue-300">{batches.length} Files</div>
          </div>
          <div className="p-3 bg-white/5 rounded-xl">
            <div className="text-slate-400 text-[11px]">Nodal Officer</div>
            <div className="text-xs font-bold text-slate-200 truncate">{collegeDetails.nodalOfficer.name}</div>
            <div className="text-[10px] text-slate-400 truncate">{collegeDetails.nodalOfficer.email}</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('upload')}
          className={`pb-3 px-3.5 flex items-center gap-2 border-b-2 transition cursor-pointer ${
            activeTab === 'upload'
              ? 'border-blue-700 text-blue-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          <span>Bulk Ingestion Engine</span>
        </button>

        <button
          onClick={() => setActiveTab('roster')}
          className={`pb-3 px-3.5 flex items-center gap-2 border-b-2 transition cursor-pointer ${
            activeTab === 'roster'
              ? 'border-blue-700 text-blue-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{collegeDetails.shortName} Student File Set ({students.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('schema')}
          className={`pb-3 px-3.5 flex items-center gap-2 border-b-2 transition cursor-pointer ${
            activeTab === 'schema'
              ? 'border-blue-700 text-blue-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Standard CSV Schema & Rules</span>
        </button>
      </div>

      {/* TAB 1: Bulk Upload Engine */}
      {activeTab === 'upload' && (
        <div className="space-y-6">
          {/* Drag & Drop Area */}
          <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-3xl p-8 sm:p-10 text-center bg-white hover:bg-blue-50/30 transition cursor-pointer relative shadow-xs">
            <input
              type="file"
              accept=".csv,.xlsx"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-700 mx-auto mb-4 flex items-center justify-center shadow-inner">
              <UploadCloud className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">
              Upload Student Roster for {collegeDetails.name}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Drag & drop standard CSV or XLSX containing student records. Records will be saved exclusively into this college's separate file set for APAAR cross-verification.
            </p>

            <div className="mt-4 flex flex-wrap justify-center items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLoadDemoRoster();
                }}
                className="px-3.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs border border-blue-200 transition cursor-pointer inline-flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Load Verified Demo Roster</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  downloadStandardCsvTemplate(collegeCode, collegeDetails.shortName);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-200 transition cursor-pointer inline-flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Standard CSV Template</span>
              </button>
            </div>

            {file && (
              <div className="mt-4 inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-4 py-2 rounded-xl text-xs font-semibold">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>{file.name}</span>
                <span className="text-slate-400">•</span>
                <span className="font-mono">{(file.size / 1024).toFixed(1)} KB</span>
                <span className="text-slate-400">•</span>
                <span>{parsedPreview.length} rows parsed</span>
              </div>
            )}
          </div>

          {/* Validation Warnings */}
          {previewErrors.length > 0 && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>CSV Header Notice</span>
              </div>
              {previewErrors.map((err, i) => (
                <p key={i} className="text-amber-800">{err}</p>
              ))}
            </div>
          )}

          {/* Parsed Preview Table */}
          {parsedPreview.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-3 p-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800 text-xs">
                    Parsed Student Records Preview ({parsedPreview.length} Rows)
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold">
                    Target: {collegeDetails.shortName} ({collegeCode})
                  </span>
                </div>
                <button
                  onClick={() => {
                    setParsedPreview([]);
                    setFile(null);
                  }}
                  className="text-xs text-rose-600 hover:underline inline-flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Clear
                </button>
              </div>

              <div className="overflow-x-auto max-h-72">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] sticky top-0 border-b">
                    <tr>
                      <th className="p-2">#</th>
                      <th className="p-2">Student Name</th>
                      <th className="p-2">APAAR ID</th>
                      <th className="p-2">Roll No</th>
                      <th className="p-2">Programme</th>
                      <th className="p-2">DOB</th>
                      <th className="p-2">Email</th>
                      <th className="p-2">AISHE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {parsedPreview.map((r, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="p-2 text-slate-400">{i + 1}</td>
                        <td className="p-2 font-sans font-bold text-slate-800">{r.name || r.studentName}</td>
                        <td className="p-2 text-blue-700">{r.apaarId}</td>
                        <td className="p-2 text-slate-600">{r.rollNo}</td>
                        <td className="p-2 text-slate-600">{r.programmeId}</td>
                        <td className="p-2 text-slate-500">{r.dateOfBirth}</td>
                        <td className="p-2 font-sans text-slate-500">{r.email}</td>
                        <td className="p-2 text-slate-700">{r.aisheCode || collegeCode}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleUploadSubmit}
                  disabled={isUploading}
                  className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer flex items-center gap-2 disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>
                    {isUploading
                      ? 'Ingesting into College Roster...'
                      : `Confirm & Ingest ${parsedPreview.length} Records into ${collegeDetails.shortName}`}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: College Student File Set (Roster) */}
      {activeTab === 'roster' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search name, APAAR ID, roll number..."
                value={rosterSearch}
                onChange={(e) => setRosterSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">
                Showing <span className="font-bold text-slate-800">{filteredRoster.length}</span> of {students.length} students
              </span>
              <button
                onClick={() => downloadStandardCsvTemplate(collegeCode, collegeDetails.shortName)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition inline-flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Export Roster
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-700" />
                <h3 className="font-bold text-slate-800 text-xs">
                  {collegeDetails.name} Bulk Uploaded Student Records
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                Cross-Verification Database Active
              </span>
            </div>

            {filteredRoster.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No students found matching your search.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold border-b">
                    <tr>
                      <th className="p-3">Student Name</th>
                      <th className="p-3">APAAR ID (12-Digit)</th>
                      <th className="p-3">Roll Number</th>
                      <th className="p-3">Programme</th>
                      <th className="p-3">Date of Birth</th>
                      <th className="p-3">Contact Email</th>
                      <th className="p-3">Verification Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {filteredRoster.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/70 transition">
                        <td className="p-3 font-bold text-slate-900">{s.name}</td>
                        <td className="p-3 font-mono font-bold text-blue-700">{s.apaarId}</td>
                        <td className="p-3 font-mono text-slate-700">{s.rollNo}</td>
                        <td className="p-3 text-slate-700 font-semibold">{s.programmeId}</td>
                        <td className="p-3 font-mono text-slate-500">{s.dateOfBirth}</td>
                        <td className="p-3 text-slate-500">{s.email}</td>
                        <td className="p-3">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Verified in Roster
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Standard CSV Schema & Rules */}
      {activeTab === 'schema' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Official Ministry of Education / AICTE Standard CSV Template Schema
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Each college must upload their student list with these exact column headers to enable automated Verhoeff checksum & cross-verification.
              </p>
            </div>
            <button
              onClick={() => downloadStandardCsvTemplate(collegeCode, collegeDetails.shortName)}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs self-start sm:self-auto"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Blank Template (.csv)</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 uppercase text-[10px] font-extrabold border-b">
                <tr>
                  <th className="p-3">Column Header</th>
                  <th className="p-3">Mandatory</th>
                  <th className="p-3">Data Type</th>
                  <th className="p-3">Example Value</th>
                  <th className="p-3">Description & Validation Rule</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {STANDARD_CSV_COLUMNS.map((col) => (
                  <tr key={col.header} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-blue-700">{col.header}</td>
                    <td className="p-3">
                      {col.required ? (
                        <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded text-[10px] font-bold">
                          REQUIRED
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px]">
                          OPTIONAL
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-mono text-slate-600">{col.type}</td>
                    <td className="p-3 font-mono text-slate-800 bg-slate-50/60">{col.example}</td>
                    <td className="p-3 text-slate-600">{col.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
