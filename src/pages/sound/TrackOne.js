// src/pages/sound/TrackOne.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosGet, axiosPost } from "../../api/standardAxios";

import { copyTextToClipboard } from "../../utils/sound/copyTextToClipboard";
import { useCSSLoader } from "../../hooks/useCSSLoader";

const showCopyAlert = () => alert("링크가 복사되었습니다!");

const TrackOne = () => {
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
  
  // API에서 받아온 상세 트랙 데이터와 태그 데이터를 저장할 state
  const [trackData, setTrackData] = useState(null);
  const [tagsData, setTagsData] = useState(null);
  const [loading, setLoading] = useState(true);

  // URL 쿼리 파라미터에서 nickname, title 추출하고 API 요청
  useEffect(() => {
    const fetchData = async () => {
      const urlParams = new URLSearchParams(location.search);
      const nickname = urlParams.get("nickname");
      const title = urlParams.get("title");
      try {
        // 트랙 상세 데이터 요청
        const response = await axiosGet({
          endpoint: `/api/sounds/tracks/${nickname}/title/${title}`,
        });
        if (response && response.dto) {
          setTrackData(response.dto);
          // 태그 관련 API 요청: 기존 js에서는 tagsBody에 [response.dto]를 넣었음
          const tagsBody = { dto: [response.dto] };
          const tagsResponse = await axiosPost({
            endpoint: "/api/sounds/tags",
            body: tagsBody,
          });
          setTagsData(tagsResponse);
        }
      } catch (error) {
        console.error("Error fetching track details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location.search]);

  // 이벤트 핸들러들
  const handleArtistClick = () => {
    const newUrl = `/sounds/tracks?keyword=${encodeURIComponent(trackData.musicDTO.nickname)}&type=n`;
    navigate(newUrl);
  };

  const handleShare = async () => {
    const url = window.location.origin;
    const shareText = `${url}/sounds/tracks/one?
        nickname=${encodeURIComponent(trackData.musicDTO.nickname)}&title=${encodeURIComponent(trackData.musicDTO.title)}`;
      
    try {
      await navigator.clipboard.writeText(shareText);
      showCopyAlert();
    } catch (err) {
      console.error("공유 복사 실패:", err);
      copyTextToClipboard(shareText);
      showCopyAlert();
    }
  };

  const handleDownload = () => {
    // 다운로드 로직은 필요에 맞게 확장; 여기서는 간단히 alert
    alert(trackData.filePath);
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!trackData) {
    return <div>데이터가 없습니다.</div>;
  }

  return (
    <div className="sound-one">
      <div id="copy-alert" className="copy-alert">
        링크가 복사되었습니다!
      </div>
      <div className="content-header-info">
        <img
          className="sound-image"
          src={`https://d1lq7t3sqkotey.cloudfront.net/${trackData.albumDTO.albumArtPath}`}
          alt="음원 이미지"
          onError={(e) => {
            e.target.src = "/images/album-default-image-01.jpeg";
          }}
        />
        <div className="sound-info">
          <div className="sound-title font-size-large">
            {trackData.musicDTO.title}
          </div>
          <div className="artist-name font-size-medium">
            <span>Artist</span>{" "}
            <a id="artist-link" className="artist-link" onClick={handleArtistClick}>
              {trackData.musicDTO.nickname}
            </a>
          </div>
          <div className="sound-info-reaction">
            <button className="btn sound-btn download-btn" onClick={handleDownload}>Get sound</button>
            <button className="btn sound-btn share-btn" onClick={handleShare}>Share sound</button>
          </div>
        </div>
      </div>
      <hr style={{ border: "1px solid #eee" }} />
      <div className="sound-tag-list">
        <div className="tag-category">
          <h3>Mood</h3>
          <div className="tag-items">
            {tagsData && tagsData.dto && tagsData.dto.mood.map((mood, index) => (
              <span key={index}>{mood}</span>
            ))}
          </div>
        </div>
        <div className="tag-category">
          <h3>Instrument</h3>
          <div className="tag-items">
            {tagsData && tagsData.dto && tagsData.dto.instrument.map((instrument, index) => (
              <span key={index}>{instrument}</span>
            ))}
          </div>
        </div>
        <div className="tag-category">
          <h3>Genre</h3>
          <div className="tag-items">
            {tagsData && tagsData.dto && tagsData.dto.genre.map((genre, index) => (
              <span key={index}>{genre}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOne;
