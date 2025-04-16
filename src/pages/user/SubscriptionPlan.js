import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom'; // react-router-dom의 useNavigate 사용
import { useCSSLoader } from '../../hooks/useCSSLoader';

//현재는 subscriptionPlan 페이지에 고지가 되어있지만.
//실제로는 subscriptionDB에 따른 값이 실제로 부여된다.
// 정보를 GET해오던가, 아니면 늘 유의주시하던가. 일단 인지해둘것.
const plans = [
  { id: 4, name: 'Free', price: 0, credit: 0, description: null },
  { id: 1, name: 'Basic', price: 10000, credit: 50, description: null },
  { id: 2, name: 'Premium', price: 20000, credit: 100, description: null },
  { id: 3, name: 'VIP', price: 30000, credit: 200, description: '무제한으로 사용하세요!' },
];

const SubscriptionPlans = () => {
  const cssFiles = useMemo(() => ["/assets/css/user/subscriptionPlan.css"], []);
  useCSSLoader(cssFiles);
  
  const navigate = useNavigate();

  const handleSubscribe = (plan) => {
    // 예: 결제페이지로 plan 정보를 state를 통해 전달
    navigate('/checkout', { state: { plan } });
  };

  return (
    <div className="subscriptionPlan-content">
      <div className="subscriptionPlan-content-header">구독제</div>
      <div className="subscriptionPlan-content-body">
        <div className="subscription-container">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`subscription-card${plan.name === 'VIP' ? ' vip-card' : ''}`}
            >
              <h2>{plan.name}</h2>
              <p>월 결제 금액: {plan.price.toLocaleString()}원</p>
              {plan.credit !== null && <p>월 크레딧: {plan.credit}</p>}
              {plan.description && <p>{plan.description}</p>}
              <button
                type="button"
                className="subscribe-btn"
                onClick={() => handleSubscribe(plan)}
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
