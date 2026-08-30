import React from 'react'
import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Home from './Pages/Home/Home';
import Header from './Components/Header/Header';
import Login from './Pages/Auth/Login';
import Register from './Pages/Auth/Register';
import Verify from './Pages/Auth/Verify';
import AdminLogin from './Pages/Auth/AdminLogin';
import Footer from './Components/Footer/Footer';
import About from './Pages/About/About';
import Account from './Pages/Account/Account';
import { UserData } from './Context/UserContext';
import Courses from './Pages/Courses/Courses';
import CourseDetail from './Pages/CourseDetail/CourseDetail';
import LecturePlayer from './Pages/Lecture/LecturePlayer';
import Dashboard from './Pages/Dashboard/Dashboard';
import { Navigate } from "react-router-dom";
import AdminDashboard from "./Pages/Dashboard/AdminDashboard";
import { AdminData } from "./Context/AdminContext";
import InstructorDashboard from './Pages/Instructor/InstructorDashboard';
import CreateCourse from './Pages/Instructor/CreateCourse';
import MyCourses from './Pages/Instructor/MyCourses';
import PendingCourses from './Pages/Admin/PendingCourses';
import AdminCreateCourse from './Pages/Admin/AdminCreateCourse';


function App() {
  const {isAuth, user } = UserData();
  const { adminAuth } = AdminData()

  const isInstructor = isAuth && user?.role === "instructor";

  return (
    <>
      <BrowserRouter>
        <Header isAuth = {isAuth}/>
        <Routes> 
          <Route path='/' element= {<Home/>} />
          <Route path='/about' element= {<About/>} />
          <Route path='/courses' element= {<Courses/>} />
          <Route path='/course/:id' element= {<CourseDetail/>} />
          <Route path='/lecture/:id' element= { isAuth ? <LecturePlayer/> : <Login/>} />
          <Route path='/account' element= { isAuth ? <Account user = {user}/> : <Login/>} />
          <Route path='/login' element= { isAuth ? <Home/> : <Login />} />
          <Route path='/register' element= { isAuth ? <Home/> : <Register />} />
          <Route path='/verify' element= { isAuth ? <Home/> : <Verify />} />

          {/* STUDENT / INSTRUCTOR shared "dashboard" — routes to the right one by role */}
          <Route
            path='/dashboard'
            element={
              !isAuth ? <Verify /> : isInstructor ? <Navigate to="/instructor/dashboard" /> : <Dashboard />
            }
          />

          {/* INSTRUCTOR */}
          <Route path="/instructor/dashboard" element={isInstructor ? <InstructorDashboard /> : <Navigate to="/login" />} />
          <Route path="/instructor/create-course" element={isInstructor ? <CreateCourse /> : <Navigate to="/login" />} />
          <Route path="/instructor/my-courses" element={isInstructor ? <MyCourses /> : <Navigate to="/login" />} />

          {/* ADMIN — separate login route, not linked from main nav */}
          <Route path="/admin/login" element={adminAuth ? <Navigate to="/admin/dashboard" /> : <AdminLogin />} />
          <Route path="/admin/dashboard" element={adminAuth ? <AdminDashboard /> : <Navigate to="/admin/login" />} />
          <Route path="/admin/pending-courses" element={adminAuth ? <PendingCourses /> : <Navigate to="/admin/login" />} />
          <Route path="/admin/create-course" element={adminAuth ? <AdminCreateCourse /> : <Navigate to="/admin/login" />} />


        </Routes>
        <Footer/>
      </BrowserRouter>
    </>
  )
}

export default App
