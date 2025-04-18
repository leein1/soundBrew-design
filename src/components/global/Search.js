// src/components/Search.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import icons from "assets/images/imageBarrel";

const Search = ({ type, keyword, onTypeChange, onKeywordChange, onSearch }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [localKeyword, setLocalKeyword] = useState(keyword || "");
  const [localType, setLocalType] = useState(type || "t");

  // 현재 경로가 /admin/user 인지 확인
  const isAdminUserPath = location.pathname.startsWith("/admin/user");

  // URL에서 파라미터 읽어오기
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const keywordParam = urlParams.get("keyword");
    const typeParam = urlParams.get("type");

    if (keywordParam) {
      setLocalKeyword(keywordParam);
      onKeywordChange(keywordParam);
    }
    if (typeParam) {
      setLocalType(typeParam);
      onTypeChange(typeParam);
    }
  }, [location.search, onKeywordChange, onTypeChange]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (!localKeyword.trim()) {
        alert("검색어를 입력해주세요.");
        return;
      }

      // URL 변경
      const newParams = new URLSearchParams(location.search);
      newParams.set("keyword", localKeyword);
      newParams.set("type", localType);

      navigate(`${location.pathname}?${newParams.toString()}`);

      // 검색 실행 콜백
      onSearch();
    }
  };

  return (
    <div className="search-sort">
      <div className="searchbar">
        <div className="searchbar-container">
          <div className="search-area">
            <span className="searchbar-icon">
              <img src={icons.searchIcon} alt="Search Icon" />
            </span>
            {isAdminUserPath ? (
              // /admin/user 경로일 경우 닉네임("n")만 사용하도록 고정
              <span className="searchType">닉네임</span>
            ) : (
              <select
                value={localType}
                onChange={(e) => {
                  setLocalType(e.target.value);
                  onTypeChange(e.target.value);
                }}
                className="searchType"
              >
                <option value="t">타이틀</option>
                <option value="n">닉네임</option>
              </select>
            )}
          </div>
          <input
            type="text"
            placeholder="검색..."
            value={localKeyword}
            onChange={(e) => {
              setLocalKeyword(e.target.value);
              onKeywordChange(e.target.value);
            }}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
    </div>
  );
};

export default Search;
