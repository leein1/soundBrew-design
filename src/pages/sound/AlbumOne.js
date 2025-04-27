// src/pages/sound/AlbumOne.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosGet } from "api/standardAxios";

import TrackList from "./TrackList";  // 재활용할 TrackList 컴포넌트
import QueBar from "../../components/sound/QueBar";

import { copyTextToClipboard } from "../../utils/sound/copyTextToClipboard";
import { useCSSLoader } from "../../hooks/useCSSLoader";

const AlbumOne = () => {
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
  const [albumData, setAlbumData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  const [playerSoundInfo, setPlayerSoundInfo] = useState(null);
  

  // URL 쿼리 파라미터에서 nickname과 albumName 추출 후 API 호출
  useEffect(() => {
    const fetchAlbumData = async () => {
      const urlParams = new URLSearchParams(location.search);
      const nickname = urlParams.get("nickname");
      const albumName = urlParams.get("albumName");
      try {
        const response = await axiosGet({
          endpoint: `/api/sounds/albums/${nickname}/title/${albumName}${location.search}`,
        });
        console.log(response);
        setAlbumData(response); // 전체 responseDTO 전달 (dtoList와 페이징 정보 포함)
      } catch (error) {
        console.error("Error fetching album data:", error);
        setAlbumData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbumData();
  }, [location.search]);

  useEffect(() => {
    console.log("albumData updated:", albumData);
  }, [albumData]);

  const handleArtistClick = () => {
    const urlParams = new URLSearchParams(location.search);
    const nickname = urlParams.get("nickname");
    const newUrl = `/sounds/tracks?keyword=${encodeURIComponent(nickname)}&type=n`;
    navigate(newUrl);
  };

  const handleShareAlbum = async () => {
    const url = window.location.origin;
    const urlParams = new URLSearchParams(location.search);
    const nickname = urlParams.get("nickname");
    const albumName = urlParams.get("albumName");
    const shareText = `${url}/sounds/albums/one?
      nickname=${encodeURIComponent(nickname)}&albumName=${encodeURIComponent(albumName)}`;

    try {
      await navigator.clipboard.writeText(shareText);
      alert("링크가 복사되었습니다!");
    } catch (err) {
      console.error("공유 복사 실패:", err);
      copyTextToClipboard(shareText);
      alert("링크가 복사되었습니다!");
    }
  };

  const toggleDescription = () => {
    setExpanded((prev) => !prev);
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!albumData || !albumData.dtoList || albumData.dtoList.length === 0) {
    return <div>앨범 데이터가 없습니다.</div>;
  }
  
  const album = albumData.dtoList[0];

  return (
    <div className="album-one-container">
      {/* 앨범 상세 정보 영역 */}
      <div className="album-one">
        <div id="copy-alert" className="copy-alert">
          링크가 복사되었습니다!
        </div>
        <div className="content-header-info">
          <img
            className="sound-image"
            src={`https://soundbrew.art/${album.albumDTO.albumArtPath}`}
            alt="음원 이미지"
            onError={(e) => {
              e.target.src = "/images/album-default-image-01.jpeg";
            }}
          />
          <div className="sound-info">
            <span>Artist</span>
            <div className="sound-title font-size-large">
              <a id="artist-link" className="artist-link" onClick={handleArtistClick}>
                {album.albumDTO.nickname}
              </a>
            </div>
            <div className="artist-name font-size-medium"></div>
            <div className="sound-info-reaction">
              {/* <button className="btn sound-btn" >add cart</button> */}
              <button className="btn sound-btn share-album-btn" onClick={handleShareAlbum}>share album</button>
            </div>
          </div>
        </div>
        <div className="album-info-text">
          <p className={`album-description ${expanded ? "expanded" : ""}`}>
            {album.albumDTO.description}
          </p>
          {album.albumDTO.description && (
            <button className="album-btn show-more-btn" onClick={toggleDescription}>
              {expanded ? "접기" : "더보기"}
            </button>
          )}
        </div>
      </div>

      <h2 style={{ marginTop: "20px", marginBottom: "20px" }}>이 앨범의 음원 목록</h2>

        <hr style={{ border: "1px solid #eee"}} />
      {/* 앨범의 음원 목록 영역 - 부모에서 전체 responseDTO를 TrackList에 전달 */}
      <div className="album-track-list">
        <TrackList onPlay={setPlayerSoundInfo}  data={albumData} />
        {/* Pagination은 TrackList 내부에서 렌더링됩니다. */}

        <QueBar playerSoundInfo={playerSoundInfo} />
      </div>
    </div>
  );
};

export default AlbumOne;
