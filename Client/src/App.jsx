import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import AdminLogin from "./Pages/Auth/AdminLogin";
import About from "./Pages/About/About";
import Account from "./Pages/Account/Account";
import Courses from "./Pages/Courses/Courses";
import CourseDetail from "./Pages/CourseDetail/CourseDetail";
import LecturePlayer from "./Pages/Lecture/LecturePlayer";
import Dashboard from "./Pages/Dashboard/Dashboard";
import AdminDashboard from "./Pages/Dashboard/AdminDashboard";
import PendingCourses from "./Pages/Admin/PendingCourses";
import AdminCreateCourse from "./Pages/Admin/AdminCreateCourse";
import UserManagement from "./Pages/Admin/UserManagement";
import InstructorDashboard from "./Pages/Instructor/InstructorDashboard";
import CreateCourse from "./Pages/Instructor/CreateCourse";
import MyCourses from "./Pages/Instructor/MyCourses";
import { UserData } from "./Context/UserContext";

function AppContent() {
  const { isAuth, user, isStudent, isInstructor, isAdmin, loading } = UserData();
  const location = useLocation();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          backgroundColor: "var(--bg-main)",
          color: "var(--gold-primary)",
          fontSize: "1.2rem",
          fontWeight: 600,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
          <div
            className="skeleton"
            style={{ width: "48px", height: "48px", borderRadius: "50%" }}
          />
          <span>Loading Code Campus...</span>
        </div>
      </div>
    );
  }

  // Hide the public header and footer on dashboard consoles and lecture theater
  const isConsoleOrStudio =
    location.pathname.startsWith("/instructor") ||
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/lecture");

  const getHomeRedirect = () => {
    if (isAdmin) return <Navigate to="/admin/dashboard" replace />;
    if (isInstructor) return <Navigate to="/instructor/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  };

  return (
    <>
      {!isConsoleOrStudio && <Header />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/course/:id" element={<CourseDetail />} />

        {/* Auth Routes */}
        <Route
          path="/login"
          element={isAuth ? getHomeRedirect() : <Login />}
        />
        <Route
          path="/register"
          element={isAuth ? getHomeRedirect() : <Register />}
        />
        <Route
          path="/admin/login"
          element={isAdmin ? <Navigate to="/admin/dashboard" replace /> : <AdminLogin />}
        />

        {/* Student Learning Console */}
        <Route
          path="/dashboard"
          element={
            !isAuth ? (
              <Navigate to="/login" replace />
            ) : isAdmin ? (
              <Navigate to="/admin/dashboard" replace />
            ) : isInstructor ? (
              <Navigate to="/instructor/dashboard" replace />
            ) : (
              <Dashboard />
            )
          }
        />

        {/* Instructor Hub */}
        <Route
          path="/instructor/dashboard"
          element={
            isInstructor || isAdmin ? <InstructorDashboard /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/instructor/my-courses"
          element={
            isInstructor || isAdmin ? <MyCourses /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/instructor/create-course"
          element={
            isInstructor || isAdmin ? <CreateCourse /> : <Navigate to="/login" replace />
          }
        />

        {/* Admin Platform Governance */}
        <Route
          path="/admin/dashboard"
          element={isAdmin ? <AdminDashboard /> : <Navigate to="/admin/login" replace />}
        />
        <Route
          path="/admin/pending-courses"
          element={isAdmin ? <PendingCourses /> : <Navigate to="/admin/login" replace />}
        />
        <Route
          path="/admin/create-course"
          element={isAdmin ? <AdminCreateCourse /> : <Navigate to="/admin/login" replace />}
        />
        <Route
          path="/admin/users"
          element={isAdmin ? <UserManagement /> : <Navigate to="/admin/login" replace />}
        />

        {/* Shared Authenticated Routes */}
        <Route
          path="/account"
          element={isAuth ? <Account /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/lecture/:id"
          element={isAuth ? <LecturePlayer /> : <Navigate to="/login" replace />}
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!isConsoleOrStudio && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
