//AppRouter.js
import { Routes, Route, Navigate } from "react-router-dom";
// // import { useEffect } from "react";

// // 페이지 리다이렉트 기능
// import FullPageRedirect from "../components/FullPageRedirect";

// // 페이지 접근 권한 기능
// import ProtectedRoute from "../components/ProtectedRoute";

// 페이지 레이아웃
import Layout from "../components/layouts/Layout"

// 부모 컴포넌트
import MeSoundManage from "../components/layouts/MeSoundManage";
import Sound from "../components/layouts/Sound";

// 컴포넌트 (./pages/(...))
import Login from "../pages/security/Login"
import MySubscription from "../pages/user/MySubscription";
import MyInfo from "../pages/user/MyInfo";
import ChangePW from "../pages/user/ChangePW";
import MeDashboard from "../pages/user/MeDashboard";
import SoundUpload from "../pages/sound/Upload";
import Register from "../pages/user/Register";
import SubscriptionPlans from "../pages/user/SubscriptionPlan";



const AppRouter = () => {
 return (
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        {/* <Route path="/me/change-password" element={<ChangePassword />} /> */}
        {/* <Route path="/me/info" element={<UserInfo />} /> */}

        {/* 예를 들어 로그인은 전체 새로고침으로 Spring Boot 로그인 페이지로 이동 */}
        <Route path="/" element={<Layout />}>
          {/* for ADMIN */}
          {/* <Route path="/admin/statistic" element={} />
          <Route path="/admin/users" element={} />
          <Route path="/admin/albums" element={} /> */}

          {/* for User */}
          <Route path="/me/info" element={<MyInfo/>} />
          <Route path="/me/change-password" element={<ChangePW/>} />
          <Route path="/me/subscription" element={<MySubscription/>} />
          <Route path="/me/statistic" element={<MeDashboard/>} />
          <Route path="/me/sounds/*" element={<MeSoundManage />} /> {/* 부모 컴포넌트*/}
          <Route path="/me/sounds/upload" element={<SoundUpload/>} />

          {/* for visitor */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register/>} />
          <Route path="/subscription" element={<SubscriptionPlans/>} />
          <Route path="/sounds/tracks" element={<Sound/>} />
          {/* <Route path="/sounds/albums" element={} /> */}
          {/* <Route path="" element={} /> */}
          
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
        {/* <Route path="/me/change-password" element={<ProtectedRoute allowedRoles={['ROLE_USER']}><ChangePassword /></ProtectedRoute>} /> */}
      </Routes>
  );
};

export default AppRouter;