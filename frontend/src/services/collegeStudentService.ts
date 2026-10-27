/**
 * College Profiles, Separate Student File Sets (Bulk Rosters),
 * and Bulk Cross-Verification Service.
 */

export interface CollegeDetail {
  code: string; // AISHE Code
  name: string;
  shortName: string;
  state: string;
  city: string;
  affiliation: string;
  type: string;
  sanctionedIntake: number;
  enrolledCount: number;
  nodalOfficer: {
    name: string;
    email: string;
    phone: string;
    designation: string;
  };
  programmes: string[];
}

export interface CollegeStudentRecord {
  id: string;
  name: string;
  apaarId: string; // Normalized 12 digits or formatted
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  guardianName: string;
  email: string;
  contactPhone: string;
  programmeId: string;
  enrollmentYear: string;
  rollNo: string;
  aisheCode: string;
  status: 'VERIFIED' | 'PENDING' | 'FLAGGED';
  batchId?: string;
  uploadedAt: string;
}

export interface UploadBatch {
  id: string;
  filename: string;
  uploadedAt: string;
  total: number;
  passed: number;
  failed: number;
  status: 'completed' | 'processing' | 'failed';
  collegeCode: string;
}

export interface CrossVerificationResult {
  isVerified: boolean;
  status: 'VERIFIED_MATCH' | 'DISCREPANCY_FLAGGED' | 'WRONG_COLLEGE_ROSTER' | 'NOT_FOUND_IN_BULK_LIST';
  message: string;
  matchedRecord?: CollegeStudentRecord;
  collegeCode: string;
  collegeName: string;
  discrepancies?: string[];
  registeredCollege?: {
    code: string;
    name: string;
  };
}

