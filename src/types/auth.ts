export type UserRole = 'student' | 'staff' | 'security';

export interface User {
  id: string;
  fullName: string;
  registrationId: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
