// src/hooks/useEditableItem.js
import { useState } from "react";

export const useEditableItem = () => {
  const [editModeId, setEditModeId] = useState(null);
  const [editedData, setEditedData] = useState({});

  const startEdit = (id, initialData) => {
    if (editModeId !== null) {
      alert("다른 항목을 수정 중입니다.");
      return;
    }
    setEditModeId(id);
    setEditedData(initialData);
  };

  const cancelEdit = () => {
    setEditModeId(null);
    setEditedData({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };

  return {
    editModeId,
    editedData,
    isEditing: (id) => editModeId === id,
    startEdit,
    cancelEdit,
    handleChange,
    setEditModeId,
    setEditedData,
  };
};