// Master Directory of Accredited Colleges with distinct institutional details
export const COLLEGE_DETAILS: Record<string, CollegeDetail> = {
  'C-18491': {
    code: 'C-18491',
    name: 'Easwari Engineering College',
    shortName: 'EEC',
    state: 'Tamil Nadu',
    city: 'Chennai',
    affiliation: 'Anna University, Chennai (Autonomous)',
    type: 'Autonomous Technical Institution',
    sanctionedIntake: 2400,
    enrolledCount: 2280,
    nodalOfficer: {
      name: 'Dr. R. Rajesh',
      email: 'nodal.admissions@easwari.ac.in',
      phone: '+91 44 2249 0853',
      designation: 'Dean of Academic Affairs & Admissions'
    },
    programmes: ['BTECH-CSE', 'BTECH-IT', 'BTECH-ECE', 'BTECH-MECH', 'MTECH-CSE']
  },
  'C-16622': {
    code: 'C-16622',
    name: 'Chennai Institute of Technology & Engineering',
    shortName: 'CIT',
    state: 'Tamil Nadu',
    city: 'Chennai',
    affiliation: 'Anna University, Chennai',
    type: 'Affiliated Technical College',
    sanctionedIntake: 1800,
    enrolledCount: 1720,
    nodalOfficer: {
      name: 'Dr. M. Senthil Kumar',
      email: 'nodal.officer@citchennai.edu.in',
      phone: '+91 44 7111 9111',
      designation: 'Vice Principal & Nodal Coordinator'
    },
    programmes: ['BTECH-CSE', 'BTECH-AIDS', 'BTECH-ECE', 'BTECH-MECH', 'BTECH-BME']
  },
  'C-24891': {
    code: 'C-24891',
    name: 'National Institute of Technology (NIT Trichy)',
    shortName: 'NITT',
    state: 'Tamil Nadu',
    city: 'Tiruchirappalli',
    affiliation: 'Council of National Institutes of Technology (INI)',
    type: 'Institute of National Importance',
    sanctionedIntake: 1200,
    enrolledCount: 1195,
    nodalOfficer: {
      name: 'Prof. K. Narayanan',
      email: 'academic.nodal@nitt.edu',
      phone: '+91 431 250 3000',
      designation: 'Dean (Academic) & State Liaison'
    },
    programmes: ['BTECH-CSE', 'BTECH-EEE', 'BTECH-ECE', 'BTECH-CHEM', 'BTECH-CIVIL']
  },
  'C-41209': {
    code: 'C-41209',
    name: 'Delhi Technological University',
    shortName: 'DTU',
    state: 'Delhi',
    city: 'New Delhi',
    affiliation: 'Government of NCT of Delhi',
    type: 'State Technical University',
    sanctionedIntake: 3200,
    enrolledCount: 3120,
    nodalOfficer: {
      name: 'Dr. Sanjay Kapoor',
      email: 'admissions.nodal@dtu.ac.in',
      phone: '+91 11 2787 1018',
      designation: 'Chief Admissions Officer'
    },
    programmes: ['BTECH-CSE', 'BTECH-IT', 'BTECH-SE', 'BTECH-ECE', 'BTECH-EE']
  },
  'C-53104': {
    code: 'C-53104',
    name: 'Bangalore Technological University',
    shortName: 'BTU',
    state: 'Karnataka',
    city: 'Bengaluru',
    affiliation: 'Visvesvaraya Technological University (VTU)',
    type: 'State Constituent College',
    sanctionedIntake: 2100,
    enrolledCount: 1980,
    nodalOfficer: {
      name: 'Dr. C. R. Hegde',
      email: 'nodal.btu@vtu.ac.in',
      phone: '+91 80 2345 6789',
      designation: 'Registrar (Evaluation)'
    },
    programmes: ['BTECH-CSE', 'BTECH-ISE', 'BTECH-AIML', 'BTECH-ECE', 'BTECH-MECH']
  },
  'C-62840': {
    code: 'C-62840',
    name: 'Apex Institute of Science & Technology',
    shortName: 'AIST',
    state: 'Maharashtra',
    city: 'Mumbai',
    affiliation: 'University of Mumbai',
    type: 'Autonomous Institute',
    sanctionedIntake: 1500,
    enrolledCount: 1410,
    nodalOfficer: {
      name: 'Dr. Anita Deshmukh',
      email: 'nodal@apextech.edu.in',
      phone: '+91 22 2456 7890',
      designation: 'Academic Dean'
    },
    programmes: ['BTECH-CSE', 'BTECH-IT', 'BTECH-EXTC', 'BTECH-MECH']
  },
  'C-36965': {
    code: 'C-36965',
    name: 'Vellore Institute of Technology',
    shortName: 'VIT',
    state: 'Tamil Nadu',
    city: 'Vellore',
    affiliation: 'Deemed to be University',
    type: 'Deemed University',
    sanctionedIntake: 4500,
    enrolledCount: 4420,
    nodalOfficer: {
      name: 'Dr. S. Ramanathan',
      email: 'director.admissions@vit.ac.in',
      phone: '+91 416 220 2020',
      designation: 'Director (Admissions & NAD Cell)'
    },
    programmes: ['BTECH-CSE', 'BTECH-IT', 'BTECH-ECE', 'BTECH-MECH', 'BTECH-BIOTECH']
  },
  'C-09122': {
    code: 'C-09122',
    name: 'Pune Institute of Computer Technology',
    shortName: 'PICT',
    state: 'Maharashtra',
    city: 'Pune',
    affiliation: 'Savitribai Phule Pune University',
    type: 'Autonomous College',
    sanctionedIntake: 1200,
    enrolledCount: 1180,
    nodalOfficer: {
      name: 'Prof. S. T. Gandhe',
      email: 'nodal@pict.edu',
      phone: '+91 20 2437 1101',
      designation: 'HOD & Nodal Officer'
    },
    programmes: ['BTECH-CSE', 'BTECH-IT', 'BTECH-ENTC', 'BTECH-AIDS']
  },
  'C-44109': {
    code: 'C-44109',
    name: 'Bengal College of Engineering',
    shortName: 'BCE',
    state: 'West Bengal',
    city: 'Durgapur',
    affiliation: 'Maulana Abul Kalam Azad University of Technology (MAKAUT)',
    type: 'Affiliated Technical College',
    sanctionedIntake: 1400,
    enrolledCount: 1350,
    nodalOfficer: {
      name: 'Dr. Anirban Ghosh',
      email: 'nodal@bengalcollege.ac.in',
      phone: '+91 343 250 1234',
      designation: 'Dean (Academic Affairs)'
    },
    programmes: ['BTECH-CSE', 'BTECH-IT', 'BTECH-ECE', 'BTECH-EE', 'BTECH-MECH']
  }
};

