// src/pages/Register.jsx
import React, { useState, useEffect, useMemo } from "react";
import { axiosPost } from "api/standardAxios";
import { inputHandler } from "utils/check/inputHandler";

import useDuplicateCheck from "hooks/duplicateCheck";
import { useCSSLoader } from "hooks/useCSSLoader";

// import "../../assets/css/register.css";

const Register = () => {
  const cssFiles = useMemo(()=>[
    "/assets/css/register.css",
  ], [])

  const cssLoaded = useCSSLoader(cssFiles);

  // 각 입력 필드 상태
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [phone1] = useState("010"); // 고정
  const [phone2, setPhone2] = useState("");
  const [phone3, setPhone3] = useState("");
  const [birth, setBirth] = useState("");

  // 중복 확인 상태 (각각 boolean 및 상태 색상)
  const { available: emailAvailable, statusColor: emailStatusColor } = useDuplicateCheck(email, "/api/verification/email");
  const { available: nicknameAvailable, statusColor: nicknameStatusColor } = useDuplicateCheck(nickname, "/api/verification/nickname");

  // 제출 버튼 disabled 상태
  const [submitting, setSubmitting] = useState(false);

  // 비밀번호 일치 검증: 비밀번호 확인 입력란의 테두리 색상을 반환
  const validatePasswordMatch = () => {
    if (passwordCheck === "") return "";
    return password === passwordCheck ? "limegreen" : "red";
  };

  // 폼 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // 중복 체크 및 기타 검증
    if (!emailAvailable) {
      alert("이메일 중복입니다. 다른 이메일을 입력해주세요.");
      setSubmitting(false);
      return;
    }
    if (!nicknameAvailable) {
      alert("닉네임 중복입니다. 다른 닉네임을 입력해주세요.");
      setSubmitting(false);
      return;
    }
    if (password !== passwordCheck) {
      alert("비밀번호를 다시 확인해주세요.");
      setSubmitting(false);
      return;
    }
    if (phone2.length !== 4 || phone3.length !== 4) {
      alert("전화번호를 올바르게 입력해주세요.");
      setSubmitting(false);
      return;
    }

    // 전화번호 조합
    const fullPhoneNumber = `${phone1}${phone2}${phone3}`;

    // 폼 데이터를 객체로 구성
    const formData = {
      email,
      name,
      nickname,
      password,
      "password-check": passwordCheck,
      birth,
      phoneNumber: fullPhoneNumber,
    };

    // 직렬화 및 입력 검증 (inputHandler는 form 데이터와 form 객체 둘 다 필요하다면, formData를 두 번 전달)
    const { errors, processedData } = inputHandler(formData, formData);
    if (errors) {
      alert("입력값 오류: " + JSON.stringify(errors));
      setSubmitting(false);
      return;
    }

    // 요청 성공/실패 후 처리 옵션
    const handleOption = {
      success: {
        message: "회원가입을 축하드립니다! 메일을 확인해주세요.",
        location: "/activation",
      },
      failure: {
        message: "서비스 오류입니다. 잠시 후 다시 시도해주세요.",
        location: "/register",
      },
    };

    try {
      console.log(processedData);

      alert("!!");
      await axiosPost({ endpoint: "/api/users", body: processedData, handle: handleOption });
    } catch (err) {
      console.error("Error:", err);
      setSubmitting(false);
    }
  };

  if (!cssLoaded) {
    return null; 
  }

  return (
    <div className="content-body">
      <h1>회원가입</h1>
      <form id="register-form" className="register-form" onSubmit={handleSubmit}>
        {/* 이메일 입력 */}
        <div className="input-group">
          <label htmlFor="email" style={{ display: "flex", justifyContent: "space-between" }}>
            <span>이메일</span>
            <span className="duplicate-check-email" style={{ color: emailStatusColor }}>
              중복확인
            </span>
          </label>
          <div className="input-with-button">
            <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
          </div>
        </div>

        {/* 이름 입력 */}
        <div className="input-group">
          <label htmlFor="name">이름</label>
          <div className="input-with-button">
            <input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
        </div>

        {/* 닉네임 입력 */}
        <div className="input-group">
          <label htmlFor="nickname" style={{ display: "flex", justifyContent: "space-between" }}>
            <span>닉네임 (특수문자 없이 2글자 이상)</span>
            <span className="duplicate-check-nickname" style={{ color: nicknameStatusColor }}>
              중복확인
            </span>
          </label>
          <div className="input-with-button">
            <input type="text" id="nickname" name="nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} required />
          </div>
        </div>

        {/* 비밀번호 입력 */}
        <div className="input-group">
          <label htmlFor="password">비밀번호 (8글자 이상, 숫자, 특수문자, 대문자 1개 이상)</label>
          <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
        </div>

        {/* 비밀번호 확인 입력 */}
        <div className="input-group">
          <label htmlFor="password-check">비밀번호 확인</label>
          <input type="password" id="password-check" name="password-check" value={passwordCheck} 
                onChange={(e) => setPasswordCheck(e.target.value)} required style={{ borderColor: validatePasswordMatch() }}/>
        </div>

        {/* 전화번호 입력 */}
        <div className="input-group">
          <label>전화번호</label>
          <div className="phone-number">
            <input type="text" id="phone1" value={phone1} readOnly />
            <input type="text" id="phone2" maxLength="4" value={phone2} onChange={(e) => setPhone2(e.target.value)} pattern="\d{4}" required />
            <input type="text" id="phone3" maxLength="4" value={phone3} onChange={(e) => setPhone3(e.target.value)} pattern="\d{4}" required />
          </div>
        </div>

        {/* 생일 입력 */}
        <div className="input-group">
          <label htmlFor="birth">생일</label>
          <input type="date" id="birth" name="birth" value={birth} onChange={(e) => setBirth(e.target.value)} required />
        </div>

        <input type="hidden" name="phoneNumber" id="phoneNumber" />

        <button type="submit" disabled={submitting}>
          회원가입
        </button>
      </form>
    </div>
  );
};

export default Register;
