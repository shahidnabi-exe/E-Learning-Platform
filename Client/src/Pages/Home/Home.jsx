import React from 'react'
import { useNavigate } from 'react-router-dom'
import './home.css'
import Testimonials from '../../Components/Testimonials/Testimonials';

function Home() {
  const navigate = useNavigate();
  return (
    <div>
      <div className="home">
        <div className="home-content">
          <h2>Welcome to Code Campus your (E-Learning Platform)</h2>
          <p>Learn, Grow, Excel</p>
          <button onClick={() => navigate('/courses')} className='common-btn'> Get Started</button>
        </div>
      </div>
      <Testimonials></Testimonials>
    </div>
  )
}

export default Home