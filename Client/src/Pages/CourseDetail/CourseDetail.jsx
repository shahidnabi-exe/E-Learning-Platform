import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Clock,
  BookOpen,
  Star,
  CheckCircle2,
  PlayCircle,
  Lock,
  ArrowRight,
  ShieldCheck,
  Award,
  Video,
  FileText,
  UserCheck,
} from "lucide-react";
import { server } from "../../config/server.js";
import { UserData } from "../../Context/UserContext";
import Badge from "../../Components/UI/Badge";
import ProgressBar from "../../Components/UI/ProgressBar";
import SkeletonLoader from "../../Components/UI/SkeletonLoader";
import EmptyState from "../../Components/UI/EmptyState";
import "./courseDetail.css";

function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuth, fetchUser } = UserData();

  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  // Reviews
  const [reviews, setReviews] = useState([]);
  const [average, setAverage] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [myRating, setMyRating] = useState(5);
  const [myReviewText, setMyReviewText] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Progress
  const [progress, setProgress] = useState(null);

  const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const checkIsEnrolled = useCallback(() => {
    if (!user || !user.subscription) return false;
    return user.subscription.some(
      (sub) => (sub._id || sub).toString() === id.toString()
    );
  }, [user, id]);

  const fetchCourseData = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${server}/api/course/${id}`);
      setCourse(data.course);

      // Check if enrolled directly from user or instructor ownership
      const isOwner = user && data.course.createdBy?._id?.toString() === user._id?.toString();
      const userEnrolled = checkIsEnrolled() || isOwner || user?.role === "admin";
      setEnrolled(userEnrolled);

      // Fetch reviews
      try {
        const revRes = await axios.get(`${server}/api/course/${id}/reviews`);
        setReviews(revRes.data.reviews || []);
        setAverage(revRes.data.average || 0);
        setReviewCount(revRes.data.count || 0);
      } catch (err) {
        console.warn("Reviews fetch error:", err);
      }

      // If enrolled/owner/admin, fetch lectures and progress
      if (token && userEnrolled) {
        try {
          const lecRes = await axios.get(`${server}/api/lectures/${id}`, authHeader);
          setLectures(lecRes.data.lectures || []);
        } catch (err) {
          console.warn("Lectures fetch error:", err);
        }

        try {
          const progRes = await axios.get(`${server}/api/course/${id}/progress`, authHeader);
          setProgress(progRes.data);
        } catch (err) {
          console.warn("Progress fetch error:", err);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load course details");
    } finally {
      setLoading(false);
    }
  }, [id, token, user, checkIsEnrolled]);

  useEffect(() => {
    fetchCourseData();
  }, [fetchCourseData]);

  const enrollHandler = async () => {
    if (!isAuth) {
      navigate("/login");
      return;
    }

    setEnrolling(true);
    try {
      const { data } = await axios.post(`${server}/api/course/${id}/enroll`, {}, authHeader);
      toast.success(data.message || "Enrolled successfully!");
      setEnrolled(true);
      if (fetchUser) await fetchUser();
      await fetchCourseData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Enrollment failed");
    } finally {
      setEnrolling(false);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!myRating || myRating < 1) {
      toast.error("Please choose a rating from 1 to 5 stars");
      return;
    }

    setSubmittingReview(true);
    try {
      const { data } = await axios.post(
        `${server}/api/course/${id}/review`,
        { rating: myRating, text: myReviewText },
        authHeader
      );
      toast.success(data.message || "Review submitted!");
      setMyReviewText("");

      const revRes = await axios.get(`${server}/api/course/${id}/reviews`);
      setReviews(revRes.data.reviews || []);
      setAverage(revRes.data.average || 0);
      setReviewCount(revRes.data.count || 0);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="course-detail-page">
        <SkeletonLoader count={4} height="160px" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="course-detail-page">
        <EmptyState
          title="Course not found"
          description="The course you are looking for does not exist or has been removed."
          actionLabel="Browse Other Courses"
          onAction={() => navigate("/courses")}
        />
      </div>
    );
  }

  const imageUrl = course.image
    ? `${server}/${course.image.replace(/\\/g, "/")}`
    : "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80";

  const firstLectureId = lectures[0]?._id;

  return (
    <div className="course-detail-page">
      <div className="course-detail-layout">
        {/* Left Content Area */}
        <div className="course-detail-content">
          {/* Hero Banner Card */}
          <div className="course-hero-card">
            <div className="course-hero-header">
              <div className="course-category-tag">
                <Badge variant="gold">{course.category || "Development"}</Badge>
                {enrolled && (
                  <Badge variant="success" icon={CheckCircle2}>
                    Enrolled
                  </Badge>
                )}
              </div>

              <h1 className="course-detail-title">{course.title}</h1>
              <p className="course-detail-desc">{course.description}</p>

              <div className="course-quick-meta">
                <div className="meta-item">
                  <UserCheck size={16} color="var(--gold-primary)" />
                  <span>Instructor: <strong>{course.instructor || "Industry Expert"}</strong></span>
                </div>

                <div className="meta-item">
                  <Clock size={16} />
                  <span>{course.duration || 0} Total Hours</span>
                </div>

                <div className="meta-item">
                  <Video size={16} />
                  <span>{lectures.length} Lessons</span>
                </div>

                <div className="meta-item" style={{ color: "var(--gold-primary)" }}>
                  <Star size={16} fill="currentColor" />
                  <span>
                    <strong>{reviewCount > 0 ? average : "New"}</strong> ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Curriculum / Syllabus Section */}
          <div className="curriculum-section">
            <div className="curriculum-header">
              <div>
                <h2>Course Curriculum</h2>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  {lectures.length} structured lessons to master this subject.
                </p>
              </div>

              {enrolled && progress && (
                <div style={{ width: "200px" }}>
                  <ProgressBar value={progress.percentage || 0} />
                </div>
              )}
            </div>

            {lectures.length === 0 ? (
              <p style={{ color: "var(--text-muted)", padding: "1rem 0" }}>
                Curriculum is currently being published by the instructor.
              </p>
            ) : (
              <div className="lectures-list">
                {lectures.map((lecture, idx) => {
                  const isCompleted = progress?.completedLectures?.some(
                    (lId) => (lId._id || lId).toString() === lecture._id.toString()
                  );

                  return (
                    <div
                      key={lecture._id}
                      className={`lecture-row ${enrolled ? "enrolled" : ""}`}
                      onClick={() => {
                        if (enrolled) navigate(`/lecture/${lecture._id}`);
                      }}
                    >
                      <div className="lecture-info-left">
                        <div className="lecture-index">{idx + 1}</div>
                        <div>
                          <div className="lecture-title-text">{lecture.title}</div>
                          {lecture.description && (
                            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>
                              {lecture.description.slice(0, 80)}...
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="lecture-status-right">
                        {isCompleted && (
                          <Badge variant="success" icon={CheckCircle2}>
                            Completed
                          </Badge>
                        )}
                        {enrolled ? (
                          <button className="btn-icon" style={{ width: "32px", height: "32px" }}>
                            <PlayCircle size={18} color="var(--gold-primary)" />
                          </button>
                        ) : (
                          <Lock size={16} color="var(--text-muted)" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Student Reviews Section */}
          <div className="reviews-section">
            <div className="reviews-header">
              <h2>Learner Reviews</h2>
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Verified Student Ratings
              </span>
            </div>

            <div className="rating-overview-box">
              <div className="rating-big-num">
                {reviewCount > 0 ? average : "5.0"}
              </div>
              <div>
                <div style={{ display: "flex", gap: "3px", color: "var(--gold-primary)", marginBottom: "4px" }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={18}
                      fill={star <= Math.round(average || 5) ? "currentColor" : "none"}
                    />
                  ))}
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  Based on {reviewCount} rating{reviewCount !== 1 ? "s" : ""}
                </div>
              </div>
            </div>

            {/* Leave a review if enrolled */}
            {enrolled && (
              <div className="leave-review-card">
                <h3 style={{ fontSize: "1.05rem", marginBottom: "0.5rem" }}>
                  Share Your Experience
                </h3>
                <form onSubmit={submitReview}>
                  <div className="star-rating-picker">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={24}
                        className={star <= myRating ? "active" : ""}
                        onClick={() => setMyRating(star)}
                      />
                    ))}
                  </div>

                  <div className="form-group">
                    <textarea
                      className="form-textarea"
                      rows={3}
                      placeholder="What did you think of the explanations and practical exercises?"
                      value={myReviewText}
                      onChange={(e) => setMyReviewText(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary btn-sm"
                    disabled={submittingReview}
                  >
                    {submittingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              </div>
            )}

            {/* List of Reviews */}
            <div className="reviews-list">
              {reviews.length === 0 ? (
                <p style={{ color: "var(--text-muted)" }}>
                  No reviews yet. Be the first enrolled student to share feedback!
                </p>
              ) : (
                reviews.map((r) => (
                  <div key={r._id} className="review-card-item">
                    <div className="review-author-row">
                      <strong style={{ color: "var(--text-primary)" }}>
                        {r.user?.name || "Student"}
                      </strong>
                      <div style={{ display: "flex", gap: "2px", color: "var(--gold-primary)" }}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={14}
                            fill={s <= r.rating ? "currentColor" : "none"}
                          />
                        ))}
                      </div>
                    </div>
                    {r.text && (
                      <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                        {r.text}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Sticky Enrollment Sidebar */}
        <aside className="course-detail-sidebar">
          <div className="sidebar-thumb-wrap">
            <img
              src={imageUrl}
              alt={course.title}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80";
              }}
            />
          </div>

          <div className="sidebar-body">
            <div className="sidebar-price-row">
              <span className="sidebar-price">
                {course.price > 0 ? `$${course.price}` : "Free"}
              </span>
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Full lifetime access
              </span>
            </div>

            {enrolled ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <button
                  className="btn-primary"
                  onClick={() => {
                    if (firstLectureId) {
                      navigate(`/lecture/${firstLectureId}`);
                    } else {
                      toast("No lectures published yet", { icon: "ℹ️" });
                    }
                  }}
                >
                  <PlayCircle size={18} />
                  <span>Resume Course</span>
                </button>
                {progress && <ProgressBar value={progress.percentage || 0} />}
              </div>
            ) : (
              <button
                className="btn-primary"
                onClick={enrollHandler}
                disabled={enrolling}
              >
                <span>{enrolling ? "Enrolling..." : "Enroll Now Free"}</span>
                <ArrowRight size={18} />
              </button>
            )}

            <ul className="included-list">
              <li className="included-item">
                <Video size={16} />
                <span>{course.duration || 0} hours on-demand video</span>
              </li>
              <li className="included-item">
                <FileText size={16} />
                <span>Private lecture notes editor</span>
              </li>
              <li className="included-item">
                <ShieldCheck size={16} />
                <span>Course Q&A and instructor discussion</span>
              </li>
              <li className="included-item">
                <Award size={16} />
                <span>Certificate of course completion</span>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default CourseDetail;
