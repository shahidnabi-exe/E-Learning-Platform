import React from 'react'
import './Auth.css';
import { Link } from 'react-router-dom';

function Login() {
  return (
    <div className="auth-page">
        <div className="auth-form">
            <h2>Login</h2>
            <form >
                <label htmlFor="email">Email</label>
                <input type="email" required />

                <label htmlFor="password">Password</label>
                <input type="password" required />

                <div className="common-btn"> Login </div>
            </form>
            <p>
                Don't have an Account? <Link to='/register'> Register </Link>
            </p>
        </div>
    </div>
  )
}

export default Login
