// src/components/Navigation.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "context/authContext";

// 아이콘 베럴
import icons from 'assets/images/imageBarrel'

const Navigation = ({ toggleSidebar }) => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="navigation">
      {/* 화면이 좁은 경우, 이 메뉴 버튼을 눌러 사이드바를 토글 */}
      <div className="navigation-menu" onClick={e => {e.stopPropagation();toggleSidebar();}}>
        <img className="navigation-menu-icon" src={icons.sidebarIcon} alt="Menu Toggle" />
      </div>
      <Link to="/" className="sitename">
        <img src={icons.SoundBrewLogo} alt="SoundBrew" />
      </Link>
      <div className="auth-container">
        {!isAuthenticated ? (
          <>
            <div className="guest-view">
              <Link to="/register">회원가입</Link>
            </div>
            <div className="guest-view loginPage">
              <Link to="/login">로그인</Link>
            </div>
          </>
        ) : (
          <div className="logoutPage" onClick={logout}>
            <Link to="/logout">로그아웃</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navigation;
