// src/components/FieldWithEdit.jsx
import React from 'react';

const FieldWithEdit = ({ label, value, onChange, isEditing, onEdit, onCancel, onSave, isValid = true, type = "text" }) => {
  const inputClassName = isEditing 
    ? 'border rounded p-2 flex-1 border-orange-500'
    : `border rounded p-2 flex-1 ${isValid ? 'border-gray-300' : 'border-red-500'}`;
  const buttonStyle = isEditing ? { backgroundColor: "orange", color: "white" } : {};

  return (
    <div className="input-group">
      <label>{label}</label>
      <div className="input-with-button">
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          readOnly={!isEditing}
          className={inputClassName}
          style={isEditing ? { borderColor: 'orange' } : {}}
        />
        {!isEditing ? (
          <button type="button" onClick={onEdit}>수정하기</button>
        ) : (
          <>
            <button type="button" onClick={onSave} style={buttonStyle}>수정완료</button>
            <button type="button" onClick={onCancel}>취소하기</button>
          </>
        )}
      </div>
    </div>
  );
};

export default FieldWithEdit;
