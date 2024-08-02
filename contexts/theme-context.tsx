import React, { createContext, useState, useContext } from "react";
import { lightTheme, darkTheme } from "../utils/theme";

// Define the structure of your theme
type ThemeType = typeof lightTheme;

// Define all possible theme names
type ThemeName = string;

// Create a themes object to easily add more themes in the future
const themes: Record<ThemeName, ThemeType> = {
  light: lightTheme,
  dark: darkTheme,
  // You can add more themes here in the future
};

interface IThemeContextType {
  theme: ThemeType;
  setTheme: (themeName: ThemeName) => void;
  themeName: ThemeName;
}

const ThemeContext = createContext<IThemeContextType>({
  theme: darkTheme,
  setTheme: () => null,
  themeName: "dark",
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themeName, setThemeName] = useState<ThemeName>("dark");

  const setTheme = (newThemeName: ThemeName) => {
    if (themes[newThemeName]) {
      setThemeName(newThemeName);
    } else {
      console.warn(
        `Theme "${newThemeName}" not found. Defaulting to dark theme.`
      );
      setThemeName("dark");
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
