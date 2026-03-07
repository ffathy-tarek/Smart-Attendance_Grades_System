// src/studentDashboard/pages/SubjectDetailsPage.jsx
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSubjectByName } from "../data/subjectData";

const SubjectDetailsPage = () => {
  const navigate = useNavigate();
  const { subjectName } = useParams();

  const subject = getSubjectByName(subjectName);

  if (!subject) {
    return (
      <div className="p-6 min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-extrabold mb-4 text-red-600">Subject Not Found</h1>
        <button
          onClick={() => navigate("/student/grades")}
          className="px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl"
        >
          Back to Grades
        </button>
      </div>
    );
  }

  const totalAttendance = subject.attendance.length;
  const presentCount = subject.attendance.filter(a => a.status === "Present").length;
  const attendancePercentage = Math.round((presentCount / totalAttendance) * 100);

  const gradesList = [
    { exam: "Midterm", score: subject.grades.midterm },
    { exam: "Quizzes", score: subject.grades.quizzes },
    { exam: "Final", score: subject.grades.final },
  ];

  if (subject.grades.lab) {
    gradesList.push({ exam: "Lab", score: subject.grades.lab });
  }

  const totalScore = gradesList.reduce((acc, curr) => acc + curr.score, 0);
  const maxPossible = subject.grades.lab ? 400 : 300;
  const overallPercentage = Math.round((totalScore / maxPossible) * 100);

  const attendanceByMonth = subject.attendance.reduce((acc, record) => {
    const month = record.date.substring(0, 7);
    if (!acc[month]) {
      acc[month] = { total: 0, present: 0, absent: 0 };
    }
    acc[month].total++;
    if (record.status === "Present") {
      acc[month].present++;
    } else {
      acc[month].absent++;
    }
    return acc;
  }, {});

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900">
          {subject.fullName}
        </h1>
        <p className="text-xl text-blue-600 mt-2">📘 {subject.name} | {subject.code}</p>
      </div>

      <div className="mb-8 bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-2xl shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-blue-100">Total Score</p>
            <p className="text-3xl font-bold">{totalScore}/{maxPossible}</p>
          </div>
          <div>
            <p className="text-blue-100">Overall Percentage</p>
            <p className="text-3xl font-bold">{overallPercentage}%</p>
          </div>
          <div>
            <p className="text-blue-100">Attendance Rate</p>
            <p className="text-3xl font-bold">{attendancePercentage}%</p>
          </div>
        </div>
      </div>

      <div className="mb-8 p-6 bg-white rounded-2xl shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-xl">📋 Attendance Record</h2>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-bold">
              ✅ {presentCount} Present
            </span>
            <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-bold">
              ❌ {totalAttendance - presentCount} Absent
            </span>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Attendance Rate</span>
            <span className="text-sm font-medium text-gray-700">{attendancePercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className={`h-4 rounded-full ${attendancePercentage >= 75 ? "bg-green-500" : "bg-red-500"}`}
              style={{ width: `${attendancePercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(attendanceByMonth).map(([month, data]) => (
            <div key={month} className="bg-gray-50 p-3 rounded-lg">
              <h3 className="font-semibold mb-2">{month}</h3>
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Present: {data.present}</span>
                <span className="text-red-600">Absent: {data.absent}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${(data.present / data.total) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-100 text-gray-900">
                <th className="border px-4 py-2 text-left">Date</th>
                <th className="border px-4 py-2 text-left">Day</th>
                <th className="border px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {subject.attendance.map((row, idx) => {
                const date = new Date(row.date);
                const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                const weekDay = weekDays[date.getDay()];
                
                return (
                  <tr
                    key={idx}
                    className={`transition hover:bg-blue-50 ${
                      row.status === "Absent" ? "bg-red-50" : ""
                    }`}
                  >
                    <td className="border px-4 py-2">{row.date}</td>
                    <td className="border px-4 py-2 text-gray-600">{weekDay}</td>
                    <td className={`border px-4 py-2 font-semibold ${
                      row.status === "Absent" ? "text-red-600" : "text-green-600"
                    }`}>
                      <span className="flex items-center gap-1">
                        {row.status === "Present" ? "✅" : "❌"} {row.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-8 p-6 bg-white rounded-2xl shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-xl">📊 Grades Breakdown</h2>
          <span className="text-lg font-bold text-blue-600">{overallPercentage}% Overall</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {gradesList.map((grade, idx) => (
            <div key={idx} className="bg-gray-50 p-4 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-700">{grade.exam}</span>
                <span className={`font-bold text-lg ${
                  grade.score >= 85 ? "text-green-600" :
                  grade.score >= 70 ? "text-yellow-600" : "text-red-600"
                }`}>
                  {grade.score}/100
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${
                    grade.score >= 85 ? "bg-green-500" :
                    grade.score >= 70 ? "bg-yellow-500" : "bg-red-500"
                  }`}
                  style={{ width: `${grade.score}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-green-100 text-gray-900">
                <th className="border px-4 py-2 text-left">Exam</th>
                <th className="border px-4 py-2 text-left">Score</th>
                <th className="border px-4 py-2 text-left">Progress</th>
              </tr>
            </thead>
            <tbody>
              {gradesList.map((row, idx) => (
                <tr key={idx} className="hover:bg-green-50 transition">
                  <td className="border px-4 py-2 font-medium">{row.exam}</td>
                  <td className="border px-4 py-2 font-bold">{row.score}</td>
                  <td className="border px-4 py-2">
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-3 rounded-full transition-all duration-1000 ${
                          row.score >= 85 ? "bg-green-500" :
                          row.score >= 70 ? "bg-yellow-400" : "bg-red-500"
                        }`}
                        style={{ width: `${row.score}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={() => navigate("/student/attendance")}
          className="px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-2xl hover:bg-blue-700 transition"
        >
          ← Back to Attendance
        </button>
        <button
          onClick={() => navigate("/student/grades")}
          className="px-6 py-3 bg-green-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-2xl hover:bg-green-700 transition"
        >
          View All Grades
        </button>
        <button
          onClick={() => navigate("/student")}
          className="px-6 py-3 bg-gray-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-2xl hover:bg-gray-700 transition"
        >
          Dashboard
        </button>
      </div>
    </div>
  );
};

export default SubjectDetailsPage;