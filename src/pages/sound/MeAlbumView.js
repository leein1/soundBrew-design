// src/pages/sound/MeAlbumView.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { axiosGet, axiosPatch } from "../../api/standardAxios";
import { inputHandler } from "../../utils/check/inputHandler";
import { formatDate } from "../../utils/date/formatDate";
import { useEditableItem } from "../../hooks/useEditableItem";
import InlineEditor from "../../components/InlineEditor";
import SortableHeaderCell from "../../components/SortableHeaderCell";
import { useCSSLoader } from "../../hooks/useCSSLoader";
import { useAuth } from "../../context/authContext";

import Pagination from "../../components/Pagination";

// 새로 만든 모달 컴포넌트를 import 합니다.
import AlbumTracksModal from "./AlbumTracksModal";


const MeAlbumView = () => {
  const cssFiles = useMemo(() => [
    "/assets/css/sound/music.css",
    "/assets/css/sound/admin-main.css",
    "/assets/css/user/user-admin.css",
  ], []);
  useCSSLoader(cssFiles);

  const [albums, setAlbums] = useState([]);
  const [responseData, setResponseData] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const location = useLocation();

  const {isAdmin} =useAuth();
  // 선택한 앨범의 ID를 저장하는 상태
  const [selectedAlbumId, setSelectedAlbumId] = useState(null);

  const {
    editModeId,
    editedData,
    isEditing,
    startEdit,
    cancelEdit,
    handleChange,
  } = useEditableItem();

  useEffect(() => {
    const fetchAlbums = async () => {
      const params = new URLSearchParams(location.search);
      let response ='';

      if(isAdmin){
        response = await axiosGet({ endpoint: `/api/admin/albums?${params.toString()}` });
      }else{
        response = await axiosGet({ endpoint: `/api/me/albums?${params.toString()}` });
      }

      if (response && response.dtoList) {
        setResponseData(response);
      } else {
        setResponseData({ dtoList: [] });
      }
      
      setAlbums(response.dtoList || []);
    };

    fetchAlbums();
  }, [location.search]);

  const handleApply = async () => {
    const { errors, processedData } = inputHandler(editedData, editedData);
    if (errors) {
      alert("입력값 오류: " + JSON.stringify(errors));
      return;
    }
    try {
      await axiosPatch({
        endpoint: `/api/me/albums/${editModeId}`,
        body: processedData,
      });
      cancelEdit();
    } catch (err) {
      console.error(err);
      alert("수정 실패");
    }
  };

  const handleDelete = async ()=>{        
    alert("삭제 클릭, 삭제한 아이디 : "+editModeId);
    // await axiosDelete({ endpoint:`/api/admin/albums/${editModeId}`, handle });
  } 

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
                    // 버튼이나 input을 클릭한 경우 모달 오픈을 막음
                    if (["button", "input"].includes(tag)) return;
                    // 모달창 오픈: 클릭한 앨범 ID를 상태에 저장
                    setSelectedAlbumId(album.albumId);
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
                        <button className="apply-button" onClick={(e) => {e.stopPropagation(); handleApply();}}>
                          적용
                        </button>
                        <button className="cancel-button" onClick={(e) => {e.stopPropagation(); cancelEdit();}}>
                          취소
                        </button>
                        {isAdmin? (<button className="delete-button" onClick={handleDelete}>삭제</button>):(<></>)}
                      </>
                    ) : (
                      <button className="edit-button" 
                          onClick={(e) => {e.stopPropagation(); startEdit(album.albumId, {albumName: album.albumName,description: album.description,});}}
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

      <Pagination responseDTO={responseData} />

      {/* 선택한 앨범이 있으면 모달창 렌더링 */}
      {selectedAlbumId && (
        <AlbumTracksModal
          albumId={selectedAlbumId}
          onClose={() => setSelectedAlbumId(null)}
        />
      )}
    </div>
  );
};

export default MeAlbumView;
