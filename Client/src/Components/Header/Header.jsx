import React from "react";
import "./Header.css";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../../Context/UserContext";
import { AdminData } from "../../Context/AdminContext";

const Header = () => {
  const navigate = useNavigate();

  const { isAuth, user, logoutUser } = UserData();     // student / instructor
  const { adminAuth, logoutAdmin } = AdminData();        // admin

  const isInstructor = isAuth && user?.role === "instructor";

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

        {/* INSTRUCTOR */}
        {!adminAuth && isInstructor && (
          <>
            <Link to="/account">Account</Link>
            <Link to="/instructor/dashboard">Instructor Dashboard</Link>
            <button onClick={() => logoutUser(navigate)} className="logout-btn">
              Logout
            </button>
          </>
        )}

        {/* STUDENT */}
        {!adminAuth && isAuth && !isInstructor && (
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
