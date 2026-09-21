import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  Clock,
  Users,
  User,
  LogOut,
  Compass,
  Menu,
  X,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { UserData } from "../../Context/UserContext";
import "./DashboardLayout.css";

export default function DashboardLayout({ children, title }) {
  const { user, isStudent, isInstructor, isAdmin, logoutUser } = UserData();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const closeSidebar = () => setMobileOpen(false);

  // Define role-specific navigation menus
  let navItems = [];

  if (isAdmin) {
    navItems = [
      { label: "Overview", to: "/admin/dashboard", icon: LayoutDashboard },
      { label: "Pending Approvals", to: "/admin/pending-courses", icon: Clock },
      { label: "Create Course", to: "/admin/create-course", icon: PlusCircle },
      { label: "User Management", to: "/admin/users", icon: Users },
      { label: "Browse Catalog", to: "/courses", icon: Compass },
      { label: "My Account", to: "/account", icon: User },
    ];
  } else if (isInstructor) {
    navItems = [
      { label: "Overview", to: "/instructor/dashboard", icon: LayoutDashboard },
      { label: "My Courses", to: "/instructor/my-courses", icon: BookOpen },
      { label: "Create Course", to: "/instructor/create-course", icon: PlusCircle },
      { label: "Browse Catalog", to: "/courses", icon: Compass },
      { label: "My Account", to: "/account", icon: User },
    ];
  } else {
    // Student
    navItems = [
      { label: "My Learning", to: "/dashboard", icon: LayoutDashboard },
      { label: "Explore Courses", to: "/courses", icon: Compass },
      { label: "My Profile", to: "/account", icon: User },
    ];
  }

  const roleLabel = isAdmin ? "Administrator" : isInstructor ? "Instructor" : "Student";

  return (
    <div className="dashboard-layout">
      {/* Mobile Backdrop */}
      {mobileOpen && <div className="sidebar-overlay" onClick={closeSidebar} />}

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="sidebar-brand">
          <div className="brand-icon">
            <GraduationCap size={22} />
          </div>
          <div className="brand-text">
            <h2>Code Campus</h2>
            <span>{roleLabel} Console</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Navigation</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`nav-link ${isActive ? "active" : ""}`}
                onClick={closeSidebar}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-mini-card">
            <div className="user-avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="user-meta">
              <div className="user-name">{user?.name || "User"}</div>
              <div className="user-role-badge">{roleLabel}</div>
            </div>
          </div>

          <button
            className="btn-secondary btn-sm"
            onClick={() => logoutUser(navigate)}
            style={{ width: "100%", justifyContent: "flex-start", gap: "8px" }}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="topbar-left">
            <button
              className="menu-toggle-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <h1 className="topbar-title">{title || "Dashboard"}</h1>
          </div>

          <div className="topbar-right">
            <Link to="/courses" className="btn-secondary btn-sm" style={{ display: "none", sm: "inline-flex" }}>
              <Compass size={15} />
              <span>Catalog</span>
            </Link>

            <Link
              to="/account"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 12px",
                borderRadius: "var(--radius-pill)",
                background: "var(--surface-elevated)",
                border: "1px solid var(--surface-border)",
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: "var(--gold-dim)",
                  color: "var(--gold-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                }}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>
                {user?.name?.split(" ")[0] || "Account"}
              </span>
            </Link>
          </div>
        </header>

        <main className="dashboard-content animate-fade-in">{children}</main>
      </div>
    </div>
  );
}

