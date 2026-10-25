import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BulkUpload() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) {
      toast.error('Please select a CSV or Excel file');
      return;
    }
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      toast.success('Upload received! Processing batch in worker queue.');
      navigate('/college/upload/errors/upl_mock_9921');
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Bulk Ingestion Engine</h1>
        <p className="text-sm text-slate-500">Upload CSV or XLSX containing student records for automatic validation</p>
      </div>

      <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-white hover:bg-slate-50 transition cursor-pointer relative">
        <input
          type="file"
          accept=".csv,.xlsx"
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        <UploadCloud className="w-12 h-12 text-blue-500 mx-auto mb-3" />
        <h3 className="font-semibold text-slate-700">Drag & drop student file here</h3>
        <p className="text-xs text-slate-400 mt-1">Supports CSV, XLSX up to 50MB (~50,000 rows)</p>
        {file && (
          <div className="mt-4 inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium">
            <FileSpreadsheet className="w-4 h-4" /> {file.name} ({(file.size / 1024).toFixed(1)} KB)
          </div>
        )}
      </div>

      <div className="flex justify-between items-center bg-white p-4 rounded-xl border">
        <a
          href="/data/samples/upload_template.csv"
          download
          className="text-xs text-blue-600 hover:underline font-medium inline-flex items-center gap-1"
        >
          Download Standard CSV Template
        </a>
        <button
          onClick={handleUpload}
          disabled={!file || isUploading}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow disabled:opacity-50"
        >
          {isUploading ? 'Dispatching to Queue...' : 'Start Ingestion'}
        </button>
      </div>
    </div>
  );
}
