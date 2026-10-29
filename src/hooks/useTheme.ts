import { create } from 'zustand';

interface ThemeState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const useTheme = create<ThemeState>((set) => ({
  theme: 
    typeof window !== 'undefined' 
      ? window.localStorage.getItem('theme') as 'light' | 'dark' || 'light'
      : 'light',
  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark');
      }
      return { theme: newTheme };
    }),
}));