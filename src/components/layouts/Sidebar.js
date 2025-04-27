// src/components/Sidebar.jsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "../../context/authContext";
import { Link,useLocation } from "react-router-dom";

// 아이콘 베럴 
import icons from 'assets/images/imageBarrel'

// 다크 모드 토글
import DarkModeToggle from "components/mode/DarkModeToggle";

const Sidebar = ({ isExpanded, toggleSidebar, onProfileClick }) => {
  const location = useLocation();    
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [userInfoOpen, setUserInfoOpen] = useState(false);
  const [adminInfoOpen, setAdminInfoOpen] = useState(false);

  const sidebarRef = useRef(null);
  const menuButtonRef = useRef(null);
  

  const handleSidebarToggle = e => {
    e.stopPropagation();         // ← 여기서도 전파 차단
    toggleSidebar();
    // 내부 메뉴 닫기
    setUserInfoOpen(false);
    setAdminInfoOpen(false);
  };

  const handleDocumentClick = useCallback(
    (e) => {
      if (isExpanded &&
        sidebarRef.current &&
        menuButtonRef.current &&
        !sidebarRef.current.contains(e.target) &&
        !menuButtonRef.current.contains(e.target)
      ) {
        toggleSidebar();
        setUserInfoOpen(false);
        setAdminInfoOpen(false);
      }
    },
    [isExpanded, toggleSidebar]
  );

  useEffect(() => {
    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, [handleDocumentClick]);

  useEffect(() => {
    if (isExpanded) {
      toggleSidebar();
      setUserInfoOpen(false);
      setAdminInfoOpen(false);
    }
  }, [location.pathname]);  
  return (
    <div ref={sidebarRef} className={`sidebar ${isExpanded ? "expanded" : ""}`}>
      {/* Sidebar 자체의 메뉴 버튼: 화면 넓은 경우에도 사용 */}
       <div ref={menuButtonRef} className="menu" onClick={handleSidebarToggle}>
        <img
          className="menu-icon"
          src={isExpanded ? icons.closeIcon : icons.sidebarIcon}
          alt="Menu Toggle"
        />
      </div>
      <hr className="divider" />

      {!isAuthenticated && (
        <div className="guest-view">
          <div className="profile">
            <img src={icons.defaultUserIcon} alt="User" className="profile-image" />
            {isExpanded && ( <button className="primary-button loginPage">로그인</button> )}
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
                    e.target.src = icons.defaultUserIcon;
                  }}
                  alt="User Profile"
                  className="profile-image no-invert"
                  src={`https://soundbrew.art/${user.profileImagePath}`}
                />
              </div>
              <div className="info1">
                <span className="myNickname">{user.nickname}</span>
                <span className="plans">관리자</span>
              </div>
              <div className={`sidebar-admin-info ${adminInfoOpen ? "open" : ""}`} onClick={() => setAdminInfoOpen((prev) => !prev)}>
                <div className="sidebar-item">
                  <img className="sidebar-icon" src={icons.infoIcon} alt="Info" />
                  <span className="sidebar-text">더 보기</span>
                </div>

                <div className="admin-view-content">
                    <Link to="/admin/statistic" className="sidebar-item">
                      <img className="sidebar-icon" src={icons.myIcon} alt="Statistics" />
                      <span className="sidebar-text">사이트 통계 조회</span>
                    </Link>
                    <Link to="/admin/users" className="sidebar-item">
                      <img className="sidebar-icon" src={icons.myIcon} alt="User Info" />
                      <span className="sidebar-text">회원 정보 조회</span>
                    </Link>
                    <Link to="/admin/albums" className="sidebar-item">
                      <img className="sidebar-icon" src={icons.myIcon} alt="Album Info" />
                      <span className="sidebar-text">앨범 정보 조회</span>
                    </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="user-view">
              <div className="profile">
                <img 
                  src={
                    !user.profileImagePath || user.profileImagePath === "default_profile_image.jpg"
                      ? icons.defaultUserIcon
                      : `https://soundbrew.art/${user.profileImagePath}`
                  }
                  alt="프로필"className="profile-image no-invert" />
                <button id="profileModalBtn" className="primary-button none-display" 
                onClick={onProfileClick}>프로필 사진 변경</button>
              </div>
              <div className="info1">
                <span className="myNickname">{user.nickname}</span>
                <span className="plans">회원</span>
              </div>
              <hr className="divider" />
              <div className={`sidebar-my-info ${userInfoOpen ? "open" : ""}`} onClick={() => setUserInfoOpen((prev) => !prev)}>
                <div className="sidebar-item">
                  <img className="sidebar-icon" src={icons.myIcon} alt="내 정보" />
                  <span className="sidebar-text">내 메뉴</span>
                </div>

                <div className="user-view-content">
                  <Link to="/me/cart" className="sidebar-item">
                    <img className="sidebar-icon" src={icons.cartIcon} alt="내 장바구니"/>
                    <span className="sidebar-text" >장바구니</span>
                  </Link>
                  <Link to="/me/info" className="sidebar-item">
                    <img className="sidebar-icon" src={icons.myIcon} alt="내 정보 조회" />
                    <span className="sidebar-text">정보 조회</span>
                  </Link>
                  <Link to="/me/change-password" className="sidebar-item">
                    <img className="sidebar-icon" src={icons.myIcon} alt="비밀번호 변경" />
                    <span className="sidebar-text">비밀번호 변경</span>
                  </Link>
                  <Link to="/me/subscription" className="sidebar-item">
                    <img className="sidebar-icon" src={icons.myIcon} alt="내 구독제 조회"/>
                    <span className="sidebar-text">
                      내 구독제 조회
                    </span>
                  </Link>
                  <Link to="/me/statistic" className="sidebar-item">
                    <img className="sidebar-icon" src={icons.soundIcon} alt="내 음악 통계" />
                    <span className="sidebar-text" >음원 관리</span>
                  </Link>
                  {/* <Link to="/me/sounds/albums" className="sidebar-item">
                    <img className="sidebar-icon" src={icons.soundIcon} alt="내 음원 관리" />
                    <span className="sidebar-text" >내 음원 관리</span>
                  </Link> */}
                  <Link to="/me/sounds/upload" className="sidebar-item">
                    <img className="sidebar-icon" src={icons.soundIcon} alt="신규 음원 등록" />
                    <span className="sidebar-text" >신규 음원 등록</span>
                  </Link>
                  <Link to="/me/cart/transaction" className="sidebar-item">
                    <img className="sidebar-icon" src={icons.cartIcon} alt="결제 음원 목록" />
                    <span className="sidebar-text">결제 음원 목록</span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <hr className="divider" />

      {/* 기타 메뉴들 */}
      <Link to="/sounds/tracks" className="sidebar-item" id="soundTracksRoute">
        <img className="sidebar-icon" src={icons.soundIcon} alt="곡" />
        <span className="sidebar-text">곡</span>
      </Link>
      <Link to="/subscription" className="sidebar-item" id="subscriptionListRoute">
        <img className="sidebar-icon" src={icons.subscriptionIcon} alt="구독제" />
        <span className="sidebar-text">구독제</span>
      </Link>
      <hr className="divider" />
      <Link to="" className="sidebar-item" onClick={()=>alert("문의하기를 클릭하셨습니다.")}>
        <img className="sidebar-icon" src={icons.qnaIcon} alt="문의" />
        <span className="sidebar-text">문의</span>
      </Link>

      {/* 다크모드 토글 */}
      <DarkModeToggle />
    </div>
  );
};

export default Sidebar;
