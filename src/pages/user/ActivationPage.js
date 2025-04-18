import React, { useState, useMemo } from "react";
import { useCSSLoader } from "hooks/useCSSLoader";
import { serializeFormToJSON } from "utils/serialize/formToJson";
import { axiosPost } from "api/standardAxios";

export default function ActivationPage() {
  const cssFiles = useMemo(() => ["/assets/css/activation.css"], []);
  useCSSLoader(cssFiles);

  const [activationCode, setActivationCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare form data
      const form = e.target;
      const jsonData = serializeFormToJSON(form);

      const handle = {
        success: {
          message: "인증되었습니다. 로그인 해주세요",
          location: "/login",
        },
        failure: {
          message:
            "서비스 오류 입니다. 잠시 후 다시 시도 해주세요. 지속적인 문제 발생시 문의 해주세요.",
          location: "/activation",
        },
      };

      await axiosPost({
        endpoint: "/api/verification/activation",
        body: jsonData,
        handle,
      });
    } catch (err) {
      console.error("Activation error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="content-header">메일 인증하기</div>

      <div className="content-body">
        <form id="activation-form" className="activation-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="activationCode">
              인증 문자를 입력해주세요 (띄워쓰기 없이 입력해주세요)
            </label>
            <input
              type="text"
              id="activationCode"
              name="activationCode"
              placeholder="인증 문자 입력"
              value={activationCode}
              onChange={(e) => setActivationCode(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "인증 중..." : "인증하기"}
          </button>
        </form>
      </div>
    </div>
  );
}
