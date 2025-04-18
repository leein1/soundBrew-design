// src/components/ProfileModal.jsx
import React, { useState } from 'react';
import { axiosPost, callRefresh } from 'api/standardAxios';
import TokenUtil from 'utils/token/tokenUtil';
import { useNavigate } from 'react-router-dom';

const ProfileModal = ({ show, setShow }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  // 1) 파일 선택 & 미리보기
  const handleImageChange = e => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  // 2) 제출 핸들러: 유효성 검사 → FormData → axiosPost → 모달 닫기/네비게이트
  const handleSubmit = async e => {
    e.preventDefault();

    // 2‑1) 파일 유효성 검사
    if (!file) {
      return alert("파일을 업로드해주세요.");
    }
    if (file.size > 2 * 1024 * 1024) {
      return alert("이미지 크기는 2MB를 초과할 수 없습니다.");
    }
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['jpg','jpeg','png'].includes(ext)) {
      return alert("허용된 파일 형식은 jpg, jpeg, png 입니다.");
    }

    // 2‑2) FormData 조립
    const formData = new FormData();
    formData.append('file', file);

    // (선택) userId 첨부
    const token = TokenUtil.getToken();
    const userInfo = TokenUtil.getUserInfo(token);
    formData.append('userId', userInfo.userId);

    // 2‑3) 서버 요청
    try {
      await axiosPost({
        endpoint: '/api/files/profiles',
        body: formData,
        handle: {
          success: {
            location: '/',
            callback: async () => {
              await callRefresh();
            }
          },
        }
      });
      // 2‑4) 모달 닫고, 이동
      setShow(false);
      navigate('/sounds/tracks');
    } catch (err) {
      console.error(err);
      alert('업로드에 실패했습니다.');
    }
  };

  // show가 false면 렌더하지 않거나 hidden 클래스 처리
  if (!show) return null;

  return (
    <div className="profile-modal">
      <div className="modal-content profile-modal-content">
        <h2>프로필 사진 변경</h2>
        <form onSubmit={handleSubmit}>
          <input type="file" id="profileInput" accept=".jpg,.jpeg,.png" onChange={handleImageChange} />
          {preview && (
            <div className="preview-container">
              <img src={preview} alt="미리보기" />
            </div>
          )}
          <button type="submit" className="primary-button">
            저장
          </button>
          <button type="button" className="secondary-button" onClick={() => setShow(false)}>
            취소
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
