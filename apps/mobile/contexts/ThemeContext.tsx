import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../theme';

type ColorScheme = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  colorScheme: ColorScheme;
  actualColorScheme: 'light' | 'dark';
  colors: typeof Colors.light;
  setColorScheme: (scheme: ColorScheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>('auto');
  const [isLoading, setIsLoading] = useState(true);

  // AsyncStorageから保存された設定を読み込む
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('colorScheme');
        if (savedTheme) {
          setColorSchemeState(savedTheme as ColorScheme);
        }
      } catch (error) {
        console.error('Failed to load theme:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTheme();
  }, []);

  // 実際に適用される色スキーム
  const actualColorScheme: 'light' | 'dark' = 
    colorScheme === 'auto' 
      ? (systemColorScheme || 'light')
      : colorScheme;

  const colors = Colors[actualColorScheme];

  const setColorScheme = async (scheme: ColorScheme) => {
    setColorSchemeState(scheme);
    try {
      await AsyncStorage.setItem('colorScheme', scheme);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  if (isLoading) {
    return null; // またはローディングスピナー
  }

  return (
    <ThemeContext.Provider 
      value={{ 
        colorScheme, 
        actualColorScheme,
        colors, 
        setColorScheme 
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};