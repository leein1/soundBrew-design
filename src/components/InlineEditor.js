// src/components/InlineEditor.jsx
import React from "react";

const InlineEditor = ({
  isEditing,
  fieldName,
  value,
  editedValue,
  onChange,
}) => {
  return isEditing ? (
    <input
      type="text"
      name={fieldName}
      value={editedValue || ""}
      onChange={onChange}
      className="editable-field"
    />
  ) : (
    <span className="current-value">{value}</span>
  );
};

export default InlineEditor;
