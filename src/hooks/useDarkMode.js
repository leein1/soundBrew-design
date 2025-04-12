// src/hooks/useDarkMode.js
import { useState, useEffect } from "react";

export function useDarkMode() {
  // 초기값: localStorage에 저장된 다크 모드 상태를 확인합니다.
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved === "enabled";
  });

  useEffect(() => {
    // 최상위 <html> 요소에 다크 모드 클래스를 토글합니다.
    const html = document.documentElement;
    const body = document.body;

    if (darkMode) {
        html.classList.add("dark-mode");
        body.classList.add("dark-mode");
      } else {
        html.classList.remove("dark-mode");
        body.classList.remove("dark-mode");
      }
  
    // localStorage에 현재 상태를 저장합니다.
    localStorage.setItem("darkMode", darkMode ? "enabled" : "disabled");
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return [darkMode, toggleDarkMode];
}
