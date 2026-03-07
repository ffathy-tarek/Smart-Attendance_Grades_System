// src/studentDashboard/data/subjectData.js

export const subjectsData = [
  { 
    name: "Soft",
    fullName: "Software Engineering",
    code: "CS-303",
    grades: {
      midterm: 7,
      quizzes: 28,
      final: 82,
      lab: 28
    },
    attendance: [
      { date: "2026-02-01", status: "Present" },
      { date: "2026-02-03", status: "Absent" },
      { date: "2026-02-05", status: "Present" },
      { date: "2026-02-08", status: "Present" },
      { date: "2026-02-10", status: "Absent" },
    ]
  },
  { 
    name: "Ds",
    fullName: "Distributed Systems",
    code: "CS-317",
    grades: {
      midterm: 8,
      quizzes: 30,
      final: 55,
      lab: 30
    },
    attendance: [
      { date: "2026-02-01", status: "Present" },
      { date: "2026-02-03", status: "Present" },
      { date: "2026-02-05", status: "Present" },
      { date: "2026-02-08", status: "Absent" },
      { date: "2026-02-10", status: "Present" },
    ]
  },
  { 
    name: "OS",
    fullName: "Operating Systems",
    code: "CS-306",
    grades: {
      midterm: 8,
      quizzes: 20,
      final: 40,
      lab: 20
    },
    attendance: [
      { date: "2026-02-01", status: "Absent" },
      { date: "2026-02-03", status: "Present" },
      { date: "2026-02-05", status: "Absent" },
      { date: "2026-02-08", status: "Present" },
      { date: "2026-02-10", status: "Present" },
    ]
  },
];

export const getSubjectByName = (name) => {
  return subjectsData.find(subject => subject.name === name);
};

export const getAttendancePercentage = (attendanceData) => {
  const total = attendanceData.length;
  const present = attendanceData.filter(a => a.status === "Present").length;
  return total > 0 ? Math.round((present / total) * 100) : 0;
};