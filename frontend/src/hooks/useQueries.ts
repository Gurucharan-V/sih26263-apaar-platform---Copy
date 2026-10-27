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
    studentName: 'Rohan Sundaram',
    apaarId: '9842-1083-4912',
    institution: 'Easwari Engineering College (EEC)',
    aisheCode: 'C-18491',
    studentEmail: 'rohan.sundaram@institute.ac.in',
    studentPhone: '+91 98765 43210',
    rollNo: '2024CS014',
    dob: '2003-10-06',
    gender: 'Male',
    department: 'Computer Science and Engineering',
    category: 'APAAR_MISMATCH',
    subject: 'Middle name initial missing in APAAR digital credential',
    description: 'My 10th marksheet has "Rohan S. Sundaram" but the APAAR card generated displays "Rohan Sundaram". Requesting correction to align with Digilocker.',
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
      let parsed: StudentQuery[] = saved ? JSON.parse(saved) : DEFAULT_QUERIES;

      // Sync active student's full profile details if logged in
      try {
        const authData = localStorage.getItem('apaar_auth');
        if (authData) {
          const authUser = JSON.parse(authData);
          if (authUser?.name && authUser.role === 'STUDENT') {
            const cleanUserApaar = String(authUser.apaarId || '').replace(/[^0-9]/g, '');
            parsed = parsed.map((q: StudentQuery) => {
              const cleanQApaar = String(q.apaarId || '').replace(/[^0-9]/g, '');
              if (cleanQApaar === cleanUserApaar || q.id === 'QRY-2024-8901') {
                const prevName = q.studentName || 'Rohan Sundaram';
                let updatedDesc = q.description;
                if (authUser.name && prevName && prevName !== authUser.name) {
                  updatedDesc = updatedDesc.split(prevName).join(authUser.name);
                }
                if (authUser.name && updatedDesc.includes('Rohan Sundaram')) {
                  updatedDesc = updatedDesc.split('Rohan Sundaram').join(authUser.name);
                }
                return {
                  ...q,
                  studentName: authUser.name || q.studentName,
                  institution: authUser.institutionName
                    ? `${authUser.institutionName} (${authUser.aisheCode || q.aisheCode || 'C-18491'})`
                    : q.institution,
                  aisheCode: authUser.aisheCode || q.aisheCode,
                  studentEmail: authUser.email || q.studentEmail,
                  studentPhone: authUser.phone || q.studentPhone,
                  rollNo: authUser.rollNo || q.rollNo,
                  dob: authUser.dob || q.dob,
                  gender: authUser.gender || q.gender,
                  department: authUser.department || q.department,
                  fatherName: authUser.fatherName || q.fatherName,
                  description: updatedDesc
                };
              }
              return q;
            });
          }
        }
      } catch {}

      return parsed;
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
