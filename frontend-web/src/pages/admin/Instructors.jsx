import { useState, useEffect } from "react";
import {
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../../firebase";

const Instructors = () => {
  const [instructors, setInstructors] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [departments, setDepartments] = useState([]);

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState(null);

  const [assignModal, setAssignModal] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState("");

  const [subjectSearch, setSubjectSearch] = useState("");

  const [newInstructor, setNewInstructor] = useState({
    fullName: "",
    code: "",
    department: "",
  });

  useEffect(() => {
    loadInstructors();
    loadSubjects();
  }, []);

  const loadInstructors = async () => {
    const snapshot = await getDocs(collection(db, "users"));

    const list = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((u) => u.role === "instructor");

    setInstructors(list);

    const deps = [...new Set(list.map((i) => i.department).filter(Boolean))];
    setDepartments(deps);
  };

  const loadSubjects = async () => {
    const snapshot = await getDocs(collection(db, "courses"));

    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setSubjects(list);
  };

  // SEARCH + FILTER
  const filteredInstructors = instructors.filter((i) => {
    const matchName = i.fullName?.toLowerCase().includes(search.toLowerCase());

    const matchDepartment =
      departmentFilter === "" || i.department === departmentFilter;

    return matchName && matchDepartment;
  });

  const handleSave = async () => {
    if (!newInstructor.fullName) return;

    if (editingInstructor) {
      await updateDoc(doc(db, "users", editingInstructor.id), newInstructor);
    } else {
      await addDoc(collection(db, "users"), {
        ...newInstructor,
        role: "instructor",
      });
    }

    setShowModal(false);
    setEditingInstructor(null);

    setNewInstructor({
      fullName: "",
      code: "",
      department: "",
    });

    loadInstructors();
  };

  const deleteInstructor = async (id) => {
    await deleteDoc(doc(db, "users", id));
    loadInstructors();
  };

  const openAssign = (ins) => {
    setSelectedInstructor(ins);
    setAssignModal(true);
  };

  const assignSubject = async () => {
    if (!selectedSubject) return;

    await updateDoc(doc(db, "courses", selectedSubject), {
      instructorId: selectedInstructor.id,
    });

    setAssignModal(false);
    setSelectedSubject("");

    loadSubjects();
  };

  return (
    <div style={{ padding: "30px" }}>
      <div style={headerStyle}>
        <div>
          <h2>Instructors</h2>
          <p style={{ color: "#64748B" }}>Manage university instructors</p>
        </div>

        <button
          style={addBtn}
          onClick={() => {
            setEditingInstructor(null);
            setShowModal(true);
          }}
        >
          + Add Instructor
        </button>
      </div>

      {/* SEARCH */}
      <input
        placeholder="Search instructor..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={inputStyle}
      />

      {/* FILTER BY DEPARTMENT */}
      <select
        value={departmentFilter}
        onChange={(e) => setDepartmentFilter(e.target.value)}
        style={inputStyle}
      >
        <option value="">All Departments</option>

        {departments.map((dep, index) => (
          <option key={index} value={dep}>
            {dep}
          </option>
        ))}
      </select>

      <div style={cardStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Code</th>
              <th style={thStyle}>Department</th>
              <th style={thStyle}>Subjects</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredInstructors.map((ins) => (
              <tr key={ins.id}>
                <td style={tdStyle}>{ins.fullName}</td>
                <td style={tdStyle}>{ins.code}</td>
                <td style={tdStyle}>{ins.department || "-"}</td>

                <td style={tdStyle}>
                  {subjects
                    .filter((s) => s.instructorId === ins.id)
                    .map((s) => s.name)
                    .join(", ") || "-"}
                </td>

                <td style={tdStyle}>
                  <button
                    style={editBtn}
                    onClick={() => {
                      setEditingInstructor(ins);
                      setNewInstructor(ins);
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    style={deleteBtn}
                    onClick={() => deleteInstructor(ins.id)}
                  >
                    Delete
                  </button>

                  <button style={assignBtn} onClick={() => openAssign(ins)}>
                    Assign Subject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h3>{editingInstructor ? "Edit Instructor" : "Add Instructor"}</h3>

            <input
              style={modalInput}
              placeholder="Full Name"
              value={newInstructor.fullName}
              onChange={(e) =>
                setNewInstructor({ ...newInstructor, fullName: e.target.value })
              }
            />

            <input
              style={modalInput}
              placeholder="Code"
              value={newInstructor.code}
              onChange={(e) =>
                setNewInstructor({ ...newInstructor, code: e.target.value })
              }
            />

            <input
              list="departments"
              style={modalInput}
              placeholder="Department"
              value={newInstructor.department}
              onChange={(e) =>
                setNewInstructor({
                  ...newInstructor,
                  department: e.target.value,
                })
              }
            />

            <datalist id="departments">
              {departments.map((dep, index) => (
                <option key={index} value={dep} />
              ))}
            </datalist>

            <div style={{ textAlign: "right", marginTop: "20px" }}>
              <button style={cancelBtn} onClick={() => setShowModal(false)}>
                Cancel
              </button>

              <button style={saveBtn} onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ASSIGN SUBJECT */}
      {assignModal && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h3>Assign Subject</h3>

            <input
              placeholder="Search subject..."
              value={subjectSearch}
              onChange={(e) => setSubjectSearch(e.target.value)}
              style={modalInput}
            />

            <select
              style={modalInput}
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="">Select Subject</option>

              {subjects
                .filter((s) =>
                  s.name.toLowerCase().includes(subjectSearch.toLowerCase()),
                )
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
            </select>

            <div style={{ textAlign: "right", marginTop: "20px" }}>
              <button style={cancelBtn} onClick={() => setAssignModal(false)}>
                Cancel
              </button>

              <button style={saveBtn} onClick={assignSubject}>
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "20px",
};

const addBtn = {
  background: "#1E3A8A",
  color: "white",
  border: "none",
  padding: "10px 20px",
  borderRadius: "8px",
};

const inputStyle = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #CBD5E1",
  marginBottom: "20px",
  marginRight: "10px",
};

const cardStyle = {
  background: "white",
  borderRadius: "12px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};

const thStyle = {
  padding: "15px",
  backgroundColor: "#F1F5F9",
  color: "#1E3A8A",
  textAlign: "left",
};

const tdStyle = {
  padding: "15px",
  borderTop: "1px solid #E2E8F0",
};

const editBtn = {
  background: "#3B82F6",
  color: "white",
  border: "none",
  padding: "6px 12px",
  borderRadius: "8px",
  marginRight: "8px",
};

const deleteBtn = {
  background: "#DC2626",
  color: "white",
  border: "none",
  padding: "6px 12px",
  borderRadius: "8px",
};

const assignBtn = {
  background: "#10B981",
  color: "white",
  border: "none",
  padding: "6px 12px",
  borderRadius: "8px",
  marginLeft: "8px",
};

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modalStyle = {
  background: "white",
  padding: "30px",
  borderRadius: "12px",
  width: "400px",
};

const modalInput = {
  width: "100%",
  padding: "10px",
  marginTop: "10px",
  borderRadius: "8px",
  border: "1px solid #CBD5E1",
};

const cancelBtn = {
  background: "#94A3B8",
  color: "white",
  border: "none",
  padding: "8px 15px",
  borderRadius: "8px",
  marginRight: "10px",
};

const saveBtn = {
  background: "#1E3A8A",
  color: "white",
  border: "none",
  padding: "8px 15px",
  borderRadius: "8px",
};

export default Instructors;
