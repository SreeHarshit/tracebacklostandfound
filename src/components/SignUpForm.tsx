import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import logo from '@/assets/trace-back-logo.jpeg';

interface SignUpFormProps {
  onLoginClick: () => void;
}

export function SignUpForm({ onLoginClick }: SignUpFormProps) {
  const [fullName, setFullName] = useState('');
  const [registrationId, setRegistrationId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const result = signup(fullName, registrationId, password);

    if (result.success) {
      toast({
        title: "Account Created",
        description: "Your account has been created. Please sign in.",
      });
      onLoginClick();
    } else {
      toast({
        title: "Sign Up Failed",
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
              className="w-20 h-20 object-contain rounded-xl shadow-md"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">Create Account</CardTitle>
          <CardDescription>
            Join GITAM's Lost & Found community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input-field"
                required
              />
            </div>

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
              <Label htmlFor="password">Create Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                required
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>

            <div className="text-center pt-4">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <button 
                  type="button"
                  onClick={onLoginClick}
                  className="text-primary font-medium hover:underline"
                >
                  Sign In
                </button>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
