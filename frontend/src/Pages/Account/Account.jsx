import React from 'react'
import { MdDashboard } from "react-icons/md";
import './account.css'
import { IoMdLogOut } from "react-icons/io";
import { UserData } from '../../Context/UserContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


function Account({user}) {
    const { setIsAuth, setUser } = UserData();
    const navigate = useNavigate();

    const logoutHandler = () => {
        localStorage.clear()
        setUser([])
        setIsAuth(false)
        toast.success("Logged Out Successfully")
        navigate('/login')
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

            <button className='common-btn'>
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