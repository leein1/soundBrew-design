// src/pages/sound/TrackList.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { axiosGet } from "../../api/standardAxios";
import icons from "../../assets/images/imageBarrel";
import Pagination from "../../components/Pagination";
import { copyTextToClipboard } from "../../utils/sound/copyTextToClipboard";
import handleDownload from "../../utils/sound/handleDownload";
import QueBar from "./QueBar";

const TrackList = ({ data: propData, onPlay }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [responseData, setResponseData] = useState(null);

  // TrackList 데이터 로드: URL의 쿼리 파라미터에 따라 재요청
  useEffect(() => {
    if (propData) {
      setResponseData(propData);
      return;
    }
    const fetchTracks = async () => {
      try {
        const response = await axiosGet({ endpoint: `/api/sounds/tracks${location.search}` });
        if (response && response.dtoList) {
          setResponseData(response);
        } else {
          setResponseData({ dtoList: [] });
        }
      } catch (error) {
        console.error("Error fetching tracks:", error);
        setResponseData({ dtoList: [] });
      }
    };
    fetchTracks();
  }, [propData, location.search]);

  // 공유 버튼 핸들러
  const handleShare = async (sound) => {
    const url = window.location.origin;
    const shareText = `${url}/sounds/tracks/one?
      nickname=${encodeURIComponent(sound.albumDTO.nickname)}&title=${encodeURIComponent(sound.musicDTO.title)}`;
    try {
      await copyTextToClipboard(shareText);
      alert("링크가 복사되었습니다!");
    } catch (err) {
      console.error("복사 실패:", err);
      alert("링크가 복사되었습니다!");
    }
  };

  if (!responseData || !responseData.dtoList || responseData.dtoList.length === 0) {
    return <span>검색결과가 없습니다</span>;
  }

  return (
    <div className="track-list">
    {responseData.dtoList.map((sound) => (
      <div key={sound.musicDTO.musicId} className="music-item">
          <div className="music-item-left">
            <img
              alt="앨범 이미지"
              className="music-album-img"
              src={`https://d1lq7t3sqkotey.cloudfront.net/${sound.albumDTO.albumArtPath}`}
              onError={(e) => { e.target.src = icons.defaultSoundImg; }}
            />
            <div className="music-play-btn" onClick={() => QueBar(sound.musicDTO.musicId)}>
              <img src={icons.playIcon} alt="재생" />
            </div>
            <div className="music-info">
              <h3
                className="track-title"
                onClick={() =>
                  navigate(
                    `/sounds/tracks/one?nickname=${encodeURIComponent(
                      sound.albumDTO.nickname
                    )}&title=${encodeURIComponent(sound.musicDTO.title)}`
                  )
                }
                style={{ cursor: "pointer" }}
              >
                {sound.musicDTO.title}
              </h3>
              <p
                className="album-name"
                onClick={() =>
                  navigate(
                    `/sounds/albums/one?nickname=${encodeURIComponent(
                      sound.albumDTO.nickname
                    )}&albumName=${encodeURIComponent(sound.albumDTO.albumName)}`
                  )
                }
                style={{ cursor: "pointer" }}
              >
                {sound.albumDTO.albumName}
              </p>
            </div>
            <div className="music-info-time">
              {/* 시간 정보 추가 가능 */}
            </div>
          </div>

          <div className="music-item-center">
            <div className="music-info-tag">
              <span>{(sound.tagsStreamDTO.instrumentTagName || "기타").replace(/,/g, " ")}</span>
              <span>{(sound.tagsStreamDTO.moodTagName || "없음").replace(/,/g, " ")}</span>
              <span>{(sound.tagsStreamDTO.genreTagName || "기타").replace(/,/g, " ")}</span>
            </div>
          </div>

          <div className="music-item-right">
            <div className="music-actions">
              <img
                src={icons.downloadIcon}
                className="download-btn"
                alt="다운로드"
                onClick={() => handleDownload(sound)}
              />
              <img
                src={icons.linkIcon}
                alt="공유"
                className="share-btn"
                onClick={() => handleShare(sound)}
              />
            </div>
          </div>
        </div>
      ))}
      {/* Pagination 컴포넌트에 전체 responseData 전달 */}
      <Pagination responseDTO={responseData} />
    </div>
  );
};

export default TrackList;
