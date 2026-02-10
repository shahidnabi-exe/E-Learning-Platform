import { Link } from "react-router-dom";
import "./adminDashboard.css";

function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      <div className="admin-actions">
        <Link to="/admin/create-course" className="admin-card">
          ➕ Create Course
        </Link>

        <Link to="/admin/courses" className="admin-card">
          📚 Manage Courses
        </Link>

        <Link to="/admin/stats" className="admin-card">
          📊 Platform Stats
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboard;
