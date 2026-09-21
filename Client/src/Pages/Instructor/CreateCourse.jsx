import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Image as ImageIcon, ArrowLeft, CheckCircle2 } from "lucide-react";
import { server } from "../../config/server.js";
import DashboardLayout from "../../Components/Layout/DashboardLayout";

function CreateCourse() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [category, setCategory] = useState("Artificial Intelligence");
  const [price, setPrice] = useState("0");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token") || localStorage.getItem("adminToken");

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    if (selected) {
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please upload a course thumbnail image");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("duration", duration);
    formData.append("category", category);
    formData.append("price", price);
    formData.append("file", file);

    setLoading(true);
    try {
      const { data } = await axios.post(
        `${server}/api/instructor/course/new`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(data.message || "Course submitted for review!");
      navigate("/instructor/my-courses");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Create Course">
      <div className="animate-fade-in" style={{ maxWidth: "840px", margin: "0 auto" }}>
        <button
          className="btn-secondary btn-sm"
          onClick={() => navigate("/instructor/my-courses")}
          style={{ marginBottom: "1.5rem", gap: "6px" }}
        >
          <ArrowLeft size={16} />
          <span>Back to My Courses</span>
        </button>

        <div className="card" style={{ padding: "2.5rem" }}>
          <div style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.6rem" }}>Author a New Course</h2>
            <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>
              Fill in the course curriculum details below. Your submission will be reviewed by an administrator.
            </p>
          </div>

          <form onSubmit={submitHandler} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div className="form-group">
              <label className="form-label">Course Title</label>
              <input
                className="form-input"
                placeholder="e.g., Modern Full Stack Architecture with React & Node"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="Full Stack Development">Full Stack Development</option>
                  <option value="Cloud & DevOps">Cloud & DevOps</option>
                  <option value="Data Science & Analytics">Data Science & Analytics</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Mobile Engineering">Mobile Engineering</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Estimated Duration (Hours)</label>
                <input
                  type="number"
                  min="1"
                  className="form-input"
                  placeholder="e.g., 12"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Price ($ USD — Enter 0 for Free)</label>
              <input
                type="number"
                min="0"
                className="form-input"
                placeholder="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Course Description & Outcomes</label>
              <textarea
                className="form-textarea"
                rows={4}
                placeholder="Detail what students will learn, prerequisites, and target audience..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Course Thumbnail Image</label>
              <input
                type="file"
                accept="image/*"
                className="form-input"
                onChange={handleFileChange}
                required
              />

              {previewUrl && (
                <div
                  style={{
                    marginTop: "1rem",
                    width: "100%",
                    height: "180px",
                    borderRadius: "var(--radius-md)",
                    overflow: "hidden",
                    border: "1px solid var(--surface-border)",
                  }}
                >
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              )}
            </div>

            <div
              style={{
                padding: "1rem",
                background: "var(--surface-elevated)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--surface-border)",
                fontSize: "0.85rem",
                color: "var(--text-secondary)",
              }}
            >
              ℹ️ Once submitted, the course will be in <strong>Pending</strong> state. Upon Admin approval, you will be able to upload video lectures directly from your Instructor Console.
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ marginTop: "0.5rem" }}
            >
              <PlusCircle size={18} />
              <span>{loading ? "Submitting Course..." : "Submit Course for Review"}</span>
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default CreateCourse;
