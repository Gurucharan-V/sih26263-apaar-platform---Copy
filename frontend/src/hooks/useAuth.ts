import { useState, useEffect } from 'react';

export interface UserSession {
  email: string;
  role: 'COLLEGE_NODAL' | 'STATE_ADMIN' | 'SUPER_ADMIN';
  token: string;
}

export function useAuth() {
  const [user, setUser] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('apaar_auth');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email: string, _pass: string) => {
    const mockUser: UserSession = {
      email,
      role: email.includes('admin') ? 'STATE_ADMIN' : 'COLLEGE_NODAL',
      token: 'jwt_mock_token_sih26263'
    };
    localStorage.setItem('apaar_auth', JSON.stringify(mockUser));
    setUser(mockUser);
  };

  const logout = () => {
    localStorage.removeItem('apaar_auth');
    setUser(null);
  };

  return { user, login, logout, isAuthenticated: !!user };
}
