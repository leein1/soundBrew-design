// MySubscription.jsx
import React from 'react';

import "../../assets/css/user/mySubscription.css"

const MySubscription = () => {
  const handleChangeSubscription = () => {
    alert("구독 변경 기능은 아직 구현되지 않았습니다.");
  };

  const handleCancelSubscription = () => {
    const confirmCancel = window.confirm("정말로 구독을 취소하시겠습니까?");
    if (confirmCancel) {
      alert("구독이 취소되었습니다.");
      // 여기에 구독 취소 API 호출 로직 추가
    }
  };

  return (
    <div className="mySubscription">
      <div className="mySubscription-content-header">
        내 구독 정보
      </div>
      <div className="mySubscription-content-body">
        <div className="dashboard-container">
          {/* 왼쪽 열: 결제 수단 카드 */}
          <div className="left-column">
            <div className="subscription-info-container">
              <div className="subscription-info-card">
                <h2>Free</h2>
                <p>월 결제 금액: 0원</p>
                <p>월 크레딧: 0</p>
                <p>
                  가입일: <span>2025-01-01</span>
                </p>
                <div className="button-container">
                  <button type="button" onClick={handleChangeSubscription}>
                    구독 변경
                  </button>
                  <button type="button" onClick={handleCancelSubscription}>
                    구독 취소
                  </button>
                </div>
              </div>
            </div>

            <div className="payment-method-container">
              <div className="payment-method-card">
                <div className="card-name">SoundBrew Test Card</div>
                <div className="card-info">
                  <div className="card-number">
                    <p>**** **** **** 1234</p>
                  </div>
                  <div className="cvc">
                    <p>123</p>
                  </div>
                </div>
                <div className="card-details">
                  <p>유효기간: 12/24</p>
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽 열: 구독 정보 및 결제 내역 */}
          <div className="right-column">
            <div className="payment-history-container">
              <div className="payment-history-card">
                <h2>결제 내역</h2>
                <p>2025-01-01: 결제 실패</p>
                <p>2024-12-01: 결제 완료</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MySubscription;
