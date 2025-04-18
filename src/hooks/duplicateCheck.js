// src/hooks/useDuplicateCheck.js
import { useState, useEffect } from 'react';
import { axiosPost } from 'api/standardAxios';

const useDuplicateCheck = (value, endpoint) => {
  const [available, setAvailable] = useState(false);
  const [statusColor, setStatusColor] = useState("gray");

  useEffect(() => {
    if (value.trim() === "") return;
    setStatusColor("orange");
    const timer = setTimeout(async () => {
      try {
        const payload = { [endpoint.includes("email") ? "email" : "nickname"]: value };
        const response = await axiosPost({ endpoint, body: payload });
        setAvailable(response.available);
        setStatusColor(response.available ? "limegreen" : "red");
      } catch (err) {
        setAvailable(false);
        setStatusColor("red");
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [value, endpoint]);

  return { available, statusColor };
};

export default useDuplicateCheck;
