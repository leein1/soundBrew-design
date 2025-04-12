// src/components/layouts/Sound.jsx
import React, { useState, useEffect, useMemo } from "react";
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

import { useCSSLoader } from "../../hooks/useCSSLoader";


const Sound = () => {
  const cssFiles = useMemo(() => [
    "/assets/css/sound/sound.css",
    "/assets/css/sound/music.css",
    "/assets/css/sound/album.css",
    "/assets/css/sound/album-list.css",
    "/assets/css/sound/player.css",
  ], []);

  useCSSLoader(cssFiles);

  const location = useLocation();
  const navigate = useNavigate();

  // 정렬 상태 (newest, oldest 등)
  const [sortStyle, setSortStyle] = useState("newest");
  useViewSort(sortStyle);

  // 검색 상태 (검색 타입, 검색어)
  const [searchType, setSearchType] = useState("t");
  const [searchKeyword, setSearchKeyword] = useState("");

  // 현재 뷰 상태: URL 경로에 따라 tracks 또는 albums 선택
  const [currentView, setCurrentView] = useState(() => {
    const seg = location.pathname.split("/").pop();
    return ["albums", "tracks"].includes(seg) ? seg : "tracks";
  });

  // 부모에서 관리하는 player 상태: 현재 재생할 정보 객체
  const [playerSoundInfo, setPlayerSoundInfo] = useState(null);

  // 태그 필터 관련 훅
  const {
    tagData,
    sectionVisibility,
    activeTags,
    toggleSection,
    clickTag,
  } = useTagFilter();

  useEffect(() => {
    const seg = location.pathname.split("/").pop();
    if (["albums", "tracks"].includes(seg) && seg !== currentView) {
      setCurrentView(seg);
    }
  }, [location.pathname, currentView]);

  return (
    <div>
      <SearchBar
        type={searchType}
        keyword={searchKeyword}
        onTypeChange={setSearchType}
        onKeywordChange={setSearchKeyword}
        onSearch={() => navigate(`?type=${searchType}&keyword=${searchKeyword}`)}
      />

      <div className="content">
        <TagSort
          data={tagData}
          sectionVisibility={sectionVisibility}
          activeTags={activeTags}
          onToggleSection={toggleSection}
          onTagClick={clickTag}
        />

        <ViewType mode={currentView} onChange={setCurrentView} />
        <ViewSort sortStyle={sortStyle} onChange={setSortStyle} />

        <div>
          {currentView === "tracks" && (<TrackList onPlay={setPlayerSoundInfo} />)}
          {currentView === "albums" && <AlbumList onPlay={setPlayerSoundInfo}/>}
        </div>

        {/* playerSoundInfo를 QueBar에 전달 */}
        <QueBar playerSoundInfo={playerSoundInfo} />
      </div>
    </div>
  );
};

export default Sound;
