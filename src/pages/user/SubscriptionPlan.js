import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCSSLoader } from 'hooks/useCSSLoader';
import { axiosGet } from 'api/standardAxios';

const SubscriptionPlans = () => {
  useCSSLoader(useMemo(() => ['/assets/css/user/subscriptionPlan.css'], []));

  // 초기값을 빈 배열로
  const [plans, setPlans] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosGet({ endpoint: '/api/payment/plans' });

        if (Array.isArray(response.dtoList)) {
          setPlans(response.dtoList);
        } else {
          console.warn('Unexpected dtoList:', response.dtoList);
        }
      } catch (err) {
        console.error('Failed to fetch plans:', err);
      }
    };
    fetchData();
  }, []);

  const handleSubscribe = (plan) => {
    // plan 객체 그대로 전달
    navigate('/checkout', { state: { plan } });
  };

  return (
    <div className="subscriptionPlan-content">
      <div className="subscriptionPlan-content-header">구독제</div>
      <div className="subscriptionPlan-content-body">
        <div className="subscription-container">
          {plans.map((plan) => (
            <div
              key={plan.subscriptionId}
              className={`subscription-card${plan.subscriptionName === 'vip' ? ' vip-card' : ''}`}
            >
              <h2>{plan.subscriptionName}</h2>
              <p>월 결제 금액: {plan.subscriptionPrice.toLocaleString()}원</p>
              <p>월 크레딧: {plan.creditPerMonth}</p>
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
