import React, { useState } from "react";
import "./Auth.css";
import { useNavigate } from "react-router-dom";
import { AdminData } from "../../Context/AdminContext";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { loginAdmin, btnLoading } = AdminData();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    await loginAdmin(email, password, navigate);
  };

  return (
    <div className="auth-page">
      <div className="auth-form">
        <h2>Admin Login</h2>

        <form onSubmit={submitHandler}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="common-btn" disabled={btnLoading}>
            {btnLoading ? "Please wait..." : "Login"}
          </button>
        </form>

        <p className="admin-note">Admin access only</p>
      </div>
    </div>
  );
};

export default AdminLogin;
