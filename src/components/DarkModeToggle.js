// src/components/DarkModeToggle.jsx
import React from "react";
import { useDarkMode } from "../hooks/useDarkMode";

import lightModeIcon from "../assets/images/light_mode_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg";
import darkModeIcon from "../assets/images/dark_mode_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg";

const DarkModeToggle = () => {
  const [darkMode, toggleDarkMode] = useDarkMode();

  return (
    <div className="toggle-container">
      <img src={lightModeIcon} alt="Light Mode" />
      <input
        type="checkbox"
        id="darkModeToggle"
        className="darkMode-checkbox"
        checked={darkMode}
        onChange={toggleDarkMode}
      />
      <label htmlFor="darkModeToggle" className="darkMode-label"></label>
      <img src={darkModeIcon} alt="Dark Mode" />
    </div>
  );
};

export default DarkModeToggle;
