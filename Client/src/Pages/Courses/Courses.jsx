import React from 'react'
import './courses.css'
import { CourseData } from '../../Context/CourseContext'
import CourseCard from '../../Components/CourseCard/CourseCard';
function Courses() {
    const { courses } = CourseData();
    console.log(courses);
  return (
    <div className='courses'>
        <h2>Available Courses</h2>
        <div className="course-container">
            {
                courses && courses.length > 0 ? courses.map((e) => (
                    <CourseCard key={e._id} course={e} />
                )) : <p>No Course Yet!</p>
            }
        </div>
    </div>
  ) 
}

export default Courses