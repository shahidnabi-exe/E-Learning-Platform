import React from 'react'
import { MdDashboard } from "react-icons/md";
import './account.css'
import { IoMdLogOut } from "react-icons/io";
import { UserData } from '../../Context/UserContext';
import { useNavigate } from 'react-router-dom';


function Account({user}) {
    const { logoutUser } = UserData();
    const navigate = useNavigate();

    const logoutHandler = () => {
        logoutUser(navigate)
    }
  return (
    <div>
    { user &&  (
        <div className="profile">
        <div className="profile-info">
            
            <h2>My Profile</h2>
            <p>
                <strong>Name - {user.name}</strong>
            </p>

            <p>
                <strong>Email - {user.email}</strong>
            </p>

            <button onClick={() => navigate('/dashboard')} className='common-btn'>
                <MdDashboard/>
                Dashboard
            </button>

            <br />

             <button onClick={logoutHandler} className='common-btn'style={{ background: 'red' }}>
                <IoMdLogOut/>
                Logout
            </button>
            
        </div>
        </div>
    )}
    </div>
  )
}

export default Account