import { CustomDarkTheme, CustomLightTheme } from "../constants/theme";
import React, { createContext, useContext, useMemo } from "react";
import { useColorScheme } from "react-native";

type ThemeContextType = { isDarkMode: boolean; theme: typeof CustomLightTheme };

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: true,
  theme: CustomDarkTheme,
});

export const useThemeContext = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";
  const theme = useMemo(
    () => (isDarkMode ? CustomDarkTheme : CustomLightTheme),
    [isDarkMode]
  );

  return (
    <ThemeContext.Provider value={{ isDarkMode, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}
