import React from 'react'
import { MdDashboard } from "react-icons/md";
import './account.css'

function Account({user}) {
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

            <button className='common-btn'>
                <MdDashboard/>
                Dashboard
            </button>
            
        </div>
        </div>
    )}
    </div>
  )
}

export default Account