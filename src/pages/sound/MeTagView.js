// src/components/MeTagView.jsx
import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { axiosGet, axiosPatch, axiosPost } from "../../api/standardAxios";
import { formatDate } from "../../utils/date/formatDate";
import SortableHeaderCell from "../../components/SortableHeaderCell";
import { inputHandler } from "../../utils/check/inputHandler";
import { useCSSLoader } from "../../hooks/useCSSLoader";

import Pagination from "../../components/Pagination";

const MeTagView = () => {
  const cssFiles = useMemo(() => [
    "/assets/css/sound/manage-tags.css",
    "/assets/css/sound/music.css",
    "/assets/css/sound/admin-main.css",
    "/assets/css/user/user-admin.css",
  ], []);

  useCSSLoader(cssFiles);

  const [tracks, setTracks] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [responseData, setResponseData] = useState(null);
  const location = useLocation();

  // 태그 관련 상태 관리
  const [allTags, setAllTags] = useState([]);
  const [activeCategory, setActiveCategory] = useState("instrument");
  // 수정 요청에 포함할 태그는 새로 선택한 태그만 저장 (초기에는 빈 배열)
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagSearch, setTagSearch] = useState("");
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  
  // 현재 태그 모달을 연 트랙의 ID (수정 대상)
  const [currentTrackId, setCurrentTrackId] = useState(null);

  // 태그 모달 열기: 기존 태그는 UI에서 보여주기 위해 따로 처리하더라도,
  // 요청에는 새로 선택한 태그만 포함하도록 selectedTags는 초기화(빈 배열)함.
  const openTagModal = async (trackId, currentTags) => {
    setCurrentTrackId(trackId);
    // 요청에 포함할 태그는 새로 선택한 태그만 사용하기 위해 초기화함.
    setSelectedTags([]);
    setIsTagModalOpen(true);
    try {
      const response = await axiosGet({ endpoint: '/api/sounds/tags' });
      const { dtoList } = response;
      // dtoList[0]의 각 배열이 태그 목록으로 들어있다고 가정
      const tags = [
        ...dtoList[0].instrument.map((tag) => ({ tag, type: "instrument" })),
        ...dtoList[0].mood.map((tag) => ({ tag, type: "mood" })),
        ...dtoList[0].genre.map((tag) => ({ tag, type: "genre" }))
      ].filter((item) => item.tag);
      setAllTags(tags);
    } catch (error) {
      console.error("태그 데이터를 가져오는 중 오류 발생:", error);
    }
  };
  
  const closeTagModal = () => {
    setIsTagModalOpen(false);
    setCurrentTrackId(null);
    setSelectedTags([]);
  };

  const resetTags = () => {
    setSelectedTags([]);
  };

  // 현재 activeCategory와 tagSearch에 따라 필터링
  const filterTags = () => {
    const searchQuery = tagSearch.toLowerCase();
    return allTags.filter(({ tag, type }) => type === activeCategory && tag.toLowerCase().includes(searchQuery));
  };

  // 태그 선택: 중복 체크 후 추가 (이미 선택된 태그가 없다면 추가)
  const selectTag = (tag, type) => {
    if (!selectedTags.find((tagObj) => tagObj.tag === tag && tagObj.type === type)) {
      setSelectedTags((prev) => [...prev, { tag, type }]);
    }
  };

  // 트랙 데이터 로드
  useEffect(() => {
    const fetchTracks = async () => {
      const params = new URLSearchParams(location.search);
      const response = await axiosGet({ endpoint: `/api/me/tracks?${params.toString()}` });
      if (response && response.dtoList) {
        setResponseData(response);
      } else {
        setResponseData({ dtoList: [] });
      }
      setTracks(response.dtoList || []);
    };
    fetchTracks();
  }, [location.search]);

  // 태그 수정 적용: 선택한 태그들을 서버에 전송 (오직 새로 선택한 태그만)
  const handleApplyTags = async () => {
    // 검증: 각 카테고리별 최소 1개 선택 확인
    const hasInstrument = selectedTags.some((tagObj) => tagObj.type === "instrument");
    const hasMood = selectedTags.some((tagObj) => tagObj.type === "mood");
    const hasGenre = selectedTags.some((tagObj) => tagObj.type === "genre");

    if (!hasInstrument) {
      alert("태그를 하나 이상 선택해야 합니다: 악기를 선택해주세요.");
      return;
    }
    if (!hasMood) {
      alert("태그를 하나 이상 선택해야 합니다: 무드를 선택해주세요.");
      return;
    }
    if (!hasGenre) {
      alert("태그를 하나 이상 선택해야 합니다: 장르를 선택해주세요.");
      return;
    }

    // 태그 데이터를 API 전송 형식으로 구성 (선택한 태그만 사용)
    const tagsDTO = {
      instrument: selectedTags.filter((t) => t.type === "instrument").map((t) => t.tag),
      mood: selectedTags.filter((t) => t.type === "mood").map((t) => t.tag),
      genre: selectedTags.filter((t) => t.type === "genre").map((t) => t.tag),
    };

    // 만약 추가 검증이 필요하다면 inputHandler 사용 가능
    const { errors, processedData } = inputHandler(tagsDTO, tagsDTO);
    // if (errors) { alert("입력값 오류: " + JSON.stringify(errors)); return; }

    // handle 옵션: 성공 시 페이지 이동 등 (여기서는 예시로 작성)
    const handle = {
      success: { navigate: "/me/sounds/tracks" },
    };

    if (!errors) {
      await axiosPost({ endpoint: `/api/me/tracks/${currentTrackId}/tags`, body: processedData, handle });
      closeTagModal();
    }
  };

  return (
    <div>
      <h3>음원 태그 수정</h3>
      <div id="render-update" className="render-update"></div>
      <div id="chart-selector-container"></div>

      {searchKeyword && (
        <p>
          검색어: <strong>{searchKeyword}</strong>
        </p>
      )}

      {tracks.length > 0 ? (
        <div className="table-wrapper">
          <table className="table-container">
            <thead>
              <tr>
                <SortableHeaderCell headerText="ID" sortKey="musicId" />
                <th>아티스트</th>
                <th>음원 제목</th>
                <th>악기 태그</th>
                <th>무드 태그</th>
                <th>장르 태그</th>
                <SortableHeaderCell headerText="업로드일" sortKey="createDate" />
                <th>수정일</th>
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
              {tracks.map((item) => (
                <tr key={item.musicDTO.musicId}>
                  <td>{item.musicDTO.musicId}</td>
                  <td>{item.albumDTO.nickname}</td>
                  <td>{item.musicDTO.title}</td>
                  <td>
                    <span className="current-value">
                      {item.tagsStreamDTO?.instrumentTagName || "-"}
                    </span>
                  </td>
                  <td>
                    <span className="current-value">
                      {item.tagsStreamDTO?.moodTagName || "-"}
                    </span>
                  </td>
                  <td>
                    <span className="current-value">
                      {item.tagsStreamDTO?.genreTagName || "-"}
                    </span>
                  </td>
                  <td>{formatDate(item.musicDTO.createDate)}</td>
                  <td>{formatDate(item.musicDTO.modifyDate)}</td>
                  <td>
                    <button
                      type="button"
                      className="open-tag-modal"
                      onClick={() =>
                        openTagModal(
                          item.musicDTO.musicId,
                          [
                            { tag: item.tagsStreamDTO?.instrumentTagName, type: "instrument" },
                            { tag: item.tagsStreamDTO?.moodTagName, type: "mood" },
                            { tag: item.tagsStreamDTO?.genreTagName, type: "genre" },
                          ].filter((tagObj) => tagObj.tag)
                        )
                      }
                    >
                      태그찾기
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>트랙이 없습니다.</p>
      )}

      {isTagModalOpen && (
        <div className="modal-cover">
          <div id="tag-modal" className="modal">
            <div className="modal-content">
              <h2>태그 선택</h2>
              {/* 탭 영역 */}
              <div className="tag-tabs">
                <button
                  type="button"
                  className={activeCategory === "instrument" ? "tab-button active" : "tab-button"}
                  onClick={() => setActiveCategory("instrument")}
                >
                  악기
                </button>
                <button
                  type="button"
                  className={activeCategory === "mood" ? "tab-button active" : "tab-button"}
                  onClick={() => setActiveCategory("mood")}
                >
                  무드
                </button>
                <button
                  type="button"
                  className={activeCategory === "genre" ? "tab-button active" : "tab-button"}
                  onClick={() => setActiveCategory("genre")}
                >
                  장르
                </button>
              </div>
              {/* 검색 및 태그 목록 영역 */}
              <input
                type="text"
                id="tag-search"
                placeholder="태그 검색"
                value={tagSearch}
                onChange={(e) => setTagSearch(e.target.value)}
              />
              <ul id="tag-list">
                {filterTags().map((item, idx) => (
                  <li key={idx} onClick={() => selectTag(item.tag, item.type)}>
                    {item.tag}
                  </li>
                ))}
              </ul>
              {/* 선택한 태그들을 보여주는 영역 */}
              <section className="upload-section">
                <div id="song-info-list">
                  {selectedTags.length > 0 ? (
                    <ul>
                      {selectedTags.map((tagObj, idx) => (
                        <li key={idx}>
                          <strong>{tagObj.type}:</strong> {tagObj.tag}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>아직 태그를 선택하지 않았습니다.</p>
                  )}
                </div>
              </section>
              <button type="button" className="close-modal" onClick={closeTagModal}>
                닫기
              </button>
              <button type="button" className="reset-tags-modal" onClick={resetTags}>
                태그 초기화
              </button>
              <button type="button" className="apply-tags" onClick={handleApplyTags}>
                수정 확정
              </button>
            </div>
          </div>
        </div>
      )}

      <Pagination responseDTO={responseData}/>
    </div>
  );
};

export default MeTagView;
