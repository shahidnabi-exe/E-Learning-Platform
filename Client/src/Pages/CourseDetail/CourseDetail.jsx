import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { server } from "../../config/server.js";
import { UserData } from "../../Context/UserContext";
import "./courseDetail.css";

function StarInput({ value, onChange }) {
  return (
    <div className="star-input">
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={n <= value ? "star filled" : "star"}
          onClick={() => onChange(n)}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuth } = UserData();

  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [average, setAverage] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [myRating, setMyRating] = useState(0);
  const [myReviewText, setMyReviewText] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const [progress, setProgress] = useState(null);

  const token = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const fetchCourse = async () => {
    try {
      const { data } = await axios.get(`${server}/api/course/${id}`);
      setCourse(data.course);
    } catch (error) {
      toast.error("Failed to load course");
    }
  };

  const fetchLectures = async () => {
    try {
      const { data } = await axios.get(`${server}/api/lectures/${id}`, authHeader);
      setLectures(data.lectures);
      setEnrolled(true);
    } catch (error) {
      setEnrolled(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`${server}/api/course/${id}/reviews`);
      setReviews(data.reviews);
      setAverage(data.average);
      setReviewCount(data.count);
    } catch (error) {
      // non-critical
    }
  };

  const fetchProgress = async () => {
    try {
      const { data } = await axios.get(`${server}/api/course/${id}/progress`, authHeader);
      setProgress(data);
    } catch (error) {
      // non-critical
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchCourse();
      await fetchReviews();
      if (isAuth) {
        await fetchLectures();
        await fetchProgress();
      }
      setLoading(false);
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isAuth]);

  const enrollHandler = async () => {
    if (!isAuth) {
      navigate("/login");
      return;
    }
    setEnrolling(true);
    try {
      const { data } = await axios.post(`${server}/api/course/${id}/enroll`, {}, authHeader);
      toast.success(data.message);
      await fetchLectures();
      await fetchProgress();
    } catch (error) {
      toast.error(error.response?.data?.message || "Enrollment failed");
    } finally {
      setEnrolling(false);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (myRating < 1) {
      toast.error("Please select a rating");
      return;
    }
    setSubmittingReview(true);
    try {
      const { data } = await axios.post(
        `${server}/api/course/${id}/review`,
        { rating: myRating, text: myReviewText },
        authHeader
      );
      toast.success(data.message);
      await fetchReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <div className="course-detail"><p>Loading...</p></div>;
  if (!course) return <div className="course-detail"><p>Course not found.</p></div>;

  const imageUrl = `${server}/${course.image.replace(/\\/g, "/")}`;

  return (
    <div className="course-detail">
      <img src={imageUrl} alt={course.title} className="course-detail-img" />
      <h2>{course.title}</h2>
      <p>{course.description}</p>
      <p><strong>Instructor:</strong> {course.instructor}</p>
      <p><strong>Duration:</strong> {course.duration} hours</p>
      <p><strong>Price:</strong> {course.price}</p>
      <p><strong>Rating:</strong> {reviewCount > 0 ? `${average} / 5 (${reviewCount} review${reviewCount > 1 ? "s" : ""})` : "No reviews yet"}</p>

      {!enrolled && (
        <button className="common-btn" onClick={enrollHandler} disabled={enrolling}>
          {enrolling ? "Enrolling..." : "Enroll Now"}
        </button>
      )}

      {enrolled && progress && (
        <div className="progress-bar-wrap">
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${progress.percentage}%` }} />
          </div>
          <span>{progress.percentage}% complete</span>
        </div>
      )}

      {enrolled && (
        <div className="lecture-list">
          <h3>Lectures</h3>
          {lectures.length === 0 && <p>No lectures uploaded yet.</p>}
          {lectures.map((lecture) => {
            const done = progress?.completedLectures?.includes(lecture._id);
            return (
              <div
                key={lecture._id}
                className="lecture-item"
                onClick={() => navigate(`/lecture/${lecture._id}`)}
              >
                {lecture.title} {done && <span className="done-badge">✓ done</span>}
              </div>
            );
          })}
        </div>
      )}

      {enrolled && (
        <div className="review-section">
          <h3>Leave a Review</h3>
          <form onSubmit={submitReview}>
            <StarInput value={myRating} onChange={setMyRating} />
            <textarea
              placeholder="Share your thoughts on this course..."
              value={myReviewText}
              onChange={(e) => setMyReviewText(e.target.value)}
              rows={3}
            />
            <button className="common-btn" type="submit" disabled={submittingReview}>
              {submittingReview ? "Saving..." : "Submit Review"}
            </button>
          </form>
        </div>
      )}

      <div className="review-list">
        <h3>Reviews</h3>
        {reviews.length === 0 && <p>No reviews yet.</p>}
        {reviews.map((r) => (
          <div key={r._id} className="review-item">
            <strong>{r.user?.name || "User"}</strong> — {r.rating}★
            {r.text && <p>{r.text}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CourseDetail;
