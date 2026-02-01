import React, { createContext, useContext, useState, useEffect } from 'react';
import { lightColors, darkColors } from '../constants/Colors';
import { getDarkMode, setDarkMode as saveDarkMode } from '../services/database';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load dark mode preference from database on mount
  useEffect(() => {
    const loadDarkMode = async () => {
      try {
        const darkMode = getDarkMode();
        setIsDarkMode(darkMode);
      } catch (error) {
        console.error('Error loading dark mode preference:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDarkMode();
  }, []);

  // Toggle dark mode and save to database
  const toggleDarkMode = (value) => {
    const newValue = value !== undefined ? value : !isDarkMode;
    setIsDarkMode(newValue);
    saveDarkMode(newValue);
  };

  // Get current theme colors
  const colors = isDarkMode ? darkColors : lightColors;

  const value = {
    isDarkMode,
    toggleDarkMode,
    colors,
    isLoading,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
