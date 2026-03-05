import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import ForgetPassword from "../pages/ForgetPassword.jsx";
import RequestEmail from "../pages/RequestEmail.jsx"; 
import Admin from "../pages/Admin.jsx";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/request-email" element={<RequestEmail />} /> 
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;