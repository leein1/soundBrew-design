// src/components/layouts/Sound.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import useTagFilter from "../../hooks/useTagFilter";
import useViewSort from "../../hooks/useViewSort";

import SearchBar from "../../components/Search";
import TagSort from "../../pages/sound/TagSort";
import ViewType from "../../pages/sound/ViewType";
import ViewSort from "../../pages/sound/ViewSort";
import TrackList from "../../pages/sound/TrackList";
import AlbumList from "../../pages/sound/AlbumList";
import QueBar from "../../pages/sound/QueBar";

import "../../assets/css/sound/sound.css";
import "../../assets/css/sound/music.css";
import "../../assets/css/sound/album-list.css";
import "../../assets/css/sound/player.css";

const Sound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 정렬 상태 (newest, oldest 등)
  const [sortStyle, setSortStyle] = useState("newest");

  // useViewSort 커스텀 훅을 통해 sortStyle 적용
  useViewSort(sortStyle);

  // 검색 상태 (검색 타입, 검색어)
  const [searchType, setSearchType] = useState("t");
  const [searchKeyword, setSearchKeyword] = useState("");

  // 현재 뷰 상태: URL 경로에 따라 tracks 또는 albums 선택
  const [currentView, setCurrentView] = useState(() => {
    const seg = location.pathname.split("/").pop();
    return ["albums", "tracks"].includes(seg) ? seg : "tracks";
  });

  // 태그 필터 관련 훅
  const {
    tagData,
    sectionVisibility,
    activeTags,
    toggleSection,
    clickTag,
  } = useTagFilter();

  // URL 변경에 따라 뷰 동기화
  useEffect(() => {
    const seg = location.pathname.split("/").pop();
    if (["albums", "tracks"].includes(seg) && seg !== currentView) {
      setCurrentView(seg);
    }
  }, [location.pathname, currentView]);

  return (
    <div className="article">
      <SearchBar
        type={searchType}
        keyword={searchKeyword}
        onTypeChange={setSearchType}
        onKeywordChange={setSearchKeyword}
        onSearch={() => navigate(`?type=${searchType}&q=${searchKeyword}`)}
      />

      <div className="content">
        <TagSort
          data={tagData}
          sectionVisibility={sectionVisibility}
          activeTags={activeTags}
          onToggleSection={toggleSection}
          onTagClick={clickTag}
        />

        <ViewSort sortStyle={sortStyle} onChange={setSortStyle} />
        <ViewType mode={currentView} onChange={setCurrentView} />

        <div>
          {currentView === "tracks" && <TrackList />}
          {currentView === "albums" && <AlbumList />}
        </div>

        <QueBar />
      </div>
    </div>
  );
};

export default Sound;
