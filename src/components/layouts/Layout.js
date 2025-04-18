// src/components/layouts/Layout.jsx
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navigation from "./Navigation";
import ProfileModal from "./ProfileModal";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const toggleSidebar = () => setIsSidebarExpanded(prev => !prev);
  const openProfileModal = () => setShowProfileModal(true);

  return (
    <div className="main">
      <Sidebar
        isExpanded={isSidebarExpanded}
        toggleSidebar={toggleSidebar}
        onProfileClick={openProfileModal}  
      />
      <div className="article">
        <Navigation toggleSidebar={toggleSidebar} />
        <div id="searchContainer" className="searchContainer" />
        <div className="content"><Outlet /></div>
        <div className="pagination-container" id="pagination-container" />
      </div>
      <ProfileModal
        show={showProfileModal}            
        setShow={setShowProfileModal}      
      />
    </div>
  );
};

export default Layout;
