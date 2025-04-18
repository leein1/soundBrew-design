import React, { useState } from "react";
import icons from "assets/images/imageBarrel";

const ViewSort = ({ sortStyle, onChange }) => {
  const [open, setOpen] = useState(false);

  const handleSortView = () => {
    setOpen(!open); // 토글 열기/닫기
  };

  const handleSelect = (sortValue) => {
    onChange(sortValue); // 외부 콜백 호출
    setOpen(false); // 드롭다운 닫기
  };

  return (
    <div className="sort-01">
      <span className="music-sort" id="sortKeyword" onClick={handleSortView}>
        <img src={icons.changeSection} alt="정렬" id="sortIcon" /> 정렬
      </span>

      {open && (
        <div className="music-sort-menu" id="musicSortMenu" style={{ display: open ? "block" : "none" }}>
          <ul>
            <li className={sortStyle === "newest" ? "active" : ""} onClick={() => handleSelect("newest")} >Newest</li>
            <li className={sortStyle === "oldest" ? "active" : ""} onClick={() => handleSelect("oldest")}>Oldest</li>
            <li className={sortStyle === "download" ? "active" : ""} onClick={() => handleSelect("download")}>Download</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ViewSort;