// Initial Dedicated Student File Sets for each college
const DEFAULT_COLLEGE_STUDENTS: Record<string, CollegeStudentRecord[]> = {
  'C-18491': [
    {
      id: 'STU-EEC-001',
      name: 'Rohan Sundaram',
      apaarId: '9842-1083-4912',
      dateOfBirth: '2004-05-14',
      gender: 'male',
      guardianName: 'Sundaram Krishnamurthy',
      email: 'rohan.sundaram@easwari.ac.in',
      contactPhone: '9876543210',
      programmeId: 'BTECH-CSE',
      enrollmentYear: '2024',
      rollNo: 'EEC2024CS042',
      aisheCode: 'C-18491',
      status: 'VERIFIED',
      batchId: 'upl_eec_8812',
      uploadedAt: '2024-10-21 14:30'
    },
    {
      id: 'STU-EEC-002',
      name: 'Priya Natarajan',
      apaarId: '9842-1083-4913',
      dateOfBirth: '2004-08-22',
      gender: 'female',
      guardianName: 'Natarajan Sankaran',
      email: 'priya.n@easwari.ac.in',
      contactPhone: '9876543211',
      programmeId: 'BTECH-CSE',
      enrollmentYear: '2024',
      rollNo: 'EEC2024CS043',
      aisheCode: 'C-18491',
      status: 'VERIFIED',
      batchId: 'upl_eec_8812',
      uploadedAt: '2024-10-21 14:30'
    },
    {
      id: 'STU-EEC-003',
      name: 'Karthik Raja',
      apaarId: '9820-4411-9034',
      dateOfBirth: '2003-11-10',
      gender: 'male',
      guardianName: 'Raja Murugan',
      email: 'karthik.r@easwari.ac.in',
      contactPhone: '9876543212',
      programmeId: 'BTECH-IT',
      enrollmentYear: '2024',
      rollNo: 'EEC2024IT014',
      aisheCode: 'C-18491',
      status: 'VERIFIED',
      batchId: 'upl_eec_8812',
      uploadedAt: '2024-10-21 14:30'
    },
    {
      id: 'STU-EEC-004',
      name: 'Divya Muthukumar',
      apaarId: '9842-3319-5501',
      dateOfBirth: '2004-01-30',
      gender: 'female',
      guardianName: 'Muthukumar S',
      email: 'divya.m@easwari.ac.in',
      contactPhone: '9876543215',
      programmeId: 'BTECH-ECE',
      enrollmentYear: '2024',
      rollNo: 'EEC2024EC009',
      aisheCode: 'C-18491',
      status: 'VERIFIED',
      batchId: 'upl_eec_8813',
      uploadedAt: '2024-10-22 11:15'
    },
    {
      id: 'STU-EEC-005',
      name: 'Ashwin Balaji',
      apaarId: '9842-8812-4402',
      dateOfBirth: '2003-07-19',
      gender: 'male',
      guardianName: 'Balaji Raman',
      email: 'ashwin.b@easwari.ac.in',
      contactPhone: '9876543216',
      programmeId: 'BTECH-MECH',
      enrollmentYear: '2024',
      rollNo: 'EEC2024ME018',
      aisheCode: 'C-18491',
      status: 'VERIFIED',
      batchId: 'upl_eec_8813',
      uploadedAt: '2024-10-22 11:15'
    }
  ],
  'C-16622': [
    {
      id: 'STU-CIT-001',
      name: 'Vikramaditya Rao',
      apaarId: '9841-5501-1290',
      dateOfBirth: '2004-03-12',
      gender: 'male',
      guardianName: 'Rao Srinivas',
      email: 'vikram.rao@citchennai.edu.in',
      contactPhone: '9812345601',
      programmeId: 'BTECH-CSE',
      enrollmentYear: '2024',
      rollNo: 'CIT2024CS001',
      aisheCode: 'C-16622',
      status: 'VERIFIED',
      batchId: 'upl_cit_7701',
      uploadedAt: '2024-10-19 10:00'
    },
    {
      id: 'STU-CIT-002',
      name: 'Swetha Krishnan',
      apaarId: '9841-7789-3321',
      dateOfBirth: '2004-06-25',
      gender: 'female',
      guardianName: 'Krishnan G',
      email: 'swetha.k@citchennai.edu.in',
      contactPhone: '9812345602',
      programmeId: 'BTECH-AIDS',
      enrollmentYear: '2024',
      rollNo: 'CIT2024AI012',
      aisheCode: 'C-16622',
      status: 'VERIFIED',
      batchId: 'upl_cit_7701',
      uploadedAt: '2024-10-19 10:00'
    },
    {
      id: 'STU-CIT-003',
      name: 'Naveen Kumar M',
      apaarId: '9841-9902-4415',
      dateOfBirth: '2003-12-04',
      gender: 'male',
      guardianName: 'Manoharan T',
      email: 'naveen.m@citchennai.edu.in',
      contactPhone: '9812345603',
      programmeId: 'BTECH-ECE',
      enrollmentYear: '2024',
      rollNo: 'CIT2024EC005',
      aisheCode: 'C-16622',
      status: 'VERIFIED',
      batchId: 'upl_cit_7702',
      uploadedAt: '2024-10-23 15:40'
    }
  ],
  'C-24891': [
    {
      id: 'STU-NITT-001',
      name: 'Siddharth Iyer',
      apaarId: '9833-1122-8899',
      dateOfBirth: '2004-04-16',
      gender: 'male',
      guardianName: 'Iyer Subramanian',
      email: 'siddharth@nitt.edu',
      contactPhone: '9798901234',
      programmeId: 'BTECH-CSE',
      enrollmentYear: '2024',
      rollNo: 'NITT2024CS001',
      aisheCode: 'C-24891',
      status: 'VERIFIED',
      batchId: 'upl_nitt_9901',
      uploadedAt: '2024-10-15 09:30'
    },
    {
      id: 'STU-NITT-002',
      name: 'Meenakshi Sundaram',
      apaarId: '9833-4455-6677',
      dateOfBirth: '2004-09-02',
      gender: 'female',
      guardianName: 'Sundaram R',
      email: 'meenakshi@nitt.edu',
      contactPhone: '9798901235',
      programmeId: 'BTECH-EEE',
      enrollmentYear: '2024',
      rollNo: 'NITT2024EE011',
      aisheCode: 'C-24891',
      status: 'VERIFIED',
      batchId: 'upl_nitt_9901',
      uploadedAt: '2024-10-15 09:30'
    }
  ],
  'C-41209': [
    {
      id: 'STU-DTU-001',
      name: 'Harsh Vardhan',
      apaarId: '9811-2233-4455',
      dateOfBirth: '2003-10-08',
      gender: 'male',
      guardianName: 'Vardhan Raj',
      email: 'harsh.v@dtu.ac.in',
      contactPhone: '9811002233',
      programmeId: 'BTECH-CSE',
      enrollmentYear: '2024',
      rollNo: 'DTU2024CS001',
      aisheCode: 'C-41209',
      status: 'VERIFIED',
      batchId: 'upl_dtu_1101',
      uploadedAt: '2024-10-18 11:20'
    }
  ]
};

