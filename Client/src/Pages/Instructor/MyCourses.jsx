import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  PlusCircle,
  Video,
  Users,
  Star,
  Clock,
  Trash2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  FileVideo,
  Upload,
} from "lucide-react";
import { server } from "../../config/server.js";
import DashboardLayout from "../../Components/Layout/DashboardLayout";
import Badge from "../../Components/UI/Badge";
import SkeletonLoader from "../../Components/UI/SkeletonLoader";
import EmptyState from "../../Components/UI/EmptyState";

function AddLectureForm({ courseId, onDone }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token") || localStorage.getItem("adminToken");

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a video file");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("file", file);

    setLoading(true);
    try {
      const { data } = await axios.post(
        `${server}/api/instructor/course/${courseId}/lecture`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(data.message || "Lecture added successfully!");
      setTitle("");
      setDescription("");
      setFile(null);
      if (onDone) onDone();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add lecture");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submitHandler}
      style={{
        background: "var(--surface-elevated)",
        padding: "1.5rem",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--surface-border-gold)",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        marginTop: "1.25rem",
      }}
    >
      <h4 style={{ color: "var(--gold-primary)", fontSize: "1rem" }}>
        Upload New Lesson Video
      </h4>

      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Lesson Title</label>
        <input
          className="form-input"
          placeholder="e.g., Introduction to Neural Networks"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Lesson Description / Notes</label>
        <textarea
          className="form-textarea"
          rows={3}
          placeholder="Summarize key concepts covered in this video..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Video File (MP4, WEBM, MOV)</label>
        <input
          type="file"
          accept="video/*"
          className="form-input"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
        <button
          type="submit"
          className="btn-primary btn-sm"
          disabled={loading}
        >
          <Upload size={15} />
          <span>{loading ? "Uploading Video..." : "Publish Lesson"}</span>
        </button>
      </div>
    </form>
  );
}

