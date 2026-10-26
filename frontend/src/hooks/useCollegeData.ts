import { useState, useEffect, useCallback } from 'react';
import {
  CollegeDetail,
  CollegeStudentRecord,
  UploadBatch,
  CrossVerificationResult,
  getCollegeDetails,
  getCollegeStudents,
  getCollegeBatches,
  saveCollegeStudents,
  addUploadedStudentsToCollege,
  crossVerifyApaarWithCollegeRoster
} from '../services/collegeStudentService';

export function useCollegeData(collegeCode?: string) {
  const activeCode = (collegeCode || 'C-18491').trim().toUpperCase();

  const [collegeDetails, setCollegeDetails] = useState<CollegeDetail>(() => getCollegeDetails(activeCode));
  const [students, setStudents] = useState<CollegeStudentRecord[]>(() => getCollegeStudents(activeCode));
  const [batches, setBatches] = useState<UploadBatch[]>(() => getCollegeBatches(activeCode));

  const refreshData = useCallback(() => {
    setCollegeDetails(getCollegeDetails(activeCode));
    setStudents(getCollegeStudents(activeCode));
    setBatches(getCollegeBatches(activeCode));
  }, [activeCode]);

  useEffect(() => {
    refreshData();

    const handleStorageUpdate = (e: StorageEvent) => {
      if (
        e.key === `apaar_college_students_${activeCode}` ||
        e.key === `apaar_college_batches_${activeCode}`
      ) {
        refreshData();
      }
    };

    const handleCustomUpdate = (e: any) => {
      if (!e.detail || e.detail.collegeCode === activeCode) {
        refreshData();
      }
    };

    window.addEventListener('storage', handleStorageUpdate);
    window.addEventListener('apaar_college_students_updated', handleCustomUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageUpdate);
      window.removeEventListener('apaar_college_students_updated', handleCustomUpdate);
    };
  }, [activeCode, refreshData]);

  const addBatch = (filename: string, rows: Partial<CollegeStudentRecord>[]) => {
    const res = addUploadedStudentsToCollege(activeCode, filename, rows);
    refreshData();
    return res;
  };

  const crossVerify = (apaarId: string, name?: string, rollNo?: string): CrossVerificationResult => {
    return crossVerifyApaarWithCollegeRoster(activeCode, apaarId, name, rollNo);
  };

  return {
    collegeCode: activeCode,
    collegeDetails,
    students,
    batches,
    refreshData,
    addBatch,
    crossVerify
  };
}
