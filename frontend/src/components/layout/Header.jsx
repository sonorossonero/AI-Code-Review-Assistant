// src/components/layout/Header.jsx
import React from "react";
import { Code, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = ({ theme, toggleTheme }) => {
  return (
    <nav className="border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center gap-2">
            <Code className="h-6 w-6 text-blue-600 dark:text-blue-500" />
            <span className="font-semibold text-xl text-gray-900 dark:text-white">
              Code Review Assistant
            </span>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
