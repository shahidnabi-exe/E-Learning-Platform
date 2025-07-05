import React from 'react'
import './CourseCard.css'
import { server } from '../../main'

function CourseCard({ course }) {
  const imageUrl = `${server}/${course.image.replace(/\\/g, "/")}`;

  return (
    <div className='course-card'>
        <img
            src={imageUrl}
            // alt={course.title}
            className="course-img"
        />

        <h3> {course.title} </h3>
        <p>Instructor - {course.createdBy}</p>
        <p>Duration - {course.duration}</p>
        <p>Price - {course.price}</p>
        <button className='common-btn'>Get Started </button>
    </div>
  );
}

export default CourseCard