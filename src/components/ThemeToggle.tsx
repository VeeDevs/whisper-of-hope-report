import React from "react";
import { Sun } from "lucide-react";

export const ThemeToggle: React.FC = () => {
  // Dark mode disabled: render a non-interactive light indicator
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white text-gray-700 border border-gray-300"
      title="Light mode"
    >
      <Sun className="h-4 w-4" />
      <span className="text-xs">Light</span>
    </span>
  );
};
