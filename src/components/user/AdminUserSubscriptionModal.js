// src/components/AdminUserSubscriptionModal.jsx
import React from "react";
import { formatDate } from "utils/date/formatDate";

const AdminUserSubscriptionModal = ({ userSubscriptionData, onClose }) => {
  // 구독 정보가 없거나, subscriptionId가 없으면 "구독을 안한 사람입니다." 출력
  if (!userSubscriptionData.subscriptionId) {
    return (
      <div className="detailModal" onClick={onClose}>
        <div className="detail-modal-content" onClick={(e) => e.stopPropagation()}>
          <h2>구독 정보 없음</h2>
          <span className="close" onClick={onClose}>X</span>
          <p>미구독 회원입니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="detailModal" onClick={onClose}>
      <div className="detail-modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{userSubscriptionData.name}의 자세한 정보</h2>
        <span className="close" onClick={onClose}>X</span>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>구독 ID</th>
                <th>첫 결제일</th>
                <th>다음 결제일</th>
                <th>결제 여부</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{userSubscriptionData.userId}</td>
                <td>{userSubscriptionData.subscriptionId}</td>
                <td>{userSubscriptionData.firstBillingDate}</td>
                <td>{userSubscriptionData.nextBillingDate}</td>
                <td>{userSubscriptionData.paymentStatus}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUserSubscriptionModal;
