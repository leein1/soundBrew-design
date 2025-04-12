// src/components/Search.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import icons from "../assets/images/imageBarrel";

// 뮤직 업로드 때문에 css가 꼬인다. 즉 어떻게든 컴포넌트에 해당하는 css만 불러오는것을 적용해야한다.

const Search = ({ type, keyword, onTypeChange, onKeywordChange, onSearch }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [localKeyword, setLocalKeyword] = useState(keyword || "");
  const [localType, setLocalType] = useState(type || "t");

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
  }, [location.search]);

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
              <img
                src={icons.searchIcon}
                alt="Search Icon"
              />
            </span>
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
