import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "../context/AuthContext"; 
import ProtectedRoute from "../components/ProtectedRoute";
import Layout from "../components/Layout";


import Login from "../pages/Login.jsx";
import StudentModule from "../studentDashboard/StudentModule.jsx";

const AppRoutes = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
         
          <Route path="/" element={<Login />} />

         
          <Route 
            path="/student/*" 
            element={
              <ProtectedRoute>
                <StudentModule />
              </ProtectedRoute>
            } 
          />

         
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default AppRoutes;