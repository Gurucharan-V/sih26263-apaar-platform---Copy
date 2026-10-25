import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';

// Polished routes
import CollegeLogin from './routes/college/Login';
import UploadPage from './routes/college/UploadPage';

// Low-fi Wireframe & Error routes
import LoginWireframe from './routes/wireframes/LoginWireframe';
import UploadWireframe from './routes/wireframes/UploadWireframe';
import ErrorStatesShowcase from './routes/wireframes/ErrorStatesShowcase';

// College Portal existing routes
import CollegeDashboard from './routes/college/CollegeDashboard';
import StudentForm from './routes/college/StudentForm';
import BulkUpload from './routes/college/BulkUpload';
import ValidationErrors from './routes/college/ValidationErrors';
import UploadHistory from './routes/college/UploadHistory';

// Admin Portal routes
import AdminDashboard from './routes/admin/AdminDashboard';
import InstitutionTable from './routes/admin/InstitutionTable';
import IntakeDiscrepancies from './routes/admin/IntakeDiscrepancies';
import CaseQueue from './routes/admin/CaseQueue';
import CaseReview from './routes/admin/CaseReview';
import VerifyRecord from './routes/admin/VerifyRecord';
import AuditLogs from './routes/admin/AuditLogs';
import Reports from './routes/admin/Reports';

export default function App() {
  return (
    <Routes>
      {/* Default Landing: Polished High-Fi Login Page */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<CollegeLogin />} />

      {/* Student Information & Document Upload Page */}
      <Route path="/upload" element={<UploadPage />} />

      {/* Low-Fidelity Figma Wireframes & Error Showcase */}
      <Route path="/wireframes/login" element={<LoginWireframe />} />
      <Route path="/wireframes/upload" element={<UploadWireframe />} />
      <Route path="/wireframes/errors" element={<ErrorStatesShowcase />} />
      <Route path="/errors" element={<ErrorStatesShowcase />} />

      {/* College Portal Layout */}
      <Route path="/college" element={<Layout portal="college" />}>
        <Route index element={<CollegeDashboard />} />
        <Route path="students/new" element={<StudentForm />} />
        <Route path="upload" element={<BulkUpload />} />
        <Route path="upload/errors/:uploadId" element={<ValidationErrors />} />
        <Route path="history" element={<UploadHistory />} />
      </Route>

      {/* Admin Portal Layout */}
      <Route path="/admin" element={<Layout portal="admin" />}>
        <Route index element={<AdminDashboard />} />
        <Route path="institutions" element={<InstitutionTable />} />
        <Route path="intake" element={<IntakeDiscrepancies />} />
        <Route path="cases" element={<CaseQueue />} />
        <Route path="cases/:caseId" element={<CaseReview />} />
        <Route path="verify" element={<VerifyRecord />} />
        <Route path="audit" element={<AuditLogs />} />
        <Route path="reports" element={<Reports />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
