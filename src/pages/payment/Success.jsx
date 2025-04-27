import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "context/authContext";
import { axiosGet, axiosPatch, axiosPost, callRefresh } from "api/standardAxios";

export function SuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [responseData, setResponseData] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    async function verifyAndProcessPayment() {
      try {
        // 결제 검증: user.userId와 READY 상태를 사용하여 결제 내역 검증
        const verificationResponse = await axiosGet({endpoint: `/api/payment/verification/${user.userId}/READY`,});
        const dto = verificationResponse.dto;

        // URL의 파라미터와 API 응답의 데이터 일치 여부 확인
        if (
          dto.orderId === searchParams.get("orderId") &&
          String(dto.amount) === searchParams.get("amount")
        ) {
          // 토스에서 제공하는 confirm() 함수를 호출하여 결제 확정 처리
          const confirmResult = await confirm();
          setResponseData(confirmResult);

          // 트랜잭션 데이터 생성 (결제 결과 기록용)
          const transaction = {
            userId: user.userId, // user 객체 내의 식별자 이름을 확인하세요.
            amount: dto.amount,
            paymentKey: searchParams.get("paymentKey"),
            orderId: dto.orderId,
            customerKey: dto.customerKey,
            orderName: dto.orderName,
            creditAmount: dto.creditAmount,
            subscriptionId: dto.subscriptionId,
          };

          // 결제 검증 정보를 업데이트하고
          await axiosPatch({ endpoint: "/api/payment/verification", body: dto });
          // 결제 트랜잭션 정보를 저장합니다.
          await axiosPost({ endpoint: "/api/payment/transaction", body: transaction });

          // 재 로그인을 통한 구독제 갱신
          await callRefresh();
        } else {
          // 검증 실패 시 실패 페이지로 이동
          console.error("결제 검증 실패: 정보 불일치", {
            expected: {
              orderId: searchParams.get("orderId"),
              amount: searchParams.get("amount"),
              paymentKey: searchParams.get("paymentKey"),
            },
            received: dto,
          });
          navigate(
            "/fail?code=verification_error&message=결제 정보가 일치하지 않습니다."
          );
        }
      } catch (error) {
        console.error("결제 검증 및 처리 중 에러 발생", error);
        navigate(
          `/fail?code=${error.code || "unknown_error"}&message=${
            error.message || "결제 검증 및 처리 중 에러가 발생했습니다."
          }`
        );
      }
    }

    verifyAndProcessPayment();
  }, [searchParams, user, navigate]);

  // 토스에서 제공하는 confirm() 함수는 그대로 유지합니다.
  async function confirm() {
    const requestData = {
      orderId: searchParams.get("orderId"),
      amount: searchParams.get("amount"),
      paymentKey: searchParams.get("paymentKey"),
    };

    const response = await fetch("https://api.soundbrew.art/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    });
    const json = await response.json();

    if (!response.ok) {
      throw { message: json.message, code: json.code };
    }

    return json;
  }

  return (
    <>
      <div className="box_section" style={{ width: "600px" }}>
        <img
          width="100px"
          src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png"
          alt="결제 완료"
        />
        <h2>결제를 완료했어요</h2>
        <div className="p-grid typography--p" style={{ marginTop: "50px" }}>
          <div className="p-grid-col text--left">
            <b>결제금액</b>
          </div>
          <div className="p-grid-col text--right" id="amount">
            {`${Number(searchParams.get("amount")).toLocaleString()}원`}
          </div>
        </div>
        <div className="p-grid typography--p" style={{ marginTop: "10px" }}>
          <div className="p-grid-col text--left">
            <b>주문번호</b>
          </div>
          <div className="p-grid-col text--right" id="orderId">
            {searchParams.get("orderId")}
          </div>
        </div>
        <div className="p-grid typography--p" style={{ marginTop: "10px" }}>
          <div className="p-grid-col text--left">
            <b>paymentKey</b>
          </div>
          <div
            className="p-grid-col text--right"
            id="paymentKey"
            style={{ whiteSpace: "initial", width: "250px" }}
          >
            {searchParams.get("paymentKey")}
          </div>
        </div>
        <div className="p-grid-col">
          <Link to="https://docs.tosspayments.com/guides/v2/payment-widget/integration">
            <button className="button p-grid-col5">연동 문서</button>
          </Link>
          <Link to="https://discord.gg/A4fRFXQhRu">
            <button
              className="button p-grid-col5"
              style={{ backgroundColor: "#e8f3ff", color: "#1b64da" }}
            >
              실시간 문의
            </button>
          </Link>
        </div>
      </div>
      <div className="box_section" style={{ width: "600px", textAlign: "left" }}>
        <b>Response Data :</b>
        <div id="response" style={{ whiteSpace: "initial" }}>
          {responseData && <pre>{JSON.stringify(responseData, null, 4)}</pre>}
        </div>
      </div>
    </>
  );
}
