// src/components/SortableHeaderCell.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const getSortIcon = (sortOrder) => (sortOrder === "asc" ? "▲" : "▼");

const SortableHeaderCell = ({ headerText, sortKey }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 현재 URL의 검색 파라미터에서 정렬 순서를 가져옴
  const searchParams = new URLSearchParams(location.search);
  const currentOrder = searchParams.get(`more[${sortKey}]`);

  // 헤더 클릭 시 정렬 순서를 토글하여 URL에 반영
  const handleClick = () => {
    let newOrder = currentOrder === "asc" ? "desc" : "asc";
    searchParams.set(`more[${sortKey}]`, newOrder);
    // 새 URL 생성 후 이동
    const newUrl = `${location.pathname}?${searchParams.toString()}`;
    navigate(newUrl);
  };

  return (
    <th
      style={{ cursor: "pointer" }}
      onClick={handleClick}
      data-direction={currentOrder || ""}
      data-original-text={headerText}
    >
      {headerText} {currentOrder ? getSortIcon(currentOrder) : ""}
    </th>
  );
};

export default SortableHeaderCell;
