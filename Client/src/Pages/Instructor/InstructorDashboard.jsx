import { Link } from "react-router-dom";
import "../Dashboard/adminDashboard.css";

function InstructorDashboard() {
  return (
    <div className="admin-dashboard">
      <h2>Instructor Dashboard</h2>

      <div className="admin-actions">
        <Link to="/instructor/create-course" className="admin-card">
          Create Course
        </Link>

        <Link to="/instructor/my-courses" className="admin-card">
          My Courses
        </Link>
      </div>
    </div>
  );
}

export default InstructorDashboard;
