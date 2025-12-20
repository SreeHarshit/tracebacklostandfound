import { Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import logo from '@/assets/trace-back-logo.jpeg';

interface TopAppBarProps {
  onSettingsClick: () => void;
}

export function TopAppBar({ onSettingsClick }: TopAppBarProps) {
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-card border-b border-border shadow-sm z-40">
      <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src={logo} 
            alt="Trace Back" 
            className="w-10 h-10 object-contain rounded-lg"
          />
          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold text-foreground">Trace Back</h1>
            {user && (
              <p className="text-xs text-muted-foreground">Welcome, {user.fullName}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {user && (
            <span className="text-sm text-muted-foreground mr-2 hidden md:block">
              {user.role === 'security' ? 'Security' : user.role === 'staff' ? 'Staff' : 'Student'} • {user.registrationId}
            </span>
          )}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onSettingsClick}
            className="hover:bg-accent"
          >
            <Settings className="h-5 w-5 text-foreground" />
          </Button>
        </div>
      </div>
    </header>
  );
}
