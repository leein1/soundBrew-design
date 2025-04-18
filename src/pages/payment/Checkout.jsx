import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { axiosGet, axiosPost, axiosDelete } from "api/standardAxios";
import { useAuth } from "context/authContext";
import "assets/css/toss.css";

const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
const customerKey = generateRandomString();

export function CheckoutPage() {
  // user가 준비되는 과정을 감안하여 initializing도 함께 받아옴
  const { user, initializing } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const selectedPlan = location.state?.plan; // 항상 존재할 수도, 없을 수도 있음

  // 모든 훅은 무조건 호출된다.
  const [amount, setAmount] = useState({
    currency: "KRW",
    // selectedPlan이 없으면 0 또는 임의의 값 지정 (후에 렌더링 조건에서 체크)
    value: selectedPlan ? selectedPlan.subscriptionPrice : 0,
  });
  const [ready, setReady] = useState(false);
  const [widgets, setWidgets] = useState(null);

  // selectedPlan이 없을 경우 alert 후 페이지 이동
  useEffect(() => {
    if (!selectedPlan) {
      alert("플랜이 없습니다.");
      navigate("/subscription");
    }
  }, [selectedPlan, navigate]);

  // TossPayments 위젯 로딩
  useEffect(() => {
    async function fetchPaymentWidgets() {
      try {
        const tossPayments = await loadTossPayments(clientKey);
        const widgets = tossPayments.widgets({ customerKey });
        setWidgets(widgets);
      } catch (error) {
        console.error("Error fetching payment widget:", error);
      }
    }
    fetchPaymentWidgets();
  }, []);

  // 위젯 렌더링 및 금액 설정
  useEffect(() => {
    async function renderPaymentWidgets() {
      if (!widgets) {
        return;
      }
      await widgets.setAmount(amount);
      await widgets.renderPaymentMethods({
        selector: "#payment-method",
        variantKey: "DEFAULT",
      });
      await widgets.renderAgreement({
        selector: "#agreement",
        variantKey: "AGREEMENT",
      });
      setReady(true);
    }
    renderPaymentWidgets();
  }, [widgets, amount]);

  // 페이지 로딩 시, user와 widgets가 준비되면 기존 결제 기록을 검증
  useEffect(() => {
    if (initializing || !user || !widgets) return; // 인증과 위젯이 준비되지 않았다면 실행하지 않음
    async function verifyPaymentRecord() {
      try {
        const existingRecord = await axiosGet({ endpoint: `/api/payment/verification/${user.userId}/READY` });
        if (existingRecord && existingRecord.dto) {
          if (window.confirm("이미 진행된 결제 기록이 존재합니다. 기존 결제로 진행하시겠습니까?")) {
            const { orderId, orderName, username, nickname } = existingRecord.dto;
            await widgets.requestPayment({
              orderId,
              orderName,
              successUrl: window.location.origin + "/success",
              failUrl: window.location.origin + "/fail",
              customerEmail: username,
              customerName: nickname,
              customerMobilePhone: "01033337777",
            });
          }
        }
      } catch (error) {
        console.error("결제 검증 중 에러 발생:", error);
      }
    }
    verifyPaymentRecord();
  }, [initializing, user, widgets]);

  const updateAmount = async (newAmount) => {
    setAmount(newAmount);
    await widgets.setAmount(newAmount);
  };

  // 조건부 렌더링: selectedPlan이 없으면 null을 반환하여 컴포넌트 내 훅 호출 순서를 바꾸지 않음
  if (!selectedPlan) {
    return null;
  }

  return (
    <div className="wrapper">
      <div className="box_section">
        <div id="payment-method" />
        <div id="agreement" />
        <div style={{ paddingLeft: "24px" }}>
          <div className="checkable typography--p">
            <label htmlFor="coupon-box" className="checkable__label typography--regular">
              <input
                id="coupon-box"
                className="checkable__input"
                type="checkbox"
                aria-checked="true"
                disabled={!ready}
                onChange={async (event) => {
                  await updateAmount({
                    currency: amount.currency,
                    value: event.target.checked
                      ? amount.value - 5000
                      : amount.value + 5000,
                  });
                }}
              />
              <span className="checkable__label-text">5,000원 쿠폰 적용</span>
            </label>
          </div>
        </div>

        <button
          className="button"
          style={{ marginTop: "30px" }}
          disabled={!ready}
          onClick={async () => {
            try {
              // // 버튼 클릭 시에도 한 번 더 검증 (원한다면 중복 검증 대신 버튼 클릭 로직을 수정할 수도 있음)
              const existingRecord = await axiosGet({ endpoint: `/api/payment/verification/${user.userId}/READY` });
              // if (existingRecord && existingRecord.dto) {
              //   if (window.confirm("이미 진행된 결제 기록이 존재합니다. 기존 결제로 진행하시겠습니까?")) {
              //     const { orderId, orderName, username, nickname } = existingRecord.dto;
              //     await widgets.requestPayment({
              //       orderId,
              //       orderName,
              //       successUrl: window.location.origin + "/success",
              //       failUrl: window.location.origin + "/fail",
              //       customerEmail: username,
              //       customerName: nickname,
              //       customerMobilePhone: "01033337777",
              //     });
              //     return;
              //   }
              // }

              if (existingRecord && existingRecord.dto) {
                await axiosDelete({ endpoint: `/api/payment/draft/${user.userId}/READY` });
              }

              // 선택한 플랜 정보에 따라 orderName, creditAmount, subscriptionId 설정
              const body = {
                userId: user.userId,
                status: "READY",
                orderId: generateRandomString(),
                amount: amount.value,
                customerKey: customerKey,
                orderName: `${selectedPlan.subscriptionName} 플랜 구독`,
                creditAmount: selectedPlan.creditPerMonth || 0,
                subscriptionId: selectedPlan.subscriptionId,
              };

              await axiosPost({ endpoint: '/api/payment/draft', body });
              await widgets.requestPayment({
                orderId: body.orderId,
                orderName: body.orderName,
                successUrl: window.location.origin + "/success",
                failUrl: window.location.origin + "/fail",
                customerEmail: user.username,
                customerName: user.nickname,
                customerMobilePhone: "01033337777",
              });
            } catch (error) {
              console.error("결제 진행 중 에러 발생:", error);
            }
          }}
        >
          결제하기
        </button>
      </div>
    </div>
  );
}

function generateRandomString() {
  return window.btoa(Math.random().toString()).slice(0, 20);
}
