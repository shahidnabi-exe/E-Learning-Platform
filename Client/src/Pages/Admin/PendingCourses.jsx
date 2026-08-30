import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { server } from "../../config/server.js";
import "../Dashboard/dashboard.css";

function PendingCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reasonDrafts, setReasonDrafts] = useState({});

  const authHeader = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
    },
  };

  const fetchPending = async () => {
    try {
      const { data } = await axios.get(
        `${server}/api/admin/courses/pending`,
        authHeader
      );
      setCourses(data.courses);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load pending courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const review = async (id, decision) => {
    try {
      const { data } = await axios.put(
        `${server}/api/admin/course/${id}/review`,
        { decision, rejectionReason: reasonDrafts[id] || "" },
        authHeader
      );
      toast.success(data.message);
      setCourses((prev) => prev.filter((c) => c._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Review failed");
    }
  };

  if (loading) return <div className="dashboard"><p>Loading...</p></div>;

  return (
    <div className="dashboard">
      <h2>Pending Courses</h2>
      <div className="course-container" style={{ flexDirection: "column" }}>
        {courses.length === 0 && <p>No courses awaiting review.</p>}

        {courses.map((course) => (
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
            <p style={{ color: "#666", fontSize: "0.9rem" }}>
              Submitted by: {course.createdBy?.name} ({course.createdBy?.email})
            </p>

            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
              <button className="common-btn" onClick={() => review(course._id, "approved")}>
                Approve
              </button>
              <button
                className="common-btn"
                style={{ background: "red" }}
                onClick={() => review(course._id, "rejected")}
              >
                Reject
              </button>
            </div>

            <input
              placeholder="Rejection reason (optional)"
              style={{ marginTop: "0.5rem", width: "100%" }}
              value={reasonDrafts[course._id] || ""}
              onChange={(e) =>
                setReasonDrafts((prev) => ({ ...prev, [course._id]: e.target.value }))
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PendingCourses;
