// src/studentDashboard/pages/ResetPasswordPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleReset = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill all fields!");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        alert("User not logged in!");
        navigate("/", { replace: true });
        return;
      }

      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      await updatePassword(user, newPassword);

      alert("Password reset successfully!");
      
      navigate("/", { replace: true });
      
    } catch (error) {
      console.error(error);
      if (error.code === "auth/wrong-password") {
        alert("Current password is incorrect!");
      } else if (error.code === "auth/weak-password") {
        alert("New password is too weak!");
      } else {
        alert("Error resetting password: " + error.message);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-gradient-to-r from-blue-50 to-green-50 justify-center items-center p-4">
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-3xl p-8 w-full max-w-md">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-center text-blue-800">
          Reset Password
        </h1>

        <div className="flex flex-col gap-5 text-gray-800 text-base md:text-lg">
          <div className="flex flex-col">
            <label className="mb-2 font-semibold">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="border rounded-xl p-3 focus:outline-none focus:ring-4 focus:ring-blue-400 transition shadow-inner"
              placeholder="Enter current password"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 font-semibold">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border rounded-xl p-3 focus:outline-none focus:ring-4 focus:ring-blue-400 transition shadow-inner"
              placeholder="Enter new password"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 font-semibold">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border rounded-xl p-3 focus:outline-none focus:ring-4 focus:ring-blue-400 transition shadow-inner"
              placeholder="Confirm new password"
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4">
          <button
            onClick={handleReset}
            className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-2xl hover:bg-blue-700 transition text-lg"
          >
            Reset Password
          </button>

          <button
            onClick={() => navigate("/student/profile", { replace: true })}
            className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl shadow-lg hover:shadow-2xl hover:bg-gray-800 transition text-lg"
          >
            Back to Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;