import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';

// Portals & Login
import Login from './routes/college/Login';
import UploadPage from './routes/college/UploadPage';

// Student Portal Routes
import StudentDashboard from './routes/student/StudentDashboard';
import StudentDetailsForm from './routes/student/StudentDetailsForm';
import StudentQueries from './routes/student/StudentQueries';
import StudentCredits from './routes/student/StudentCredits';
import StudentDocuments from './routes/student/StudentDocuments';

// College Portal Routes
import CollegeDashboard from './routes/college/CollegeDashboard';
import StudentForm from './routes/college/StudentForm';
import BulkUpload from './routes/college/BulkUpload';
import ValidationErrors from './routes/college/ValidationErrors';
import UploadHistory from './routes/college/UploadHistory';
import CollegeQueries from './routes/college/CollegeQueries';

// Moderator / Admin Portal Routes
import AdminDashboard from './routes/admin/AdminDashboard';
import QueryControlCenter from './routes/admin/QueryControlCenter';
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
      {/* Default Landing: Multi-Portal Login Page */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/login/student" element={<Login defaultPortal="student" />} />
      <Route path="/login/college" element={<Login defaultPortal="college" />} />
      <Route path="/login/moderator" element={<Login defaultPortal="moderator" />} />
      <Route path="/login/admin" element={<Login defaultPortal="moderator" />} />

      {/* Student Data Upload Page */}
      <Route path="/upload" element={<UploadPage />} />

      {/* 1. Student Portal Layout */}
      <Route path="/student" element={<Layout portal="student" />}>
        <Route index element={<StudentDashboard />} />
        <Route path="details" element={<StudentDetailsForm />} />
        <Route path="queries" element={<StudentQueries />} />
        <Route path="credits" element={<StudentCredits />} />
        <Route path="documents" element={<Navigate to="/student" replace />} />
      </Route>

      {/* 2. College Portal Layout */}
      <Route path="/college" element={<Layout portal="college" />}>
        <Route index element={<CollegeDashboard />} />
        <Route path="students/new" element={<StudentForm />} />
        <Route path="upload" element={<BulkUpload />} />
        <Route path="upload/errors/:uploadId" element={<ValidationErrors />} />
        <Route path="history" element={<UploadHistory />} />
        <Route path="queries" element={<CollegeQueries />} />
      </Route>

      {/* 3. Moderator / Admin Portal Layout */}
      <Route path="/admin" element={<Layout portal="admin" />}>
        <Route index element={<AdminDashboard />} />
        <Route path="queries" element={<QueryControlCenter />} />
        <Route path="institutions" element={<InstitutionTable />} />
        <Route path="intake" element={<IntakeDiscrepancies />} />
        <Route path="cases" element={<CaseQueue />} />
        <Route path="cases/:caseId" element={<CaseReview />} />
        <Route path="verify" element={<VerifyRecord />} />
        <Route path="audit" element={<AuditLogs />} />
        <Route path="reports" element={<Reports />} />
      </Route>

      {/* Moderator alias route */}
      <Route path="/moderator/*" element={<Navigate to="/admin" replace />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
