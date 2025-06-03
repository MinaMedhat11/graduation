// src/context/ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProviderr = ({ children }) => {
  // تعريف darkMode أولاً
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('darkMode');
      return savedTheme ? JSON.parse(savedTheme) : false;
    } catch (error) {
      console.error('Error reading darkMode from localStorage:', error);
      return false;
    }
  });

  // حفظ التفضيل في localStorage عند التغيير
  useEffect(() => {
    try {
      localStorage.setItem('darkMode', JSON.stringify(darkMode));
      // تطبيق data-theme على body
      document.body.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving darkMode to localStorage:', error);
    }
  }, [darkMode]);

  // إنشاء theme بعد تعريف darkMode
  const theme = React.useMemo(() => {
    return createTheme({
      palette: {
        mode: darkMode ? 'dark' : 'light',
        primary: {
          main: '#28A79F',
          dark: '#1C7A73',
          light: '#4CBBB3',
        },
        secondary: {
          main: '#ff6b6b',
          dark: '#ee5a24',
          light: '#ff8e8e',
        },
        background: {
          default: darkMode ? '#121212' : '#ffffff',
          paper: darkMode ? '#1e1e1e' : '#ffffff',
        },
        text: {
          primary: darkMode ? '#ffffff' : '#000000',
          secondary: darkMode ? '#b3b3b3' : '#666666',
        }
      },
      typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      },
      components: {
        MuiCard: {
          styleOverrides: {
            root: {
              backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
              color: darkMode ? '#ffffff' : '#000000',
              boxShadow: darkMode 
                ? '0px 4px 20px rgba(255, 255, 255, 0.05)' 
                : '0px 4px 20px rgba(0, 0, 0, 0.05)',
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
              color: darkMode ? '#ffffff' : '#000000',
            },
          },
        },
        MuiAppBar: {
          styleOverrides: {
            root: {
              backgroundColor: darkMode ? '#1e1e1e' : '#28A79F',
            },
          },
        },
        MuiTableCell: {
          styleOverrides: {
            root: {
              borderColor: darkMode ? '#444444' : '#e0e0e0',
            },
          },
        },
        MuiTableHead: {
          styleOverrides: {
            root: {
              backgroundColor: darkMode ? '#333333' : '#f5f5f5',
            },
          },
        },
      },
    });
  }, [darkMode]); // dependency على darkMode

  const toggleDarkMode = React.useCallback(() => {
    setDarkMode(prev => !prev);
  }, []);

  const value = React.useMemo(() => ({
    darkMode,
    toggleDarkMode,
    theme
  }), [darkMode, toggleDarkMode, theme]);

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};