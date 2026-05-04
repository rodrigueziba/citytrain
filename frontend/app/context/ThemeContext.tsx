'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeId = 'default' | 'vintage' | 'expedition';

interface ThemeContextType {
  theme: ThemeId;
  setTheme: (t: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextType>({ theme: 'default', setTheme: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>('default');

  useEffect(() => {
    const saved = localStorage.getItem('uct-theme') as ThemeId | null;
    const valid = ['default', 'vintage', 'expedition'];
    const initial = saved && valid.includes(saved) ? saved : 'default';
    setThemeState(initial);
    document.documentElement.setAttribute('data-theme', initial);
  }, []);

  const setTheme = (t: ThemeId) => {
    setThemeState(t);
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('uct-theme', t);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
