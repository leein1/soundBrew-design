// src/components/FullPageRedirect.js
import { useEffect } from "react";

const FullPageRedirect = ({ to }) => {
  useEffect(() => {
    // React 개발 서버에서 Spring Boot 서버의 URL로 이동
    window.location.href = to;
  }, [to]);

  return null;
};

export default FullPageRedirect;