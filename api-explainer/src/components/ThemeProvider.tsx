'use client';

import { useEffect } from 'react';
import { useTheme } from '@/lib/useTheme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { mounted } = useTheme();

  useEffect(() => {
    // Prevent flash of unstyled content
    const root = document.documentElement;
    const stored = localStorage.getItem('theme');
    
    if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-900">{children}</div>;
  }

  return <>{children}</>;
}
