// src/components/LoadingSpinner.jsx
import React from "react";
import "../assets/loadingSpinner.css"

const LoadingSpinner = () => {
  return (
    <div className="spinner-container">
      <div className="loading-spinner" />
      <p>로딩 중입니다...</p>
    </div>
  );
};

export default LoadingSpinner;
