import React, { useState, useMemo } from 'react';
import { useCSSLoader } from 'hooks/useCSSLoader';
import { serializeFormToJSON } from 'utils/serialize/formToJson';
import { inputHandler } from 'utils/check/inputHandler';
import { axiosPost } from 'api/standardAxios';

export default function FindPWPage() {
  const cssFiles = useMemo(() => ['/assets/css/findpw.css'], []);
  useCSSLoader(cssFiles);

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = e.target;
      const jsonData = serializeFormToJSON(form);
      const { errors, processedData } = inputHandler(jsonData, form);

      if (!errors) {
        const handle = {
          success: { location: '/login' },
          failure: { location: '/help/find-password' },
        };

        await axiosPost({
          endpoint: '/api/help/find-password',
          useToken: false,
          body: processedData,
          handle,
        });
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error('FindPW error:', err);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="content-header">비밀번호 찾기</div>
      <div className="content-body">
        <form id="findpw-form" className="findpw-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">이메일 (가입시 등록한 이메일을 입력해주세요)</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="이메일 입력"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="name">이름 (가입시 등록한 이름을 입력해주세요)</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="이름 입력"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
