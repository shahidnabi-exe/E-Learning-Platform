import React from 'react';
import './dashboard.css';
import { CourseData } from '../../Context/CourseContext';
import CourseCard from '../../Components/CourseCard/CourseCard';

function Dashboard() {
  const { myCourse } = CourseData();

  return (
    <div className="dashboard">
      <h2>My Courses</h2>
      <div className="course-container">
        {
          myCourse && myCourse.length > 0 ? (
            myCourse.map(course => (
              <CourseCard key={course._id} course={course} />
            ))
          ) : (
            <p>No courses enrolled yet.</p>
          )
        }
      </div>
    </div>
  );
}

export default Dashboard;
