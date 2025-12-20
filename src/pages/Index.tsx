import { useState, useEffect } from 'react';
import { SplashScreen } from '@/components/SplashScreen';
import { LoginForm } from '@/components/LoginForm';
import { SignUpForm } from '@/components/SignUpForm';
import { StudentDashboard } from '@/components/StudentDashboard';
import { SecurityDashboard } from '@/components/SecurityDashboard';
import { useAuth } from '@/contexts/AuthContext';

type AuthView = 'login' | 'signup';

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [authView, setAuthView] = useState<AuthView>('login');
  const { isAuthenticated, user } = useAuth();

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  if (!isAuthenticated) {
    return authView === 'login' ? (
      <LoginForm onSignUpClick={() => setAuthView('signup')} />
    ) : (
      <SignUpForm onLoginClick={() => setAuthView('login')} />
    );
  }

  // Role-based dashboard
  if (user?.role === 'security') {
    return <SecurityDashboard />;
  }

  return <StudentDashboard />;
};

export default Index;
