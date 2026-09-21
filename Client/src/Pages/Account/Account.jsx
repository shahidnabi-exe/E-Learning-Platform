import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Shield,
  Key,
  LogOut,
  LayoutDashboard,
  CheckCircle2,
  Lock,
  Save,
  GraduationCap,
} from "lucide-react";
import { UserData } from "../../Context/UserContext";
import Badge from "../../Components/UI/Badge";
import "./account.css";

function Account() {
  const navigate = useNavigate();
  const { user, isStudent, isInstructor, isAdmin, logoutUser, updateProfile, changePassword, btnLoading } = UserData();

  const [name, setName] = useState(user?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const getDashboardPath = () => {
    if (isAdmin) return "/admin/dashboard";
    if (isInstructor) return "/instructor/dashboard";
    return "/dashboard";
  };

  const roleLabel = isAdmin ? "Administrator" : isInstructor ? "Instructor" : "Student";
  const roleVariant = isAdmin ? "gold" : isInstructor ? "info" : "neutral";

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    await updateProfile(name);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match");
      return;
    }
    const success = await changePassword(currentPassword, newPassword);
    if (success) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="account-settings-page animate-fade-in">
      <div className="account-header">
        <span
          style={{
            color: "var(--gold-primary)",
            fontSize: "0.82rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          Control Center
        </span>
        <h1>Account & Security Settings</h1>
        <p style={{ color: "var(--text-secondary)" }}>
          Manage your personal profile, credentials, and platform role preferences.
        </p>
      </div>

      <div className="account-grid">
        {/* Profile Overview Hero Card */}
        <div className="profile-hero-card">
          <div className="profile-user-left">
            <div className="profile-large-avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>

            <div className="profile-user-info">
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                <h2>{user?.name || "User"}</h2>
                <Badge variant={roleVariant}>{roleLabel}</Badge>
              </div>
              <p>{user?.email}</p>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "4px", display: "inline-block" }}>
                Enrolled tracks: {user?.subscription?.length || 0}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              className="btn-primary"
              onClick={() => navigate(getDashboardPath())}
            >
              <LayoutDashboard size={16} />
              <span>Go to {roleLabel} Console</span>
            </button>

            <button
              className="btn-danger btn-sm"
              onClick={() => logoutUser(navigate)}
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Edit Profile Form Card */}
        <div className="settings-card">
          <div className="settings-card-head">
            <User size={20} color="var(--gold-primary)" />
            <h3>Personal Information</h3>
          </div>

          <form onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label className="form-label">Display Name</label>
              <input
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address (Read Only)</label>
              <input
                className="form-input"
                value={user?.email || ""}
                disabled
                style={{ opacity: 0.6, cursor: "not-allowed" }}
              />
              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                Email address is linked to your account identity.
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
              <button type="submit" className="btn-primary btn-sm" disabled={btnLoading}>
                <Save size={15} />
                <span>{btnLoading ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="settings-card">
          <div className="settings-card-head">
            <Lock size={20} color="var(--gold-primary)" />
            <h3>Security & Password</h3>
          </div>

          <form onSubmit={handleChangePassword}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
              <button type="submit" className="btn-secondary btn-sm" disabled={btnLoading}>
                <Key size={15} />
                <span>{btnLoading ? "Updating..." : "Update Password"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Account;