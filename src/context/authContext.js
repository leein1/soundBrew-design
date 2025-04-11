// src/context/authContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TokenUtil from "../utils/token/tokenUtil";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true); // ✅ 초기화 여부
  const navigate = useNavigate();

  useEffect(() => {
    const token = TokenUtil.getToken();
    if (token && !TokenUtil.isTokenExpired(token)) {
      const userInfo = TokenUtil.getUserInfo(token);
      setUser(userInfo);
    }
    setInitializing(false); 

  }, []);

  const login = async (username, password) => {
    const userInput = { username, password };
    try {
      const response = await axios.post("https://localhost:8443/generateToken", userInput);
      const { accessToken, refreshToken, redirectUrl } = response.data;
      TokenUtil.setToken(accessToken, refreshToken);
      const userInfo = TokenUtil.getUserInfo(accessToken);
      setUser(userInfo);
      navigate(redirectUrl);
    } catch (error) {
      TokenUtil.clearToken();
      setUser(null);
      console.log(error);
      if (error?.response?.data?.resetToken) {
        localStorage.setItem("resetToken", error.response.data.resetToken);
      } else {
        alert(error?.response?.data?.message || "로그인 실패");
      }
    }
  };

  const logout = () => {
    TokenUtil.clearToken();
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.roles?.includes("ROLE_ADMIN"),
        initializing, // ✅ 컨텍스트에 포함
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
