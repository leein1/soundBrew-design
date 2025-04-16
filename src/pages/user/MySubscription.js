// MySubscription.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useCSSLoader } from '../../hooks/useCSSLoader';
import { axiosGet,axiosDelete } from "../../api/standardAxios";
import {useAuth,initializing} from "../../context/authContext";
import {formatDate} from "../../utils/date/formatDate"
import { useNavigate } from "react-router-dom";

const MySubscription = () => {
  const cssFiles = useMemo(()=>[
    "/assets/css/user/mySubscription.css"
  ],[])
  useCSSLoader(cssFiles);

  const [paymentData , setPaymentData ] = useState({dtoList:[]});
  const [subscription, setSubscription] = useState({dto:[]});
  const { user, initializing} = useAuth();
  const navigate = useNavigate();

  const subscriptionNames = {
    1: "Basic",
    2: "Premium",
    3: "VIP",
    4: "Free"
  };

  useEffect(()=>{
    if(initializing){
      return;
    }

    const fetchPaymentData= async ()=>{
      console.log(user)
      const payments = await axiosGet({endpoint:`/api/payment/transaction/${user.userId}`});
      const subscription = await axiosGet({endpoint:'/api/me/subscription'});
      setPaymentData(payments);
      setSubscription(subscription);
    }

    fetchPaymentData();
  },[user]);

  const handleChangeSubscription = () => {
    alert("구독 변경 기능은 아직 구현되지 않았습니다.");
  };

  const handleCancelSubscription = async() => {
    const confirmCancel = window.confirm("정말로 구독을 취소하시겠습니까?");
    if (confirmCancel) {
      await axiosDelete({endpoint:'/api/me/subscription'});
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
              <h2>{subscription.dto.subscriptionName}</h2>
                <p>월 결제 금액: {subscription.dto.subscriptionPrice} </p>
                <p>월 크레딧: {subscription.dto.creditPerMonth}</p>
                <div className="button-container">
                  <button type="button" onClick={()=> navigate("/subscription")}>
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
                {paymentData.dtoList && paymentData.dtoList.length > 0 ? (
                  paymentData.dtoList.map((payment, index) => (
                    <div key={index}>
                      <p>구독제 : {payment.orderName}</p>
                      <p>날짜: {formatDate(payment.createDate)}</p>
                    </div>
                  ))
                ) : (
                  <p>결제 내역이 없습니다.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MySubscription;
