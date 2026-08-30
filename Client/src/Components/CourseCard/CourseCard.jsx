import React from 'react'
import './CourseCard.css'
import { server } from '../../config/server.js'
import { useNavigate } from 'react-router-dom'

function CourseCard({ course }) {
  const navigate = useNavigate();
  const imageUrl = `${server}/${course.image.replace(/\\/g, "/")}`;

  return (
    <div className='course-card'>
        <img
            src={imageUrl}
            alt={course.title}
            className="course-img"
        />

        <h3> {course.title} </h3>
        <p>Instructor - {course.instructor}</p>
        <p>Duration - {course.duration}</p>
        <p>Price - {course.price}</p>
        <button className='common-btn' onClick={() => navigate(`/course/${course._id}`)}>
          Get Started
        </button>
    </div>
  );
}

export default CourseCard
