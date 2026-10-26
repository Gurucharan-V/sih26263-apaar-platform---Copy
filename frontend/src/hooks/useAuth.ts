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
    portalRole?: 'student' | 'college' | 'moderator'
  ) => {
    let mockUser: UserSession;

    if (portalRole === 'student' || emailOrId.includes('student') || /^\d{4}/.test(emailOrId)) {
      mockUser = {
        email: emailOrId.includes('@') ? emailOrId : 'rohan.sundaram@srmeaswari.ac.in',
        name: 'Rohan Sundaram',
        role: 'STUDENT',
        token: 'jwt_student_sih26263',
        apaarId: '9842-1083-4912',
        rollNo: 'EEC2024CS042',
        institutionName: 'Easwari Engineering College (EEC)',
        department: 'B.E. Computer Science and Engineering',
        phone: '+91 98765 43210'
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
      mockUser = {
        email: emailOrId.includes('@') ? emailOrId : 'nodal@srmeaswari.ac.in',
        name: 'Dr. R. Rajesh',
        role: 'COLLEGE_NODAL',
        token: 'jwt_college_sih26263',
        institutionName: 'Easwari Engineering College (EEC)',
        aisheCode: 'C-16622',
        department: 'Office of Academic Affairs & Admissions',
        phone: '+91 44 2249 0853'
      };
    }

    localStorage.setItem('apaar_auth', JSON.stringify(mockUser));
    setUser(mockUser);
    return mockUser;
  };

  const logout = () => {
    localStorage.removeItem('apaar_auth');
    setUser(null);
  };

  return { user, login, logout, isAuthenticated: !!user };
}
