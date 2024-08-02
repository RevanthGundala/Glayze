import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { lightTheme, darkTheme } from "../utils/theme";

type ThemeType = typeof lightTheme;
type ThemeName = string;

const themes: Record<ThemeName, ThemeType> = {
  light: lightTheme,
  dark: darkTheme,
};

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (themeName: ThemeName) => void;
  themeName: ThemeName;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: darkTheme,
  setTheme: () => null,
  themeName: "dark",
});

const THEME_STORAGE_KEY = "@user_theme_preference";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themeName, setThemeName] = useState<ThemeName>("dark");

  useEffect(() => {
    // Load the saved theme when the component mounts
    const loadSavedTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme !== null && themes[savedTheme]) {
          setThemeName(savedTheme);
        }
      } catch (e) {
        console.error("Failed to load the theme", e);
      }
    };

    loadSavedTheme();
  }, []);

  const setTheme = async (newThemeName: ThemeName) => {
    if (themes[newThemeName]) {
      setThemeName(newThemeName);
      try {
        await AsyncStorage.setItem(THEME_STORAGE_KEY, newThemeName);
      } catch (e) {
        console.error("Failed to save the theme", e);
      }
    } else {
      console.warn(
        `Theme "${newThemeName}" not found. Defaulting to dark theme.`
      );
      setThemeName("dark");
      try {
        await AsyncStorage.setItem(THEME_STORAGE_KEY, "dark");
      } catch (e) {
        console.error("Failed to save the theme", e);
      }
    }
  };

  const value = {
    theme: themes[themeName],
    setTheme,
    themeName,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
