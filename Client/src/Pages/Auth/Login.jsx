import React, { useState } from "react";
import "./Auth.css";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../../Context/UserContext";
import { AdminData } from "../../Context/AdminContext";

const Login = () => {
  const navigate = useNavigate();

  const { loginUser, btnLoading: userLoading } = UserData();
  const { loginAdmin, btnLoading: adminLoading } = AdminData();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const submitHandler = async (e) => {
    e.preventDefault();

    if (role === "student") {
      await loginUser(email, password, navigate);
    } else {
      await loginAdmin(email, password, navigate);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-form">
        <h2>Login</h2>

        {/* Role Selector */}
        <label className="role-title">Login as</label>
        <div className="role-selector">
          <label className={role === "student" ? "active" : ""}>
            <input
              type="radio"
              name="role"
              value="student"
              checked={role === "student"}
              onChange={() => setRole("student")}
            />
            Student
          </label>

          <label className={role === "admin" ? "active" : ""}>
            <input
              type="radio"
              name="role"
              value="admin"
              checked={role === "admin"}
              onChange={() => setRole("admin")}
            />
            Admin
          </label>
        </div>

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

          <button
            type="submit"
            className="common-btn"
            disabled={userLoading || adminLoading}
          >
            {userLoading || adminLoading ? "Please wait..." : "Login"}
          </button>
        </form>

        {role === "student" && (
          <p>
            Don’t have an account? <Link to="/register">Register</Link>
          </p>
        )}

        {role === "admin" && (
          <p className="admin-note">Admin access only</p>
        )}
      </div>
    </div>
  );
};

export default Login;
