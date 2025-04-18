import React from "react";
import { Navigate } from "react-router-dom";
import TokenUtil from "utils/token/tokenUtil";

const ProtectedRoute = ({ allowedRoles, children }) => {
  // 1. 토큰 유효성 먼저 검사
  const token = TokenUtil.getToken();
  if (!token || TokenUtil.isTokenExpired(token)) {
    alert("로그인이 필요한 서비스입니다. 먼저 로그인해주세요.");
    return <Navigate to="/login" replace />;
  }

  // 2. 토큰 디코딩 및 사용자 정보 획득
  let userInfo;
  try {
    userInfo = TokenUtil.getUserInfo(token);
  } catch (error) {
    alert("로그인 정보 확인 중 문제가 발생했습니다. 다시 로그인해주세요.");
    return <Navigate to="/login" replace />;
  }

  // 3. roles 프로퍼티 체크
  const roles = userInfo?.roles;
  if (!roles || !Array.isArray(roles)) {
    alert("사용자 정보가 올바르지 않습니다. 다시 로그인해주세요.");
    return <Navigate to="/login" replace />;
  }

  // 4. 권한 비교
  const isAuthorized = allowedRoles.some((role) => roles.includes(role));
  if (!isAuthorized) {
    alert("이 페이지에 접근할 수 있는 권한이 없습니다.");
    return <Navigate to="/" replace />;
  }

  // 5. 통과 시 자식 요소 렌더
  return <>{children}</>;
};

export default ProtectedRoute;
