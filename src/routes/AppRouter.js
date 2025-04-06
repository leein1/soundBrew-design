//AppRouter.js
import { Routes, Route, Navigate } from "react-router-dom";
// // import { useEffect } from "react";

// // 페이지 리다이렉트 기능
// import FullPageRedirect from "../components/FullPageRedirect";

// // 페이지 접근 권한 기능
// import ProtectedRoute from "../components/ProtectedRoute";

// 페이지 레이아웃
import Layout from "../components/layouts/Layout"

// 페이지들. (./pages/(...))
// import ChangePassword from "../pages/ChangePW.js"
import Login from "../pages/security/Login"


const AppRouter = () => {
 return (
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        {/* <Route path="/me/change-password" element={<ChangePassword />} /> */}
        {/* <Route path="/me/info" element={<UserInfo />} /> */}

        {/* 예를 들어 로그인은 전체 새로고침으로 Spring Boot 로그인 페이지로 이동 */}
        <Route path="/" element={<Layout />}>
          <Route path="/login" element={<Login />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
        {/* <Route path="/me/change-password" element={<ProtectedRoute allowedRoles={['ROLE_USER']}><ChangePassword /></ProtectedRoute>} /> */}
      </Routes>
  );
};

export default AppRouter;