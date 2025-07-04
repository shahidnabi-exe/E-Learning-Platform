import React, { useState } from 'react'
import './Auth.css';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const 
  const[email, setEmail] = useState('')
  const[password, setPassword] = useState('')

  const submitHandler = async(e) => {
    e.preventDefault();
  }

  return (
    <div className="auth-page">
        <div className="auth-form">
            <h2>Login</h2>
            <form onSubmit={submitHandler}>
                <label htmlFor="email">Email</label>
                <input type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required />

                <label htmlFor="password">Password</label>
                <input type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required />

                <button type='submit' className="common-btn"> Login </button>
            </form>
            <p>
                Don't have an Account? <Link to='/register'> Register </Link>
            </p>
        </div>
    </div>
  )
}

export default Login
