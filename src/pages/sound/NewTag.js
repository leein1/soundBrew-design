import React, { useState } from "react";
import { axiosPost } from "../../api/standardAxios"; // 경로 필요시 조정하세요
import { inputHandler } from "../../utils/check/inputHandler";

const NewTag = ({ isVisible, onClose, onTagAdded }) => {
  const [tagName, setTagName] = useState("");
  const [tagType, setTagType] = useState("instrument");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedTagName = tagName.trim();
    if (!trimmedTagName) {
      alert("태그명을 입력해주세요.");
      return;
    }

    // 기본 TagsDTO 구조
    const tagsDto = {
      instrument: [],
      mood: [],
      genre: [],
    };

    // 데이터 검증 및 변환
    const jsonData = { tagName: trimmedTagName, tagType };
    const { errors, processedData } = inputHandler(jsonData, null);

    if (errors) {
      alert("태그 생성에 문제가 있습니다.");
      return;
    }

    if (tagsDto.hasOwnProperty(tagType)) {
      tagsDto[tagType].push(processedData.tagName);
    } else {
      alert(`잘못된 태그 타입: ${tagType}`);
      return;
    }

    // 예시용 axiosPost 요청 (handle은 상황에 맞게 변경)
    const handle = {
      success: { navigate: "/admin/tags" },
    };

    try {
      await axiosPost({ endpoint: `/api/admin/tags`, body: tagsDto, handle });
      alert("태그를 정상적으로 생성했습니다.");
      if (onTagAdded) onTagAdded();
      onClose();
    } catch (error) {
      console.error("태그 생성 실패:", error);
      alert("태그를 생성하지 못했습니다.");
    }
  };

  if (!isVisible) return null;

  return (
    <div className="detailModal">
      <div className="detail-modal-content">
        <span
          className="close"
          style={{ cursor: "pointer", float: "right" }}
          onClick={onClose}
        >
          ×
        </span>
        <h2>태그 추가</h2>
        <div id="sound-detail-modal-body" className="sound-detail-modal-body">
          <form id="tag-form" onSubmit={handleSubmit}>
            <section className="tag-add-section">
              <div id="tag-create-container">
                <input
                  type="text"
                  id="new-tag-name"
                  name="tagName"
                  placeholder="새 태그명 입력"
                  value={tagName}
                  onChange={(e) => setTagName(e.target.value)}
                />
                <select
                  id="new-tag-type"
                  name="tagType"
                  value={tagType}
                  onChange={(e) => setTagType(e.target.value)}
                >
                  <option value="instrument">Instrument</option>
                  <option value="mood">Mood</option>
                  <option value="genre">Genre</option>
                </select>
                <button type="submit">태그 추가</button>
              </div>
            </section>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewTag;
