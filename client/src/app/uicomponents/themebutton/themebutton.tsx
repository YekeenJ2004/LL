import React from 'react';
import { useTheme } from '@/app/contexts/themecontext';
import { CgDarkMode } from "react-icons/cg";


const ThemeToggle: React.FC  = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <button onClick={toggleTheme}>
      <CgDarkMode size={20}></CgDarkMode>
    </button>
  );
};

export default ThemeToggle;