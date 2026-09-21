import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, ArrowRight, UserCheck, BookOpen } from "lucide-react";
import { UserData } from "../../Context/UserContext";
import "./Auth.css";

function Register() {
  const navigate = useNavigate();
  const { btnLoading, registerUser } = UserData();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const submitHandler = async (e) => {
    e.preventDefault();
    await registerUser(name, email, password, role, navigate);
  };

  return (
    <div className="auth-page">
      <div className="auth-glow-accent" />

      <div className="auth-card-modern animate-fade-in">
        <div className="auth-card-head">
          <div className="auth-logo-emblem">
            <GraduationCap size={24} />
          </div>
          <h2>Join Code Campus</h2>
          <p>Start learning production engineering or author your own courses.</p>
        </div>

        {/* Role Toggle */}
        <div className="role-tabs-wrap">
          <button
            type="button"
            className={`role-tab-item ${role === "student" ? "active" : ""}`}
            onClick={() => setRole("student")}
          >
            <GraduationCap size={16} />
            <span>I am a Student</span>
          </button>

          <button
            type="button"
            className={`role-tab-item ${role === "instructor" ? "active" : ""}`}
            onClick={() => setRole("instructor")}
          >
            <UserCheck size={16} />
            <span>I am an Instructor</span>
          </button>
        </div>

        <form onSubmit={submitHandler} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., Alex Rivera"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={btnLoading}
            style={{ width: "100%", marginTop: "0.5rem", padding: "12px" }}
          >
            <span>{btnLoading ? "Setting up account..." : `Register as ${role === "instructor" ? "Instructor" : "Student"}`}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="auth-footer-prompt">
          Already have an account?
          <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
