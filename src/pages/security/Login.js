// src/pages/Login.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/css/login.css";
import axios from "axios";
import TokenUtil from "../../utils/token/tokenUtil";
import { useAuth } from "../../context/authContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { logout } = useAuth(); // 이미 로그인된 상태에서 로그아웃 쓸 수 있음

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userInput = { username, password };

    try {
      const response = await axios.post("https://localhost:3000/generateToken", userInput);

      const { accessToken, refreshToken, redirectUrl } = response.data;

      TokenUtil.setToken(accessToken, refreshToken); // 토큰 저장

      navigate(redirectUrl); // 성공 시 이동
    } catch (error) {
      TokenUtil.clearToken();

      alert(error?.response?.data?.message || "로그인 실패");

      if (error?.response?.data?.resetToken) {
        localStorage.setItem("resetToken", error.response.data.resetToken);
      }

      if (error?.response?.data?.redirectUrl) {
        window.location.href = error.response.data.redirectUrl;
      }
    }
  };

  return (
    <div className="content-wrapper">
      <div className="content-header">로그인</div>

      <div className="content-body">
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">이메일</label>
            <input
              type="text"
              id="email"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="이메일 입력"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 입력"
              required
            />
          </div>

          <button type="submit">로그인</button>
        </form>
      </div>

      <div className="content-footer">
        <span>
          <a href="/help/find-password">비밀번호 찾기</a>
        </span>
      </div>
    </div>
  );
};

export default Login;
