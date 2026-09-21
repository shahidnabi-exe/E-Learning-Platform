import React from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Code2,
  Cpu,
  Shield,
  Cloud,
  Database,
  Smartphone,
  CheckCircle2,
  PlayCircle,
  Award,
  Users,
  Layers,
  GraduationCap,
} from "lucide-react";
import { CourseData } from "../../Context/CourseContext";
import { UserData } from "../../Context/UserContext";
import CourseCard from "../../Components/CourseCard/CourseCard";
import Testimonials from "../../Components/Testimonials/Testimonials";
import "./home.css";

function Home() {
  const navigate = useNavigate();
  const { courses, loading } = CourseData();
  const { isAuth, isStudent, isInstructor, isAdmin } = UserData();

  const categories = [
    { name: "Artificial Intelligence", count: "12+ Courses", icon: Cpu, query: "AI" },
    { name: "Full Stack Development", count: "24+ Courses", icon: Code2, query: "Web" },
    { name: "Cloud & DevOps", count: "15+ Courses", icon: Cloud, query: "Cloud" },
    { name: "Data Science & Analytics", count: "18+ Courses", icon: Database, query: "Data" },
    { name: "Cybersecurity", count: "10+ Courses", icon: Shield, query: "Security" },
    { name: "Mobile Engineering", count: "8+ Courses", icon: Smartphone, query: "Mobile" },
  ];

  const features = [
    {
      icon: PlayCircle,
      title: "Production-Grade Video Lectures",
      desc: "Learn from comprehensive, step-by-step modular video lessons recorded by practicing engineers.",
    },
    {
      icon: Award,
      title: "Real Progress Tracking",
      desc: "Stay accountable with automated lecture completion markers, private notes, and course progress bars.",
    },
    {
      icon: Users,
      title: "Direct Discussion & Q&A",
      desc: "Interact with classmates and course instructors right below each lesson for rapid feedback.",
    },
  ];

  const featuredCourses = courses.slice(0, 3);

  return (
    <div className="landing-page">
      {/* 1. Hero Section */}
      <section className="hero-section">
        <div className="hero-glow-sphere" />

        <div className="hero-content">
          <div className="hero-pill-badge">
            <Sparkles size={14} />
            <span>Next-Generation Developer Learning Platform</span>
          </div>

          <h1 className="hero-title">
            Master Tomorrow's Tech Skills with <span>Production-Ready</span> Courses.
          </h1>

          <p className="hero-subtitle">
            Accelerate your engineering journey with structured curricula, hands-on modules, and instructor-led real-world projects designed for real-world impact.
          </p>

          <div className="hero-cta-group">
            <button
              onClick={() => navigate("/courses")}
              className="btn-primary"
              style={{ padding: "12px 28px", fontSize: "1rem" }}
            >
              <span>Explore All Courses</span>
              <ArrowRight size={18} />
            </button>

            {isAuth ? (
              <button
                onClick={() =>
                  navigate(
                    isAdmin
                      ? "/admin/dashboard"
                      : isInstructor
                      ? "/instructor/dashboard"
                      : "/dashboard"
                  )
                }
                className="btn-secondary"
                style={{ padding: "12px 28px", fontSize: "1rem" }}
              >
                Go to Dashboard
              </button>
            ) : (
              <button
                onClick={() => navigate("/register")}
                className="btn-secondary"
                style={{ padding: "12px 28px", fontSize: "1rem" }}
              >
                Create Free Account
              </button>
            )}
          </div>
        </div>

        {/* Hero Interactive Preview Frame */}
        <div className="hero-preview-wrap">
          <div className="hero-preview-frame">
            <div className="preview-topbar">
              <div className="window-dots">
                <div className="window-dot" />
                <div className="window-dot" />
                <div className="window-dot" />
              </div>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginLeft: "1rem" }}>
                codecampus.edu/learning-studio
              </span>
            </div>

            <div className="preview-mock-grid">
              <div className="preview-mock-sidebar">
                <div className="preview-mock-item active" />
                <div className="preview-mock-item" />
                <div className="preview-mock-item" />
                <div className="preview-mock-item" />
              </div>

              <div className="preview-mock-main">
                <div className="preview-hero-banner">
                  <div>
                    <span style={{ color: "var(--gold-primary)", fontSize: "0.8rem", fontWeight: 700 }}>
                      IN PROGRESS
                    </span>
                    <h3 style={{ fontSize: "1.4rem", marginTop: "4px" }}>
                      Advanced AI & Deep Learning Architecture
                    </h3>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                      Lesson 4: Building Custom RAG Pipelines with Vector Databases
                    </p>
                  </div>
                  <button
                    className="btn-primary btn-sm"
                    onClick={() => navigate("/courses")}
                  >
                    Resume Lesson
                  </button>
                </div>

                <div className="preview-stats-row">
                  <div className="preview-stat-box">
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Course Progress</span>
                    <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--gold-primary)", marginTop: "4px" }}>
                      68% Complete
                    </div>
                  </div>
                  <div className="preview-stat-box">
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Completed Lessons</span>
                    <div style={{ fontSize: "1.3rem", fontWeight: 700, marginTop: "4px" }}>
                      14 / 20
                    </div>
                  </div>
                  <div className="preview-stat-box">
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Private Notes</span>
                    <div style={{ fontSize: "1.3rem", fontWeight: 700, marginTop: "4px" }}>
                      8 Saved
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Platform Statistics */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <h3>{courses.length > 0 ? `${courses.length}+` : "15+"}</h3>
            <p>Production Courses</p>
          </div>
          <div className="stat-item">
            <h3>1,200+</h3>
            <p>Active Learners</p>
          </div>
          <div className="stat-item">
            <h3>98%</h3>
            <p>Satisfaction Rating</p>
          </div>
          <div className="stat-item">
            <h3>100%</h3>
            <p>Hands-On Code</p>
          </div>
        </div>
      </section>

      {/* 3. Featured Courses */}
      <section className="section-wrap">
        <div className="section-head">
          <div>
            <span className="section-tag">Curated Curriculum</span>
            <h2>Featured Learning Tracks</h2>
            <p>Hand-crafted courses with real-world case studies and guided walkthroughs.</p>
          </div>
          <button onClick={() => navigate("/courses")} className="btn-secondary btn-sm">
            View All Catalog ({courses.length})
          </button>
        </div>

        {loading ? (
          <p style={{ color: "var(--text-secondary)" }}>Loading top courses...</p>
        ) : featuredCourses.length > 0 ? (
          <div className="courses-grid">
            {featuredCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        ) : (
          <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
            <p>Courses are being curated. Check back shortly!</p>
          </div>
        )}
      </section>

      {/* 4. Categories */}
      <section className="section-wrap" style={{ paddingTop: 0 }}>
        <div className="section-head">
          <div>
            <span className="section-tag">Explore by Domain</span>
            <h2>Top Learning Categories</h2>
            <p>Choose your pathway and master in-demand industry disciplines.</p>
          </div>
        </div>

        <div className="categories-grid">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                className="category-card"
                onClick={() => navigate(`/courses?category=${encodeURIComponent(cat.name)}`)}
              >
                <div className="category-icon-wrap">
                  <Icon size={24} />
                </div>
                <div>
                  <h3>{cat.name}</h3>
                  <p>{cat.count}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Platform Key Features */}
      <section className="section-wrap" style={{ paddingTop: 0 }}>
        <div className="section-head">
          <div>
            <span className="section-tag">Built For Learners</span>
            <h2>Why Choose Code Campus?</h2>
            <p>A learning environment optimized for retention, speed, and real-world mastery.</p>
          </div>
        </div>

        <div className="features-grid">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div key={idx} className="feature-box">
                <div className="feature-icon-circle">
                  <Icon size={24} />
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Dual Experience Showcase (Students & Instructors) */}
      <section className="section-wrap" style={{ paddingTop: 0 }}>
        <div className="roles-grid">
          <div className="role-card">
            <div>
              <span className="section-tag">For Learners</span>
              <h3>Streamlined Student Experience</h3>
              <p>Learn at your pace with clean video playback, timestamped private notes, and automatic resume points.</p>

              <ul className="role-feature-list">
                <li className="role-feature-item">
                  <CheckCircle2 size={18} />
                  <span>Interactive lesson studio with syllabus overview</span>
                </li>
                <li className="role-feature-item">
                  <CheckCircle2 size={18} />
                  <span>Lecture-specific private notes that save automatically</span>
                </li>
                <li className="role-feature-item">
                  <CheckCircle2 size={18} />
                  <span>Real-time completion tracking with certificates</span>
                </li>
              </ul>
            </div>

            <button onClick={() => navigate("/courses")} className="btn-primary">
              Start Learning Now
            </button>
          </div>

          <div className="role-card">
            <div>
              <span className="section-tag">For Educators</span>
              <h3>Powerful Instructor Hub</h3>
              <p>Create rich courses, upload video lectures, track enrollment counts, and inspect student engagement.</p>

              <ul className="role-feature-list">
                <li className="role-feature-item">
                  <CheckCircle2 size={18} />
                  <span>Intuitive course authoring and admin review pipeline</span>
                </li>
                <li className="role-feature-item">
                  <CheckCircle2 size={18} />
                  <span>Instant video uploading with modular lesson organization</span>
                </li>
                <li className="role-feature-item">
                  <CheckCircle2 size={18} />
                  <span>Course analytics, ratings, and student reviews</span>
                </li>
              </ul>
            </div>

            <button onClick={() => navigate("/register")} className="btn-secondary">
              Become an Instructor
            </button>
          </div>
        </div>
      </section>

      {/* 7. Testimonials */}
      <Testimonials />

      {/* 8. Call to Action Banner */}
      <section className="cta-section">
        <div className="cta-banner">
          <h2>Ready to Level Up Your Tech Career?</h2>
          <p>
            Join thousands of engineers learning cutting-edge technologies with Code Campus.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("/courses")}
              className="btn-primary"
              style={{ padding: "14px 32px", fontSize: "1rem" }}
            >
              Browse Course Catalog
            </button>
            <button
              onClick={() => navigate("/register")}
              className="btn-secondary"
              style={{ padding: "14px 32px", fontSize: "1rem" }}
            >
              Sign Up Free
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;