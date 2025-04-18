// src/pages/sound/TrackList.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { axiosGet, axiosPost } from "api/standardAxios";
import icons from "assets/images/imageBarrel";
import Pagination from "components/global/Pagination";
import { copyTextToClipboard } from "utils/sound/copyTextToClipboard";
import handleCart from "utils/sound/handleCart";
import handleDownload from "utils/sound/handleDownload";
import { useAuth } from "context/authContext";

const TrackList = ({ onPlay, data }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [responseData, setResponseData] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    // 부모에서 data prop이 들어오면 API 호출 없이 덮어쓰기
    if (data && data.dtoList) {
      setResponseData(data);
      return;
    }

    // data가 없을 때만 API 호출
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
  }, [location.search, data]);

  const handleShare = async (sound) => {
    const url = window.location.origin;
    const shareText = `${url}/sounds/tracks/one?nickname=${encodeURIComponent(
      sound.albumDTO.nickname
    )}&title=${encodeURIComponent(sound.musicDTO.title)}`;
    try {
      await copyTextToClipboard(shareText);
      alert("링크가 복사되었습니다!");
    } catch (err) {
      console.error("복사 실패:", err);
      alert("링크가 복사되었습니다!");
    }
  };

  const handleCartAndTransaction = async (sound, userId)=>{
    const body={
      musicId:sound.musicDTO.musicId,
      userId : userId, // 추가한 유저의 아이디
      title: sound.musicDTO.title,
      filePath:sound.musicDTO.filePath,
      nickname:sound.albumDTO.nickname,
      credit:3,
      status:"DONE",
    }  
    const response = await axiosPost({endpoint:'/api/cart/transaction', body:body});
    if (response.message.includes("결제가 완료되었습니다")) {
      handleDownload(sound.musicDTO.filePath);
    }
  }

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
            <div
              className="music-play-btn"
              onClick={() =>
                onPlay({
                  filePath: sound.musicDTO.filePath,
                  title: sound.musicDTO.title,
                  albumName: sound.albumDTO.albumName,
                  albumArtPath: sound.albumDTO.albumArtPath,
                })
              }
            >
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
            <div className="music-info-time"></div>
          </div>

          <div className="music-item-center">
            <div className="music-info-tag">
              <span>
                {(sound.tagsStreamDTO.instrumentTagName || "기타").replace(/,/g, " ")}
              </span>
              <span>
                {(sound.tagsStreamDTO.moodTagName || "없음").replace(/,/g, " ")}
              </span>
              <span>
                {(sound.tagsStreamDTO.genreTagName || "기타").replace(/,/g, " ")}
              </span>
            </div>
          </div>

          <div className="music-item-right">
            <div className="music-actions">
              <img
                src={icons.cartIcon}
                alt="장바구니"
                className="cart-btn"
                onClick={() => handleCart(sound, user.userId)}
              />
              <img
                src={icons.downloadIcon}
                className="download-btn"
                alt="다운로드"
                onClick={() => handleCartAndTransaction(sound, user.userId)}
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
      <Pagination responseDTO={responseData} />
    </div>
  );
};

export default TrackList;
