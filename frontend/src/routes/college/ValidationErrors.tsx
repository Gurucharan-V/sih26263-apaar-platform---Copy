import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { AlertCircle, Download, CheckCircle2 } from 'lucide-react';

export default function ValidationErrors() {
  const { uploadId } = useParams();

  const mockErrors = [
    { row: 5, field: 'apaarId', value: '98234-invalid', error: 'Invalid APAAR checksum / length' },
    { row: 12, field: 'dateOfBirth', value: '1990-00-00', error: 'Malformed date format' },
    { row: 23, field: 'email', value: 'rohan.duplicate@srmeaswari.ac.in', error: 'Duplicate APAAR identifier present in row 7' },
    { row: 41, field: 'contactPhone', value: '12345', error: 'Phone number must be 10 digits' },
  ];

  const handleDownloadCsv = () => {
    const csvContent = "Row,Field,Received Value,Rule Violation\n" +
      mockErrors.map(e => `${e.row},"${e.field}","${e.value}","${e.error}"`).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `validation_errors_${uploadId || 'batch'}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Ingestion Audit Report</h1>
          <p className="text-sm text-slate-500">Batch ID: <span className="font-mono text-xs">{uploadId}</span></p>
        </div>
        <button 
          onClick={handleDownloadCsv}
          className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 shadow-xs transition active:scale-95"
        >
          <Download className="w-4 h-4" /> Download Error CSV
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border">
          <p className="text-xs text-slate-500">Processed Rows</p>
          <p className="text-2xl font-bold text-slate-800">150</p>
        </div>
        <div className="bg-white p-4 rounded-xl border">
          <p className="text-xs text-emerald-600">Successfully Ingested</p>
          <p className="text-2xl font-bold text-emerald-700">146</p>
        </div>
        <div className="bg-white p-4 rounded-xl border">
          <p className="text-xs text-rose-600">Validation Failures</p>
          <p className="text-2xl font-bold text-rose-700">4</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="p-4 border-b bg-slate-50">
          <h3 className="font-semibold text-slate-800 text-sm">Failed Row Diagnostics</h3>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-600 text-xs uppercase font-medium">
            <tr>
              <th className="p-3">Row #</th>
              <th className="p-3">Field</th>
              <th className="p-3">Received Value</th>
              <th className="p-3">Rule Violation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mockErrors.map((err, i) => (
              <tr key={i} className="hover:bg-rose-50/40">
                <td className="p-3 font-mono text-xs">{err.row}</td>
                <td className="p-3 font-semibold text-slate-700">{err.field}</td>
                <td className="p-3 font-mono text-xs text-rose-700 bg-rose-50 rounded inline-block my-1">{err.value}</td>
                <td className="p-3 text-slate-600">{err.error}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
