// src/pages/sound/AlbumTracksModal.jsx
import React, { useState, useEffect } from "react";
import { axiosGet, axiosPatch } from "../../api/standardAxios";
import { formatDate } from "../../utils/date/formatDate";
import { useEditableItem } from "../../hooks/useEditableItem";
import InlineEditor from "../../components/InlineEditor";
import Pagination from "../../components/Pagination";
import { inputHandler } from "../../utils/check/inputHandler";

const AlbumTracksModal = ({ albumId, onClose }) => {
  const [tracks, setTracks] = useState([]);
  const [responseData, setResponseData] = useState(null);
  const {
    editModeId,
    editedData,
    isEditing,
    startEdit,
    cancelEdit,
    handleChange,
  } = useEditableItem();

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        // 앨범 ID를 기반으로 트랙 정보를 가져옵니다.
        const response = await axiosGet({ endpoint: `/api/me/albums/${albumId}/tracks` });
        if (response && response.dtoList) {
          setResponseData(response);
          setTracks(response.dtoList);
        } else {
          setResponseData({ dtoList: [] });
          setTracks([]);
        }
      } catch (error) {
        console.error("Error fetching tracks for album:", error);
        setResponseData({ dtoList: [] });
        setTracks([]);
      }
    };
    fetchTracks();
  }, [albumId]);

  const handleApply = async () => {
    const { errors, processedData } = inputHandler(editedData, editedData);
    if (errors) {
      alert("입력값 오류: " + JSON.stringify(errors));
      return;
    }
    try {
      await axiosPatch({ endpoint: `/api/me/tracks/${editModeId}`, body: processedData });
      cancelEdit();
    } catch (err) {
      console.error(err);
      alert("수정 실패");
    }
  };

  return (
    <div id="soundDetailModal" className="detailModal" style={{ display: "block" }}>
      <div className="detail-modal-content">
        <span
          className="close"
          style={{ cursor: "pointer", float: "right" }}
          onClick={onClose}
        >
          ×
        </span>
        <h2>앨범 {albumId}의 음원 정보 수정</h2>
        <div id="sound-detail-modal-body">
          <h3>음원 정보 수정</h3>
          <div id="render-update" className="render-update"></div>
          <div className="table-wrapper">
            <table className="table-container">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>아티스트</th>
                  <th>음원 제목</th>
                  <th>음원 설명</th>
                  <th>업로드일</th>
                  <th>수정일</th>
                  <th>작업</th>
                </tr>
              </thead>
              <tbody>
                {tracks.map((item) => {
                  const isCurrentEditing = isEditing(item.musicDTO.musicId);
                  return (
                    <tr
                      key={item.musicDTO.musicId}
                      data-track-id={item.musicDTO.musicId}
                    >
                      <td>{item.musicDTO.musicId}</td>
                      <td>{item.musicDTO.nickname}</td>
                      <td>
                        <InlineEditor
                          isEditing={isCurrentEditing}
                          fieldName="title"
                          value={item.musicDTO.title}
                          editedValue={editedData.title}
                          onChange={handleChange}
                        />
                      </td>
                      <td>
                        <InlineEditor
                          isEditing={isCurrentEditing}
                          fieldName="description"
                          value={item.musicDTO.description}
                          editedValue={editedData.description}
                          onChange={handleChange}
                        />
                      </td>
                      <td>{formatDate(item.musicDTO.createDate)}</td>
                      <td>{formatDate(item.musicDTO.modifyDate)}</td>
                      <td>
                        {isCurrentEditing ? (
                          <>
                            <button
                              className="apply-button"
                              onClick={handleApply}
                            >
                              적용
                            </button>
                            <button
                              className="cancel-button"
                              onClick={cancelEdit}
                            >
                              취소
                            </button>
                          </>
                        ) : (
                          <button
                            className="edit-button"
                            onClick={() =>
                              startEdit(item.musicDTO.musicId, {
                                title: item.musicDTO.title,
                                description: item.musicDTO.description,
                              })
                            }
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
          </div>
          <Pagination responseDTO={responseData} />
        </div>
      </div>
    </div>
  );
};

export default AlbumTracksModal;
