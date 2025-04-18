import React, { useEffect, useMemo, useState } from "react";
import { axiosGet, axiosPatch } from "api/standardAxios"; // 적절한 경로로 조정하세요
import { useCSSLoader } from "hooks/useCSSLoader";
import { inputHandler } from "utils/check/inputHandler";
import NewTag from "components/sound/NewTag";

const TagSpelling = () => {
  const cssFiles = useMemo(() => [
    "/assets/css/sound/music.css",
    "/assets/css/sound/admin-main.css",
    "/assets/css/user/user-admin.css",
  ], []);

  useCSSLoader(cssFiles);

  const [tagsData, setTagsData] = useState([]);
  const [editStates, setEditStates] = useState({}); // 각 태그의 수정 상태 관리
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axiosGet({ endpoint: `/api/sounds/tags` });
        // instrument, mood, genre 구조의 데이터 받아오기
        setTagsData(response.dtoList[0]);
      } catch (error) {
        console.error("태그 데이터를 불러오는 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  const handleEdit = (category, tag) => {
    setEditStates((prev) => ({
      ...prev,
      [`${category}-${tag}`]: { editing: true, newValue: tag },
    }));
  };

  const handleChange = (category, tag, value) => {
    setEditStates((prev) => ({
      ...prev,
      [`${category}-${tag}`]: {
        ...prev[`${category}-${tag}`],
        newValue: value,
      },
    }));
  };

  const handleApply = async (category, tag) => {
    const key = `${category}-${tag}`;
    const newValue = editStates[key]?.newValue;
    const spelling = { [category]: [newValue] };
    const { errors, processedData } = inputHandler(spelling, null);

    if (!errors) {
      try {
        await axiosPatch({ endpoint: `/api/admin/tags/instruments/${tag}`, body: processedData });
        // 적용 후 상태 초기화
        setEditStates((prev) => ({
          ...prev,
          [key]: { editing: false, newValue },
        }));
      } catch (error) {
        console.error("태그 수정 실패:", error);
      }
    } else {
      alert("wrong!");
    }
  };

  const handleCancel = (category, tag) => {
    setEditStates((prev) => ({
      ...prev,
      [`${category}-${tag}`]: { editing: false, newValue: tag },
    }));
  };

  const renderRows = (category, tags) =>
    tags.map((tag) => {
      const key = `${category}-${tag}`;
      const editState = editStates[key] || { editing: false, newValue: tag };

      return (
        <tr key={key}>
          <td>{tag}</td>
          <td>{category}</td>
          <td>
            {!editState.editing ? (
              <span>{editState.newValue}</span>
            ) : (
              <input
                type="text"
                value={editState.newValue}
                onChange={(e) => handleChange(category, tag, e.target.value)}
              />
            )}
          </td>
          <td>
            {!editState.editing ? (
              <button className="edit-button" onClick={() => handleEdit(category, tag)}>
                수정하기
              </button>
            ) : (
              <>
                <button className="apply-button" onClick={() => handleApply(category, tag)}>
                  적용
                </button>
                <button className="cancel-button" onClick={() => handleCancel(category, tag)}>
                  취소
                </button>
              </>
            )}
          </td>
        </tr>
      );
    });

  const handleNewTagClick = () => {
    // 신규 태그 추가 모달 오픈
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    // 필요에 따라 신규 태그 추가 후 목록 갱신 작업을 진행
  };

  if (loading) return <p>로딩 중...</p>;
  if (!tagsData) return <p>태그 데이터를 찾을 수 없습니다.</p>;

  const categories = [
    { category: "instrument", tags: tagsData.instrument || [] },
    { category: "mood", tags: tagsData.mood || [] },
    { category: "genre", tags: tagsData.genre || [] },
  ];

  return (
    <div>
      <div className="new-tag-registration" style={{ margin: "1em 0" }}>
        <button className="edit-button" onClick={handleNewTagClick}>
          신규 태그 등록
        </button>
      </div>

      <h3>태그 정보 수정</h3>

      <div className="table-wrapper">
        <table className="table-container">
          <thead>
            <tr>
              <th>원본 태그명</th>
              <th>분류</th>
              <th>수정 후 태그명</th>
              <th>작업</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((categoryObj) => renderRows(categoryObj.category, categoryObj.tags))}
          </tbody>
        </table>
      </div>

      {/* 신규 태그 추가 모달 */}
      <NewTag isVisible={showAddModal} onClose={handleCloseModal} onTagAdded={() => {}} />
    </div>
  );
};

export default TagSpelling;
