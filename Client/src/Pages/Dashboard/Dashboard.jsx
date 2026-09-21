import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Compass,
  GraduationCap,
  PlayCircle,
  TrendingUp,
  Award,
} from "lucide-react";
import { server } from "../../config/server.js";
import { CourseData } from "../../Context/CourseContext";
import { UserData } from "../../Context/UserContext";
import DashboardLayout from "../../Components/Layout/DashboardLayout";
import StatCard from "../../Components/UI/StatCard";
import ProgressBar from "../../Components/UI/ProgressBar";
import Badge from "../../Components/UI/Badge";
import EmptyState from "../../Components/UI/EmptyState";
import SkeletonLoader from "../../Components/UI/SkeletonLoader";
import CourseCard from "../../Components/CourseCard/CourseCard";
import "./dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const { user } = UserData();
  const { myCourse, courses, fetchMyCourse, loading: coursesLoading } = CourseData();

  const [progressMap, setProgressMap] = useState({});
  const [loadingProgress, setLoadingProgress] = useState(true);

  const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
  const authHeader = useMemo(
    () => ({ headers: { Authorization: `Bearer ${token}` } }),
    [token]
  );

  useEffect(() => {
    fetchMyCourse();
  }, [fetchMyCourse]);

  // Fetch progress for enrolled courses
  useEffect(() => {
    const loadAllProgress = async () => {
      if (!myCourse || myCourse.length === 0) {
        setLoadingProgress(false);
        return;
      }

      try {
        // Attempt batch endpoint first
        try {
          const { data } = await axios.get(`${server}/api/progress/all`, authHeader);
          const map = {};
          data.progressData?.forEach((p) => {
            map[p.courseId.toString()] = p;
          });
          setProgressMap(map);
          setLoadingProgress(false);
          return;
        } catch (batchErr) {
          console.warn("Batch progress unavailable, falling back to parallel fetch");
        }

        // Fallback: parallel per-course fetch
        const map = {};
        await Promise.all(
          myCourse.map(async (course) => {
            try {
              const { data } = await axios.get(
                `${server}/api/course/${course._id}/progress`,
                authHeader
              );
              map[course._id] = data;
            } catch (err) {
              map[course._id] = { percentage: 0, completedLectures: [], totalLectures: 0 };
            }
          })
        );
        setProgressMap(map);
      } catch (err) {
        console.error("Progress fetch error:", err);
      } finally {
        setLoadingProgress(false);
      }
    };

    loadAllProgress();
  }, [myCourse, authHeader]);

  // Derived stats
  const enrolledCount = myCourse?.length || 0;

  const totalCompletedLessons = useMemo(() => {
    return Object.values(progressMap).reduce((sum, p) => {
      return sum + (p.completedLectures ? p.completedLectures.length : 0);
    }, 0);
  }, [progressMap]);

  const avgCompletionPercentage = useMemo(() => {
    if (enrolledCount === 0) return 0;
    const total = Object.values(progressMap).reduce(
      (sum, p) => sum + (p.percentage || 0),
      0
    );
    return Math.round(total / enrolledCount);
  }, [progressMap, enrolledCount]);

  const continueCourse = myCourse && myCourse.length > 0 ? myCourse[0] : null;
  const continueProgress = continueCourse ? progressMap[continueCourse._id] : null;

  // Unenrolled recommended courses
  const recommendedCourses = useMemo(() => {
    if (!courses) return [];
    const myIds = new Set((myCourse || []).map((c) => c._id.toString()));
    return courses.filter((c) => !myIds.has(c._id.toString())).slice(0, 3);
  }, [courses, myCourse]);

  return (
    <DashboardLayout title="Student Learning Console">
      <div className="student-dashboard-page animate-fade-in">
        {/* 1. Greeting Banner */}
        <div className="student-greeting-banner">
          <div className="greeting-text">
            <h1>Welcome back, {user?.name || "Student"}! 👋</h1>
            <p>
              Track your course progression, resume lessons, and acquire in-demand software skills.
            </p>
          </div>

          <button
            className="btn-primary"
            onClick={() => navigate("/courses")}
            style={{ flexShrink: 0 }}
          >
            <Compass size={18} />
            <span>Discover Courses</span>
          </button>
        </div>

        {/* 2. Key Metrics Grid */}
        <div className="student-metrics-grid">
          <StatCard
            title="Enrolled Courses"
            value={enrolledCount}
            icon={BookOpen}
            subtitle="Active pathways"
            color="gold"
          />
          <StatCard
            title="Lessons Completed"
            value={totalCompletedLessons}
            icon={CheckCircle2}
            subtitle="Verified units"
            color="white"
          />
          <StatCard
            title="Avg. Progress"
            value={`${avgCompletionPercentage}%`}
            icon={TrendingUp}
            subtitle="Across enrolled tracks"
            color="gold"
          />
          <StatCard
            title="Certificates"
            value={avgCompletionPercentage === 100 ? "1" : "0"}
            icon={Award}
            subtitle="Earned on Code Campus"
            color="white"
          />
        </div>

        {/* 3. Continue Learning Hero Card */}
        {continueCourse && (
          <div>
            <div className="dashboard-section-header">
              <h2>Resume Learning</h2>
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Pick up where you left off
              </span>
            </div>

            <div className="continue-hero-card">
              <div className="continue-hero-thumb">
                <img
                  src={
                    continueCourse.image
                      ? `${server}/${continueCourse.image.replace(/\\/g, "/")}`
                      : "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80"
                  }
                  alt={continueCourse.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80";
                  }}
                />
              </div>

              <div className="continue-hero-info">
                <div style={{ display: "flex", gap: "8px" }}>
                  <Badge variant="gold">{continueCourse.category || "Course"}</Badge>
                  <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                    {continueCourse.duration || 0} Total Hours
                  </span>
                </div>

                <h3>{continueCourse.title}</h3>

                <ProgressBar
                  value={continueProgress?.percentage || 0}
                  showLabel={true}
                />
              </div>

              <div>
                <button
                  className="btn-primary"
                  onClick={() => navigate(`/course/${continueCourse._id}`)}
                  style={{ gap: "8px" }}
                >
                  <PlayCircle size={18} />
                  <span>Resume Course</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 4. Enrolled Courses Grid */}
        <div>
          <div className="dashboard-section-header">
            <h2>My Enrolled Courses ({enrolledCount})</h2>
          </div>

          {coursesLoading ? (
            <SkeletonLoader count={3} height="200px" />
          ) : enrolledCount === 0 ? (
            <EmptyState
              icon={GraduationCap}
              title="You haven't enrolled in any courses yet"
              description="Explore our curriculum to start learning real-world engineering skills for free."
              actionLabel="Browse Course Catalog"
              onAction={() => navigate("/courses")}
            />
          ) : (
            <div className="enrolled-courses-grid">
              {myCourse.map((course) => {
                const prog = progressMap[course._id];
                const pct = prog?.percentage || 0;
                const imageUrl = course.image
                  ? `${server}/${course.image.replace(/\\/g, "/")}`
                  : "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80";

                return (
                  <div
                    key={course._id}
                    className="enrolled-course-card"
                    onClick={() => navigate(`/course/${course._id}`)}
                  >
                    <div className="enrolled-card-thumb">
                      <img
                        src={imageUrl}
                        alt={course.title}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80";
                        }}
                      />
                    </div>

                    <div className="enrolled-card-body">
                      <div>
                        <Badge variant="gold">{course.category || "General"}</Badge>
                        <h3 style={{ marginTop: "6px" }}>{course.title}</h3>
                      </div>

                      <div style={{ marginTop: "auto" }}>
                        <ProgressBar value={pct} showLabel={true} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 5. Recommended Next Courses */}
        {recommendedCourses.length > 0 && (
          <div style={{ marginTop: "1rem" }}>
            <div className="dashboard-section-header">
              <h2>Recommended Next Tracks</h2>
              <button
                className="btn-secondary btn-sm"
                onClick={() => navigate("/courses")}
              >
                View Full Catalog
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "2rem" }}>
              {recommendedCourses.map((c) => (
                <CourseCard key={c._id} course={c} />
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
