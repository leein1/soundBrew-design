import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/layouts/Layout";
import MeSoundManage from "../components/layouts/MeSoundManage";
import Sound from "../components/layouts/Sound";
import Login from "../pages/security/Login";
import MySubscription from "../pages/user/MySubscription";
import MyInfo from "../pages/user/MyInfo";
import ChangePW from "../pages/user/ChangePW";
import MeDashboard from "../pages/user/MeDashboard";
import SoundUpload from "../pages/sound/Upload";
import TrackOne from "../pages/sound/TrackOne";   // 상세 트랙 페이지
import AlbumOne from "../pages/sound/AlbumOne";   // 상세 앨범 페이지
import Register from "../pages/user/Register";
import SubscriptionPlans from "../pages/user/SubscriptionPlan";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* User Routes */}
        <Route path="/me/info" element={<MyInfo />} />
        <Route path="/me/change-password" element={<ChangePW />} />
        <Route path="/me/subscription" element={<MySubscription />} />
        <Route path="/me/statistic" element={<MeDashboard />} />
        <Route path="/me/sounds/*" element={<MeSoundManage />} />
        <Route path="/me/sounds/upload" element={<SoundUpload />} />
        {/* Visitor Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/subscription" element={<SubscriptionPlans />} />
        <Route path="/sounds/tracks" element={<Sound />} />
        {/* 상세 페이지 등록 */}
        <Route path="/sounds/tracks/one" element={<TrackOne />} />
        <Route path="/sounds/albums/one" element={<AlbumOne />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRouter;
