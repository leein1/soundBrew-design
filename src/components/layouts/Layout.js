// src/components/Layout.jsx
import Sidebar from './Sidebar';
import Navigation from './Navigation';
import ProfileModal from './ProfileModal';
import { useAuth } from '../../context/authContext';
import { Outlet } from 'react-router-dom';
// import '../assets/styles/layout.css'; // 기존 CSS 유지

const Layout = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="main">
      <Sidebar />
      <div className="article">
        <Navigation />
        <div id="searchContainer" className="searchContainer"></div>
        <div className="content">
          <Outlet /> {/* 여기에 각 페이지 내용이 들어감 */}
        </div>
        <div className="pagination-container" id="pagination-container"></div>
      </div>
      <ProfileModal />
    </div>
  );
};

export default Layout;
