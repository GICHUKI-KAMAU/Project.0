import { createContext, useState, ReactNode, useEffect } from "react";
// @ts-ignore
import { DARK_THEME, LIGHT_THEME } from "../constants/themeConstants";

// Defining the context interface
interface ThemeContextType {
  theme: string | null;
  toggleTheme: () => void;
}

// Create context with initial value
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Defining the props interface for ThemeProvider
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<string | null>(
    window.localStorage.getItem("themeMode") || LIGHT_THEME
  );

  useEffect(() => {
    window.localStorage.setItem("themeMode", theme || LIGHT_THEME); // storing in the local storage
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme === LIGHT_THEME ? DARK_THEME : LIGHT_THEME
    );
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
