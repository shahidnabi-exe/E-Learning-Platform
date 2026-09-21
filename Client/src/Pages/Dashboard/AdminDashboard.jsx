import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Users,
  BookOpen,
  Clock,
  CheckCircle,
  PlusCircle,
  TrendingUp,
  UserCheck,
  ShieldCheck,
  GraduationCap,
  ExternalLink,
} from "lucide-react";
import { server } from "../../config/server.js";
import DashboardLayout from "../../Components/Layout/DashboardLayout";
import StatCard from "../../Components/UI/StatCard";
import Badge from "../../Components/UI/Badge";
import SkeletonLoader from "../../Components/UI/SkeletonLoader";
import EmptyState from "../../Components/UI/EmptyState";

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [pendingCourses, setPendingCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const loadAdminData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsRes, pendingRes] = await Promise.all([
        axios.get(`${server}/api/stats`, authHeader),
        axios.get(`${server}/api/admin/courses/pending`, authHeader),
      ]);

      setStats(statsRes.data.stats || {});
      setPendingCourses(pendingRes.data.courses || []);
    } catch (error) {
      console.error("Failed to load admin stats:", error);
      toast.error(error.response?.data?.message || "Failed to load admin metrics");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  const reviewCourse = async (id, decision) => {
    try {
      const { data } = await axios.put(
        `${server}/api/admin/course/${id}/review`,
        { decision },
        authHeader
      );
      toast.success(data.message || `Course ${decision}`);
      setPendingCourses((prev) => prev.filter((c) => c._id !== id));
      loadAdminData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed");
    }
  };

  return (
    <DashboardLayout title="Platform Administration">
      <div className="student-dashboard-page animate-fade-in">
        {/* Banner */}
        <div className="student-greeting-banner">
          <div className="greeting-text">
            <h1>Platform Administration Console</h1>
            <p>
              Real-time platform statistics, user accounts moderation, and course publishing oversight.
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              className="btn-primary"
              onClick={() => navigate("/admin/pending-courses")}
            >
              <Clock size={16} />
              <span>Review Queue ({pendingCourses.length})</span>
            </button>
            <button
              className="btn-secondary"
              onClick={() => navigate("/admin/users")}
            >
              <Users size={16} />
              <span>Manage Users</span>
            </button>
            <button
              className="btn-secondary"
              onClick={() => navigate("/admin/create-course")}
            >
              <PlusCircle size={16} />
              <span>New Course</span>
            </button>
          </div>
        </div>

        {/* 6 Platform StatCards */}
        {loading ? (
          <SkeletonLoader count={4} height="120px" />
        ) : (
          <div className="student-metrics-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
            <StatCard
              title="Total Users"
              value={stats?.totalUsers ?? 0}
              icon={Users}
              subtitle="Registered accounts"
              color="gold"
            />
            <StatCard
              title="Active Students"
              value={stats?.totalStudents ?? 0}
              icon={GraduationCap}
              subtitle="Enrolled learners"
              color="white"
            />
            <StatCard
              title="Instructors"
              value={stats?.totalInstructors ?? 0}
              icon={UserCheck}
              subtitle="Course authors"
              color="white"
            />
            <StatCard
              title="Approved Courses"
              value={stats?.totalCourses ?? 0}
              icon={BookOpen}
              subtitle="In public catalog"
              color="gold"
            />
            <StatCard
              title="Pending Reviews"
              value={stats?.pendingCourses ?? 0}
              icon={Clock}
              subtitle="Awaiting moderation"
              color="gold"
            />
            <StatCard
              title="Total Enrollments"
              value={stats?.activeEnrollments ?? 0}
              icon={TrendingUp}
              subtitle="Course subscriptions"
              color="white"
            />
          </div>
        )}

        {/* Pending Courses Approval Queue Section */}
        <div>
          <div className="dashboard-section-header">
            <div>
              <h2>Pending Course Submissions ({pendingCourses.length})</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>
                Courses submitted by instructors awaiting quality and curriculum review.
              </p>
            </div>

            <Link to="/admin/pending-courses" className="btn-secondary btn-sm">
              Open Full Review Queue
            </Link>
          </div>

          {loading ? (
            <SkeletonLoader count={2} height="120px" />
          ) : pendingCourses.length === 0 ? (
            <div
              className="card"
              style={{
                textAlign: "center",
                padding: "2.5rem 1rem",
                color: "var(--text-secondary)",
              }}
            >
              <CheckCircle size={36} color="var(--status-success)" style={{ margin: "0 auto 0.75rem" }} />
              <p style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                The review queue is completely clear!
              </p>
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                All instructor submissions have been moderated.
              </span>
            </div>
          ) : (
            <div className="data-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Submitted By</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th style={{ textAlign: "right" }}>Review Decision</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingCourses.slice(0, 5).map((course) => (
                    <tr key={course._id}>
                      <td>
                        <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                          {course.title}
                        </div>
                        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                          {course.duration} hours
                        </span>
                      </td>

                      <td>
                        <div>{course.createdBy?.name || course.instructor}</div>
                        <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                          {course.createdBy?.email}
                        </span>
                      </td>

                      <td>
                        <Badge variant="gold">{course.category}</Badge>
                      </td>

                      <td>{course.price > 0 ? `$${course.price}` : "Free"}</td>

                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "8px" }}>
                          <button
                            className="btn-primary btn-sm"
                            onClick={() => reviewCourse(course._id, "approved")}
                          >
                            Approve
                          </button>
                          <button
                            className="btn-danger btn-sm"
                            onClick={() => reviewCourse(course._id, "rejected")}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdminDashboard;
