import { Link } from "react-router-dom";
import "./adminDashboard.css";

function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      <div className="admin-actions">
        <Link to="/admin/pending-courses" className="admin-card">
          Review Pending Courses
        </Link>

        <Link to="/admin/create-course" className="admin-card">
          Create Course
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboard;
