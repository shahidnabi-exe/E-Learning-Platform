import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  BookOpen,
  Users,
  Video,
  Star,
  PlusCircle,
  Clock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { server } from "../../config/server.js";
import { UserData } from "../../Context/UserContext";
import DashboardLayout from "../../Components/Layout/DashboardLayout";
import StatCard from "../../Components/UI/StatCard";
import Badge from "../../Components/UI/Badge";
import SkeletonLoader from "../../Components/UI/SkeletonLoader";
import EmptyState from "../../Components/UI/EmptyState";

function InstructorDashboard() {
  const navigate = useNavigate();
  const { user } = UserData();

  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token") || localStorage.getItem("adminToken");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${server}/api/instructor/analytics`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAnalytics(data.analytics || []);
      } catch (error) {
        console.error("Failed to load instructor analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [token]);

  // Aggregate totals
  const totalCourses = analytics.length;
  const totalStudents = analytics.reduce((sum, item) => sum + (item.enrolledCount || 0), 0);
  const totalLectures = analytics.reduce((sum, item) => sum + (item.lectureCount || 0), 0);
  const avgRating =
    analytics.length > 0
      ? (
          analytics.reduce((sum, item) => sum + (item.averageRating || 0), 0) /
          analytics.filter((item) => item.averageRating > 0).length || 1
        ).toFixed(1)
      : "0.0";

  return (
    <DashboardLayout title="Instructor Console">
      <div className="student-dashboard-page animate-fade-in">
        {/* Banner */}
        <div className="student-greeting-banner">
          <div className="greeting-text">
            <h1>Instructor Studio</h1>
            <p>
              Manage your published curricula, add video lectures, and monitor student engagement.
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button
              className="btn-primary"
              onClick={() => navigate("/instructor/create-course")}
            >
              <PlusCircle size={18} />
              <span>Create New Course</span>
            </button>
            <button
              className="btn-secondary"
              onClick={() => navigate("/instructor/my-courses")}
            >
              <BookOpen size={18} />
              <span>Manage Lectures</span>
            </button>
          </div>
        </div>

        {/* 4 Key StatCards */}
        <div className="student-metrics-grid">
          <StatCard
            title="Total Courses"
            value={totalCourses}
            icon={BookOpen}
            subtitle="Authored by you"
            color="gold"
          />
          <StatCard
            title="Enrolled Learners"
            value={totalStudents}
            icon={Users}
            subtitle="Across all courses"
            color="white"
          />
          <StatCard
            title="Total Lessons"
            value={totalLectures}
            icon={Video}
            subtitle="Published lectures"
            color="white"
          />
          <StatCard
            title="Average Rating"
            value={avgRating > 0 ? `${avgRating} ★` : "New"}
            icon={Star}
            subtitle="Student feedback"
            color="gold"
          />
        </div>

        {/* Courses Table / Overview */}
        <div>
          <div className="dashboard-section-header">
            <h2>Course Performance & Engagement</h2>
            <Link to="/instructor/my-courses" className="btn-secondary btn-sm">
              Manage Content
            </Link>
          </div>

          {loading ? (
            <SkeletonLoader count={3} height="120px" />
          ) : analytics.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="You haven't authored any courses yet"
              description="Start sharing your expertise with developers by creating your first course."
              actionLabel="Create Your First Course"
              onAction={() => navigate("/instructor/create-course")}
            />
          ) : (
            <div className="data-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Course Title</th>
                    <th>Status</th>
                    <th>Enrolled</th>
                    <th>Lectures</th>
                    <th>Rating</th>
                    <th>Price</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.map(
                    ({ course, enrolledCount, lectureCount, averageRating, reviewCount }) => {
                      const statusVariant =
                        course.status === "approved"
                          ? "success"
                          : course.status === "rejected"
                          ? "danger"
                          : "warning";

                      return (
                        <tr key={course._id}>
                          <td>
                            <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                              {course.title}
                            </div>
                            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                              {course.category} • {course.duration} hrs
                            </span>
                          </td>

                          <td>
                            <Badge variant={statusVariant}>{course.status}</Badge>
                          </td>

                          <td>
                            <strong>{enrolledCount}</strong> students
                          </td>

                          <td>
                            <strong>{lectureCount}</strong> videos
                          </td>

                          <td>
                            {reviewCount > 0 ? (
                              <span style={{ color: "var(--gold-primary)", fontWeight: 600 }}>
                                {averageRating} ★ ({reviewCount})
                              </span>
                            ) : (
                              <span style={{ color: "var(--text-muted)" }}>None yet</span>
                            )}
                          </td>

                          <td>{course.price > 0 ? `$${course.price}` : "Free"}</td>

                          <td style={{ textAlign: "right" }}>
                            <div style={{ display: "inline-flex", gap: "8px" }}>
                              <button
                                className="btn-secondary btn-sm"
                                onClick={() => navigate("/instructor/my-courses")}
                              >
                                Manage
                              </button>
                              {course.status === "approved" && (
                                <button
                                  className="btn-icon"
                                  style={{ width: "30px", height: "30px" }}
                                  title="View Public Page"
                                  onClick={() => navigate(`/course/${course._id}`)}
                                >
                                  <ExternalLink size={14} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default InstructorDashboard;
