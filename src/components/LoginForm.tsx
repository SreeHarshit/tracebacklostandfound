import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import logo from '@/assets/trace-back-logo.jpeg';

interface LoginFormProps {
  onSignUpClick: () => void;
}

export function LoginForm({ onSignUpClick }: LoginFormProps) {
  const [registrationId, setRegistrationId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = login(registrationId, password);

    if (result.success) {
      toast({
        title: "Login Successful",
        description: "Welcome to Trace Back!",
      });
    } else {
      toast({
        title: "Login Failed",
        description: result.error,
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg animate-slide-up">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <img 
              src={logo} 
              alt="Trace Back Logo" 
              className="w-24 h-24 object-contain rounded-xl shadow-md"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to your GITAM account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="registrationId">Registration ID</Label>
              <Input
                id="registrationId"
                type="text"
                placeholder="e.g., 2024001234, 123456, or viz1234"
                value={registrationId}
                onChange={(e) => setRegistrationId(e.target.value)}
                className="input-field"
                required
              />
              <p className="text-xs text-muted-foreground">
                Student: 10 digits • Staff: 6 digits • Security: viz + 4 digits
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>

            <div className="text-center pt-4">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <button 
                  type="button"
                  onClick={onSignUpClick}
                  className="text-primary font-medium hover:underline"
                >
                  Create Account
                </button>
              </p>
            </div>
          </form>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground text-center mb-2">Demo Credentials:</p>
            <div className="text-xs space-y-1 text-muted-foreground">
              <p>Student: 2024001234 / student123</p>
              <p>Staff: 123456 / staff123</p>
              <p>Security: viz1234 / security123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
