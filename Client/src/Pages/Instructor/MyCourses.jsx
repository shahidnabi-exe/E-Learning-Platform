import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { server } from "../../config/server.js";
import "../Dashboard/dashboard.css";

function AddLectureForm({ courseId, onDone }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a video file");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("file", file);

    setLoading(true);
    try {
      const { data } = await axios.post(
        `${server}/api/instructor/course/${courseId}/lecture`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success(data.message);
      setTitle("");
      setDescription("");
      setFile(null);
      onDone && onDone();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add lecture");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submitHandler} style={{ marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <input placeholder="Lecture title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <input placeholder="Lecture description" value={description} onChange={(e) => setDescription(e.target.value)} required />
      <input type="file" accept="video/*" onChange={(e) => setFile(e.target.files[0])} required />
      <button type="submit" className="common-btn" disabled={loading}>
        {loading ? "Uploading..." : "Add Lecture"}
      </button>
    </form>
  );
}

function MyCourses() {
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCourseId, setOpenCourseId] = useState(null);

  const fetchAnalytics = async () => {
    try {
      const { data } = await axios.get(`${server}/api/instructor/analytics`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setAnalytics(data.analytics);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const statusColor = {
    pending: "#f0ad4e",
    approved: "#28a745",
    rejected: "#dc3545",
  };

  if (loading) return <div className="dashboard"><p>Loading...</p></div>;

  return (
    <div className="dashboard">
      <h2>My Courses</h2>
      <div className="course-container" style={{ flexDirection: "column" }}>
        {analytics.length === 0 && <p>You haven't created any courses yet.</p>}

        {analytics.map(({ course, enrolledCount, lectureCount, averageRating, reviewCount }) => (
          <div
            key={course._id}
            style={{
              border: "1px solid #eee",
              borderRadius: "8px",
              padding: "1rem",
              marginBottom: "1rem",
            }}
          >
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <span
              style={{
                display: "inline-block",
                padding: "0.2rem 0.6rem",
                borderRadius: "4px",
                color: "#fff",
                background: statusColor[course.status] || "#999",
                fontSize: "0.8rem",
                textTransform: "capitalize",
              }}
            >
              {course.status}
            </span>

            {course.status === "approved" && (
              <div style={{ display: "flex", gap: "1.5rem", marginTop: "0.75rem", color: "#444", fontSize: "0.9rem" }}>
                <span>👤 {enrolledCount} enrolled</span>
                <span>🎬 {lectureCount} lectures</span>
                <span>⭐ {reviewCount > 0 ? `${averageRating} (${reviewCount})` : "No reviews yet"}</span>
              </div>
            )}

            {course.status === "rejected" && course.rejectionReason && (
              <p style={{ color: "#dc3545", marginTop: "0.5rem" }}>
                Reason: {course.rejectionReason}
              </p>
            )}

            {course.status === "approved" && (
              <div>
                <button
                  className="common-btn"
                  style={{ marginTop: "0.75rem" }}
                  onClick={() =>
                    setOpenCourseId(openCourseId === course._id ? null : course._id)
                  }
                >
                  {openCourseId === course._id ? "Cancel" : "Add Lecture"}
                </button>

                {openCourseId === course._id && (
                  <AddLectureForm
                    courseId={course._id}
                    onDone={() => {
                      setOpenCourseId(null);
                      fetchAnalytics();
                    }}
                  />
                )}
              </div>
            )}

            {course.status === "pending" && (
              <p style={{ marginTop: "0.5rem", color: "#666" }}>
                Waiting for admin approval before you can add lectures.
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyCourses;