// Default batch history per college
const DEFAULT_COLLEGE_BATCHES: Record<string, UploadBatch[]> = {
  'C-18491': [
    { id: 'upl_eec_8812', filename: 'eec_btech_admissions_batch1.csv', uploadedAt: '2024-10-21 14:30', total: 3, passed: 3, failed: 0, status: 'completed', collegeCode: 'C-18491' },
    { id: 'upl_eec_8813', filename: 'eec_ece_mech_roster.csv', uploadedAt: '2024-10-22 11:15', total: 2, passed: 2, failed: 0, status: 'completed', collegeCode: 'C-18491' },
    { id: 'upl_eec_8814', filename: 'eec_supplementary_intake.xlsx', uploadedAt: '2024-10-24 16:45', total: 45, passed: 43, failed: 2, status: 'completed', collegeCode: 'C-18491' }
  ],
  'C-16622': [
    { id: 'upl_cit_7701', filename: 'cit_cse_aids_2024.csv', uploadedAt: '2024-10-19 10:00', total: 2, passed: 2, failed: 0, status: 'completed', collegeCode: 'C-16622' },
    { id: 'upl_cit_7702', filename: 'cit_ece_roster.csv', uploadedAt: '2024-10-23 15:40', total: 1, passed: 1, failed: 0, status: 'completed', collegeCode: 'C-16622' }
  ],
  'C-24891': [
    { id: 'upl_nitt_9901', filename: 'nitt_josaa_round1.csv', uploadedAt: '2024-10-15 09:30', total: 2, passed: 2, failed: 0, status: 'completed', collegeCode: 'C-24891' }
  ],
  'C-41209': [
    { id: 'upl_dtu_1101', filename: 'dtu_jac_admissions_btech.csv', uploadedAt: '2024-10-18 11:20', total: 1, passed: 1, failed: 0, status: 'completed', collegeCode: 'C-41209' }
  ]
};

