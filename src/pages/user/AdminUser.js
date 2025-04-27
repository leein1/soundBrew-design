// src/components/AdminUser.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosGet, axiosPatch } from "api/standardAxios";
import { useCSSLoader } from "hooks/useCSSLoader";
import { formatDate } from "utils/date/formatDate"; // 임의 유틸, 필요에 따라 변경
import SortableHeaderCell from "components/global/SortableHeaderCell";
import AdminUserInfoModal from "components/user/AdminUserInfoModal";
import AdminUserSubscriptionModal from "components/user/AdminUserSubscriptionModal"
import Pagination from "components/global/Pagination";
import Search from "components/global/Search"

// 수정할 수 있는 항목 종류 (상태, 실무 상황에 따라 확장 가능)
const EDIT_FIELDS = {
  CREDIT: "creditBalance",
  SUBSCRIPTION: "subscriptionId",
  PAYMENT: "paymentStatus",
};

const AdminUser = () => {
  // CSS 파일 로딩
  const cssFiles = useMemo(() => [
    "/assets/css/sound/music.css",
    "/assets/css/sound/admin-main.css",
    "/assets/css/user/user-admin.css",
  ], []);
  useCSSLoader(cssFiles);

  const location = useLocation();
  const navigate = useNavigate();

  // 사용자 목록 상태
  const [users, setUsers] = useState([]);
  // 에러나 응답 데이터 상태 (필요시 활용)
  const [responseData, setResponseData] = useState(null);
  // 현재 수정중인 행: { userId, field (수정할 항목), tempValue }
  const [editingRow, setEditingRow] = useState(null);
  // 검색 키워드 (원래 코드에 포함되어 있었음)
  const [searchType, setSearchType] = useState("t");
  const [searchKeyword, setSearchKeyword] = useState("");
  // 모달에 전달할 선택된 user (userDTO 객체를 전달)
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserSubscription, setSelectedUserSubscription] = useState(null);

  // 데이터 패칭
  useEffect(() => {
    const fetchUsers = async () => {
      const params = new URLSearchParams(location.search);
      const response = await axiosGet({ endpoint: `/api/admin/users?${params.toString()}` });
      if (response && response.dtoList) {
        setResponseData(response);
        setUsers(response.dtoList);
      } else {
        setResponseData({ dtoList: [] });
        setUsers([]);
      }
    };
    fetchUsers();
  }, [location.search]);

  // "수정하기" 버튼 클릭 시 수정모드 활성화: 수정할 항목은 아직 미선택 상태
  const handleStartEdit = (userId) => {
    setEditingRow({ userId, field: null, tempValue: "" });
  };

  // 수정할 항목 선택: 클릭하면 해당 항목의 기존값을 임시 값으로 설정
  const handleChooseField = (user, field) => {
    let initialValue = "";
    if (field === EDIT_FIELDS.CREDIT) {
      initialValue = user.userDTO.creditBalance;
    } else if (field === EDIT_FIELDS.SUBSCRIPTION) {
      initialValue = user.userDTO.subscriptionId;
    } else if (field === EDIT_FIELDS.PAYMENT) {
      // paymentStatus는 boolean이거나 문자열로 처리
      initialValue = user.userSubscriptionDTO.paymentStatus;
    }
    setEditingRow({ userId: user.userDTO.userId, field, tempValue: initialValue });
  };

  // 변경값 입력 핸들러
  const handleInputChange = (e) => {
    setEditingRow((prev) => ({ ...prev, tempValue: e.target.value }));
  };

  // 수정 적용: API 호출 후 사용자 목록 갱신
  const handleApply = async (user) => {
    if (!editingRow || editingRow.userId !== user.userDTO.userId || !editingRow.field) {
      return;
    }
    const { field, tempValue } = editingRow;
    // 유효성 체크 (예: 크레딧은 숫자여야 함)
    if (field === EDIT_FIELDS.CREDIT && (tempValue === "" || isNaN(tempValue))) {
      alert("크레딧은 숫자여야 하며 공백일 수 없습니다.");
      return;
    }

    // 각 필드마다 다른 endpoint를 호출한다고 가정합니다.
    let endpoint = "";
    if (field === EDIT_FIELDS.CREDIT) {
      endpoint = `/api/admin/users/${user.userDTO.userId}/credit`;
    } else if (field === EDIT_FIELDS.SUBSCRIPTION) {
      endpoint = `/api/admin/users/${user.userDTO.userId}/subscription`;
    } else if (field === EDIT_FIELDS.PAYMENT) {
      endpoint = `/api/admin/users/${user.userDTO.userId}/payment`;
    }

    try {
      await axiosPatch({ endpoint, body: tempValue });
      const response = await axiosGet({ endpoint: "/api/admin/users" });
      if (response && response.dtoList) {
        setUsers(response.dtoList);
      }
      setEditingRow(null);
    } catch (err) {
      console.error(err);
      alert("수정에 실패하였습니다.");
    }
  };

  // 수정 취소
  const handleCancel = () => {
    setEditingRow(null);
  };

  // 임시로 구독, 결제 옵션을 위한 매핑 (원래 JS 코드에서와 유사)
  const subscriptionMapping = {
    "1": "free",
    "2": "basic",
    "3": "premium",
    "4": "vip"
  };

  const roleMapping = {
    "1": "회원",
    "2": "매니저",
    "3": "관리자",
  };

  return (
    <div>
      <Search
        type={searchType}
        keyword={searchKeyword}
        onTypeChange={setSearchType}
        onKeywordChange={setSearchKeyword}
        onSearch={() => navigate(`?type=${searchType}&keyword=${searchKeyword}`)}
      />
      <div className="table-actions">
        {/* <div>
          <label htmlFor="rows-per-page">페이지 당 데이터 수:</label>
          <select
            id="rows-per-page"
            onChange={(e) => {
              // 페이지 당 데이터 수 변경 시 URL 업데이트(예시)
              const size = e.target.value;
              const currentParams = new URLSearchParams(location.search);
              currentParams.set("size", size);
              navigate(`${location.pathname}?${currentParams.toString()}`);
            }}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
        </div> */}
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <SortableHeaderCell headerText="ID" sortKey="userId" />
              <th>이름</th>
              <th>별명</th>
              <SortableHeaderCell headerText="구독" sortKey="subscriptionId" />
              <SortableHeaderCell headerText="크레딧" sortKey="creditBalance" />
              <SortableHeaderCell headerText="결제상태" sortKey="paymentStatus" />
              <SortableHeaderCell headerText="권한" sortKey="roleId" />
              <th>가입일</th>
              <th>작업</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => {
                const userId = user.userDTO.userId;
                const isEditingThisRow = editingRow && editingRow.userId === userId;
                return (
                  <tr key={userId}>
                    <td onClick={() => setSelectedUser(user.userDTO)}>{user.userDTO.userId}</td>
                    <td onClick={() => setSelectedUser(user.userDTO)}>{user.userDTO.name}</td>
                    <td onClick={() => setSelectedUser(user.userDTO)}>{user.userDTO.nickname}</td>
                    <td onClick={() => setSelectedUserSubscription(user.userSubscriptionDTO)}>
                      {isEditingThisRow && editingRow.field === EDIT_FIELDS.SUBSCRIPTION ? (
                        <select value={editingRow.tempValue} onChange={handleInputChange}>
                          <option value="1">basic</option>
                          <option value="2">premium</option>
                          <option value="3">vip</option>
                        </select>
                      ) : (
                        subscriptionMapping[user.userDTO.subscriptionId] || user.userDTO.subscriptionId
                      )}
                    </td>
                    <td onClick={() => setSelectedUserSubscription(user.userSubscriptionDTO)}>
                      {isEditingThisRow && editingRow.field === EDIT_FIELDS.CREDIT ? (
                        <input type="number" value={editingRow.tempValue} onChange={handleInputChange} />
                      ) : (
                        user.userDTO.creditBalance
                      )}
                    </td>
                    <td onClick={() => setSelectedUserSubscription(user.userSubscriptionDTO)}>
                      {isEditingThisRow && editingRow.field === EDIT_FIELDS.PAYMENT ? (
                        <select value={editingRow.tempValue} onChange={handleInputChange}>
                          <option value="true">true</option>
                          <option value="false">false</option>
                        </select>
                      ) : (
                        String(user.userSubscriptionDTO.paymentStatus)
                      )}
                    </td>
                    <td>{roleMapping[user.userRoleDTO.roleId] || user.userRoleDTO.roleId}</td>
                    <td>{formatDate(user.userDTO.createDate)}</td>
                    <td>
                      {isEditingThisRow ? (
                        <>
                          {editingRow.field === null ? (
                            // 수정 모드를 시작한 후, 아직 수정할 필드를 선택하지 않은 상태: 항목 선택 버튼들을 보여줌
                            <div>
                              <button className="apply-button" onClick={() => handleChooseField(user, EDIT_FIELDS.CREDIT)}>
                                크레딧
                              </button>
                              <button className="apply-button" onClick={() => handleChooseField(user, EDIT_FIELDS.SUBSCRIPTION)}>
                                구독
                              </button>
                              <button className="apply-button" onClick={() => handleChooseField(user, EDIT_FIELDS.PAYMENT)}>
                                결제상태
                              </button>
                              <button className="cancel-button" onClick={handleCancel}>취소</button>
                            </div>
                          ) : (
                            // 수정 항목이 선택된 경우, 적용/취소 버튼과 입력란 보임
                            <div>
                              <button className="edit-button" onClick={() => handleApply(user)}>적용</button>
                              <button className="cancel-button" onClick={handleCancel}>취소</button>
                            </div>
                          )}
                        </>
                      ) : (
                        <button className="edit-button" onClick={(e) => {
                          e.stopPropagation(); // row 클릭 이벤트 전파 방지
                          handleStartEdit(userId);
                        }}>수정하기</button>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="9">유저 정보가 없거나 찾을 수 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination responseDTO={responseData}/>
      {/* 선택한 사용자 정보가 있으면 모달을 렌더링 */}
      {selectedUser && (
        <AdminUserInfoModal userData={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
      {selectedUserSubscription &&(
        <AdminUserSubscriptionModal userSubscriptionData={selectedUserSubscription} onClose={() => setSelectedUserSubscription(null)}/>
      )}
    </div>
  );
};

export default AdminUser;
