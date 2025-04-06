// src/components/ProtectedRoute.js
import { Navigate } from "react-router-dom";
import TokenUtil from "../utils/token/tokenUtil";

const ProtectedRoute = ({ allowedRoles, children }) => {
  // localStorage에서 토큰을 가져옴
  const token = TokenUtil.getToken();
  
  // 토큰이 없거나 만료되었으면 로그인 페이지로 이동
  if (!token || TokenUtil.isTokenExpired(token)) {
    alert("로그인을 안하신 상태네요? ProtectedRoute가 알려드렸습니다?");
    // return <Navigate to="/login1" replace />;
  }
  
  // 토큰에서 사용자 정보를 추출
  const userInfo = TokenUtil.getUserInfo(token);
  
  if (!userInfo || !userInfo.roles) {
    alert("토큰의 getUserInfo를 실패했네요? ProtectedRoute가 알려드렸습니다?");
    // return <Navigate to="/login2" replace />;
  }
  
  // 현재 사용자의 역할이 allowedRoles에 포함되어 있는지 확인
  const isAuthorized = allowedRoles.some(role => userInfo.roles.includes(role));
  alert("33");
  if (!isAuthorized) {
    alert("접근 권한이 없습니다.");
    return <Navigate to="/3" replace />;
  }
  
  return children;
};

export default ProtectedRoute;
