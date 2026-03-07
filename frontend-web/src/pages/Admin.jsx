import { useState, useEffect } from "react";
import { collection, onSnapshot, doc, updateDoc, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth, sendPasswordResetEmail, createUserWithEmailAndPassword } from "firebase/auth";

const AdminDashboard = () => {
  const [requests, setRequests] = useState([]);
  const auth = getAuth();

  // جلب الطلبات مباشرة من Firestore
  useEffect(() => {
    const q = collection(db, "emailRequests");
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRequests(data);
    });
    return () => unsubscribe();
  }, []);

  // Approve: يضيف الحساب في Firebase Auth و Firestore
  const handleApprove = async (request) => {
    try {
      // إنشاء حساب مؤقت في Auth
      await createUserWithEmailAndPassword(auth, request.email, "TempPass123!");

      // تحديث حالة الطلب
      await updateDoc(doc(db, "emailRequests", request.id), {
        status: "approved"
      });

      // إضافة المستخدم في Firestore
      await addDoc(collection(db, "users"), {
        name: request.name,
        email: request.email,
        code: request.code || "",
        role: request.role,
        createdAt: new Date(),
      });

      alert(`${request.name} approved & added to Auth successfully`);
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        alert("User already exists in Firebase Auth!");
      } else {
        alert("Error approving: " + error.message);
      }
    }
  };

  // Reject: يغير الحالة فقط
  const handleReject = async (request) => {
    try {
      await updateDoc(doc(db, "emailRequests", request.id), {
        status: "rejected"
      });
      alert(`${request.name} rejected`);
    } catch (error) {
      alert("Error rejecting: " + error.message);
    }
  };

  // Reset Password: يرسل رابط تغيير كلمة المرور
  const handleResetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert(`Password reset email sent to ${email}`);
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        alert(`Error: No user found with email ${email} in Firebase Auth`);
      } else {
        alert("Error: " + error.message);
      }
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>
      {requests.length === 0 && <p>No requests yet</p>}

      <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Code</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(req => (
            <tr key={req.id}>
              <td>{req.name}</td>
              <td>{req.email}</td>
              <td>{req.code || "-"}</td>
              <td>{req.role}</td>
              <td>{req.status || "pending"}</td>
              <td>
                {req.status === "pending" && (
                  <>
                    <button onClick={() => handleApprove(req)}>Approve</button>
                    <button onClick={() => handleReject(req)}>Reject</button>
                  </>
                )}
                <button onClick={() => handleResetPassword(req.email)}>Reset Password</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;