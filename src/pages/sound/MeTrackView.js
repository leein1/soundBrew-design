import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { inputHandler } from "utils/check/inputHandler";
import { axiosPatch, axiosGet,axiosDelete } from "api/standardAxios";
import { formatDate } from "utils/date/formatDate";
import { useEditableItem } from "hooks/useEditableItem";
import InlineEditor from "components/editor/InlineEditor";
import SortableHeaderCell from "components/global/SortableHeaderCell";
import { useCSSLoader } from "hooks/useCSSLoader";

import { useAuth } from "context/authContext";

import Pagination from "components/global/Pagination"

const MeTrackView= ()=>{
    const cssFiles = useMemo(() => [
        "/assets/css/sound/music.css",
        "/assets/css/sound/admin-main.css",
        "/assets/css/user/user-admin.css",
    ], []);
    
    useCSSLoader(cssFiles);

    const { user,isAdmin } = useAuth();
    const [track, setTrack] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [responseData, setResponseData] = useState(null);
    const location = useLocation();

    // 에디팅에 사용되는 공통 훅
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
        const fetchTracks = async () => {
            const params = new URLSearchParams(location.search);
            let response='';
            
            if(isAdmin){
                response = await axiosGet({endpoint:`/api/admin/tracks?${params.toString()}`});
            }else{
                response = await axiosGet({endpoint: `/api/me/tracks?${params.toString()}`});
            }

            if (response && response.dtoList) {
                setResponseData(response);
            } else {
                setResponseData({ dtoList: [] });
            }
            
            setTrack(response.dtoList || []);
        };
    
        fetchTracks();
    }, [location.search]);

    // 공통 훅에 대한 apply
    const handleApply = async () => {
        const { errors, processedData } = inputHandler(editedData, editedData);
        if (errors) {
            alert("입력값 오류: " + JSON.stringify(errors));
            return;
        }
        try{
            console.log(processedData);
            await axiosPatch({ endpoint: `/api/me/tracks/${editModeId}`, body: processedData,});
            cancelEdit();
        }catch (err) {
            console.error(err);
            alert("수정 실패");
        }
    }
    
    const handleDelete = async ()=>{        
        alert("삭제 클릭, 삭제한 아이디 : "+editModeId);
        // await axiosDelete({ endpoint:`/api/admin/tracks/${editModeId}`, handle });
    }

    return (
        <div>
        <h3>음원 정보 수정</h3>
        <div id="render-update" className="render-update"></div>
        <div id="chart-selector-container"></div>
    
        {searchKeyword && (
            <p>
                검색어: <strong>{searchKeyword}</strong>
            </p>
        )}

        {track.length > 0 ? (
            <div className="table-wrapper">
            <table className="table-container">
                <thead>
                <tr>
                    <SortableHeaderCell headerText="ID" sortKey="musicId" />
                    <th>아티스트</th>
                    <th>음원 제목</th>
                    <th>음원 설명</th>
                    <SortableHeaderCell headerText="업로드일" sortKey="createDate" />
                    <th>수정일</th>
                    <th>작업</th>
                </tr>
                </thead>
                <tbody>
                {track.map((item) => {
                    const isCurrentEditing = isEditing(item.musicDTO.musicId);

                    return (
                        <tr key={item.musicDTO.musicId}>
                            <td>{item.musicDTO.musicId}</td>
                            <td>{item.albumDTO.nickname}</td>
                            <td>
                            <InlineEditor
                                isEditing={isCurrentEditing}
                                fieldName="title"
                                value={item.musicDTO.title}
                                editedValue={editedData.title}
                                onChange={handleChange}/>
                            </td>
                            <td>
                            <InlineEditor
                                isEditing={isCurrentEditing}
                                fieldName="description"
                                value={item.musicDTO.description}
                                editedValue={editedData.description}
                                onChange={handleChange}/>
                            </td>
                            <td>{formatDate(item.musicDTO.createDate)}</td>
                            <td>{formatDate(item.musicDTO.modifyDate)}</td>
                            <td>
                                {isCurrentEditing ? (
                                    <>
                                    <button className="apply-button" onClick={handleApply}>적용</button>
                                    <button className="cancel-button" onClick={cancelEdit}>취소</button>
                                    {isAdmin?(<button className="delete-button" onClick={handleDelete}>삭제</button>):(<></>)}
                                    </>
                                ) : (
                                    <button
                                    className="edit-button"
                                    onClick={() => startEdit(item.musicDTO.musicId, {
                                            title: item.musicDTO.title,
                                            description: item.musicDTO.description,
                                        })
                                    }>
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
        ) : (
            <p>트랙이 없습니다.</p>
        )}

            <Pagination responseDTO={responseData}/>
        </div>
    );
};

export default MeTrackView;