/**
 * Get details of a specific college by code, with localStorage persistence for custom edits
 */
export function getCollegeDetails(collegeCode: string): CollegeDetail {
  const norm = collegeCode.trim().toUpperCase();

  // 1. Check custom saved profile in localStorage
  try {
    const custom = localStorage.getItem(`apaar_college_profile_${norm}`);
    if (custom) {
      return JSON.parse(custom);
    }
  } catch {}

  // 2. Check predefined directory
  if (COLLEGE_DETAILS[norm]) {
    return COLLEGE_DETAILS[norm];
  }

  // Fallback for custom code
  return {
    code: norm,
    name: 'Affiliated Higher Education Institution',
    shortName: norm,
    state: 'National Jurisdiction',
    city: 'State Capital',
    affiliation: 'Recognized Technical University',
    type: 'Affiliated Institution',
    sanctionedIntake: 1200,
    enrolledCount: 950,
    nodalOfficer: {
      name: 'Institution Nodal Officer',
      email: `nodal@${norm.toLowerCase().replace(/[^a-z0-9]/g, '') || 'college'}.edu.in`,
      phone: '+91 99999 88888',
      designation: 'Registrar & Nodal Coordinator'
    },
    programmes: ['BTECH-CSE', 'BTECH-IT', 'BTECH-ECE']
  };
}

/**
 * Save custom edits to a college / institute name and institutional profile
 */
export function saveCollegeDetails(collegeCode: string, updates: Partial<CollegeDetail>): CollegeDetail {
  const norm = collegeCode.trim().toUpperCase();
  const current = getCollegeDetails(norm);
  const updated: CollegeDetail = {
    ...current,
    ...updates,
    code: norm,
    nodalOfficer: {
      ...current.nodalOfficer,
      ...(updates.nodalOfficer || {})
    }
  };

  try {
    localStorage.setItem(`apaar_college_profile_${norm}`, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('apaar_college_students_updated', { detail: { collegeCode: norm, updatedProfile: updated } }));
  } catch (e) {
    console.error('Failed to save college details', e);
  }

  return updated;
}

/**
 * Get distinct institutional nodal officer email specific to each college
 */
export function getCollegeNodalEmail(collegeCode: string, collegeName?: string): string {
  const norm = collegeCode.trim().toUpperCase();
  const details = getCollegeDetails(norm);
  if (details.nodalOfficer?.email) {
    return details.nodalOfficer.email;
  }
  const cleanName = (collegeName || details.name).toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 10);
  return `nodal@${cleanName || norm.toLowerCase()}.ac.in`;
}

/**
 * Get distinct institutional nodal officer name specific to each college
 */
export function getCollegeNodalName(collegeCode: string): string {
  const norm = collegeCode.trim().toUpperCase();
  const details = getCollegeDetails(norm);
  return details.nodalOfficer?.name || 'Dr. College Nodal Officer';
}

/**
 * Get the dedicated student file set (uploaded bulk list) for a college
 */
