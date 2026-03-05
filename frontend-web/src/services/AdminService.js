import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

/* ================= INSTRUCTORS ================= */

export const addInstructor = async (data) => {
  try {
    await addDoc(collection(db, "users"), {
      ...data,
      role: "instructor",
      createdAt: new Date(),
    });
  } catch (err) {
    throw new Error("Failed to add instructor");
  }
};

export const updateInstructor = async (id, data) => {
  try {
    const ref = doc(db, "users", id);

    await updateDoc(ref, data);
  } catch (err) {
    throw new Error("Failed to update instructor");
  }
};

export const deleteInstructor = async (id) => {
  try {
    await deleteDoc(doc(db, "users", id));
  } catch (err) {
    throw new Error("Failed to delete instructor");
  }
};

/* ================= COURSES ================= */

export const addCourse = async (data) => {
  try {
    await addDoc(collection(db, "courses"), data);
  } catch (err) {
    throw new Error("Failed to add course");
  }
};

export const getAllCourses = async () => {
  const snapshot = await getDocs(collection(db, "courses"));

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const updateCourse = async (id, data) => {
  try {
    const ref = doc(db, "courses", id);

    await updateDoc(ref, data);
  } catch (err) {
    throw new Error("Failed to update course");
  }
};

export const deleteCourse = async (id) => {
  try {
    await deleteDoc(doc(db, "courses", id));
  } catch (err) {
    throw new Error("Failed to delete course");
  }
};

/* ================= ENROLLMENTS ================= */

export const enrollStudent = async (studentId, courseId) => {
  const q = query(
    collection(db, "enrollments"),
    where("studentId", "==", studentId),
    where("courseId", "==", courseId),
  );

  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    throw new Error("Student already enrolled");
  }

  await addDoc(collection(db, "enrollments"), {
    studentId,
    courseId,
    createdAt: new Date(),
  });
};
