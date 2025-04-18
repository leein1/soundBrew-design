// src/components/AdminUserInfoModal.jsx
import React from "react";
import { formatDate } from "utils/date/formatDate";

const AdminUserInfoModal = ({ userData, onClose }) => {
  if (!userData) {
    return null;
  }
  return (
    <div className="detailModal" onClick={onClose}>
      <div className="detail-modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{userData.name}의 자세한 정보</h2>
        <span className="close" onClick={onClose}>X</span>
            <div className="table-wrapper">
                <table>
                <thead>
                    <tr>
                    <th>ID</th>
                    <th>구독 ID</th>
                    <th>이름</th>
                    <th>별명</th>
                    <th>전화번호</th>
                    <th>이메일</th>
                    <th>이메일 인증</th>
                    <th>크레딧</th>
                    <th>프로필</th>
                    <th>생년월일</th>
                    <th>가입일</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td>{userData.userId}</td>
                    <td>{userData.subscriptionId}</td>
                    <td>{userData.name}</td>
                    <td>{userData.nickname}</td>
                    <td>{userData.phoneNumber}</td>
                    <td>{userData.email}</td>
                    <td>{String(userData.emailVerified)}</td>
                    <td>{userData.creditBalance}</td>
                    <td>{userData.profileImagePath}</td>
                    <td>{userData.birth}</td>
                    <td>{formatDate(userData.createDate)}</td>
                    </tr>
                </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};

export default AdminUserInfoModal;
