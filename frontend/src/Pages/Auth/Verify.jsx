import React from 'react'
import './Auth.css';
import { Link } from 'react-router-dom';

function Verify() {
  return (
    <div className="auth-page">
        <div className="auth-form">
            <h2>Verify Account</h2>
            <form >
                <label htmlFor="otp">OTP</label>
                <input type="number" required />

                <div className="common-btn"> Verify </div>
            </form>
            <p>
                Go to <Link to='/login'> Login </Link> Page 
            </p>
        </div>
    </div>
  )
}

export default Verify