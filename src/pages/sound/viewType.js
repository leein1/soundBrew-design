// src/pages/sound/ViewType.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ViewType = ({ mode, onChange }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleToggle = () => {
        const newMode = mode === "albums" ? "tracks" : "albums";
        const params = new URLSearchParams(location.search);
        params.delete("page");

        onChange(newMode); // 부모 상태도 업데이트
        navigate(`/sounds/${newMode}?${params.toString()}`);
    };

    const isAlbumView = mode === "albums";
    const toggleText = isAlbumView ? "음원 목록으로 보기" : "앨범 목록으로 보기";
    const iconSrc = isAlbumView
        ? "/images/list_24dp_1F1F1F_FILL0_wght400_GRAD0_opsz24.svg"
        : "/images/library_music_24dp_FILL0_wght400_GRAD0_opsz24.svg"; // 예시

    return (
        <div className="view-type">
            <span id="viewToggleBtn" className="viewToggleBtn" onClick={handleToggle}>
                <img src={iconSrc} alt="보기 전환 아이콘" />
                <span id="toggleText">{toggleText}</span>
            </span>
        </div>
    );
};

export default ViewType;
