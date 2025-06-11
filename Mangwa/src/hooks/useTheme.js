import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    // Verifica se há tema salvo no localStorage
    const savedTheme = localStorage.getItem('mangwa-theme');
    if (savedTheme) {
      return savedTheme;
    }

    // Se não há tema salvo, usa 'system' como padrão
    return 'system';
  });

  useEffect(() => {
    const applyTheme = (currentTheme) => {
      const root = document.documentElement;

      if (currentTheme === 'system') {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.toggle('dark', systemPrefersDark);
      } else {
        root.classList.toggle('dark', currentTheme === 'dark');
      }
    };

    applyTheme(theme);
    localStorage.setItem('mangwa-theme', theme);

    // Listener para mudanças no tema do sistema
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme('system');

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  };
  const getThemeIcon = () => {
    switch (theme) {
      case 'light': return '☀️';
      case 'dark': return '🌙';
      default: return '💻';
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'light': return 'Claro';
      case 'dark': return 'Escuro';
      default: return 'Sistema';
    }
  };

  return {
    theme,
    setTheme,
    toggleTheme,
    getThemeIcon,
    getThemeLabel
  };
};
