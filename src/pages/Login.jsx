// src/pages/Login.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
       
        navigate("/student", { replace: true });
        
      }
    });
    return unsubscribe;
  }, [navigate]);

  const handleLogin = async () => {
    try {
     
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        alert("User data not found!");
        await signOut(auth);
        return;
      }

      const userData = docSnap.data();

  
      if (userData.role === "student") {
       
        navigate("/student", { replace: true });
      } else {
        alert("You are not authorized to access the student dashboard.");
        await signOut(auth);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Login using your University Email</p>

        <div className="input-group">
          <label className="input-label">Email</label>
          <input
            type="email"
            className="input-field"
            placeholder="Ex: ****@std.sci.edu.eg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label className="input-label">Password</label>
          <input
            type="password"
            className="input-field"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        <button
          type="button"
          onClick={handleLogin}
          className="primary-button"
        >
          Log-in
        </button>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
          <button
            type="button"
            onClick={() => navigate("/forget-password")}
            style={{
              background: "none",
              border: "none",
              color: "#110a96",
              cursor: "pointer",
              textDecoration: "underline",
              fontSize: "0.9rem",
            }}
          >
            Forgot Password?
          </button>

          <button
            type="button"
            onClick={() => navigate("/request-email")}
            style={{
              background: "none",
              border: "none",
              color: "#110a96",
              cursor: "pointer",
              textDecoration: "underline",
              fontSize: "0.9rem",
            }}
          >
            Request Email
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;