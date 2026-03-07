// src/studentDashboard/pages/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const studentDoc = await getDoc(doc(db, "users", user.uid));

          if (studentDoc.exists()) {
            const data = studentDoc.data();

            if (data.role !== "student") {
              alert("You are not authorized to access the student profile.");
              await signOut(auth);
              navigate("/");
              return;
            }

            setStudent({
              name: data.fullName || data.name,
              code: data.code,
              level: data.academicYear || data.level,
              department: data.department,
            });
          } else {
            setError("User data not found!");
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
          setError("حدث خطأ في جلب البيانات");
        }
      } else {
        navigate("/");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-2xl">
        جاري التحميل...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-2xl">
        {error}
      </div>
    );

  if (!student) return null;

  return (
    <div className="p-6 min-h-screen bg-gradient-to-r from-blue-50 to-green-50 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold mb-10 text-gray-900 text-center">
        Student Profile
      </h1>

      <div className="bg-gradient-to-r from-blue-100 to-green-100 p-8 rounded-3xl shadow-3xl w-full max-w-md relative overflow-hidden">
        <div className="w-24 h-24 bg-blue-500 rounded-full mx-auto mb-6 shadow-lg flex items-center justify-center text-white text-2xl font-bold">
          {student.name?.split(" ").map((n) => n[0]).join("") || "👤"}
        </div>

        <div className="grid grid-cols-1 gap-4 text-gray-800">
          <p className="p-3 bg-white rounded-lg shadow hover:shadow-xl transition">
            <span className="font-bold">Name:</span> {student.name}
          </p>
          <p className="p-3 bg-white rounded-lg shadow hover:shadow-xl transition">
            <span className="font-bold">Code:</span> {student.code}
          </p>
          <p className="p-3 bg-white rounded-lg shadow hover:shadow-xl transition">
            <span className="font-bold">Level:</span> {student.level}
          </p>
          <p className="p-3 bg-white rounded-lg shadow hover:shadow-xl transition">
            <span className="font-bold">Department:</span> {student.department}
          </p>
        </div>

        <div className="flex flex-col gap-4 mt-8">
          <button
            onClick={() => navigate("/student/reset-password")}
            className="px-8 py-3 bg-red-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-2xl hover:bg-red-600 transition"
          >
            Reset Password
          </button>

          <button
            onClick={() => navigate("/student")}
            className="px-8 py-3 bg-blue-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-2xl hover:bg-blue-700 transition"
          >
            Back to Main
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;