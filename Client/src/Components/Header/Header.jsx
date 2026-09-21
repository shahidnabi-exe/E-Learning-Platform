import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { GraduationCap, Menu, X, User, LogOut, LayoutDashboard, ArrowRight } from "lucide-react";
import { UserData } from "../../Context/UserContext";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const { isAuth, user, isStudent, isInstructor, isAdmin, logoutUser } = UserData();
  const [mobileOpen, setMobileOpen] = useState(false);

  const getDashboardPath = () => {
    if (isAdmin) return "/admin/dashboard";
    if (isInstructor) return "/instructor/dashboard";
    return "/dashboard";
  };

  const getDashboardLabel = () => {
    if (isAdmin) return "Admin Console";
    if (isInstructor) return "Instructor Hub";
    return "Student Dashboard";
  };

  return (
    <header className="site-header">
      <div className="site-header-inner">
        {/* Brand Logo */}
        <Link to="/" className="header-brand">
          <div className="header-brand-icon">
            <GraduationCap size={20} />
          </div>
          <div className="header-brand-name">
            Code<span>Campus</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="header-nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
            Home
          </NavLink>
          <NavLink to="/courses" className={({ isActive }) => (isActive ? "active" : "")}>
            Explore Courses
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => (isActive ? "active" : "")}>
            About Us
          </NavLink>
        </nav>

        {/* Right Action Area */}
        <div className="header-actions">
          {isAuth ? (
            <>
              <Link to={getDashboardPath()} className="btn-primary btn-sm">
                <LayoutDashboard size={15} />
                <span>{getDashboardLabel()}</span>
              </Link>

              <Link
                to="/account"
                className="btn-icon"
                title="Account Settings"
                aria-label="Account Settings"
              >
                <User size={18} />
              </Link>

              <button
                onClick={() => logoutUser(navigate)}
                className="btn-icon"
                title="Log Out"
                aria-label="Log Out"
                style={{ color: "var(--status-danger)" }}
              >
                <LogOut size={17} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn-primary btn-sm">
                <span>Get Started</span>
                <ArrowRight size={14} />
              </Link>
            </>
          )}

          {/* Mobile Hamburger Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileOpen && (
        <div className="mobile-nav-drawer">
          <Link to="/" onClick={() => setMobileOpen(false)}>
            Home
          </Link>
          <Link to="/courses" onClick={() => setMobileOpen(false)}>
            Explore Courses
          </Link>
          <Link to="/about" onClick={() => setMobileOpen(false)}>
            About Us
          </Link>

          {isAuth ? (
            <>
              <Link to={getDashboardPath()} onClick={() => setMobileOpen(false)}>
                {getDashboardLabel()}
              </Link>
              <Link to="/account" onClick={() => setMobileOpen(false)}>
                Account Settings
              </Link>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  logoutUser(navigate);
                }}
                className="btn-danger btn-sm"
                style={{ marginTop: "0.5rem" }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <div style={{ display: "flex", gap: "10px", marginTop: "0.5rem" }}>
              <Link
                to="/login"
                className="btn-secondary btn-sm"
                style={{ flex: 1, textAlign: "center" }}
                onClick={() => setMobileOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn-primary btn-sm"
                style={{ flex: 1, textAlign: "center" }}
                onClick={() => setMobileOpen(false)}
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