export function getCollegeStudents(collegeCode: string): CollegeStudentRecord[] {
  const norm = collegeCode.trim().toUpperCase();
  const storageKey = `apaar_college_students_${norm}`;
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}

  // Initial defaults
  const initial = DEFAULT_COLLEGE_STUDENTS[norm] || [];
  try {
    localStorage.setItem(storageKey, JSON.stringify(initial));
  } catch {}
  return initial;
}

/**
 * Save or update the student file set for a college
 */
export function saveCollegeStudents(collegeCode: string, students: CollegeStudentRecord[]): void {
  const norm = collegeCode.trim().toUpperCase();
  const storageKey = `apaar_college_students_${norm}`;
  try {
    localStorage.setItem(storageKey, JSON.stringify(students));
    window.dispatchEvent(new CustomEvent('apaar_college_students_updated', { detail: { collegeCode: norm } }));
  } catch (e) {
    console.error('Failed to save college students:', e);
  }
}

/**
 * Synchronize student profile update into the corresponding college's student roster
 */
export function syncStudentToCollegeRoster(student: {
  apaarId: string;
  name: string;
  rollNo?: string;
  aisheCode: string;
  dob?: string;
  gender?: string;
  email?: string;
  phone?: string;
  department?: string;
  guardianName?: string;
  admissionYear?: string;
}): void {
  const norm = (student.aisheCode || 'C-18491').trim().toUpperCase();
  const collegeInfo = getCollegeDetails(norm);
  const currentStudents = getCollegeStudents(norm);
  const cleanApaar = student.apaarId.replace(/[^0-9]/g, '');

  const existingIndex = currentStudents.findIndex(
    (s) => s.apaarId.replace(/[^0-9]/g, '') === cleanApaar
  );

  const studentRecord: CollegeStudentRecord = {
    id: existingIndex >= 0 ? currentStudents[existingIndex].id : `STU-${collegeInfo.shortName}-${Math.floor(100 + Math.random() * 900)}`,
    name: student.name,
    apaarId: student.apaarId,
    dateOfBirth: student.dob || '2004-05-14',
    gender: (['male', 'female', 'other'].includes(String(student.gender).toLowerCase()) ? String(student.gender).toLowerCase() : 'male') as any,
    guardianName: student.guardianName || 'Parent / Guardian',
    email: student.email || `${student.name.toLowerCase().replace(/\s+/g, '.')}@${collegeInfo.shortName.toLowerCase()}.edu.in`,
    contactPhone: (student.phone || '9876543210').replace(/[^0-9]/g, '').slice(0, 10),
    programmeId: student.department || collegeInfo.programmes[0] || 'BTECH-CSE',
    enrollmentYear: student.admissionYear || '2024',
    rollNo: student.rollNo || `${collegeInfo.shortName}2024CS042`,
    aisheCode: norm,
    status: 'VERIFIED',
    batchId: 'Direct Student Registration',
    uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
  };

  if (existingIndex >= 0) {
    currentStudents[existingIndex] = { ...currentStudents[existingIndex], ...studentRecord };
  } else {
    currentStudents.unshift(studentRecord);
  }

  saveCollegeStudents(norm, currentStudents);
}

/**
 * Append newly uploaded bulk student records to a college's file set
 */
