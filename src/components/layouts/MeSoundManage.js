// src/components/layouts/MeSoundManage.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MeAlbumView from "../../pages/sound/MeAlbumView";
import MeTrackView from "../../pages/sound/MeTrackView";
import MeTagView from "../../pages/sound/MeTagView";
import icons from "../../assets/images/imageBarrel";

import { useAuth } from "../../context/authContext";
import TagSpelling from "../../pages/sound/TagSpelling";

const MeSoundManage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const validViews = ["albums", "tracks", "tags", "tags/spelling"];
  const pathRelative = location.pathname.replace("/me/sounds/", "").replace("/admin/", "");

  const initialView = validViews.includes(pathRelative) ? pathRelative : "albums";
  const [currentView, setCurrentView] = useState(initialView);
  const [sortView, setSortView] = useState(false);

  const {isAdmin} = useAuth();

  useEffect(() => {
    const updatedPath = location.pathname.replace("/me/sounds/", "").replace("/admin/", "");
    if (validViews.includes(updatedPath) && updatedPath !== currentView) {
      setCurrentView(updatedPath);
    }
  }, [location.pathname]);

  const handleViewChange = (view) => {
    setCurrentView(view);
  
    if (isAdmin) {
      navigate(`/admin/${view}`);
    } else {
      navigate(`/me/sounds/${view}`);
    }
  
    setSortView(false); // 드롭다운 닫기
  };

  // 드롭다운 토글 핸들러
  const handleSortView = () => {
    setSortView((prev) => !prev);
  };

  return (
    <div>
      <div id="chart-selector-container">
        <div className="music-sort">
          <div className="sort-01">
            <span className="music-sort-left" onClick={handleSortView}>
              <img src={icons.changeSection} alt="정보 전환" />
              정보 전환
            </span>
            <div className={`music-sort-menu ${sortView ? "visible" : "hidden"}`}>
              <ul>
                <li onClick={() => handleViewChange("albums")} className={currentView === "albums" ? "active" : ""}>앨범 정보</li>
                <li onClick={() => handleViewChange("tracks")} className={currentView === "tracks" ? "active" : ""}>음원 정보</li>
                {!isAdmin && (<li onClick={() => handleViewChange("tags")} className={currentView === "tags" ? "active" : ""}>태그 정보</li>)}
                {isAdmin && (<li onClick={() => handleViewChange("tags/spelling")}className={currentView === "tags/spelling" ? "active" : ""}>태그 스펠링</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="view-container">
      {currentView === "albums" && <MeAlbumView />}
      {currentView === "tracks" && <MeTrackView />}
      {currentView === "tags" && !isAdmin && <MeTagView />}
      {currentView === "tags/spelling" && isAdmin && <TagSpelling />}
    </div>

    </div>
  );
};

export default MeSoundManage;
