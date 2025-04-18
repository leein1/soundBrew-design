// src/pages/sound/QueBar.jsx
import React, { useState, useRef, useEffect } from "react";
import WaveSurfer from "https://cdn.jsdelivr.net/npm/wavesurfer.js@7/dist/wavesurfer.esm.js";
import icons from "assets/images/imageBarrel";

const QueBar = ({ playerSoundInfo }) => {
  const waveformRef = useRef(null);
  const playPauseRef = useRef(null);
  const progressBarRef = useRef(null);
  const currentTimeRef = useRef(null);
  const totalTimeRef = useRef(null);
  const volumeBarRef = useRef(null);

  const [wavesurfer, setWavesurfer] = useState(null);
  const [loadedSoundId, setLoadedSoundId] = useState(null);

  // 포맷: 초를 mm:ss 형식으로 변환
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" + secs : secs}`;
  };

  // WaveSurfer 인스턴스 생성 (컴포넌트 마운트 시)
  useEffect(() => {
    const ws = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#ddd",
      progressColor: "#005da0",
      cursorColor: "#fff",
      height: 50,
      barWidth: 1,
    });
    setWavesurfer(ws);

    // 재생 시 UI 업데이트: 진행바, 현재시간
    ws.on("audioprocess", () => {
      const currentTime = ws.getCurrentTime();
      const duration = ws.getDuration();
      if (currentTimeRef.current) {
        currentTimeRef.current.textContent = formatTime(currentTime);
      }
      if (progressBarRef.current) {
        progressBarRef.current.value = Math.floor(currentTime);
        const percentage = (currentTime / duration) * 100;
        progressBarRef.current.style.background = `linear-gradient(to right, #005da0 ${percentage}%, #ddd ${percentage}%)`;
      }
    });

    // 음원 로드 완료 시: 자동 재생 및 UI 업데이트(총시간, 진행바 최대값, 버튼 이미지)
    ws.on("ready", () => {
      ws.play();
      if (playPauseRef.current) {
        playPauseRef.current.src = icons.pauseIcon;
      }
      const duration = ws.getDuration();
      if (totalTimeRef.current) {
        totalTimeRef.current.textContent = formatTime(duration);
      }
      if (progressBarRef.current) {
        progressBarRef.current.max = Math.floor(duration);
      }
    });

    return () => ws.destroy();
  }, []);

  // playerSoundInfo prop 변경 시, 새 음원 로드 (백엔드 포트 8443 적용)
  useEffect(() => {
    if (
      wavesurfer &&
      playerSoundInfo &&
      playerSoundInfo.filePath &&
      playerSoundInfo.filePath !== loadedSoundId
    ) {
      setLoadedSoundId(playerSoundInfo.filePath);
      wavesurfer.load(`https://localhost:8443/api/stream/${playerSoundInfo.filePath}`);
    }
  }, [playerSoundInfo, wavesurfer, loadedSoundId]);

  // 플레이/일시정지 버튼 핸들러
  const handlePlayPause = () => {
    if (!wavesurfer) return;
    if (wavesurfer.isPlaying()) {
      wavesurfer.pause();
      if (playPauseRef.current) {
        playPauseRef.current.src = icons.playIcon;
      }
    } else {
      wavesurfer.play();
      if (playPauseRef.current) {
        playPauseRef.current.src = icons.pauseIcon;
      }
    }
  };

  // 진행바 변경 시: seek 동작
  const handleProgressChange = (e) => {
    if (!wavesurfer) return;
    const seekTime = Number(e.target.value);
    const duration = wavesurfer.getDuration();
    wavesurfer.seekTo(seekTime / duration);
  };

  // 볼륨바 변경 시: 음량 조절
  const handleVolumeChange = (e) => {
    if (!wavesurfer) return;
    const volume = Number(e.target.value) / 100;
    wavesurfer.setVolume(volume);
  };

  return (
    <div className="audio-player-bar">
      <div className="player-container">
        <div className="player-top-layer">
          <div className="progress-container">
            <input
              id="progress-bar"
              type="range"
              ref={progressBarRef}
              defaultValue={0}
              min="0"
              max="100"
              onChange={handleProgressChange}
            />
          </div>
        </div>
        <div className="player-bottom-layer">
          <div className="player-item-left">
            {/* 앨범 이미지: playerSoundInfo가 있으면 해당 이미지, 없으면 기본 이미지 */}
            <img
              alt="앨범 이미지"
              className="player-album-img"
              src={
                playerSoundInfo && playerSoundInfo.albumArtPath
                  ? `https://d1lq7t3sqkotey.cloudfront.net/${playerSoundInfo.albumArtPath}`
                  : icons.defaultSoundImg
              }
              width={50}
              height={50}
            />
            {playerSoundInfo &&
            <div className="player-play-btn" onClick={handlePlayPause}>
              <img ref={playPauseRef} src={icons.playIcon} alt="재생/일시정지" />
            </div>
            }   
            <div className="player-info">
              <h3>{playerSoundInfo ? playerSoundInfo.title : "음원을 선택하세요"}</h3>
              <p>{playerSoundInfo ? playerSoundInfo.albumName : ""}</p>
            </div>
            <div className="player-info-time">
              <p ref={currentTimeRef}>0:00</p>
              <p ref={totalTimeRef}>0:00</p>
            </div>
          </div>
          <div className="waveform">
            <div ref={waveformRef}></div>
          </div>
          <div className="volume-container">
            <input
              type="range"
              ref={volumeBarRef}
              defaultValue={100}
              min="0"
              max="100"
              onChange={handleVolumeChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueBar;
