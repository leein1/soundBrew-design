// SoundUpload.jsx
import React, { useState, useRef, useEffect } from "react";
import { axiosGet, axiosPost } from "../../api/standardAxios"; // 기존 API 함수 import
import { serializeFormToJSON } from "../../utils/serialize/formToJson";
import { inputHandler } from "../../utils/check/inputHandler";

import "../../assets/css/sound/music-upload.css";
import "../../assets/css/sound/manage-tags.css";

const SoundUpload = () => {
  // 파일 업로드 결과 (서버로부터 받은 경로)
  const [uploadImage, setUploadImage] = useState("");
  const [uploadTrack, setUploadTrack] = useState("");

  // 태그 관련 상태 관리
  const [allTags, setAllTags] = useState([]);
  const [activeCategory, setActiveCategory] = useState("instrument");
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagSearch, setTagSearch] = useState("");
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);

  // Ref를 사용해 form에 접근
  const imageFormRef = useRef(null);
  const trackFormRef = useRef(null);
  const metaFormRef = useRef(null);

  // ---------------------------
  // 태그 모달 관련 핸들러
  // ---------------------------
  const openTagModal = async () => {
    setIsTagModalOpen(true);
    try {
      const response = await axiosGet({endpoint:'/api/sounds/tags'});
      console.log(response);
      const { dtoList } = response;
      const tags = [
        ...dtoList[0].instrument.map(tag => ({ tag, type: 'instrument' })),
        ...dtoList[0].mood.map(tag => ({ tag, type: 'mood' })),
        ...dtoList[0].genre.map(tag => ({ tag, type: 'genre' }))
      ].filter(item => item.tag);
      setAllTags(tags);
    } catch (error) {
      console.error("태그 데이터를 가져오는 중 오류 발생:", error);
    }
  };

  const closeTagModal = () => {
    setIsTagModalOpen(false);
  };

  const resetTags = () => {
    setSelectedTags([]);
  };

  // 현재 activeCategory와 tagSearch에 따라 태그 필터링
  const filterTags = () => {
    const searchQuery = tagSearch.toLowerCase();
    return allTags.filter(({ tag, type }) => {
      return type === activeCategory && tag.toLowerCase().includes(searchQuery);
    });
  };

  const selectTag = (tag, type) => {
    // 중복 확인 후 추가
    if (!selectedTags.includes(tag)) {
      setSelectedTags(prev => [...prev, { tag, type }]);
    }
  };

  // ---------------------------
  // 이미지 업로드 처리
  // ---------------------------
  const onImageUpload = async (e) => {
    e.preventDefault();
    const form = imageFormRef.current;
    const fileInput = form.querySelector('input[type="file"]');
    const files = fileInput.files;
    if (!files || files.length === 0) {
      alert("이미지를 업로드해주세요.");
      return;
    }
    if (files.length > 1) {
      alert("이미지는 한 번에 하나만 업로드할 수 있습니다.");
      return;
    }
    const file = files[0];
    const maxFileSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxFileSize) {
      alert("이미지 크기는 2MB를 초과할 수 없습니다.");
      return;
    }
    const allowedExtensions = ["jpg", "jpeg", "png"];
    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      alert(`허용된 파일 형식은 ${allowedExtensions.join(", ")}입니다.`);
      return;
    }
    // 파일 이름을 제목에 자동 입력 (readonly 필드)
    const titleInput = form.querySelector('input[name="title"]');
    titleInput.value = file.name;
    const formData = new FormData(form);
    // API 호출
    const result = await axiosPost({ endpoint: "/api/files/albums", body: formData });
    console.log(result+"!!!!!");
    setUploadImage(result);
  };

  // ---------------------------
  // 음원 파일 업로드 처리
  // ---------------------------
  const onTrackUpload = async (e) => {
    e.preventDefault();
    const form = trackFormRef.current;
    const fileInput = form.querySelector('input[type="file"]');
    const files = fileInput.files;
    if (!files || files.length === 0) {
      alert("파일을 업로드해주세요.");
      return;
    }
    if (files.length > 1) {
      alert("파일은 한 번에 하나만 업로드할 수 있습니다.");
      return;
    }
    const file = files[0];
    const maxFileSize = 20 * 1024 * 1024; // 20MB
    if (file.size > maxFileSize) {
      alert("파일 크기는 20MB를 초과할 수 없습니다.");
      return;
    }
    const allowedExtensions = ["mp3", "wav"];
    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      alert(`허용된 파일 형식은 ${allowedExtensions.join(", ")}입니다.`);
      return;
    }
    // 파일 이름 자동 입력
    const titleInput = form.querySelector('input[name="title"]');
    titleInput.value = file.name;
    const formData = new FormData(form);
    // API 호출
    const result = await axiosPost({ endpoint: "/api/files/tracks", body: formData });
    setUploadTrack(result);
  };

  // ---------------------------
  // 최종 메타 데이터 제출 처리
  // ---------------------------
  const onMetaFormSubmit = async (e) => {
    e.preventDefault();
    const form = metaFormRef.current;
  
    // 태그 검증: 각 카테고리별 최소 1개 이상 선택되었는지 확인
    const hasInstrumentTag = selectedTags.some(tagObj => tagObj.type === "instrument");
    const hasMoodTag = selectedTags.some(tagObj => tagObj.type === "mood");
    const hasGenreTag = selectedTags.some(tagObj => tagObj.type === "genre");
    if (!hasInstrumentTag) {
      alert("태그를 하나 이상 선택해야 합니다: 악기를 선택해주세요.");
      return;
    }
    if (!hasMoodTag) {
      alert("태그를 하나 이상 선택해야 합니다: 무드를 선택해주세요.");
      return;
    }
    if (!hasGenreTag) {
      alert("태그를 하나 이상 선택해야 합니다: 장르를 선택해주세요.");
      return;
    }
  
    // 업로드된 이미지와 음원 파일 경로를 폼의 hidden input에 세팅
    form.querySelector('input[name="albumDTO.albumArtPath"]').value = uploadImage;
    form.querySelector('input[name="musicDTO.filePath"]').value = uploadTrack;
  
    // 폼 데이터를 JSON으로 직렬화
    const jsonData = serializeFormToJSON(form);
  
    // 선택한 태그들을 카테고리별로 분류하여 tagsDTO 객체 생성
    const tagsDTO = {
      instrument: selectedTags
                    .filter(tagObj => tagObj.type === "instrument")
                    .map(tagObj => tagObj.tag),
      mood: selectedTags
                    .filter(tagObj => tagObj.type === "mood")
                    .map(tagObj => tagObj.tag),
      genre: selectedTags
                    .filter(tagObj => tagObj.type === "genre")
                    .map(tagObj => tagObj.tag),
    };
  
    // JSON 데이터에 tagsDTO 병합: 기존 폼 데이터와 태그 데이터를 함께 전송
    const finalData = {
      ...jsonData,
      tagsDTO,
    };
  
    // 입력값 검증 및 최종 데이터 처리
    const { errors, processedData } = inputHandler(finalData, form);
    console.log(finalData);
  
    // 서버 응답 처리 옵션 (성공 시 페이지 이동)
    const handle = {
      success: { navigate: "/sounds/tracks" },
    };
  
    if (!errors) {
      await axiosPost({ endpoint: '/api/me/sounds', body: processedData, handle });
    }
  };
  

  // ---------------------------
  // JSX 렌더링
  // ---------------------------
  return (
    <div className="sound-upload-container">
      {/* 앨범 이미지 업로드 폼 */}
      <form ref={imageFormRef} className="myImage" onSubmit={onImageUpload}>
      <h1 style={{marginBottom:20,marginTop:30}}>음악 업로드 페이지</h1>
        <section className="upload-section">
          <h2>앨범 이미지를 선택해주세요.</h2>
          <input type="file" id="file-upload-image" name="file" accept=".jpg,.jpeg,.png" />
          <input type="text" id="title-image" name="title" placeholder="제목 (자동 입력됨)" readOnly hidden />
          <button type="submit" className="upload">이미지 업로드</button>
        </section>
      </form>

      {/* 음원 파일 업로드 폼 */}
      <form ref={trackFormRef} className="myTrack" onSubmit={onTrackUpload}>
        <section className="upload-section">
          <h2>음원 파일을 선택해주세요.</h2>
          <input type="file" id="file-upload-track" name="file" accept=".mp3,.wav" />
          <input type="text" id="title-track" name="title" placeholder="제목 (자동 입력됨)" readOnly hidden />
          <button type="submit" className="upload">음원 업로드</button>
        </section>
      </form>

      {/* 메타 정보 입력 폼 */}
      <form ref={metaFormRef} className="myForm" onSubmit={onMetaFormSubmit}>
        {/* 싱글/앨범 선택 */}
        <section className="upload-section">
          <h2>싱글인지 앨범인지 선택해주세요.</h2>
          <div className="select-div">
            <select id="group-type" name="groupType">
              <option value="single">싱글</option>
              {/* <option value="album">앨범</option> */}
            </select>
          </div>
        </section>

        {/* 앨범 정보 입력 */}
        <section className="upload-section">
          <h2>앨범의 이름을 정해주세요.</h2>
          <input type="text" id="group-name" name="albumDTO.albumName" placeholder="그룹 이름" />
          <input type="text" id="group-image" name="albumDTO.albumArtPath" readOnly hidden />
          <h2>앨범 설명을 작성해주세요.</h2>
          <textarea id="group-description" name="albumDTO.description" placeholder="앨범 설명"></textarea>
        </section>

        {/* 곡 정보 입력 */}
        <section className="upload-section">
          <h2>곡 제목을 입력해주세요.</h2>
          <input type="text" id="song-title" name="musicDTO.title" placeholder="곡 제목" />
          <input type="text" id="file-upload-track-path" name="musicDTO.filePath" readOnly hidden />
          <h2>곡 설명을 작성해주세요.</h2>
          <textarea id="song-description" name="musicDTO.description" placeholder="곡 설명"></textarea>
        </section>

        {/* 태그 선택 영역 */}
        <section className="upload-section">
          <h2>곡에 적절한 태그를 선택해주세요.</h2>
          <button type="button" className="open-modal" onClick={openTagModal}>태그 찾기</button>
          <ul id="selected-tags">
            {selectedTags.map((item, idx) => (
              <li key={idx}>{item.tag}</li>
            ))}
          </ul>
          <button type="button" className="reset-tags-main" onClick={resetTags}>태그 초기화</button>
        </section>

        {/* 최종 확인 및 제출 영역 */}
        <section className="upload-section">
          <h2>최종적으로 작성한 정보를 확인해주세요.</h2>
          <div id="song-info-list">
            {/* 작성된 정보 확인 UI 작성 - 필요시 추가 */}
          </div>
          <button type="submit" className="upload">업로드</button>
        </section>
      </form>

      {/* 태그 선택 모달 */}
      {isTagModalOpen && (
        <div className="modal-cover">
          <div id="tag-modal" className="modal">
            <div className="modal-content">
              <h2>태그 선택</h2>
              {/* 탭 영역 */}
              <div className="tag-tabs">
                <button type="button" className={activeCategory === "instrument" ? "tab-button active" : "tab-button"}
                  onClick={() => setActiveCategory("instrument")}>
                  악기
                </button>
                <button type="button" className={activeCategory === "mood" ? "tab-button active" : "tab-button"}
                  onClick={() => setActiveCategory("mood")}>
                  무드
                </button>
                <button type="button" className={activeCategory === "genre" ? "tab-button active" : "tab-button"}
                  onClick={() => setActiveCategory("genre")}>
                  장르
                </button>
              </div>
              {/* 검색 및 목록 영역 */}
              <input type="text" id="tag-search" placeholder="태그 검색"
                value={tagSearch} onChange={(e) => setTagSearch(e.target.value)}/>
              <ul id="tag-list">
                {filterTags().map((item, idx) => (
                  <li key={idx} onClick={() => selectTag(item.tag, item.type)}>{item.tag}</li>
                ))}
              </ul>
              <button type="button" className="close-modal" onClick={closeTagModal}>닫기</button>
              <button type="button" className="reset-tags-modal" onClick={resetTags}>태그 초기화</button>
              <button type="button" className="apply-tags" onClick={closeTagModal}>수정 확정</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SoundUpload;
