// src/pages/sound/ViewType.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

import icons from "assets/images/imageBarrel";

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
        ? icons.listIcon
        : icons.listIcon; // 예시

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
