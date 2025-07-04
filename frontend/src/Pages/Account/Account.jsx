import React from 'react'
import { MdDashboard } from "react-icons/md";

function Account() {
  return (
    <div className="profile">
        <div className="profile-info">
            
            <p>
                <strong>Name - Shahid</strong>
            </p>

            <p>
                <strong>Email - Shahid@123</strong>
            </p>

            <button className='common-btn'>
                <MdDashboard/>
                Dashboard
            </button>
            
        </div>
    </div>
  )
}

export default Account