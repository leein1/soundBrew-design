// src/components/ProfileModal.jsx
import { useState } from 'react';
 
const ProfileModal = () => {
  const [show, setShow] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div className={`profile-modal ${show ? '' : 'hidden'}`}>
      <div className="modal-content profile-modal-content">
        <h2>프로필 사진 변경</h2>
        <form>
          <input type="file" accept=".jpg,.jpeg,.png" onChange={handleImageChange} />
          <div className="preview-container">
            {preview && <img src={preview} alt="미리보기" />}
          </div>
          <button type="submit" className="primary-button">저장</button>
          <button type="button" className="secondary-button" onClick={() => setShow(false)}>취소</button>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
