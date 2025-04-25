// src/router/AppRouter.jsx
import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Layout from "components/layouts/Layout";
import MeSoundManage from "components/user/MeSoundManage";
import Sound from "components/sound/Sound";
import Login from "pages/security/Login";
import MySubscription from "pages/user/MySubscription";
import MyInfo from "pages/user/MyInfo";
import ChangePW from "pages/user/ChangePW";
import MeDashboard from "pages/user/MeDashboard";
import SoundUpload from "pages/sound/Upload";
import TrackOne from "pages/sound/TrackOne";
import AlbumOne from "pages/sound/AlbumOne";
import Register from "pages/user/Register";
import SubscriptionPlans from "pages/user/SubscriptionPlan";
import AdminDashBoard from "pages/user/AdminDashBoard";
import AdminUser from "pages/user/AdminUser";
import Cart from "pages/cart/Cart";
import Activation from "pages/user/ActivationPage";
import Transaction from "pages/cart/Transaction";
import ResetPW from "pages/user/ResetPWPage";
import FindPW from "pages/user/FindPWPage";
import { CheckoutPage } from "pages/payment/Checkout";
import { FailPage } from "pages/payment/Fail";
import { SuccessPage } from "pages/payment/Success";

// 접근 권한
import ProtectedRoute from "components/auth/ProtectedRoute";

const AdminRoutes = () => (
  <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
    <Outlet />
  </ProtectedRoute>
);

const UserRoutes = () => (
  <ProtectedRoute allowedRoles={["ROLE_USER"]}>
    <Outlet />
  </ProtectedRoute>
);


const AppRouter = () => (
  <Routes>
    <Route path="/media/*" element={null} />

    <Route path="/" element={<Layout />}>      
      <Route index element={<Navigate to="/sounds/tracks" replace />} />

      {/* Admin-only Routes */}
      <Route element={<AdminRoutes />}>        
        <Route path="admin/statistic" element={<AdminDashBoard />} />
        <Route path="admin/users" element={<AdminUser />} />
        <Route path="admin/albums" element={<MeSoundManage />} />
        <Route path="admin/tracks" element={<MeSoundManage />} />
        <Route path="admin/tags/spelling" element={<MeSoundManage />} />
        <Route path="admin/albums/verify" element={null} />
      </Route>

      {/* Authenticated User Routes */}
      <Route element={<UserRoutes />}>        
        <Route path="me/info" element={<MyInfo />} />
        <Route path="me/change-password" element={<ChangePW />} />
        <Route path="me/subscription" element={<MySubscription />} />
        <Route path="me/statistic" element={<MeDashboard />} />
        <Route path="me/sounds/*" element={<MeSoundManage />} />
        <Route path="me/sounds/upload" element={<SoundUpload />} />
        <Route path="me/cart" element={<Cart />} />
        <Route path="me/cart/transaction" element={<Transaction />} />

        {/* Payment */}
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="success" element={<SuccessPage />} />
        <Route path="fail" element={<FailPage />} />
      </Route>

      {/* Public Routes */}
      <Route path="help/reset-password" element={<ResetPW />} />
      <Route path="help/find-password" element={<FindPW />} />

      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="activation" element={<Activation />} />
      <Route path="subscription" element={<SubscriptionPlans />} />
      <Route path="sounds/tracks" element={<Sound />} />
      <Route path="sounds/albums" element={<Sound />} />
      <Route path="sounds/tracks/one" element={<TrackOne />} />
      <Route path="sounds/albums/one" element={<AlbumOne />} />


      <Route path="*" element={<Navigate to="/" />} />
    </Route>
  </Routes>
);

export default AppRouter;