function CourseLecturesManager({ courseId, token, onUpdated }) {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLectures = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${server}/api/instructor/course/${courseId}/lectures`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLectures(data.lectures || []);
    } catch (error) {
      console.warn("Could not load course lectures:", error);
    } finally {
      setLoading(false);
    }
  }, [courseId, token]);

  useEffect(() => {
    fetchLectures();
  }, [fetchLectures]);

  const handleDeleteLecture = async (lectureId) => {
    if (!window.confirm("Are you sure you want to delete this lecture?")) return;
    try {
      await axios.delete(`${server}/api/instructor/lecture/${lectureId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Lecture deleted");
      fetchLectures();
      if (onUpdated) onUpdated();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete lecture");
    }
  };

  if (loading) return <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Loading lectures...</p>;

  if (lectures.length === 0) {
    return (
      <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", padding: "0.5rem 0" }}>
        No lessons uploaded yet. Use the upload form below to add your first lecture video.
      </p>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", margin: "1rem 0" }}>
      {lectures.map((l, idx) => (
        <div
          key={l._id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 14px",
            background: "var(--surface-elevated)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--surface-border)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ color: "var(--gold-primary)", fontWeight: 700, fontSize: "0.85rem" }}>
              #{idx + 1}
            </span>
            <span style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.9rem" }}>
              {l.title}
            </span>
          </div>

          <button
            onClick={() => handleDeleteLecture(l._id)}
            className="btn-icon"
            style={{ width: "30px", height: "30px", color: "var(--status-danger)" }}
            title="Delete Lecture"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ))}
    </div>
  );
}

function MyCourses() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCourseId, setOpenCourseId] = useState(null);

  const token = localStorage.getItem("token") || localStorage.getItem("adminToken");

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${server}/api/instructor/analytics`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnalytics(data.analytics || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load courses");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return (
    <DashboardLayout title="My Instructor Courses">
      <div className="student-dashboard-page animate-fade-in">
        <div className="dashboard-section-header">
          <div>
            <h2>Created Courses ({analytics.length})</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              Manage lecture uploads, curriculum outlines, and submission reviews.
            </p>
          </div>

          <button
            className="btn-primary"
            onClick={() => navigate("/instructor/create-course")}
          >
            <PlusCircle size={18} />
            <span>Create New Course</span>
          </button>
        </div>

        {loading ? (
          <SkeletonLoader count={3} height="150px" />
        ) : analytics.length === 0 ? (
          <EmptyState
            icon={FileVideo}
            title="No courses created yet"
            description="You haven't authored any courses. Launch your first course to begin teaching."
            actionLabel="Create a Course"
            onAction={() => navigate("/instructor/create-course")}
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {analytics.map(
              ({ course, enrolledCount, lectureCount, averageRating, reviewCount }) => {
                const isOpen = openCourseId === course._id;
                const statusVariant =
                  course.status === "approved"
                    ? "success"
                    : course.status === "rejected"
                    ? "danger"
                    : "warning";

                return (
                  <div key={course._id} className="card" style={{ padding: "1.75rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                          <Badge variant={statusVariant}>{course.status}</Badge>
                          <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                            {course.category} • {course.duration} hrs • {course.price > 0 ? `$${course.price}` : "Free"}
                          </span>
                        </div>

                        <h3 style={{ fontSize: "1.25rem" }}>{course.title}</h3>
                        <p style={{ color: "var(--text-secondary)", marginTop: "4px", maxWidth: "700px" }}>
                          {course.description}
                        </p>
                      </div>

                      <div style={{ display: "flex", gap: "8px" }}>
                        {course.status === "approved" && (
                          <button
                            className="btn-secondary btn-sm"
                            onClick={() => navigate(`/course/${course._id}`)}
                            title="View Public Page"
                          >
                            <ExternalLink size={14} />
                            <span>Preview</span>
                          </button>
                        )}

                        {course.status === "approved" && (
                          <button
                            className="btn-primary btn-sm"
                            onClick={() => setOpenCourseId(isOpen ? null : course._id)}
                          >
                            <span>{isOpen ? "Close Studio" : "Curriculum & Lessons"}</span>
                            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Metrics Row */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "2rem",
                        marginTop: "1.25rem",
                        paddingTop: "1rem",
                        borderTop: "1px solid var(--surface-border)",
                        fontSize: "0.88rem",
                        color: "var(--text-secondary)",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Users size={16} color="var(--gold-primary)" />
                        <span><strong>{enrolledCount}</strong> Students Enrolled</span>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Video size={16} />
                        <span><strong>{lectureCount}</strong> Lessons Published</span>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Star size={16} fill="var(--gold-primary)" color="var(--gold-primary)" />
                        <span>
                          <strong>{reviewCount > 0 ? averageRating : "New"}</strong> ({reviewCount} reviews)
                        </span>
                      </div>
                    </div>

                    {/* Rejected feedback alert */}
                    {course.status === "rejected" && course.rejectionReason && (
                      <div
                        style={{
                          marginTop: "1rem",
                          padding: "1rem",
                          background: "var(--status-danger-bg)",
                          border: "1px solid rgba(239, 68, 68, 0.3)",
                          borderRadius: "var(--radius-md)",
                          display: "flex",
                          gap: "10px",
                          color: "var(--status-danger)",
                          fontSize: "0.9rem",
                        }}
                      >
                        <AlertCircle size={18} style={{ flexShrink: 0 }} />
                        <div>
                          <strong>Rejection Feedback from Admin:</strong>
                          <p style={{ color: "var(--text-primary)", marginTop: "2px" }}>
                            {course.rejectionReason}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Pending review notice */}
                    {course.status === "pending" && (
                      <div
                        style={{
                          marginTop: "1rem",
                          padding: "0.75rem 1rem",
                          background: "var(--status-warning-bg)",
                          border: "1px solid rgba(245, 158, 11, 0.25)",
                          borderRadius: "var(--radius-md)",
                          color: "var(--status-warning)",
                          fontSize: "0.85rem",
                        }}
                      >
                        ⏳ This course is currently under review by an administrator. Once approved, you can immediately upload video lectures.
                      </div>
                    )}

                    {/* Collapsible Curriculum & Lesson Manager */}
                    {isOpen && course.status === "approved" && (
                      <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--surface-border)" }}>
                        <h4 style={{ fontSize: "1.05rem", marginBottom: "0.5rem" }}>
                          Course Curriculum ({lectureCount} Lessons)
                        </h4>

                        <CourseLecturesManager
                          courseId={course._id}
                          token={token}
                          onUpdated={fetchAnalytics}
                        />

                        <AddLectureForm
                          courseId={course._id}
                          onDone={() => {
                            fetchAnalytics();
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              }
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default MyCourses;
