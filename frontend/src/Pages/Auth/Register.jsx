import React from 'react'
import './Auth.css';
import { Link } from 'react-router-dom';


function Register() {
  return (
     <div className="auth-page">
        <div className="auth-form">
            <h2>Register</h2>
            <form >
                <label htmlFor="name">Name</label>
                <input type="text" required />

                <label htmlFor="email">Email</label>
                <input type="email" required />

                <label htmlFor="password">Password</label>
                <input type="password" required />

                <div className="common-btn"> Register </div>
            </form>
            <p>
                Already have an Account? <Link to='/login'> Login </Link>
            </p>
        </div>
    </div>
  )
}

export default Register