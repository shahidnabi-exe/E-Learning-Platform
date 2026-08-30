import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { server } from "../../config/server.js";
import "../Auth/Auth.css";

function CreateCourse() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a thumbnail image");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
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
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success(data.message);
      navigate("/instructor/my-courses");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-form">
        <h2>Create Course</h2>
        <form onSubmit={submitHandler}>
          <label>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />

          <label>Description</label>
          <input value={description} onChange={(e) => setDescription(e.target.value)} required />

          <label>Duration (hours)</label>
          <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} required />

          <label>Category</label>
          <input value={category} onChange={(e) => setCategory(e.target.value)} required />

          <label>Price</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />

          <label>Thumbnail Image</label>
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} required />

          <button type="submit" className="common-btn" disabled={loading}>
            {loading ? "Submitting..." : "Submit for Review"}
          </button>
        </form>
        <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#666" }}>
          Your course will be reviewed by an admin before it becomes visible to students.
        </p>
      </div>
    </div>
  );
}

export default CreateCourse;
