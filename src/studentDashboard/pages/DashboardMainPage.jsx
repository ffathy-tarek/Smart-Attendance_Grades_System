// src/studentDashboard/pages/DashboardMainPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { subjectsData, getAttendancePercentage } from "../data/subjectData";

const DashboardMainPage = () => {
  const navigate = useNavigate();

  const totalSubjects = subjectsData.length;
  const lowAttendanceSubjects = subjectsData.filter(sub => 
    getAttendancePercentage(sub.attendance) < 70
  );

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-900 text-center">
        Welcome Back! 👋
      </h1>

      {lowAttendanceSubjects.length > 0 && (
        <div className="mb-6 p-3 bg-yellow-100 border-l-4 border-yellow-400 text-yellow-900 rounded-lg shadow max-w-xl mx-auto text-center animate-pulse">
          ⚠️ Attention: You have low attendance in {lowAttendanceSubjects.length} subject(s)
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjectsData.map((subject, idx) => {
          const attendancePercentage = getAttendancePercentage(subject.attendance);
          
          const grades = subject.grades;
          const totalGrades = grades.midterm + grades.quizzes + grades.final + (grades.lab || 0);
          const maxPossible = grades.lab ? 400 : 300;
          const gradePercentage = Math.round((totalGrades / maxPossible) * 100);
          
          const presentCount = subject.attendance.filter(a => a.status === "Present").length;
          const totalSessions = subject.attendance.length;

          return (
            <div
              key={idx}
              className="bg-white p-4 rounded-lg shadow-xl hover:scale-105 hover:shadow-2xl transition-transform cursor-pointer relative overflow-hidden"
              onClick={() => navigate(`/student/subject/${subject.name}`)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-green-200 opacity-15 rounded-lg blur-2xl pointer-events-none"></div>

              <div className="relative z-10">
                <h2 className="font-bold text-lg mb-1 text-gray-900">{subject.name}</h2>
                <p className="text-sm text-gray-600 mb-3">{subject.fullName}</p>
                <p className="text-xs text-blue-600 mb-2">{subject.code}</p>

                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <p className="text-gray-700 font-medium">Attendance</p>
                    <p className={`font-bold ${attendancePercentage >= 75 ? "text-green-600" : "text-red-600"}`}>
                      {attendancePercentage}% ({presentCount}/{totalSessions})
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-1000 ${
                        attendancePercentage >= 75 ? "bg-blue-500" : "bg-red-500"
                      }`}
                      style={{ width: `${attendancePercentage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <p className="text-gray-700 font-medium">Average Grade</p>
                    <p className={`font-bold ${
                      gradePercentage >= 85 ? "text-green-600" : 
                      gradePercentage >= 70 ? "text-yellow-600" : "text-red-600"
                    }`}>
                      {gradePercentage}%
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-1000 ${
                        gradePercentage >= 85 ? "bg-green-500" : 
                        gradePercentage >= 70 ? "bg-yellow-500" : "bg-red-500"
                      }`}
                      style={{ width: `${gradePercentage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs">
                  <div className="text-center">
                    <span className="text-gray-500">Midterm</span>
                    <p className="font-bold text-gray-700">{subject.grades.midterm}</p>
                  </div>
                  <div className="text-center">
                    <span className="text-gray-500">Final</span>
                    <p className="font-bold text-gray-700">{subject.grades.final}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/student/attendance")}
          className="py-3 bg-blue-600 text-white font-bold rounded-lg shadow hover:shadow-xl hover:bg-blue-700 transition flex items-center justify-center gap-2"
        >
          📋 Full Attendance
        </button>
        <button
          onClick={() => navigate("/student/grades")}
          className="py-3 bg-green-600 text-white font-bold rounded-lg shadow hover:shadow-xl hover:bg-green-700 transition flex items-center justify-center gap-2"
        >
          📊 Full Grades
        </button>
        <button
          onClick={() => navigate("/student/profile")}
          className="py-3 bg-gray-600 text-white font-bold rounded-lg shadow hover:shadow-xl hover:bg-gray-700 transition flex items-center justify-center gap-2"
        >
          👤 Profile
        </button>
      </div>
    </div>
  );
};

export default DashboardMainPage;