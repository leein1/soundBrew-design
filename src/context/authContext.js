// src/context/authContext.jsx
import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const navigate = useNavigate();

  const login = async (username, password) => {
    const userInput = { username, password };

    try {
      const response = await axios.post("https://localhost:3000/generateToken", userInput);

      const { accessToken, refreshToken, redirectUrl } = response.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      setAuth({ username, accessToken });

      navigate(redirectUrl);
    } catch (error) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      if (error?.response?.data?.resetToken) {
        localStorage.setItem("resetToken", error.response.data.resetToken);
      }

      if (error?.response?.data?.redirectUrl) {
        window.location.href = error.response.data.redirectUrl;
      } else {
        alert(error?.response?.data?.message || "로그인 실패");
      }

      throw error;
    }
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
