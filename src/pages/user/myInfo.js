import React, { useEffect, useMemo, useState } from 'react';
import { axiosGet, axiosPost, axiosPatch } from '../../api/standardAxios';
import { inputHandler } from '../../utils/check/inputHandler';

import FieldWithEdit from '../../components/FieldWithEdit';
import { useCSSLoader } from '../../hooks/useCSSLoader';

const MyInfo = () => {
  const cssFiles = useMemo(()=>[
    "/assets/css/user/myInfo.css",
  ], []);

  useCSSLoader(cssFiles);

  const [userInfo, setUserInfo] = useState(null);
  const [editMode, setEditMode] = useState({}); // { name: true } 등 한 필드만 수정 가능
  const [nicknameAvailable, setNicknameAvailable] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await axiosGet({ endpoint: "/api/me", useToken: true });
      // dto 내부의 phoneNumber를 세 파트로 분리 (전화번호가 문자열로 "01012341234" 형식으로 온다고 가정)
      const dto = data.dto;
      if (dto.phoneNumber) {
        dto.phone1 = dto.phoneNumber.slice(0, 3);
        dto.phone2 = dto.phoneNumber.slice(3, 7);
        dto.phone3 = dto.phoneNumber.slice(7);
      }
      setUserInfo(dto);
    };
    fetchData();
  }, []);

  // 수정 모드 전환 (한 항목만 동시에 수정 가능)
  const handleEdit = (field) => {
    if (Object.values(editMode).some(Boolean)) {
      alert("다른 항목을 수정 중입니다. 먼저 완료하거나 취소해주세요.");
      return;
    }
    setEditMode({ [field]: true });
  };

  // 수정 취소 시 원래 상태 복원(필요 시 API 재요청 등 추가 가능)
  const handleCancel = () => {
    setEditMode({});
    setNicknameAvailable(true);
    // 전화번호의 경우 원래 값으로 되돌리려면 fetchData를 재호출하거나 로컬 상태를 보존하도록 처리
  };

  // 상태 업데이트 (사용자 입력에 따른 업데이트)
  const handleChange = (field, value) => {
    setUserInfo(prev => ({ ...prev, [field]: value }));
  };

  // 닉네임 입력 후 500ms 후 중복 체크
  const handleNicknameInput = (value) => {
    handleChange("nickname", value);
    setNicknameAvailable(false);
    if (value.trim() === "") return;

    setTimeout(async () => {
      // React에서는 input 엘리먼트 대신 객체로 만들어 전송합니다.
      const inputPayload = { nickname: value };
      try {
        const res = await axiosPost({ endpoint: "/api/verification/nickname", body: inputPayload });
        setNicknameAvailable(res.available);
      } catch {
        setNicknameAvailable(false);
      }
    }, 500);
  };

  // 수정 완료 시, 업데이트 데이터를 구성하여 검증 후 PATCH 요청 실행
  const handleSave = async (field) => {
    // phoneNumber는 각 파트가 4글자인지 검증 (전화번호 전체는 11자리: phone1(3)+phone2(4)+phone3(4))
    if (field === "phoneNumber") {
      if ((userInfo.phone2 || "").length !== 4 || (userInfo.phone3 || "").length !== 4) {
        alert("전화번호를 올바르게 입력해주세요.");
        return;
      }
    }
    if (field === "nickname" && !nicknameAvailable) {
      alert("닉네임 중복입니다. 다른 닉네임을 입력해주세요.");
      return;
    }

    // 업데이트할 필드를 JSON 객체로 구성
    const updatePayload = { userId: userInfo.userId };
    if (field === "phoneNumber") {
      updatePayload.phoneNumber = userInfo.phone1 + userInfo.phone2 + userInfo.phone3;
    } else {
      updatePayload[field] = userInfo[field];
    }

    const { errors, processedData } = inputHandler(updatePayload);
    if (errors) return;

    // PATCH 요청 실행
    try {
      await axiosPatch({ endpoint: "/api/me", body: processedData, useToken: true });
      // alert(`${field} 수정을 완료하였습니다.`);
      setEditMode({});
      // 필요 시, 최신 정보를 다시 가져오거나 로컬 상태 업데이트
    } catch (error) {
      console.error("업데이트 실패:", error);
      alert("수정 중 오류가 발생하였습니다.");
    }
  };

  if (!userInfo) return <div>Loading...</div>;

  return (
    <div className="myInfo-content-body">
      <h2 className="myInfo-content-header">내 정보</h2>
      <form className="myInfo-form" onSubmit={(e) => e.preventDefault()}>
        <div className="input-group">
          <label className="flex justify-between">이메일</label>
          <div className="input-with-button">
            <input 
              type="email" 
              value={userInfo.email} 
              readOnly 
              className="border rounded p-2 w-full" 
            />
          </div>
        </div>

        <FieldWithEdit 
          label="이름" 
          value={userInfo.name}
          isEditing={editMode.name}
          onChange={val => handleChange("name", val)}
          onEdit={() => handleEdit("name")}
          onCancel={handleCancel}
          onSave={() => handleSave("name")}
        />

        <FieldWithEdit
          label="닉네임"
          value={userInfo.nickname}
          isEditing={editMode.nickname}
          onChange={handleNicknameInput}
          isValid={nicknameAvailable}
          onEdit={() => handleEdit("nickname")}
          onCancel={handleCancel}
          onSave={() => handleSave("nickname")}
        />

        <div className="myInfo-form input-group">
          <label>전화번호</label>
          <div className="phone-number">
            {["phone1", "phone2", "phone3"].map((part, i) => (
              <input
                key={i}
                id={part}
                type="text"
                value={userInfo[part] || ''}
                onChange={e => handleChange(part, e.target.value)}
                readOnly={!editMode.phoneNumber}
                style={editMode.phoneNumber ? { borderColor: 'orange' } : {}}
                maxLength={4}
              />
            ))}
          </div>
          {!editMode.phoneNumber ? (
            <button type="button" onClick={() => handleEdit("phoneNumber")}>수정하기</button>
          ) : (
            <div className="flex space-x-2 mt-2">
              <button 
                type="button" 
                onClick={() => handleSave("phoneNumber")}
                style={{ backgroundColor: "orange", color: "white" }}
              >
                수정완료
              </button>
              <button type="button" onClick={handleCancel}>취소하기</button>
            </div>
          )}
        </div>

        <div className="input-group">
          <label>생일</label>
          <input 
            type="date" 
            value={userInfo.birth || ''} 
            readOnly 
            className="border rounded p-2 w-full" 
          />
        </div>
      </form>
    </div>
  );
};

export default MyInfo;
