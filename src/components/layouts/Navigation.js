// src/components/Navigation.jsx
import { Link } from "react-router-dom";
import { useAuth } from '../../context/authContext';
import SoundBrewLogo from "../../assets/images/SoundBrew.svg";
import sidebarIcon from '../../assets/images/menu_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg';

const Navigation = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="navigation">
      <div className="navigation-menu">
        <img className="navigation-menu-icon" src={sidebarIcon} alt="menu" />
      </div>

      <div className="sitename">
        <img src={SoundBrewLogo} alt="SoundBrew" />
      </div>
      
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
