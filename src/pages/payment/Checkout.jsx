import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import { useEffect, useState } from "react";

import {axiosGet, axiosPost, axiosDelete} from "../../api/standardAxios";
import { useAuth } from "../../context/authContext";

import "../../assets/css/toss.css";

// TODO: clientKey는 개발자센터의 결제위젯 연동 키 > 클라이언트 키로 바꾸세요.
// TODO: 구매자의 고유 아이디를 불러와서 customerKey로 설정하세요. 이메일・전화번호와 같이 유추가 가능한 값은 안전하지 않습니다.
// @docs https://docs.tosspayments.com/sdk/v2/js#토스페이먼츠-초기화
const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
const customerKey = generateRandomString();

export function CheckoutPage() {
  const {user} = useAuth();
  const [amount, setAmount] = useState({
    currency: "KRW",
    value: 500,
  });
  const [ready, setReady] = useState(false);
  const [widgets, setWidgets] = useState(null);

  useEffect(() => {
    async function fetchPaymentWidgets() {
      try {
        // ------  SDK 초기화 ------
        // @docs https://docs.tosspayments.com/sdk/v2/js#토스페이먼츠-초기화
        const tossPayments = await loadTossPayments(clientKey);

        // 회원 결제
        // @docs https://docs.tosspayments.com/sdk/v2/js#tosspaymentswidgets
        const widgets = tossPayments.widgets({
          customerKey,
        });
        // 비회원 결제
        // const widgets = tossPayments.widgets({ customerKey: ANONYMOUS });

        setWidgets(widgets);
      } catch (error) {
        console.error("Error fetching payment widget:", error);
      }
    }

    fetchPaymentWidgets();
  }, [clientKey, customerKey]);

  useEffect(() => {
    async function renderPaymentWidgets() {
      if (widgets == null) {
        return;
      }

      // ------  주문서의 결제 금액 설정 ------
      // TODO: 위젯의 결제금액을 결제하려는 금액으로 초기화하세요.
      // TODO: renderPaymentMethods, renderAgreement, requestPayment 보다 반드시 선행되어야 합니다.
      await widgets.setAmount(amount);

      // ------  결제 UI 렌더링 ------
      // @docs https://docs.tosspayments.com/sdk/v2/js#widgetsrenderpaymentmethods
      await widgets.renderPaymentMethods({
        selector: "#payment-method",
        // 렌더링하고 싶은 결제 UI의 variantKey
        // 결제 수단 및 스타일이 다른 멀티 UI를 직접 만들고 싶다면 계약이 필요해요.
        // @docs https://docs.tosspayments.com/guides/v2/payment-widget/admin#새로운-결제-ui-추가하기
        variantKey: "DEFAULT",
      });

      // ------  이용약관 UI 렌더링 ------
      // @docs https://docs.tosspayments.com/reference/widget-sdk#renderagreement선택자-옵션
      await widgets.renderAgreement({
        selector: "#agreement",
        variantKey: "AGREEMENT",
      });

      setReady(true);
    }

    renderPaymentWidgets();
  }, [widgets]);

  const updateAmount = async (amount) => {
    setAmount(amount);
    await widgets.setAmount(amount);
  };

  return (
    <div className="wrapper">
      <div className="box_section">
        {/* 결제 UI */}
        <div id="payment-method" />
        {/* 이용약관 UI */}
        <div id="agreement" />
        {/* 쿠폰 체크박스 */}
        <div style={{ paddingLeft: "24px" }}>
          <div className="checkable typography--p">
            <label
              htmlFor="coupon-box"
              className="checkable__label typography--regular"
            >
              <input
                id="coupon-box"
                className="checkable__input"
                type="checkbox"
                aria-checked="true"
                disabled={!ready}
                // ------  주문서의 결제 금액이 변경되었을 경우 결제 금액 업데이트 ------
                // @docs https://docs.tosspayments.com/sdk/v2/js#widgetssetamount
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

        {/* 결제하기 버튼 */}
        <button
          className="button"
          style={{ marginTop: "30px" }}
          disabled={!ready}
          // ------ '결제하기' 버튼 누르면 결제창 띄우기 ------
          // @docs https://docs.tosspayments.com/sdk/v2/js#widgetsrequestpayment
          onClick={async () => {
            try {
              // 1. 기존 결제 기록이 있는지 확인
              const existingRecord = await axiosGet({ endpoint: `/api/payment/verification/${user.userId}/READY` });
        
              // 기존 결제 기록이 있고 유효한 데이터가 있으면
              if (existingRecord && existingRecord.dto) {
                // 2. 기존 결제로 진행할 것인지 확인
                if (window.confirm("이미 진행된 결제 기록이 존재합니다. 기존 결제로 진행하시겠습니까?")) {
                  // 3-1. 기존 기록으로 토스 결제 진행
                  const { orderId, orderName,username, nickname } = existingRecord.dto;
                  await widgets.requestPayment({
                    orderId: orderId,
                    orderName: orderName,
                    successUrl: window.location.origin + "/success",
                    failUrl: window.location.origin + "/fail",
                    customerEmail: username,
                    customerName: nickname,
                    customerMobilePhone: "01033337777",
                  });
                  return;
                }
              }
        
              // 4. 기존 기록이 없거나 사용자가 기존 결제로 진행하지 않는 경우 new 임시 기록 생성 후 결제 진행
              if (existingRecord && existingRecord.dto) {
                // 기존 기록을 진행하지 않는 관계로 있던 기존 결제 기록은 지우기.
                await axiosDelete({endpoint:`/api/payment/draft/${user.userId}/READY`});
              }
              const body = {
                userId: user.userId,
                status: "READY",
                orderId: generateRandomString(),
                amount: amount.value,
                customerKey: customerKey,
                orderName: "토스 티셔츠 외 2건",
                creditAmount: 100, //후에 subscrption 페이지랑 연계해서 가져오기
                subscriptionId: 3 //후에 subscrption 페이지랑 연계해서 가져오기
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
