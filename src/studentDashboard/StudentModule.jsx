// src/studentDashboard/StudentModule.jsx
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import DashboardMainPage from "./pages/DashboardMainPage";
import GradesPage from "./pages/GradesPage";
import AttendancePage from "./pages/AttendancePage";
import ProfilePage from "./pages/ProfilePage";
import SubjectDetailsPage from "./pages/SubjectDetailsPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

const StudentModule = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<DashboardMainPage />} />
        <Route path="grades" element={<GradesPage />} />
        <Route path="attendance" element={<AttendancePage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="subject/:subjectName" element={<SubjectDetailsPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
      </Route>
    </Routes>
  );
};

export default StudentModule;