import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, ArrowRight, ArrowLeft } from "lucide-react";
import { AdminData } from "../../Context/AdminContext";
import "./Auth.css";

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
      <div className="auth-glow-accent" />

      <div className="auth-card-modern animate-fade-in">
        <div className="auth-card-head">
          <div className="auth-logo-emblem" style={{ background: "var(--surface-elevated)", border: "1px solid var(--gold-primary)", color: "var(--gold-primary)" }}>
            <Shield size={24} />
          </div>
          <h2>Staff Portal</h2>
          <p>Administrator authentication required for platform governance.</p>
        </div>

        <form onSubmit={submitHandler} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Admin Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="admin@codecampus.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Admin Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
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
            <span>{btnLoading ? "Authenticating..." : "Enter Admin Console"}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="auth-footer-prompt">
          <Link to="/login" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
            <ArrowLeft size={14} />
            <span>Return to standard login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
