// src/components/LoadingSpinner.jsx
import React from "react";
import "assets/loadingSpinner.css"

const LoadingSpinner = () => {
  return (
    <div className="spinner-overlay">
      <div className="loading-spinner" />
      <p>로딩 중입니다...</p>
      <p>API LoadingSpinner...</p>
    </div>
  );
};

export default LoadingSpinner;
