import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';

type ThemeMode = 'dark' | 'light';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  toggleTheme: () => {},
  setThemeMode: () => {}
});

export const useTheme = () => useContext(ThemeContext);

export function CustomThemeProvider({ children }: { children: ReactNode }) {
  // Initial theme detection - default 'light' for clean medical blue theme
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('tb_quest_theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
    }
    return 'light';
  });

  // Sync class on documentElement and localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (mode === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
    localStorage.setItem('tb_quest_theme', mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setThemeMode = (newMode: ThemeMode) => {
    setMode(newMode);
  };

  // Material UI Theme object matching application specifications
  const muiTheme = useMemo(() => {
    return createTheme({
      palette: {
        mode,
        primary: {
          main: '#0284c7', // Primary Blue
          light: '#38bdf8',
          dark: '#0369a1'
        },
        secondary: {
          main: '#a855f7'
        },
        background: {
          default: mode === 'dark' ? '#0B1120' : '#F8FAFC',
          paper: mode === 'dark' ? '#111827' : '#FFFFFF'
        },
        text: {
          primary: mode === 'dark' ? '#F9FAFB' : '#0F172A',
          secondary: mode === 'dark' ? '#9CA3AF' : '#475569'
        },
        divider: mode === 'dark' ? '#1F2937' : '#E2E8F0'
      },
      typography: {
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
      },
      components: {
        MuiCard: {
          styleOverrides: {
            root: {
              backgroundImage: 'none',
              backgroundColor: mode === 'dark' ? '#111827' : '#FFFFFF',
              borderColor: mode === 'dark' ? '#1F2937' : '#E2E8F0',
              borderRadius: '1rem',
              boxShadow: mode === 'dark' ? '0 10px 25px -5px rgba(0, 0, 0, 0.3)' : '0 10px 25px -5px rgba(0, 0, 0, 0.05)'
            }
          }
        },
        MuiAccordion: {
          styleOverrides: {
            root: {
              backgroundColor: mode === 'dark' ? '#030712' : '#F1F5F9',
              color: mode === 'dark' ? '#F9FAFB' : '#0F172A',
              borderColor: mode === 'dark' ? '#1F2937' : '#E2E8F0'
            }
          }
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: 'none',
              backgroundColor: mode === 'dark' ? '#111827' : '#FFFFFF'
            }
          }
        },
        MuiDialog: {
          styleOverrides: {
            paper: {
              backgroundColor: mode === 'dark' ? '#0B1120' : '#FFFFFF',
              borderColor: mode === 'dark' ? '#1F2937' : '#E2E8F0'
            }
          }
        }
      }
    });
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, setThemeMode }}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
