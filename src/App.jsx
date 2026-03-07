import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./studentDashboard/context/AuthContext";
import ProtectedRoute from "./studentDashboard/components/ProtectedRoute";

import Login from "./pages/Login";
import ForgetPassword from "./pages/ForgetPassword";
import RequestEmail from "./pages/RequestEmail";
import StudentModule from "./studentDashboard/StudentModule";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/request-email" element={<RequestEmail />} />

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
      </AuthProvider>
    </BrowserRouter>
  );
}
export default App;