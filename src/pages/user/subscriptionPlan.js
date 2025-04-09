// src/components/SubscriptionPlans.jsx
import React from 'react';
import '../../assets/css/user/subscriptionPlan.css';  // ← 여기에 CSS import

const plans = [
  { name: 'Free', price: 0, credit: 0, description: null },
  { name: 'Basic', price: 10000, credit: 50, description: null },
  { name: 'Premium', price: 20000, credit: 100, description: null },
  { name: 'VIP', price: 30000, credit: null, description: '무제한으로 사용하세요!' },
];

const SubscriptionPlans = () => {
  const handleSubscribe = (plan) => {
    alert('결제 기능과 함께 업데이트 예정입니다.');
  };

  return (
    <div className="subscriptionPlan-content">
      <div className="subscriptionPlan-content-header">
        구독제
      </div>

      <div className="subscriptionPlan-content-body">
        <div className="subscription-container">
          {plans.map(({ name, price, credit, description }) => (
            <div
              key={name}
              className={`subscription-card${name === 'VIP' ? ' vip-card' : ''}`}
            >
              <h2>{name}</h2>
              <p>월 결제 금액: {price.toLocaleString()}원</p>
              {credit !== null && <p>월 크레딧: {credit}</p>}
              {description && <p>{description}</p>}
              <button
                type="button"
                className="subscribe-btn"
                onClick={() => handleSubscribe(name)}
              >
                구독하기
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
