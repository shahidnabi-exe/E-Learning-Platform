import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, ArrowRight, Lock, Mail } from "lucide-react";
import { UserData } from "../../Context/UserContext";
import "./Auth.css";

const Login = () => {
  const navigate = useNavigate();
  const { loginUser, btnLoading } = UserData();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    await loginUser(email, password, navigate);
  };

  return (
    <div className="auth-page">
      <div className="auth-glow-accent" />

      <div className="auth-card-modern animate-fade-in">
        <div className="auth-card-head">
          <div className="auth-logo-emblem">
            <GraduationCap size={24} />
          </div>
          <h2>Welcome Back</h2>
          <p>Enter your credentials to access your courses and studio.</p>
        </div>

        <form onSubmit={submitHandler} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Email Address</label>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <input
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Password</label>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={btnLoading}
            style={{ width: "100%", marginTop: "0.5rem", padding: "12px" }}
          >
            <span>{btnLoading ? "Verifying..." : "Sign In to Code Campus"}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="auth-footer-prompt">
          Don't have an account yet?
          <Link to="/register">Create Account</Link>
        </div>

        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <Link
            to="/admin/login"
            style={{ fontSize: "0.78rem", color: "var(--text-muted)", textDecoration: "none" }}
          >
            Staff & Administrator Portal →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
