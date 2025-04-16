// src/components/AuthLoadingSpinner.jsx
import React from "react";
import "../assets/loadingSpinner.css"

const AuthLoadingSpinner = () => {
  return (
    <div className="spinner-container">
      <div className="loading-spinner" />
      <p>로딩 중입니다...</p>
      <p>AuthLoadingSpinner..</p>
    </div>
  );
};

export default AuthLoadingSpinner;
