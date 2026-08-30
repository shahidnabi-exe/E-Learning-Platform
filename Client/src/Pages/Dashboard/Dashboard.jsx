import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './dashboard.css';
import { CourseData } from '../../Context/CourseContext';
import { server } from "../../config/server.js";

function CourseProgressCard({ course }) {
  const navigate = useNavigate();
  const [percentage, setPercentage] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const { data } = await axios.get(`${server}/api/course/${course._id}/progress`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPercentage(data.percentage);
      } catch (error) {
        setPercentage(0);
      }
    };
    fetchProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course._id]);

  const imageUrl = `${server}/${course.image.replace(/\\/g, "/")}`;

  return (
    <div className="progress-course-card" onClick={() => navigate(`/course/${course._id}`)}>
      <img src={imageUrl} alt={course.title} />
      <h3>{course.title}</h3>
      <div className="progress-bar-track">
        <div className="progress-bar-fill" style={{ width: `${percentage ?? 0}%` }} />
      </div>
      <span>{percentage === null ? "Loading..." : `${percentage}% complete`}</span>
    </div>
  );
}

function Dashboard() {
  const { myCourse } = CourseData();

  return (
    <div className="dashboard">
      <h2>My Courses</h2>
      <div className="course-container">
        {
          myCourse && myCourse.length > 0 ? (
            myCourse.map(course => (
              <CourseProgressCard key={course._id} course={course} />
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
