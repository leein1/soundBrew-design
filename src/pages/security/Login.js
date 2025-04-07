// src/pages/Login.js
import { useState } from "react";
import { useAuth } from "../../context/authContext";
import "../../assets/css/login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
      await login(username, password);
      // 로그인 성공 시 navigate는 context 내부에서 처리됨.
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
