import { useEffect, useState } from 'react';
import logo from '@/assets/trace-back-logo.jpeg';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onComplete, 500);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 flex flex-col items-center justify-center bg-background z-50 transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center">
        <img 
          src={logo} 
          alt="Trace Back Logo" 
          className="w-40 h-40 object-contain splash-logo rounded-2xl shadow-xl"
        />
        <div className="mt-6 splash-text">
          <h1 className="text-3xl font-bold text-primary tracking-wide">TRACE BACK</h1>
          <p className="text-muted-foreground text-center mt-2 text-sm">
            GITAM Lost & Found
          </p>
        </div>
      </div>
    </div>
  );
}
