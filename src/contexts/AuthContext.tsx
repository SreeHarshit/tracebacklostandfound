import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (registrationId: string, password: string) => { success: boolean; error?: string };
  signup: (fullName: string, registrationId: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: { [key: string]: { password: string; user: User } } = {
  '2024001234': {
    password: 'student123',
    user: { id: '1', fullName: 'Rahul Kumar', registrationId: '2024001234', role: 'student' }
  },
  '123456': {
    password: 'staff123',
    user: { id: '2', fullName: 'Dr. Priya Sharma', registrationId: '123456', role: 'staff' }
  },
  'viz1234': {
    password: 'security123',
    user: { id: '3', fullName: 'Ravi Security', registrationId: 'viz1234', role: 'security' }
  }
};

const validateRegistrationId = (id: string): { valid: boolean; role: UserRole | null; error?: string } => {
  // Security: starts with "viz" followed by 4 digits
  if (/^viz\d{4}$/i.test(id)) {
    return { valid: true, role: 'security' };
  }
  
  // Student: 10 digits, format YYYYXXXXXX
  if (/^\d{10}$/.test(id)) {
    const year = parseInt(id.substring(0, 4));
    if (year >= 2000 && year <= 2030) {
      return { valid: true, role: 'student' };
    }
    return { valid: false, role: null, error: 'Invalid student ID format. Year must be between 2000-2030.' };
  }
  
  // Staff: 6 digits
  if (/^\d{6}$/.test(id)) {
    return { valid: true, role: 'staff' };
  }
  
  return { 
    valid: false, 
    role: null, 
    error: 'Invalid ID format. Student: 10 digits (YYYYXXXXXX), Staff: 6 digits, Security: viz + 4 digits' 
  };
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (registrationId: string, password: string) => {
    const validation = validateRegistrationId(registrationId);
    
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    const mockUser = mockUsers[registrationId.toLowerCase()];
    if (mockUser && mockUser.password === password) {
      setUser(mockUser.user);
      return { success: true };
    }

    // For demo: create user on the fly if not found
    if (password.length >= 6) {
      const newUser: User = {
        id: Date.now().toString(),
        fullName: 'Demo User',
        registrationId: registrationId,
        role: validation.role!
      };
      setUser(newUser);
      return { success: true };
    }

    return { success: false, error: 'Invalid credentials. Password must be at least 6 characters.' };
  };

  const signup = (fullName: string, registrationId: string, password: string) => {
    const validation = validateRegistrationId(registrationId);
    
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
