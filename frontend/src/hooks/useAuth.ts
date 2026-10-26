import { useState } from 'react';

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

export function useAuth() {
  const [user, setUser] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem('apaar_auth');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = async (
    emailOrId: string,
    _pass: string,
    portalRole?: 'student' | 'college' | 'moderator',
    collegeCustomCode?: string,
    collegeCustomName?: string
  ) => {
    let mockUser: UserSession;

    if (portalRole === 'student' || emailOrId.includes('student') || /^\d{4}/.test(emailOrId)) {
      mockUser = {
        email: emailOrId.includes('@') ? emailOrId : 'rohan.sundaram@institute.ac.in',
        name: 'Rohan Sundaram',
        role: 'STUDENT',
        token: 'jwt_student_sih26263',
        apaarId: '9842-1083-4912',
        rollNo: '2024CS042',
        institutionName: 'National Institute of Technology & Higher Education',
        aisheCode: 'C-16622',
        department: 'Computer Science and Engineering',
        degree: 'B.Tech - Computer Science',
        dob: '2004-05-14',
        gender: 'Male',
        bloodGroup: 'O+',
        fatherName: 'Sundaram Krishnamurthy',
        motherName: 'Lakshmi Sundaram',
        aadhaarMasked: 'XXXX-XXXX-4912',
        address: 'No. 42, Anna Nagar West',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600040',
        admissionYear: '2024',
        semester: 'Semester 4',
        abcId: 'ABC-102-984-219',
        phone: '+91 98765 43210',
        detailsCompleted: false // Prompts student to review/fill their details
      };
    } else if (portalRole === 'moderator' || emailOrId.includes('admin') || emailOrId.includes('moderator')) {
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
      const selectedAishe = collegeCustomCode || 'C-16622';
      const selectedName = collegeCustomName || 'National Institute of Technology & Engineering';

      mockUser = {
        email: emailOrId.includes('@') ? emailOrId : 'nodal@college.ac.in',
        name: 'Dr. R. Rajesh',
        role: 'COLLEGE_NODAL',
        token: 'jwt_college_sih26263',
        institutionName: selectedName,
        aisheCode: selectedAishe,
        department: 'Office of Academic Affairs & Admissions',
        phone: '+91 44 2249 0853'
      };
    }

    localStorage.setItem('apaar_auth', JSON.stringify(mockUser));
    setUser(mockUser);
    return mockUser;
  };

  const updateUserProfile = (updates: Partial<UserSession>) => {
    if (!user) return;
    const updated = { ...user, ...updates, detailsCompleted: true };
    localStorage.setItem('apaar_auth', JSON.stringify(updated));
    setUser(updated);
    return updated;
  };

  const logout = () => {
    localStorage.removeItem('apaar_auth');
    setUser(null);
  };

  return { user, login, logout, updateUserProfile, isAuthenticated: !!user };
}
