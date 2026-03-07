// src/studentDashboard/pages/AttendancePage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { subjectsData } from "../data/subjectData";

const AttendancePage = () => {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState("all");

  const allAttendanceData = subjectsData.flatMap(subject => 
    subject.attendance.map(record => ({
      ...record,
      subject: subject.name,
      subjectFullName: subject.fullName
    }))
  );

  const sortedAttendance = allAttendanceData.sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  const filteredAttendance = selectedSubject === "all" 
    ? sortedAttendance 
    : sortedAttendance.filter(record => record.subject === selectedSubject);

  const subjectStats = subjectsData.map(subject => {
    const total = subject.attendance.length;
    const present = subject.attendance.filter(a => a.status === "Present").length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
    
    return {
      name: subject.name,
      fullName: subject.fullName,
      total,
      present,
      absent: total - present,
      percentage
    };
  });

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-900 text-center">
        📋 Full Attendance Record
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {subjectStats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition cursor-pointer"
            onClick={() => setSelectedSubject(stat.name)}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-lg">{stat.name}</h3>
                <p className="text-sm text-gray-600">{stat.fullName}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                stat.percentage >= 75 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
              }`}>
                {stat.percentage}%
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-center mt-3">
              <div>
                <p className="text-xs text-gray-500">Total</p>
                <p className="font-bold">{stat.total}</p>
              </div>
              <div>
                <p className="text-xs text-green-500">Present</p>
                <p className="font-bold text-green-600">{stat.present}</p>
              </div>
              <div>
                <p className="text-xs text-red-500">Absent</p>
                <p className="font-bold text-red-600">{stat.absent}</p>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div
                className={`h-2 rounded-full ${stat.percentage >= 75 ? "bg-green-500" : "bg-red-500"}`}
                style={{ width: `${stat.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <label className="font-semibold text-gray-700">Filter by Subject:</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="all">All Subjects</option>
            {subjectsData.map(subject => (
              <option key={subject.name} value={subject.name}>
                {subject.name} - {subject.fullName}
              </option>
            ))}
          </select>
        </div>
        
        <div className="text-sm text-gray-600">
          Total Records: {filteredAttendance.length}
        </div>
      </div>

      <div className="overflow-x-auto p-4 bg-white rounded-2xl shadow-2xl">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-100 text-gray-900">
              <th className="border px-4 py-2 text-left">Subject</th>
              <th className="border px-4 py-2 text-left">Date</th>
              <th className="border px-4 py-2 text-left">Status</th>
              <th className="border px-4 py-2 text-left">Week Day</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendance.map((row, idx) => {
              const date = new Date(row.date);
              const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
              const weekDay = weekDays[date.getDay()];
              
              return (
                <tr
                  key={idx}
                  className={`transition hover:bg-blue-50 cursor-pointer ${
                    row.status === "Absent" ? "bg-red-50 hover:bg-red-100" : ""
                  }`}
                >
                  <td
                    className="border px-4 py-2 font-semibold text-blue-600 hover:underline"
                    onClick={() => navigate(`/student/subject/${row.subject}`)}
                  >
                    {row.subject}
                  </td>
                  <td className="border px-4 py-2">{row.date}</td>
                  <td
                    className={`border px-4 py-2 font-bold ${
                      row.status === "Present" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      {row.status === "Present" ? "✅" : "❌"} {row.status}
                    </span>
                  </td>
                  <td className="border px-4 py-2 text-gray-600">{weekDay}</td>
                </tr>
              );
            })}

            {filteredAttendance.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-8 text-gray-500">
                  No attendance records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl shadow">
          <h3 className="font-bold text-blue-800">📊 Total Sessions</h3>
          <p className="text-2xl font-bold text-blue-600">{allAttendanceData.length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl shadow">
          <h3 className="font-bold text-green-800">✅ Total Present</h3>
          <p className="text-2xl font-bold text-green-600">
            {allAttendanceData.filter(a => a.status === "Present").length}
          </p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl shadow">
          <h3 className="font-bold text-red-800">❌ Total Absent</h3>
          <p className="text-2xl font-bold text-red-600">
            {allAttendanceData.filter(a => a.status === "Absent").length}
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl shadow">
          <h3 className="font-bold text-purple-800">📈 Overall Rate</h3>
          <p className="text-2xl font-bold text-purple-600">
            {Math.round((allAttendanceData.filter(a => a.status === "Present").length / allAttendanceData.length) * 100)}%
          </p>
        </div>
      </div>

      <div className="mt-8 flex justify-center gap-4">
        <button
          onClick={() => navigate("/student")}
          className="px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-2xl hover:bg-blue-700 transition flex items-center gap-2"
        >
          ← Back to Main
        </button>
        <button
          onClick={() => navigate("/student/grades")}
          className="px-6 py-3 bg-green-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-2xl hover:bg-green-700 transition"
        >
          View Grades
        </button>
      </div>
    </div>
  );
};

export default AttendancePage;