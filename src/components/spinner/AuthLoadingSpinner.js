// src/components/AuthLoadingSpinner.jsx
import React from "react";
import "assets/loadingSpinner.css"

const AuthLoadingSpinner = () => {
  return (
    <div className="spinner-overlay">
      <div className="loading-spinner" />
      <p>로딩 중입니다...</p>
      <p>Auth LoadingSpinner...</p>
    </div>
  );
};

export default AuthLoadingSpinner;
