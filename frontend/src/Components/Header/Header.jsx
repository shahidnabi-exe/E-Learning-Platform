import React from 'react'
import './Header.css'
import { Link } from 'react-router-dom'

const Header = ({ isAuth }) => {
  return (
    <header>
      <Link to="/" className="logo"> E-Learning </Link>
      <div className='link'>
        <Link to="/">Home</Link>
        <Link to="/courses">Courses</Link>
        <Link to="/about">About</Link>
        {isAuth ? (
          <>
            <Link to="/account">Account</Link>
            <Link to="/dashboard">Dashboard</Link> {/* ✅ Now it's added */}
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </header>
  )
}

export default Header
