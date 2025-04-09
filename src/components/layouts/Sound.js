// src/components/layouts/Sound.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";

// 플레이스홀더(나중에 구현할) 컴포넌트들
import SearchBar from "../../components/Search";
import TagArea   from "../../pages/sound/TagArea"
import ViewType  from "../../pages/sound/ViewType"
// import TrackList  from "../../pages/sound/TrackList"
// import AlbumList  from "../../pages/sound/AlbumList"
import Pagination from "../../components/Pagination";

const Sound = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // 예: 검색어, 필터, 정렬 상태 등
    const [searchType, setSearchType] = useState("t");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [activeTags, setActiveTags] = useState({
        instrument: true,
        mood: true,
        genre: true,
    });
    
    const [viewMode, setViewMode] = useState("list"); // or "grid"
    const [sortKey, setSortKey] = useState("newest");
    const [page, setPage] = useState(1);

    const validViews = ["albums", "tracks"];
    const pathSegment = location.pathname.split("/").pop(); // albums, tracks 중 하나
    const initialView = validViews.includes(pathSegment) ? pathSegment : "tracks";
    const [currentView, setCurrentView] = useState(initialView);

    useEffect(() => {
        // 주소가 바뀌면 currentView 도 동기화되도록
        if (validViews.includes(pathSegment) && pathSegment !== currentView) {
            setCurrentView(pathSegment);
        }
    }, [pathSegment]);

    return (
        <div className="article">
        {/* 1. 검색바 영역 */}
        <SearchBar
            type={searchType}
            keyword={searchKeyword}
            onTypeChange={setSearchType}
            onKeywordChange={setSearchKeyword}
            onSearch={() => {
            // e.g. navigate(`?type=${searchType}&q=${searchKeyword}`)
            }}
        />

        <div className="content">
            {/* 2. 태그영역 */}
            <TagArea
            activeTags={activeTags}
            onToggleTag={(tag) =>
                setActiveTags((prev) => ({ ...prev, [tag]: !prev[tag] }))
            }
            />

            {/* 3. 뷰타입 영역 */}
            <ViewType mode={currentView} onChange={(newView) => setCurrentView(newView)}/>

            {/* 4. 리스트 영역 */}
            <div>
                {/* {currentView === "albums" && <AlbumList />}
                {currentView === "tracks" && <TrackList />} */}
            </div>

            {/* <ListArea
                viewMode={viewMode}
                searchType={searchType}
                searchKeyword={searchKeyword}
                activeTags={activeTags}
                sortKey={sortKey}
            /> */}

            {/* 5. 페이지 영역 */}
            <Pagination currentPage={page} onChange={setPage} />
        </div>

        {/* Outlet 쓰고 싶으면 이 자리에 */}
        {/* <Outlet /> */}
        </div>
    );
};

export default Sound;
