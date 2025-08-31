'use client';

import { useTheme } from '@/lib/useTheme';

export function ThemeToggle() {
  const { theme, mounted, toggleTheme, setTheme, isDark } = useTheme();

  if (!mounted) {
    return (
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-700 dark:text-gray-300">Theme</span>
        <div className="w-9 h-5 bg-gray-200 dark:bg-gray-600 rounded-full animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Theme</label>
      
      {/* Quick Toggle */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-foreground">Dark Mode</span>
        <button
          onClick={toggleTheme}
          className="relative inline-flex items-center cursor-pointer"
          aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
          <div className={`w-9 h-5 rounded-full transition-colors duration-200 ${isDark ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-600'}`}>
            <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${isDark ? 'translate-x-4' : 'translate-x-0.5'} mt-0.5`}></div>
          </div>
        </button>
      </div>

      {/* Theme Options */}
      <div className="space-y-1">
        <button
          onClick={() => setTheme('light')}
          className={`w-full text-left px-2 py-1.5 text-xs rounded-md transition-colors ${
            theme === 'light' 
              ? 'bg-primary/10 text-primary' 
              : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          Light
        </button>
        <button
          onClick={() => setTheme('dark')}
          className={`w-full text-left px-2 py-1.5 text-xs rounded-md transition-colors ${
            theme === 'dark' 
              ? 'bg-primary/10 text-primary' 
              : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          Dark
        </button>
        <button
          onClick={() => setTheme('system')}
          className={`w-full text-left px-2 py-1.5 text-xs rounded-md transition-colors ${
            theme === 'system' 
              ? 'bg-primary/10 text-primary' 
              : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          System
        </button>
      </div>
    </div>
  );
}
