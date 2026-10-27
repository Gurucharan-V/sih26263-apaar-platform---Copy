import { useState, useEffect } from 'react';
import { getCollegeDetails, getCollegeNodalEmail, getCollegeNodalName } from '../services/collegeStudentService';

export type UserRole = 'STUDENT' | 'COLLEGE_NODAL' | 'MODERATOR' | 'STATE_ADMIN';

export interface UserSession {
  email: string;
  name: string;
  role: UserRole;
  token: string;
  institutionName?: string;
  apaarId?: string;
  rollNo?: string;
  aisheCode?: string;
  department?: string;
  phone?: string;
  // Student extended details
  dob?: string;
  gender?: string;
  bloodGroup?: string;
  fatherName?: string;
  motherName?: string;
  aadhaarMasked?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  degree?: string;
  admissionYear?: string;
  semester?: string;
  abcId?: string;
  detailsCompleted?: boolean;
}

const AUTH_SYNC_EVENT = 'apaar_auth_sync';

function broadcastAuthUpdate(newUser: UserSession | null) {
  try {
    window.dispatchEvent(new CustomEvent(AUTH_SYNC_EVENT, { detail: newUser }));
  } catch {}
}

export function useAuth() {
  const [user, setUser] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem('apaar_auth');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Listen to broadcast updates across components and tabs
  useState(() => {
    // Initial sync
  });

  // Sync state reactively across any mounted component
  const syncCurrentUser = (newUser: UserSession | null) => {
    setUser(newUser);
  };

  // Subscribe to auth events
  useEffect(() => {
    const handleSync = (e: any) => {
      if (e?.detail !== undefined) {
        setUser(e.detail);
      } else {
        try {
          const saved = localStorage.getItem('apaar_auth');
          setUser(saved ? JSON.parse(saved) : null);
        } catch {
          setUser(null);
        }
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'apaar_auth') {
        try {
          setUser(e.newValue ? JSON.parse(e.newValue) : null);
        } catch {
          setUser(null);
        }
      }
    };

    window.addEventListener(AUTH_SYNC_EVENT, handleSync);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener(AUTH_SYNC_EVENT, handleSync);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const login = async (
    emailOrId: string,
    pass: string,
    portalRole?: 'student' | 'college' | 'moderator',
    collegeCustomCode?: string,
    collegeCustomName?: string
  ) => {
    let mockUser: UserSession;
    const trimmedPass = (pass || '').trim();

    if (portalRole === 'student' || emailOrId.includes('student') || /^\d{4}/.test(emailOrId)) {
      const cleanInputDigits = emailOrId.replace(/[^0-9]/g, '');
      const assignedApaar = cleanInputDigits.length === 12
        ? `${cleanInputDigits.slice(0, 4)}-${cleanInputDigits.slice(4, 8)}-${cleanInputDigits.slice(8, 12)}`
        : (emailOrId.includes('-') && emailOrId.length >= 12 ? emailOrId : '9842-1083-4912');

      // Check if student was previously saved or registered
      let existingProfile: any = null;
      try {
        const savedStudents = JSON.parse(localStorage.getItem('apaar_registered_students') || '[]');
        existingProfile = savedStudents.find((s: any) => s.apaarId === assignedApaar || s.email === emailOrId);
      } catch {}

      // Validate student credentials
      const validStudentPasswords = ['student@2024'];
      const profilePass = existingProfile?.password;
      if (!validStudentPasswords.includes(trimmedPass) && (!profilePass || trimmedPass !== profilePass)) {
        throw new Error('Invalid credentials: The password you entered is incorrect. (Default demo password: student@2024)');
      }

      // Calculate distinct DOB based on digits if not from existing profile
      const seed = parseInt(cleanInputDigits.slice(6, 10), 10) || 514;
      const calcMonth = String((seed % 12) + 1).padStart(2, '0');
      const calcDay = String((seed % 28) + 1).padStart(2, '0');
      const calcYear = 2003 + (seed % 3);
      const derivedDob = existingProfile?.dob || `${calcYear}-${calcMonth}-${calcDay}`;
      const derivedName = existingProfile?.name || (emailOrId.includes('@') ? emailOrId.split('@')[0].replace(/[._]/g, ' ') : 'Rohan Sundaram');

      mockUser = {
        email: existingProfile?.email || (emailOrId.includes('@') ? emailOrId : ''),
        name: existingProfile?.name || '',
        role: 'STUDENT',
        token: 'jwt_student_sih26263',
        apaarId: assignedApaar,
        rollNo: existingProfile?.rollNo || '',
        institutionName: existingProfile?.institutionName || '',
        aisheCode: existingProfile?.aisheCode || '',
        department: existingProfile?.department || '',
        degree: existingProfile?.degree || '',
        dob: existingProfile?.dob || '',
        gender: existingProfile?.gender || '',
        bloodGroup: existingProfile?.bloodGroup || '',
        fatherName: existingProfile?.fatherName || '',
        motherName: existingProfile?.motherName || '',
        aadhaarMasked: existingProfile?.aadhaarMasked || '',
        address: existingProfile?.address || '',
        city: existingProfile?.city || '',
        state: existingProfile?.state || '',
        pincode: existingProfile?.pincode || '',
        admissionYear: existingProfile?.admissionYear || '',
        semester: existingProfile?.semester || '',
        abcId: existingProfile?.abcId || '',
        phone: existingProfile?.phone || '',
        detailsCompleted: !!existingProfile?.detailsCompleted
      };
    } else if (portalRole === 'moderator' || emailOrId.includes('admin') || emailOrId.includes('moderator')) {
      const validModPasswords = ['admin@moe2024', 'moderator@2024'];
      if (!validModPasswords.includes(trimmedPass)) {
        throw new Error('Invalid credentials: The password you entered is incorrect. (Default demo password: admin@moe2024)');
      }

      mockUser = {
        email: emailOrId.includes('@') ? emailOrId : 'moderator@education.gov.in',
        name: 'Dr. V. K. Sharma',
        role: 'MODERATOR',
        token: 'jwt_moderator_sih26263',
        institutionName: 'AICTE & Ministry of Education Oversight Cell',
        department: 'National APAAR & Intake Moderation Bureau',
        aisheCode: 'MOE-GOV-01',
        phone: '+91 11 2338 1234'
      };
    } else {
      // College login with unique college code
      const validCollegePasswords = ['college@2024', 'nodal@2024'];
      if (!validCollegePasswords.includes(trimmedPass)) {
        throw new Error('Invalid credentials: The password you entered is incorrect. (Default demo password: college@2024)');
      }

      const selectedAishe = (collegeCustomCode || 'C-18491').trim().toUpperCase();
      const collegeInfo = getCollegeDetails(selectedAishe);
      const selectedName = collegeCustomName || collegeInfo.name;
      const expectedNodalEmail = getCollegeNodalEmail(selectedAishe, selectedName);

      // Strict validation: Email must match the selected college's registered nodal officer email
      if (emailOrId.trim().toLowerCase() !== expectedNodalEmail.trim().toLowerCase()) {
        throw new Error(
          `Institutional Email Mismatch: The entered email "${emailOrId}" does not match the registered Institutional Nodal Officer email for ${selectedName} (${expectedNodalEmail}). Please enter the official registered email.`
        );
      }

      const nodalName = getCollegeNodalName(selectedAishe);

      mockUser = {
        email: expectedNodalEmail,
        name: nodalName,
        role: 'COLLEGE_NODAL',
        token: 'jwt_college_sih26263',
        institutionName: selectedName,
        aisheCode: selectedAishe,
        department: 'Office of Academic Affairs & Admissions',
        phone: collegeInfo.nodalOfficer?.phone || '+91 44 2249 0853'
      };
    }

    localStorage.setItem('apaar_auth', JSON.stringify(mockUser));
    setUser(mockUser);
    broadcastAuthUpdate(mockUser);
    return mockUser;
  };

  const updateUserProfile = (updates: Partial<UserSession>) => {
    // Read fresh base user to avoid stale closures
    let baseUser: UserSession | null = user;
    try {
      const saved = localStorage.getItem('apaar_auth');
      if (saved) {
        baseUser = JSON.parse(saved);
      }
    } catch {}

    if (!baseUser) return;
    const updated = { ...baseUser, ...updates, detailsCompleted: true };
    localStorage.setItem('apaar_auth', JSON.stringify(updated));
    setUser(updated);
    broadcastAuthUpdate(updated);

    // Also persist into registered students
    try {
      const saved = JSON.parse(localStorage.getItem('apaar_registered_students') || '[]');
      const filtered = saved.filter((s: any) => s.apaarId !== updated.apaarId);
      filtered.push(updated);
      localStorage.setItem('apaar_registered_students', JSON.stringify(filtered));
    } catch {}

    // Synchronize ANY student profile updates in student queries
    try {
      const savedQueries = JSON.parse(localStorage.getItem('apaar_queries') || '[]');
      let queriesChanged = false;
      const cleanUserApaar = String(updated.apaarId || '').replace(/[^0-9]/g, '');
      const updatedQueries = savedQueries.map((q: any) => {
        const cleanQApaar = String(q.apaarId || '').replace(/[^0-9]/g, '');
        if (cleanQApaar === cleanUserApaar || q.id === 'QRY-2024-8901') {
          queriesChanged = true;
          const oldName = q.studentName || 'Rohan Sundaram';
          let newDesc = q.description || '';
          if (updated.name && oldName && oldName !== updated.name) {
            newDesc = newDesc.split(oldName).join(updated.name);
          }
          if (updated.name && newDesc.includes('Rohan Sundaram')) {
            newDesc = newDesc.split('Rohan Sundaram').join(updated.name);
          }
          return {
            ...q,
            studentName: updated.name || q.studentName,
            institution: updated.institutionName ? `${updated.institutionName} (${updated.aisheCode || ''})` : q.institution,
            aisheCode: updated.aisheCode || q.aisheCode,
            studentEmail: updated.email || q.studentEmail,
            studentPhone: updated.phone || q.studentPhone,
            rollNo: updated.rollNo || q.rollNo,
            dob: updated.dob || q.dob,
            gender: updated.gender || q.gender,
            department: updated.department || q.department,
            fatherName: updated.fatherName || q.fatherName,
            description: newDesc
          };
        }
        return q;
      });
      if (queriesChanged) {
        localStorage.setItem('apaar_queries', JSON.stringify(updatedQueries));
        window.dispatchEvent(new CustomEvent('apaar_queries_updated'));
      }
    } catch {}

    return updated;
  };

  const logout = () => {
    localStorage.removeItem('apaar_auth');
    setUser(null);
    broadcastAuthUpdate(null);
  };

  return { user, login, logout, updateUserProfile, isAuthenticated: !!user };
}
