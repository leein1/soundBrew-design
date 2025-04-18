import React, { useState, useEffect } from "react";

let toastIdCounter = 0;

export default function GlobalAlertToast() {
  // 여러 개의 토스트 메시지를 배열로 관리
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const nativeAlert = window.alert;

    window.alert = (msg) => {
      const id = toastIdCounter++;
      // 새 토스트 추가
      setToasts((prev) => [...prev, { id, message: msg }]);

      // 2초 뒤에 해당 토스트만 제거
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 2000);
    };

    return () => {
      window.alert = nativeAlert;
    };
  }, []);

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className="global-toast show">
          {toast.message}
        </div>
      ))}
    </div>
  );
}
