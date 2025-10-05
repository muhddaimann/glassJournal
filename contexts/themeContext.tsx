import { CustomDarkTheme, CustomLightTheme } from "../constants/theme";
import React, { createContext, useContext, useMemo, useState } from "react";

type ThemeContextType = {
  isDarkMode: boolean;
  theme: typeof CustomLightTheme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  theme: CustomLightTheme,
  toggleTheme: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const theme = useMemo(
    () => (isDarkMode ? CustomDarkTheme : CustomLightTheme),
    [isDarkMode]
  );

  return (
    <ThemeContext.Provider value={{ isDarkMode, theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
