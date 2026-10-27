import { useState, useEffect, useCallback } from 'react';

export interface StudentQuery {
  id: string;
  studentName: string;
  apaarId: string;
  institution: string;
  aisheCode?: string;
  studentEmail?: string;
  studentPhone?: string;
  rollNo?: string;
  dob?: string;
  gender?: string;
  department?: string;
  fatherName?: string;
  category: 'APAAR_MISMATCH' | 'INTAKE_DISCREPANCY' | 'CREDIT_TRANSFER' | 'NAME_CORRECTION' | 'DIGILOCKER_SYNC';
  subject: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'PENDING_REVIEW' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  moderatorNotes?: string;
  resolvedBy?: string;
}

const DEFAULT_QUERIES: StudentQuery[] = [
  {
    id: 'QRY-2024-8901',
    studentName: 'Archived Demo Student',
    apaarId: '9840-0000-0001',
    institution: 'Easwari Engineering College (EEC)',
    aisheCode: 'C-18491',
    studentEmail: 'archived.student@institute.ac.in',
    studentPhone: '+91 98765 00001',
    rollNo: '2022CS099',
    dob: '2002-05-12',
    gender: 'Male',
    department: 'Computer Science and Engineering',
    category: 'APAAR_MISMATCH',
    subject: 'Middle name initial missing in APAAR digital credential',
    description: 'My 10th marksheet has "Archived S. Demo" but the APAAR card generated displays "Archived Demo Student". Requesting correction to align with Digilocker.',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    createdAt: '2024-10-24 14:30',
    updatedAt: '2024-10-25 10:15',
    moderatorNotes: 'Verified against Anna University master enrolment database. Updating name in central registry batch #EEC-99.',
    resolvedBy: 'Dr. V. K. Sharma (State Admin)'
  },
  {
    id: 'QRY-2024-8902',
    studentName: 'Ananya Deshpande',
    apaarId: '9841-2290-7811',
    institution: 'Chennai Institute of Technology & Engineering',
    aisheCode: 'C-16622',
    category: 'CREDIT_TRANSFER',
    subject: 'Semester 3 NPTEL 4-credit course not reflected in ABC Account',
    description: 'Completed "Cloud Computing & Distributed Systems" on NPTEL with 88%. Certificate uploaded but credits not yet populated in Academic Bank of Credits.',
    priority: 'HIGH',
    status: 'PENDING_REVIEW',
    createdAt: '2024-10-25 09:20',
    updatedAt: '2024-10-25 09:20'
  },
  {
    id: 'QRY-2024-8903',
    studentName: 'Karthik Raja',
    apaarId: '9820-4411-9034',
    institution: 'Easwari Engineering College (EEC)',
    aisheCode: 'C-18491',
    category: 'DIGILOCKER_SYNC',
    subject: 'DigiLocker sync error code DL-409 during APAAR linking',
    description: 'When clicking "Fetch from DigiLocker" inside EEC portal, receives code 409 duplicate reference.',
    priority: 'LOW',
    status: 'RESOLVED',
    createdAt: '2024-10-20 11:00',
    updatedAt: '2024-10-22 16:45',
    moderatorNotes: 'Cleared cached DigiLocker session token on national gateway. Student instructed to re-verify OTP.',
    resolvedBy: 'Dr. V. K. Sharma (State Admin)'
  },
  {
    id: 'QRY-2024-8904',
    studentName: 'Sneha Mukherjee',
    apaarId: '9833-7712-4021',
    institution: 'Bengal College of Engineering',
    aisheCode: 'C-44109',
    category: 'INTAKE_DISCREPANCY',
    subject: 'Over-intake seat allotment confirmation dispute',
    description: 'College batch intake shows 124% of sanctioned seats. Requesting confirmation of enrollment validity under AICTE norms.',
    priority: 'CRITICAL',
    status: 'PENDING_REVIEW',
    createdAt: '2024-10-25 16:10',
    updatedAt: '2024-10-25 16:10'
  }
];

export function useQueries() {
  const loadSaved = useCallback((): StudentQuery[] => {
    try {
      const saved = localStorage.getItem('apaar_queries');
      if (saved) {
        let parsed: StudentQuery[] = JSON.parse(saved);
        // Ensure QRY-2024-8901 is decoupled from active student
        parsed = parsed.map((q) => {
          if (q.id === 'QRY-2024-8901') {
            return {
              ...q,
              studentName: 'Archived Demo Student',
              apaarId: '9840-0000-0001',
              studentEmail: 'archived.student@institute.ac.in'
            };
          }
          return q;
        });
        return parsed;
      }
      return DEFAULT_QUERIES;
    } catch {
      return DEFAULT_QUERIES;
    }
  }, []);

  const [queries, setQueries] = useState<StudentQuery[]>(loadSaved);

  const refreshQueries = useCallback(() => {
    setQueries(loadSaved());
  }, [loadSaved]);

  // Sync across tabs, query updates, and auth profile changes
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'apaar_queries' || e.key === 'apaar_auth') {
        refreshQueries();
      }
    };

    const handleCustomSync = () => {
      refreshQueries();
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('apaar_queries_updated', handleCustomSync);
    window.addEventListener('apaar_auth_sync', handleCustomSync);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('apaar_queries_updated', handleCustomSync);
      window.removeEventListener('apaar_auth_sync', handleCustomSync);
    };
  }, [refreshQueries]);

  const addQuery = (newQuery: Omit<StudentQuery, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    const q: StudentQuery = {
      ...newQuery,
      id: `QRY-2024-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'PENDING_REVIEW'
    };

    const updated = [q, ...loadSaved()];
    try {
      localStorage.setItem('apaar_queries', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save query', e);
    }
    setQueries(updated);
    window.dispatchEvent(new CustomEvent('apaar_queries_updated'));
    return q;
  };

  const updateQueryStatus = (
    id: string,
    status: StudentQuery['status'],
    moderatorNotes?: string,
    resolvedBy?: string
  ) => {
    const current = loadSaved();
    const updated = current.map((q) =>
      q.id === id
        ? {
            ...q,
            status,
            moderatorNotes: moderatorNotes ?? q.moderatorNotes,
            resolvedBy: resolvedBy ?? q.resolvedBy ?? 'National Moderator Cell',
            updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
          }
        : q
    );

    try {
      localStorage.setItem('apaar_queries', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to update query status', e);
    }
    setQueries(updated);
    window.dispatchEvent(new CustomEvent('apaar_queries_updated'));
  };

  return { queries, addQuery, updateQueryStatus, refreshQueries };
}
