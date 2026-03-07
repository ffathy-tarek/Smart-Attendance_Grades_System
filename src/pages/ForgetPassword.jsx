// src/pages/ForgetPassword.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import "./Login.css";

const ForgetPassword = () => {
  const navigate = useNavigate(); 
  const [email, setEmail] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  const handleNumbersOnly = (e, setter) => {
    const value = e.target.value.replace(/\D/g, "");
    setter(value);
  };

  const handleSend = async () => {
    if (!email || !nationalId || !mobileNumber) {
      alert("Please fill all fields");
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email");
      return;
    }

    try {
      await addDoc(collection(db, "passwordRequests"), {
        email,
        nationalId,
        mobileNumber,
        createdAt: new Date(),
      });

      alert("We will send your new password to your email :)");

      setEmail("");
      setNationalId("");
      setMobileNumber("");
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="forget-container">
      <div className="forget-card">
        <h1 className="forget-title">Forgot Password</h1>
        <p className="forget-subtitle">Enter your details to reset password</p>

        <div className="input-group">
          <label className="input-label">Email</label>
          <input
            className="input-field"
            type="email"
            placeholder="Ex: ****@std.sci.edu.eg"
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

        <div className="input-group">
          <label className="input-label">Mobile Number</label>
          <input
            className="input-field"
            type="text"
            placeholder="Ex: +201*********"
            value={mobileNumber}
            onChange={(e) => handleNumbersOnly(e, setMobileNumber)}
          />
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

export default ForgetPassword;