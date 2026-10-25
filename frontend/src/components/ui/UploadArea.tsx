import React, { useState, useRef } from 'react';
import { UploadCloud, File, FileCheck, X, AlertTriangle } from 'lucide-react';
import { Button } from './Button';

export interface UploadAreaProps {
  onFileSelect?: (file: File | null) => void;
  allowedFormats?: string[];
  maxSizeMB?: number;
  progress?: number;
  selectedFile?: File | null;
  error?: string;
  isWireframe?: boolean;
}

export const UploadArea: React.FC<UploadAreaProps> = ({
  onFileSelect,
  allowedFormats = ['PDF', 'JPG', 'PNG', 'CSV', 'XLSX'],
  maxSizeMB = 5,
  progress = 0,
  selectedFile = null,
  error = '',
  isWireframe = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onFileSelect) {
      onFileSelect(null);
    }
  };

  if (isWireframe) {
    return (
      <div className="space-y-3 font-mono">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed border-gray-500 bg-gray-100 p-8 text-center cursor-pointer transition ${
            isDragging ? 'bg-gray-200 border-black' : ''
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileInput}
          />
          <div className="text-gray-500 mb-2">[ICON: UPLOAD CLOUD]</div>
          <div className="font-bold text-xs uppercase text-gray-800">
            [DRAG & DROP AREA] OR CLICK TO BROWSE
          </div>
          <div className="text-[11px] text-gray-600 mt-1">
            Allowed: {allowedFormats.join(', ')} | Max Size: {maxSizeMB}MB
          </div>
        </div>

        {selectedFile && (
          <div className="p-3 border-2 border-gray-500 bg-gray-50 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold">[SELECTED FILE]:</span> {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
            </div>
            <button onClick={handleRemove} className="text-red-600 font-bold hover:underline">
              [REMOVE]
            </button>
          </div>
        )}

        {progress > 0 && progress < 100 && (
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-gray-600">
              <span>[UPLOAD PROGRESS]:</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-300 h-2 border border-gray-500">
              <div className="bg-gray-800 h-full" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition cursor-pointer relative bg-surface hover:bg-slate-50 ${
          isDragging
            ? 'border-navy-600 bg-navy-50/50 scale-[1.005]'
            : error
            ? 'border-rose-300 bg-rose-50/30'
            : 'border-slate-300'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileInput}
        />

        <div className="w-12 h-12 rounded-2xl bg-navy-50 text-navy-800 border border-navy-100 flex items-center justify-center mx-auto mb-3 shadow-sm">
          <UploadCloud className="w-6 h-6 text-navy-800" />
        </div>

        <h3 className="font-semibold text-slate-800 text-sm">
          Drag & drop student document here, or{' '}
          <span className="text-navy-700 underline font-bold">Browse Files</span>
        </h3>

        <p className="text-xs text-slate-500 mt-1.5">
          Supports {allowedFormats.join(', ')} up to {maxSizeMB}MB
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600 font-medium">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Selected File Card */}
      {selectedFile && (
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-navy-50 text-navy-800 flex items-center justify-center">
              <File className="w-5 h-5 text-navy-800" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-800 truncate max-w-xs sm:max-w-md">
                {selectedFile.name}
              </p>
              <p className="text-[11px] text-slate-500">
                {(selectedFile.size / 1024).toFixed(1)} KB • Ready for AICTE APAAR validation
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition"
            title="Remove file"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Progress Bar */}
      {progress > 0 && progress <= 100 && (
        <div className="space-y-1.5 animate-in fade-in">
          <div className="flex justify-between items-center text-xs">
            <span className={`font-semibold flex items-center gap-1.5 ${
              progress === 100 ? 'text-emerald-700' : 'text-slate-700'
            }`}>
              {progress === 100 ? (
                <>
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  <span>Pre-Validation & Upload Complete</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  <span>Uploading & Pre-Validating Checksum...</span>
                </>
              )}
            </span>
            <span className={`font-bold ${progress === 100 ? 'text-emerald-700' : 'text-navy-800'}`}>
              {progress}%
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                progress === 100 ? 'bg-emerald-600' : 'bg-navy-800'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
