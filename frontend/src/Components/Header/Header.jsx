import React from 'react'
import './Header.css'
import { Link } from 'react-router-dom'

function Header() {
  return (
    <header>
        <Link to="/" className="logo"> E-Learning </Link>
        <div className='link'>
            <Link to={'/'}>Home</Link>
            <Link to={'/courses'}>Courses</Link>
            <Link to={'/about'}>About</Link>
            <Link to={'/account'}>Account</Link>
        </div>
        
    </header>
    
  )
}

export default Header