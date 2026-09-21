import React from "react";
import { useNavigate } from "react-router-dom";
import { Clock, BookOpen, Star, CheckCircle } from "lucide-react";
import { server } from "../../config/server.js";
import { UserData } from "../../Context/UserContext";
import Badge from "../UI/Badge";
import "./CourseCard.css";

function CourseCard({ course }) {
  const navigate = useNavigate();
  const { user } = UserData();

  if (!course) return null;

  const isEnrolled = user?.subscription?.some(
    (sub) => (sub._id || sub).toString() === course._id.toString()
  );

  const imageUrl = course.image
    ? `${server}/${course.image.replace(/\\/g, "/")}`
    : "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80";

  return (
    <div className="course-card">
      <div className="course-card-thumb-wrap">
        <img
          src={imageUrl}
          alt={course.title}
          className="course-card-img"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80";
          }}
        />

        <div className="course-card-badge-overlay">
          {course.category && (
            <Badge variant="gold">{course.category}</Badge>
          )}
          {isEnrolled && (
            <Badge variant="success" icon={CheckCircle} style={{ marginLeft: "6px" }}>
              Enrolled
            </Badge>
          )}
        </div>

        <div className="course-card-price-overlay">
          {course.price > 0 ? `$${course.price}` : "Free"}
        </div>
      </div>

      <div className="course-card-body">
        <h3 className="course-card-title" title={course.title}>
          {course.title}
        </h3>

        <div className="course-card-instructor">
          <div className="instructor-avatar-micro">
            {course.instructor ? course.instructor.charAt(0).toUpperCase() : "I"}
          </div>
          <span>{course.instructor || "Lead Instructor"}</span>
        </div>

        <div className="course-card-meta">
          <div className="course-card-meta-item">
            <Clock size={14} />
            <span>{course.duration || 0} hrs</span>
          </div>

          <div className="course-card-meta-item">
            <BookOpen size={14} />
            <span>Self-Paced</span>
          </div>

          <div className="course-card-meta-item" style={{ color: "var(--gold-primary)" }}>
            <Star size={13} fill="currentColor" />
            <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>4.9</span>
          </div>
        </div>

        <div className="course-card-action">
          {isEnrolled ? (
            <button
              className="btn-primary btn-sm"
              onClick={() => navigate(`/course/${course._id}`)}
            >
              Resume Learning
            </button>
          ) : (
            <button
              className="btn-secondary btn-sm"
              onClick={() => navigate(`/course/${course._id}`)}
            >
              View Course Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseCard;
