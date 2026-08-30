import React, { useState } from 'react'
import './Auth.css';
import { Link, useNavigate } from 'react-router-dom';
import { UserData } from '../../Context/UserContext';


function Register() {

    const navigate = useNavigate();
    const  {btnLoading, registerUser} = UserData()
    const[email, setEmail] = useState('')
    const[password, setPassword] = useState('')
    const[name, setName] = useState('')
    const[role, setRole] = useState('student')

    const submitHandler = async(e) => {
        e.preventDefault();
        await registerUser(name, email, password, role, navigate)
    }
  return (
     <div className="auth-page">
        <div className="auth-form">
            <h2>Register</h2>

            <label className="role-title">Register as</label>
            <div className="role-selector">
                <label className={role === "student" ? "active" : ""}>
                    <input
                        type="radio"
                        name="role"
                        value="student"
                        checked={role === "student"}
                        onChange={() => setRole("student")}
                    />
                    Student
                </label>

                <label className={role === "instructor" ? "active" : ""}>
                    <input
                        type="radio"
                        name="role"
                        value="instructor"
                        checked={role === "instructor"}
                        onChange={() => setRole("instructor")}
                    />
                    Instructor
                </label>
            </div>

            <form onSubmit={submitHandler}>
                <label htmlFor="name">Name</label>
                <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required />

                <label htmlFor="email">Email</label>
                <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required />

                <label htmlFor="password">Password</label>
                <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required />

                <button type= 'submit' disabled ={btnLoading}
                 className="common-btn"> { btnLoading ? " Please Wait..." : "Register" } 
                </button>
                
            </form>
            <p>
                Already have an Account? <Link to='/login'> Login </Link>
            </p>
        </div>
    </div>
  )
}

export default Register
