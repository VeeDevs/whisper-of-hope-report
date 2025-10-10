import React, { createContext, useContext, useEffect, useState } from "react";

export interface ThemeContextType {
	darkMode: boolean;
	toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [darkMode, setDarkMode] = useState(() => {
		const stored = localStorage.getItem("wof_dark_mode");
		return stored ? stored === "true" : window.matchMedia("(prefers-color-scheme: dark)").matches;
	});

	useEffect(() => {
		document.documentElement.classList.toggle("dark", darkMode);
		localStorage.setItem("wof_dark_mode", darkMode.toString());
	}, [darkMode]);

	const toggleTheme = () => setDarkMode((d) => !d);

	return (
		<ThemeContext.Provider value={{ darkMode, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};

// Note: useTheme hook moved to src/hooks/use-theme.ts to keep this file exporting only components.

export { ThemeContext };
