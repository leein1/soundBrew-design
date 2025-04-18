// src/components/auth/ResetPWPage.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { useCSSLoader } from 'hooks/useCSSLoader';
import { serializeFormToJSON } from 'utils/serialize/formToJson';
import { inputHandler } from 'utils/check/inputHandler';
import { axiosPost } from 'api/standardAxios';

export default function ResetPWPage() {
  // // CSS 파일 한 번만 로드
  const cssFiles = useMemo(() => ['/assets/css/resetpw.css'], []);
  useCSSLoader(cssFiles);

  // 폼 상태 관리
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [borderColor, setBorderColor] = useState('');
  const [loading, setLoading] = useState(false);

  // 비밀번호 일치 여부에 따라 테두리 색상 설정
  useEffect(() => {
    if (!passwordCheck) {
      setBorderColor('');
    } else if (password === passwordCheck) {
      setBorderColor('limegreen');
    } else {
      setBorderColor('red');
    }
  }, [password, passwordCheck]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 로컬 검증: 비밀번호와 확인이 다르면 얼럿 후 리턴
    if (password !== passwordCheck) {
      alert('비밀번호를 다시 확인해주세요');
      return;
    }

    setLoading(true);
    try {
      const form = e.target;
      const jsonData = serializeFormToJSON(form);
      const { errors, processedData } = inputHandler(jsonData, form);

      if (!errors) {
        const handle = {
          success: { location: '/login' },
          failure: { message: '오류가 발생하였습니다. 문의 부탁드립니다.', location: '/login' }
        };

        // ❗ accessToken 헤더 스킵, resetToken 헤더만 붙이기
        await axiosPost({
          endpoint: '/api/help/reset-password',
          body: processedData,
          useToken: false,       // ← accessToken 인증 스킵
          uniqueToken: true,     // ← resetToken 인증만 적용
          handle
        });

        // 사용 후 토큰 제거
        localStorage.removeItem('resetToken');
      }
    } catch (err) {
      console.error('ResetPW error:', err);
      alert('접근 권한이 없습니다.');
      window.location.href = '/login';
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="content-header">비밀번호 변경</div>
      <div className="content-body">
        <form id="resetpw-form" className="resetpw-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="password">
              비밀번호 8글자 이상, 숫자·특수문자·대문자 각각 1개 이상
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password-check">비밀번호 확인</label>
            <input
              type="password"
              id="password-check"
              name="password-check"
              value={passwordCheck}
              onChange={(e) => setPasswordCheck(e.target.value)}
              style={{ borderColor }}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? '처리중...' : '확인'}
          </button>
        </form>
      </div>
    </>
  );
}
