import React from "react";
import "./Header.css";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../../Context/UserContext";
import { AdminData } from "../../Context/AdminContext";

const Header = () => {
  const navigate = useNavigate();

  const { isAuth, logoutUser } = UserData();     // student
  const { adminAuth, logoutAdmin } = AdminData(); // admin

  return (
    <header>
      <Link to="/" className="logo">Code Campus</Link>

      <div className="link">
        <Link to="/">Home</Link>
        <Link to="/courses">Courses</Link>
        <Link to="/about">About</Link>

        {/* ADMIN */}
        {adminAuth && (
          <>
            <Link to="/admin/dashboard">Admin Dashboard</Link>
            <button onClick={() => logoutAdmin(navigate)} className="logout-btn">
              Logout
            </button>
          </>
        )}

        {/* STUDENT */}
        {!adminAuth && isAuth && (
          <>
            <Link to="/account">Account</Link>
            <Link to="/dashboard">Dashboard</Link>
            <button onClick={() => logoutUser(navigate)} className="logout-btn">
              Logout
            </button>
          </>
        )}

        {/* GUEST */}
        {!adminAuth && !isAuth && (
          <Link to="/login">Login</Link>
        )}
      </div>
    </header>
  );
};

export default Header;
