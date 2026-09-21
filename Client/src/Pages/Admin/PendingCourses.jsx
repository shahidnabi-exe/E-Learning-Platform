import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Clock, CheckCircle, XCircle, ArrowLeft, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { server } from "../../config/server.js";
import DashboardLayout from "../../Components/Layout/DashboardLayout";
import Badge from "../../Components/UI/Badge";
import SkeletonLoader from "../../Components/UI/SkeletonLoader";
import EmptyState from "../../Components/UI/EmptyState";

function PendingCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reasonDrafts, setReasonDrafts] = useState({});
  const [processingId, setProcessingId] = useState(null);

  const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
  const authHeader = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const fetchPending = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${server}/api/admin/courses/pending`,
        authHeader
      );
      setCourses(data.courses || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load pending courses");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  const review = async (id, decision) => {
    setProcessingId(id);
    try {
      const { data } = await axios.put(
        `${server}/api/admin/course/${id}/review`,
        { decision, rejectionReason: reasonDrafts[id] || "" },
        authHeader
      );
      toast.success(data.message || `Course ${decision}`);
      setCourses((prev) => prev.filter((c) => c._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Review action failed");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <DashboardLayout title="Course Review Queue">
      <div className="student-dashboard-page animate-fade-in" style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <button
          className="btn-secondary btn-sm"
          onClick={() => navigate("/admin/dashboard")}
          style={{ width: "fit-content", gap: "6px" }}
        >
          <ArrowLeft size={16} />
          <span>Back to Console</span>
        </button>

        <div className="dashboard-section-header">
          <div>
            <h2>Instructor Course Submissions ({courses.length})</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              Evaluate syllabus quality and approve or provide actionable rejection feedback.
            </p>
          </div>
        </div>

        {loading ? (
          <SkeletonLoader count={3} height="200px" />
        ) : courses.length === 0 ? (
          <EmptyState
            icon={CheckCircle}
            title="All caught up!"
            description="There are currently no courses awaiting moderation."
            actionLabel="Return to Admin Dashboard"
            onAction={() => navigate("/admin/dashboard")}
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {courses.map((course) => {
              const imageUrl = course.image
                ? `${server}/${course.image.replace(/\\/g, "/")}`
                : "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80";

              return (
                <div key={course._id} className="card" style={{ padding: "2rem" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: "1.75rem", marginBottom: "1.5rem" }}>
                    <div
                      style={{
                        width: "100%",
                        height: "120px",
                        borderRadius: "var(--radius-md)",
                        overflow: "hidden",
                        background: "var(--surface-elevated)",
                      }}
                    >
                      <img
                        src={imageUrl}
                        alt={course.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80";
                        }}
                      />
                    </div>

                    <div>
                      <div style={{ display: "flex", gap: "8px", marginBottom: "6px" }}>
                        <Badge variant="warning">Awaiting Review</Badge>
                        <Badge variant="gold">{course.category}</Badge>
                      </div>

                      <h3 style={{ fontSize: "1.3rem" }}>{course.title}</h3>
                      <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", margin: "6px 0" }}>
                        {course.description}
                      </p>

                      <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "8px" }}>
                        <span>👤 Instructor: <strong>{course.createdBy?.name || course.instructor}</strong> ({course.createdBy?.email})</span>
                        <span>⏱️ Duration: <strong>{course.duration} hours</strong></span>
                        <span>🏷️ Price: <strong>{course.price > 0 ? `$${course.price}` : "Free"}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      background: "var(--surface-elevated)",
                      padding: "1.25rem",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--surface-border)",
                    }}
                  >
                    <label className="form-label" style={{ marginBottom: "6px", display: "block" }}>
                      Rejection Reason / Required Improvements (Optional for Approval)
                    </label>
                    <input
                      className="form-input"
                      placeholder="e.g., Please provide more detail in the course description before resubmission..."
                      value={reasonDrafts[course._id] || ""}
                      onChange={(e) =>
                        setReasonDrafts((prev) => ({
                          ...prev,
                          [course._id]: e.target.value,
                        }))
                      }
                    />

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "1rem" }}>
                      <button
                        className="btn-danger btn-sm"
                        disabled={processingId === course._id}
                        onClick={() => review(course._id, "rejected")}
                      >
                        <XCircle size={15} />
                        <span>Reject Course</span>
                      </button>

                      <button
                        className="btn-primary btn-sm"
                        disabled={processingId === course._id}
                        onClick={() => review(course._id, "approved")}
                      >
                        <CheckCircle size={15} />
                        <span>Approve Course</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default PendingCourses;
