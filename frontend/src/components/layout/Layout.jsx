// src/components/layout/Layout.jsx
import React from "react";
import Header from "./Header";
import useTheme from "@/hooks/useTheme";

const Layout = ({ children }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={theme}>
      <div className="min-h-screen bg-background transition-colors duration-300">
        <Header theme={theme} toggleTheme={toggleTheme} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="max-w-full mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
