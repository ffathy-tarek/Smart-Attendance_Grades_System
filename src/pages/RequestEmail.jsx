// src/pages/RequestEmail.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import "./Login.css";

const RequestEmail = () => {
  const navigate = useNavigate(); 
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [role, setRole] = useState("student");

  const handleNumbersOnly = (e, setter) => {
    const value = e.target.value.replace(/\D/g, "");
    setter(value);
  };

  const handleLettersOnly = (e, setter) => {
    const value = e.target.value.replace(/[^a-zA-Z\u0600-\u06FF\s]/g, "");
    setter(value);
  };

  const handleSend = async () => {
    if (!name || !email || !nationalId || (role === "student" && !code)) {
      alert("Please fill all required fields");
      return;
    }

    if (nationalId.length !== 14) {
      alert("National ID must be 14 digits");
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email");
      return;
    }

    try {
      await addDoc(collection(db, "emailRequests"), {
        name,
        code: role === "student" ? code : "",
        email,
        nationalId,
        role,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      alert("Thank you, we will send your sign-in info to your email soon");

      setName("");
      setCode("");
      setEmail("");
      setNationalId("");
      setRole("student");
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="request-container">
      <div className="request-card">
        <h1 className="request-title">Request Email</h1>
        <p className="request-subtitle">Enter your details to request your email</p>

        <div className="input-group">
          <label className="input-label">Name</label>
          <input
            className="input-field"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => handleLettersOnly(e, setName)}
          />
        </div>

        {role === "student" && (
          <div className="input-group">
            <label className="input-label">Code</label>
            <input
              className="input-field"
              type="text"
              placeholder="Enter your code"
              value={code}
              onChange={(e) => handleNumbersOnly(e, setCode)}
            />
          </div>
        )}

        <div className="input-group">
          <label className="input-label">Email</label>
          <input
            className="input-field"
            type="email"
            placeholder={
              role === "student"
                ? "Ex: ***@std.sci.cu.edu.eg"
                : "Ex: ***@sci.cu.edu.eg"
            }
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label className="input-label">National ID - 14 Digits</label>
          <input
            className="input-field"
            type="text"
            placeholder="Enter your national ID"
            value={nationalId}
            onChange={(e) => handleNumbersOnly(e, setNationalId)}
            maxLength={14}
          />
        </div>

        <div className="role-buttons">
          <button
            className={`role-button ${
              role === "student" ? "role-button-active" : "role-button-inactive"
            }`}
            onClick={() => setRole("student")}
          >
            Student
          </button>

          <button
            className={`role-button ${
              role === "instructor" ? "role-button-active" : "role-button-inactive"
            }`}
            onClick={() => setRole("instructor")}
          >
            Instructor
          </button>
        </div>

        <button
          className="primary-button"
          onClick={handleSend}
        >
          Send
        </button>

      
        <button
          onClick={() => navigate("/")}
          style={{
            background: "none",
            border: "none",
            color: "#110a96",
            cursor: "pointer",
            textDecoration: "underline",
            fontSize: "0.9rem",
            marginTop: "15px"
          }}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default RequestEmail;