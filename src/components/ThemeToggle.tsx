import React from "react";
import { useTheme } from "@/hooks/use-theme";
import { Sun, Moon } from "lucide-react";

export const ThemeToggle: React.FC = () => {
  const { darkMode, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      aria-label="Toggle light/dark mode"
      title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
};
