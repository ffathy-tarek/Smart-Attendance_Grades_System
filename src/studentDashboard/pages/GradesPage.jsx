// src/studentDashboard/pages/GradesPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { subjectsData, getAttendancePercentage } from "../data/subjectData";

const GradesPage = () => {
  const navigate = useNavigate();

  const calculateTotal = (grades) => {
    return grades.midterm + grades.quizzes + grades.final + (grades.lab || 0);
  };

  const calculatePercentage = (grades) => {
    const total = calculateTotal(grades);
    const maxPossible = (grades.lab ? 400 : 300);
    return Math.round((total / maxPossible) * 100);
  };

  const getScoreColor = (score) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getBarColor = (percentage) => {
    if (percentage >= 85) return "bg-green-500";
    if (percentage >= 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-900 text-center">
        📚 Grades Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {subjectsData.map((subject, idx) => {
          const total = calculateTotal(subject.grades);
          const percentage = calculatePercentage(subject.grades);
          const barColor = getBarColor(percentage);
          const attendancePercentage = getAttendancePercentage(subject.attendance);

          return (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer"
              onClick={() => navigate(`/student/subject/${subject.name}`)}
            >
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4">
                <h2 className="text-xl font-bold text-white">{subject.name}</h2>
                <p className="text-blue-100 text-sm">{subject.fullName}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-blue-100">Total: {total}/{(subject.grades.lab ? 400 : 300)}</span>
                  <span className="text-white font-bold">{percentage}%</span>
                </div>
                <div className="w-full bg-white/30 rounded-full h-2 mt-2">
                  <div
                    className={`${barColor} h-2 rounded-full transition-all duration-1000`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                  <span className="font-semibold text-gray-700">📝 Midterm</span>
                  <span className={`font-bold ${getScoreColor(subject.grades.midterm)}`}>
                    {subject.grades.midterm}/100
                  </span>
                </div>

                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                  <span className="font-semibold text-gray-700">📊 Quizzes</span>
                  <span className={`font-bold ${getScoreColor(subject.grades.quizzes)}`}>
                    {subject.grades.quizzes}/100
                  </span>
                </div>

                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                  <span className="font-semibold text-gray-700">🎯 Final</span>
                  <span className={`font-bold ${getScoreColor(subject.grades.final)}`}>
                    {subject.grades.final}/100
                  </span>
                </div>

                {subject.grades.lab && (
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                    <span className="font-semibold text-gray-700">🔬 Lab</span>
                    <span className={`font-bold ${getScoreColor(subject.grades.lab)}`}>
                      {subject.grades.lab}/100
                    </span>
                  </div>
                )}

                <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span>📋 Attendance</span>
                    <span className={attendancePercentage >= 75 ? "text-green-600" : "text-red-600"}>
                      {attendancePercentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className={`h-2 rounded-full ${attendancePercentage >= 75 ? "bg-green-500" : "bg-red-500"}`}
                      style={{ width: `${attendancePercentage}%` }}
                    ></div>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/student/subject/${subject.name}`);
                  }}
                  className="w-full mt-3 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                >
                  View Full Details →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl shadow">
          <h3 className="font-bold text-green-800">📊 Average Score</h3>
          <p className="text-2xl font-bold text-green-600">
            {Math.round(subjectsData.reduce((acc, sub) => 
              acc + ((sub.grades.midterm + sub.grades.quizzes + sub.grades.final + (sub.grades.lab || 0)) / (sub.grades.lab ? 4 : 3)), 0
            ) / subjectsData.length)}%
          </p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl shadow">
          <h3 className="font-bold text-blue-800">📚 Total Subjects</h3>
          <p className="text-2xl font-bold text-blue-600">{subjectsData.length}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl shadow">
          <h3 className="font-bold text-purple-800">🏆 Best Attendance</h3>
          <p className="text-2xl font-bold text-purple-600">
            {Math.max(...subjectsData.map(sub => 
              (sub.attendance.filter(a => a.status === "Present").length / sub.attendance.length) * 100
            ))}%
          </p>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={() => navigate("/student")}
          className="px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-2xl hover:bg-blue-700 transition flex items-center gap-2"
        >
          <span>←</span> Back to Main
        </button>
      </div>
    </div>
  );
};

export default GradesPage;