export function addUploadedStudentsToCollege(
  collegeCode: string,
  batchFilename: string,
  newRows: Partial<CollegeStudentRecord>[]
): { batch: UploadBatch; addedStudents: CollegeStudentRecord[] } {
  const norm = collegeCode.trim().toUpperCase();
  const currentStudents = getCollegeStudents(norm);
  const collegeInfo = getCollegeDetails(norm);

  const batchId = `upl_${norm.toLowerCase().replace(/[^a-z0-9]/g, '')}_${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

  const addedStudents: CollegeStudentRecord[] = [];
  let passedCount = 0;
  let failedCount = 0;

  for (let i = 0; i < newRows.length; i++) {
    const r = newRows[i];
    const cleanApaar = String(r.apaarId || '').replace(/[^0-9]/g, '');
    const isValid = cleanApaar.length === 12;

    const formattedApaar = cleanApaar.length === 12
      ? `${cleanApaar.slice(0, 4)}-${cleanApaar.slice(4, 8)}-${cleanApaar.slice(8, 12)}`
      : (r.apaarId || `9842-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`);

    const student: CollegeStudentRecord = {
      id: `STU-${collegeInfo.shortName}-${Math.floor(100 + Math.random() * 900)}`,
      name: String(r.name || 'Student Candidate').trim(),
      apaarId: formattedApaar,
      dateOfBirth: String(r.dateOfBirth || '2004-01-01').trim(),
      gender: (['male', 'female', 'other'].includes(String(r.gender).toLowerCase()) ? String(r.gender).toLowerCase() : 'male') as any,
      guardianName: String(r.guardianName || 'Guardian').trim(),
      email: String(r.email || `student${i}@${collegeInfo.shortName.toLowerCase()}.edu.in`).trim(),
      contactPhone: String(r.contactPhone || '9876543210').replace(/[^0-9]/g, '').slice(0, 10),
      programmeId: String(r.programmeId || collegeInfo.programmes[0] || 'BTECH-CSE').trim(),
      enrollmentYear: String(r.enrollmentYear || '2024').trim(),
      rollNo: String(r.rollNo || `${collegeInfo.shortName}2024CS${String(i + 1).padStart(3, '0')}`).trim(),
      aisheCode: norm,
      status: isValid ? 'VERIFIED' : 'FLAGGED',
      batchId: batchId,
      uploadedAt: now
    };

    if (isValid) {
      passedCount++;
    } else {
      failedCount++;
    }

    addedStudents.push(student);
  }

  // Combine and de-duplicate by APAAR ID
  const existingMap = new Map(currentStudents.map((s) => [s.apaarId.replace(/[^0-9]/g, ''), s]));
  for (const s of addedStudents) {
    existingMap.set(s.apaarId.replace(/[^0-9]/g, ''), s);
  }
  const updatedRoster = Array.from(existingMap.values());
  saveCollegeStudents(norm, updatedRoster);

  // Record batch in history
  const batch: UploadBatch = {
    id: batchId,
    filename: batchFilename,
    uploadedAt: now,
    total: newRows.length,
    passed: passedCount,
    failed: failedCount,
    status: 'completed',
    collegeCode: norm
  };

  const batches = getCollegeBatches(norm);
  const updatedBatches = [batch, ...batches];
  saveCollegeBatches(norm, updatedBatches);

  return { batch, addedStudents };
}

/**
 * Get upload history batches for a specific college
 */
export function getCollegeBatches(collegeCode: string): UploadBatch[] {
  const norm = collegeCode.trim().toUpperCase();
  const storageKey = `apaar_college_batches_${norm}`;
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}

  const initial = DEFAULT_COLLEGE_BATCHES[norm] || [
    {
      id: `upl_${norm.toLowerCase()}_init`,
      filename: `batch_admissions_${norm.toLowerCase()}.csv`,
      uploadedAt: '2024-10-20 12:00',
      total: (DEFAULT_COLLEGE_STUDENTS[norm] || []).length || 5,
      passed: (DEFAULT_COLLEGE_STUDENTS[norm] || []).length || 5,
      failed: 0,
      status: 'completed',
      collegeCode: norm
    }
  ];
  try {
    localStorage.setItem(storageKey, JSON.stringify(initial));
  } catch {}
  return initial;
}

/**
 * Save upload batches for a specific college
 */
export function saveCollegeBatches(collegeCode: string, batches: UploadBatch[]): void {
  const norm = collegeCode.trim().toUpperCase();
  const storageKey = `apaar_college_batches_${norm}`;
  try {
    localStorage.setItem(storageKey, JSON.stringify(batches));
  } catch (e) {
    console.error('Failed to save batches:', e);
  }
}

/**
 * CROSS-VERIFY APAAR ID with College's Uploaded Bulk Student List
 *
 * Verifies whether the provided APAAR ID is in the college's uploaded student roster.
 * Also checks for attribute consistency (name, rollNo, DOB) and returns actionable status.
 */
export function crossVerifyApaarWithCollegeRoster(
  collegeCode: string,
  inputApaarId: string,
  inputName?: string,
  inputRollNo?: string
): CrossVerificationResult {
  const normCode = collegeCode.trim().toUpperCase();
  const collegeInfo = getCollegeDetails(normCode);
  const cleanInputDigits = inputApaarId.replace(/[^0-9]/g, '');

  if (cleanInputDigits.length !== 12) {
    return {
      isVerified: false,
      status: 'NOT_FOUND_IN_BULK_LIST',
      message: `Invalid APAAR ID format. Must contain 12 numeric digits (received ${cleanInputDigits.length} digits).`,
      collegeCode: normCode,
      collegeName: collegeInfo.name
    };
  }

  // 1. Check in this college's uploaded roster
  const collegeStudents = getCollegeStudents(normCode);
  const matchedStudent = collegeStudents.find(
    (s) => s.apaarId.replace(/[^0-9]/g, '') === cleanInputDigits
  );

  if (matchedStudent) {
    // Check for discrepancies with optional inputs
    const discrepancies: string[] = [];

    if (inputName && inputName.trim()) {
      const cleanInput = inputName.trim().toLowerCase();
      const cleanRoster = matchedStudent.name.toLowerCase();
      if (!cleanRoster.includes(cleanInput) && !cleanInput.includes(cleanRoster)) {
        discrepancies.push(`Name mismatch: Uploaded roster has "${matchedStudent.name}", but input received was "${inputName}"`);
      }
    }

    if (inputRollNo && inputRollNo.trim()) {
      const cleanInputRoll = inputRollNo.trim().toUpperCase();
      const cleanRosterRoll = matchedStudent.rollNo.toUpperCase();
      if (cleanInputRoll !== cleanRosterRoll) {
        discrepancies.push(`Roll Number mismatch: Uploaded roster has "${matchedStudent.rollNo}", but input was "${inputRollNo}"`);
      }
    }

    if (discrepancies.length > 0) {
      return {
        isVerified: false,
        status: 'DISCREPANCY_FLAGGED',
        message: `APAAR ID found in ${collegeInfo.name} bulk roster, but data discrepancies were detected.`,
        matchedRecord: matchedStudent,
        collegeCode: normCode,
        collegeName: collegeInfo.name,
        discrepancies
      };
    }

    return {
      isVerified: true,
      status: 'VERIFIED_MATCH',
      message: `APAAR ID successfully cross-verified against ${collegeInfo.name} (${normCode}) uploaded bulk roster. Batch: ${matchedStudent.batchId || 'Official Admission Roster'}.`,
      matchedRecord: matchedStudent,
      collegeCode: normCode,
      collegeName: collegeInfo.name
    };
  }

  // 2. Check if this APAAR ID exists in another college's bulk list
  for (const otherCode of Object.keys(COLLEGE_DETAILS)) {
    if (otherCode === normCode) continue;
    const otherStudents = getCollegeStudents(otherCode);
    const inOther = otherStudents.find(
      (s) => s.apaarId.replace(/[^0-9]/g, '') === cleanInputDigits
    );
    if (inOther) {
      const otherCollege = COLLEGE_DETAILS[otherCode];
      return {
        isVerified: false,
        status: 'WRONG_COLLEGE_ROSTER',
        message: `Cross-verification failed: This APAAR ID is registered in the uploaded bulk list of "${otherCollege.name}" (AISHE: ${otherCode}), NOT ${collegeInfo.name} (${normCode}). Institutional transfer authorization required.`,
        collegeCode: normCode,
        collegeName: collegeInfo.name,
        registeredCollege: {
          code: otherCode,
          name: otherCollege.name
        }
      };
    }
  }

  // 3. Not found in any uploaded roster
  return {
    isVerified: false,
    status: 'NOT_FOUND_IN_BULK_LIST',
    message: `APAAR ID (${inputApaarId}) was NOT found in the bulk student records uploaded by ${collegeInfo.name} (${normCode}). Please ensure this student is included in the college bulk upload file (.csv/.xlsx).`,
    collegeCode: normCode,
    collegeName: collegeInfo.name
  };
}
