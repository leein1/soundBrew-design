// src/pages/sound/QueBar.jsx
import React, { useState, useRef, useEffect } from "react";
import WaveSurfer from "https://cdn.jsdelivr.net/npm/wavesurfer.js@7/dist/wavesurfer.esm.js";
import icons from "../../assets/images/imageBarrel";

const QueBar = ({ playSound }) => {
  const waveformRef = useRef(null);
  const playPauseRef = useRef(null);
  const progressBarRef = useRef(null);
  const currentTimeRef = useRef(null);
  const totalTimeRef = useRef(null);
  const volumeBarRef = useRef(null);
  console.log(playSound);

  const [wavesurfer, setWavesurfer] = useState(null);
  const [loadedSoundId, setLoadedSoundId] = useState("");

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" + secs : secs}`;
  };

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

    ws.on("audioprocess", () => {
      const currentTime = ws.getCurrentTime();
      const duration = ws.getDuration();
      if (currentTimeRef.current) currentTimeRef.current.textContent = formatTime(currentTime);
      if (progressBarRef.current) {
        progressBarRef.current.value = Math.floor(currentTime);
        const percentage = (currentTime / duration) * 100;
        progressBarRef.current.style.background = `linear-gradient(to right, #005da0 ${percentage}%, #ddd ${percentage}%)`;
      }
    });

    ws.on("ready", () => {
      ws.play();
      if (playPauseRef.current) {
        playPauseRef.current.src = icons.pauseIcon;
      }
      const duration = ws.getDuration();
      if (totalTimeRef.current) totalTimeRef.current.textContent = formatTime(duration);
      if (progressBarRef.current) progressBarRef.current.max = Math.floor(duration);
    });

    return () => ws.destroy();
  }, []);

  const handlePlaySound = (soundId) => {
    if (!wavesurfer) return;
    if (loadedSoundId !== soundId) {
      setLoadedSoundId(soundId);
      wavesurfer.load(`/api/stream/${soundId}`);
    }
  };

  playSound.current = handlePlaySound;

  return (
    <div className="audio-player-bar">
      <div className="player-container">
        <div className="player-top-layer">
          <input
            type="range"
            ref={progressBarRef}
            defaultValue={0}
            min="0"
            max="100"
          />
        </div>
        <div className="player-bottom-layer">
          <div className="player-item-left">
            <img alt="앨범 이미지" className="player-album-img" src={icons.defaultSoundImg} />
            <div className="player-play-btn">
              <img ref={playPauseRef} src={icons.playIcon} alt="재생" />
            </div>
            <div className="player-info">
              <h3>제목</h3>
              <p>앨범</p>
            </div>
            <div className="player-info-time">
              <p ref={currentTimeRef}>0:00</p>
              <p ref={totalTimeRef}>0:00</p>
            </div>
          </div>
          <div ref={waveformRef}></div>
          <div className="volume-container">
            <input type="range" ref={volumeBarRef} defaultValue={100} min="0" max="100" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueBar;
