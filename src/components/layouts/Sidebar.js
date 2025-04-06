// src/components/Sidebar.jsx
import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/authContext";

// 아이콘 import (경로는 실제 프로젝트에 맞게 수정)
import sidebarIcon from "../../assets/images/menu_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg";
import closeIcon from "../../assets/images/close_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg";
import soundIcon from "../../assets/images/music_note_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg";
import subscriptionIcon from "../../assets/images/graphic_eq_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg";
import qnaIcon from "../../assets/images/help_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg";
import defaultUserIcon from "../../assets/images/account_circle_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg"

import DarkModeToggle from "../DarkModeToggle"; // 다크 모드 토글 컴포넌트

// css
import "../../assets/css/layout.css";
import "../../assets/css/common.css";

const Sidebar = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();

  const [isExpanded, setIsExpanded] = useState(false);
  const [userInfoOpen, setUserInfoOpen] = useState(false);
  const [adminInfoOpen, setAdminInfoOpen] = useState(false);

  const sidebarRef = useRef(null);
  const menuButtonRef = useRef(null);

  const handleSidebarToggle = () => {
    setIsExpanded((prev) => {
      if (prev) {
        setUserInfoOpen(false);
        setAdminInfoOpen(false);
      }
      return !prev;
    });
  };

  const handleDocumentClick = (e) => {
    if (
      isExpanded &&
      sidebarRef.current &&
      menuButtonRef.current &&
      !sidebarRef.current.contains(e.target) &&
      !menuButtonRef.current.contains(e.target)
    ) {
      setIsExpanded(false);
      setUserInfoOpen(false);
      setAdminInfoOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, [isExpanded]);

  return (
    <div ref={sidebarRef} className={`sidebar ${isExpanded ? "expanded" : ""}`}>
      <div ref={menuButtonRef} className="menu" onClick={handleSidebarToggle}>
        <img
          className="menu-icon"
          src={isExpanded ? closeIcon : sidebarIcon}
          alt="Menu Toggle"
        />
      </div>
      <hr className="divider" />

      {/* 여기는 기존 게스트/유저/관리자 뷰 */}
      {!isAuthenticated && (
        <div className="guest-view">
          <div className="profile">
            <img
              src={defaultUserIcon}
              alt="User"
              className="profile-image"
            />
            {isExpanded && (
              <button className="primary-button loginPage">로그인</button>
            )}
          </div>
        </div>
      )}

      {isAuthenticated && (
        <>
          {isAdmin ? (
            <div className="admin-view">
              <div className="profile">
                <img
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src ={defaultUserIcon};
                  }}
                  alt="User Profile"
                  className="profile-image"
                />
              </div>
              <div className="info1">
                <span className="myNickname">{user.nickname}</span>
                <span className="plans">관리자</span>
              </div>
              <div className="sidebar-admin-info">
                <div
                  className="sidebar-admin-info-title"
                  onClick={() => setAdminInfoOpen((prev) => !prev)}
                >
                  <div className="sidebar-item">
                    <img
                      className="sidebar-icon"
                      src="/images/info_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg"
                      alt="Info"
                    />
                    <span className="sidebar-text">더 보기</span>
                  </div>
                </div>
                {adminInfoOpen && (
                  <div className="admin-view-content">
                    {/* 관리자 메뉴 아이템 */}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="user-view">
              <div className="profile">
                <img
                  src={`https://soundbrew.storage.s3.ap-northeast-2.amazonaws.com/${user.profileImagePath}`}
                  alt="프로필"
                  className="profile-image"
                />
              </div>
              <div className="info1">
                <span className="myNickname">{user.nickname}</span>
                <span className="plans">회원</span>
              </div>
              <div
                className="sidebar-my-info"
                onClick={() => setUserInfoOpen((prev) => !prev)}
              >
                <div className="sidebar-item">
                  <img
                    className="sidebar-icon"
                    src="/images/info_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg"
                    alt="내 정보"
                  />
                  <span className="sidebar-text">내 정보</span>
                </div>
                {userInfoOpen && (
                  <div className="user-view-content">
                    {/* 사용자 메뉴 아이템 */}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      <hr className="divider" />

      {/* 기타 메뉴들 */}
      <div className="sidebar-item" id="soundTracksRoute">
        <img className="sidebar-icon" src={soundIcon} alt="곡" />
        <span className="sidebar-text">곡</span>
      </div>
      <div className="sidebar-item" id="subscriptionListRoute">
        <img className="sidebar-icon" src={subscriptionIcon} alt="구독제" />
        <span className="sidebar-text">구독제</span>
      </div>
      <hr className="divider" />
      <div className="sidebar-item">
        <img className="sidebar-icon" src={qnaIcon} alt="문의" />
        <span className="sidebar-text">문의</span>
      </div>

      {/* 다크모드 토글 */}
      <DarkModeToggle />
    </div>
  );
};

export default Sidebar;
