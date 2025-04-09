// src/pages/sound/MeAlbumView.jsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { axiosGet, axiosPatch } from "../../api/standardAxios";
import { inputHandler } from "../../utils/check/inputHandler";
import { formatDate } from "../../utils/date/formatDate";
import { useEditableItem } from "../../hooks/useEditableItem";
import InlineEditor from "../../components/InlineEditor";
import SortableHeaderCell from "../../components/SortableHeaderCell";

import "../../assets/css/sound/admin-main.css";
import "../../assets/css/user/user-admin.css";

const MeAlbumView = () => {
  const [albums, setAlbums] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const location = useLocation();

  // 에디팅에 사용되는 공통 훅 (여기서 form 만들어 줌)
  const {
    editModeId,
    editedData,
    isEditing,
    startEdit,
    cancelEdit,
    handleChange,
  } = useEditableItem();

  // 앨범 데이터 및 검색어 로드
  useEffect(() => {
    const fetchAlbums = async () => {
      const params = new URLSearchParams(location.search);
      
      const response = await axiosGet({endpoint: `/api/me/albums?${params.toString()}`});
  
      setAlbums(response.dtoList || []);
    };
  
    fetchAlbums();
  }, [location]);
  

  // 적용 버튼 클릭 시: 입력값 검증 후 PATCH API 호출
  const handleApply = async () => {
    const { errors, processedData } = inputHandler(editedData, editedData);
    if (errors) {
      alert("입력값 오류: " + JSON.stringify(errors));
      return;
    }
    try {
      await axiosPatch({ endpoint: `/api/me/albums/${editModeId}`, body: processedData,});
      cancelEdit();
    } catch (err) {
      console.error(err);
      alert("수정 실패");
    }
  };

  return (
    <div>
      <h3>앨범 정보 수정</h3>
      <div id="render-update" className="render-update"></div>
      <div id="chart-selector-container"></div>

      {searchKeyword && (
        <p>
          검색어: <strong>{searchKeyword}</strong>
        </p>
      )}

      {albums.length > 0 ? (
        <table className="table-container">
          <thead>
            <tr>
              <SortableHeaderCell headerText="ID" sortKey="albumId" />
              <th>회원 ID</th>
              <th>아티스트</th>
              <th>앨범 제목</th>
              <th>앨범 설명</th>
              <SortableHeaderCell headerText="업로드일" sortKey="createDate" />
              <th>수정일</th>
              <th>작업</th>
            </tr>
          </thead>
          <tbody>
            {albums.map((item) => {
              const album = item.albumDTO;
              const isCurrentEditing = isEditing(album.albumId);
              return (
                <tr
                  key={album.albumId}
                  onClick={(e) => {
                    const tag = e.target.tagName.toLowerCase();
                    if (["button", "input"].includes(tag)) return;
                    alert(`앨범 모달 열기: ${album.userId}, ${album.albumId}`);
                  }}
                >
                  <td>{album.albumId}</td>
                  <td>{album.userId}</td>
                  <td>{album.nickname}</td>
                  <td>
                    <InlineEditor
                      isEditing={isCurrentEditing}
                      fieldName="albumName"
                      value={album.albumName}
                      editedValue={editedData.albumName}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <InlineEditor
                      isEditing={isCurrentEditing}
                      fieldName="description"
                      value={album.description}
                      editedValue={editedData.description}
                      onChange={handleChange}
                    />
                  </td>
                  <td>{formatDate(album.createDate)}</td>
                  <td>{formatDate(album.modifyDate)}</td>
                  <td>
                    {isCurrentEditing ? (
                      <>
                        <button
                          className="apply-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApply();
                          }}
                        >
                          적용
                        </button>
                        <button
                          className="cancel-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            cancelEdit();
                          }}
                        >
                          취소
                        </button>
                      </>
                    ) : (
                      <button
                        className="edit-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          startEdit(album.albumId, {
                            albumName: album.albumName,
                            description: album.description,
                          });
                        }}
                      >
                        수정하기
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>앨범이 없습니다.</p>
      )}
    </div>
  );
};

export default MeAlbumView;
