import { useState, useEffect } from 'react';
import { useDynamicColors } from '@/hooks/useDynamicColors';

interface PersonalizedGreetingProps {
  className?: string;
}

export const PersonalizedGreeting = ({ className = '' }: PersonalizedGreetingProps) => {
  const [greeting, setGreeting] = useState('');
  const [showGreeting, setShowGreeting] = useState(false);
  const { colors } = useDynamicColors();

  useEffect(() => {
    // Get time-based greeting
    const hour = new Date().getHours();
    let timeGreeting = '';
    
    if (hour < 12) {
      timeGreeting = 'Good morning';
    } else if (hour < 17) {
      timeGreeting = 'Good afternoon';
    } else {
      timeGreeting = 'Good evening';
    }

    // Check for returning visitor
    const lastVisit = localStorage.getItem('lastVisit');
    const today = new Date().toDateString();
    
    if (lastVisit && lastVisit !== today) {
      setGreeting(`${timeGreeting}, welcome back!`);
    } else {
      setGreeting(`${timeGreeting}!`);
    }

    // Store current visit
    localStorage.setItem('lastVisit', today);

    // Show greeting after a short delay
    const timer = setTimeout(() => setShowGreeting(true), 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (!showGreeting || !greeting) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-[11px] font-medium transition-all duration-500 transform ${showGreeting ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'} ${className}`}
      style={{
        backgroundColor: `${colors.background}20`,
        borderColor: `${colors.primary}30`
      }}
    >
      {greeting}
    </div>
  );
};