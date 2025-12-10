import React, { createContext } from "react";

export interface ThemeContextType {
	darkMode: boolean;
	toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const darkMode = false;
  const toggleTheme = () => {};

  // Ensure light mode: remove any existing 'dark' class
  if (typeof document !== 'undefined') {
    document.documentElement.classList.remove('dark');
  }

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Note: useTheme hook moved to src/hooks/use-theme.ts to keep this file exporting only components.

export { ThemeContext };
