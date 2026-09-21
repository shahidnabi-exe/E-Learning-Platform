import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  FileText,
  MessageSquare,
  Info,
  Download,
  Trash2,
  Send,
  Save,
  Menu,
  Check,
} from "lucide-react";
import { server } from "../../config/server.js";
import { UserData } from "../../Context/UserContext";
import ProgressBar from "../../Components/UI/ProgressBar";
import SkeletonLoader from "../../Components/UI/SkeletonLoader";
import EmptyState from "../../Components/UI/EmptyState";
import "./lecture.css";

function LecturePlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = UserData();

  const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
  const authHeader = useMemo(
    () => ({ headers: { Authorization: `Bearer ${token}` } }),
    [token]
  );

  const [lecture, setLecture] = useState(null);
  const [courseLectures, setCourseLectures] = useState([]);
  const [loading, setLoading] = useState(true);

  // Progress state
  const [progress, setProgress] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [togglingComplete, setTogglingComplete] = useState(false);

  // Tabs: 'overview' | 'notes' | 'comments' | 'resources'
  const [activeTab, setActiveTab] = useState("overview");

  // Notes state
  const [note, setNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  // Comments state
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [postingComment, setPostingComment] = useState(false);

  // Fetch current lecture
  const loadLecture = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${server}/api/lecture/${id}`, authHeader);
      setLecture(data.lecture);

      const courseId = data.lecture.course?._id || data.lecture.course;

      // Fetch all lectures for this course
      if (courseId) {
        try {
          const lecRes = await axios.get(`${server}/api/lectures/${courseId}`, authHeader);
          setCourseLectures(lecRes.data.lectures || []);
        } catch (err) {
          console.warn("Could not load course playlist:", err);
        }

        // Fetch course progress
        try {
          const progRes = await axios.get(`${server}/api/course/${courseId}/progress`, authHeader);
          setProgress(progRes.data);
          const completed = progRes.data?.completedLectures?.some(
            (cId) => (cId._id || cId).toString() === id.toString()
          );
          setIsCompleted(!!completed);
        } catch (err) {
          console.warn("Could not load course progress:", err);
        }
      }

      // Fetch Note for this lecture
      try {
        const noteRes = await axios.get(`${server}/api/lecture/${id}/note`, authHeader);
        setNote(noteRes.data.note?.content || "");
      } catch (err) {
        setNote("");
      }

      // Fetch Comments for this lecture
      try {
        const comRes = await axios.get(`${server}/api/lecture/${id}/comments`, authHeader);
        setComments(comRes.data.comments || []);
      } catch (err) {
        setComments([]);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load lecture");
    } finally {
      setLoading(false);
    }
  }, [id, authHeader]);

  useEffect(() => {
    loadLecture();
  }, [loadLecture]);

  // Find index in playlist
  const currentIndex = courseLectures.findIndex((l) => l._id.toString() === id.toString());
  const prevLecture = currentIndex > 0 ? courseLectures[currentIndex - 1] : null;
  const nextLecture = currentIndex < courseLectures.length - 1 ? courseLectures[currentIndex + 1] : null;

  // Toggle Lecture Completion
  const toggleComplete = async () => {
    setTogglingComplete(true);
    try {
      // Try new toggle route first, with fallback to complete
      let res;
      try {
        res = await axios.post(`${server}/api/lecture/${id}/toggle`, {}, authHeader);
        setIsCompleted(res.data.isCompleted);
        toast.success(res.data.message);
      } catch (e) {
        res = await axios.post(`${server}/api/lecture/${id}/complete`, {}, authHeader);
        setIsCompleted(true);
        toast.success("Lesson marked as complete!");
      }

      // Refresh progress
      const courseId = lecture.course?._id || lecture.course;
      const progRes = await axios.get(`${server}/api/course/${courseId}/progress`, authHeader);
      setProgress(progRes.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update progress");
    } finally {
      setTogglingComplete(false);
    }
  };

  // Save Note
  const saveNote = async () => {
    if (!note.trim()) {
      toast.error("Note content cannot be empty");
      return;
    }
    setSavingNote(true);
    try {
      await axios.post(`${server}/api/lecture/${id}/note`, { content: note }, authHeader);
      toast.success("Private note saved successfully!");
    } catch (error) {
      toast.error("Failed to save note");
    } finally {
      setSavingNote(false);
    }
  };

  // Post Comment
  const postComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setPostingComment(true);
    try {
      const { data } = await axios.post(
        `${server}/api/lecture/${id}/comment`,
        { text: commentText.trim() },
        authHeader
      );
      setComments((prev) => [data.comment, ...prev]);
      setCommentText("");
      toast.success("Comment posted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post comment");
    } finally {
      setPostingComment(false);
    }
  };

  // Delete Comment
  const deleteComment = async (commentId) => {
    try {
      await axios.delete(`${server}/api/comment/${commentId}`, authHeader);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      toast.success("Comment removed");
    } catch (error) {
      toast.error("Failed to delete comment");
    }
  };

  if (loading) {
    return (
      <div className="learning-studio">
        <div style={{ padding: "3rem", maxWidth: "900px", margin: "0 auto" }}>
          <SkeletonLoader count={3} height="180px" />
        </div>
      </div>
    );
  }

  if (!lecture) {
    return (
      <div className="learning-studio">
        <div style={{ padding: "4rem 1.5rem", maxWidth: "600px", margin: "0 auto" }}>
          <EmptyState
            title="Lecture Not Found"
            description="The requested lesson does not exist or you do not have permission to view it."
            actionLabel="Return to Catalog"
            onAction={() => navigate("/courses")}
          />
        </div>
      </div>
    );
  }

  const courseId = lecture.course?._id || lecture.course;
  const courseTitle = lecture.course?.title || "Course Details";
  const videoUrl = `${server}/${lecture.video.replace(/\\/g, "/")}`;

  return (
    <div className="learning-studio">
      {/* 1. Studio Sticky Topbar */}
      <header className="studio-topbar">
        <div className="studio-topbar-left">
          <Link
            to={`/course/${courseId}`}
            className="btn-secondary btn-sm"
            style={{ gap: "6px" }}
          >
            <ArrowLeft size={16} />
            <span>Course Overview</span>
          </Link>
          <div className="studio-course-title">
            <span style={{ color: "var(--text-muted)" }}>/</span>
            <span>{courseTitle}</span>
          </div>
        </div>

        <div className="studio-topbar-right">
          {progress && (
            <div className="studio-progress-pill">
              <span>Course Progress:</span>
              <strong>{progress.percentage || 0}%</strong>
            </div>
          )}
        </div>
      </header>

      {/* 2. Studio Body */}
      <div className="studio-body">
        {/* Main Workspace (Video + Navigation + Lower Tabs) */}
        <main className="studio-main-pane animate-fade-in">
          {/* HTML5 Video Box */}
          <div className="video-theater-wrap">
            <video
              src={videoUrl}
              controls
              className="video-element"
              controlsList="nodownload"
            />
          </div>

          {/* Action Bar (Prev / Complete / Next) */}
          <div className="studio-action-bar">
            <div>
              <h2 style={{ fontSize: "1.35rem", marginBottom: "4px" }}>
                {lecture.title}
              </h2>
              <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                Lesson {currentIndex + 1} of {courseLectures.length}
              </span>
            </div>

            <div className="studio-nav-buttons">
              <button
                className="btn-secondary btn-sm"
                onClick={() => prevLecture && navigate(`/lecture/${prevLecture._id}`)}
                disabled={!prevLecture}
                title={prevLecture ? prevLecture.title : "First lesson"}
              >
                <ChevronLeft size={16} />
                <span>Previous</span>
              </button>

              <button
                className={`btn-complete-toggle ${isCompleted ? "completed" : "incomplete"}`}
                onClick={toggleComplete}
                disabled={togglingComplete}
              >
                {isCompleted ? (
                  <>
                    <CheckCircle2 size={16} />
                    <span>Completed</span>
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    <span>{togglingComplete ? "Saving..." : "Mark as Done"}</span>
                  </>
                )}
              </button>

              <button
                className="btn-secondary btn-sm"
                onClick={() => nextLecture && navigate(`/lecture/${nextLecture._id}`)}
                disabled={!nextLecture}
                title={nextLecture ? nextLecture.title : "Last lesson"}
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Tabbed Workspace */}
          <div className="studio-tabs-bar">
            <button
              className={`studio-tab-btn ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              className={`studio-tab-btn ${activeTab === "notes" ? "active" : ""}`}
              onClick={() => setActiveTab("notes")}
            >
              My Notes
            </button>
            <button
              className={`studio-tab-btn ${activeTab === "comments" ? "active" : ""}`}
              onClick={() => setActiveTab("comments")}
            >
              Discussion ({comments.length})
            </button>
          </div>

          {/* Tab Content */}
          <div className="studio-tab-content">
            {activeTab === "overview" && (
              <div>
                <h3 style={{ fontSize: "1.1rem", marginBottom: "0.75rem" }}>
                  About this Lesson
                </h3>
                <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
                  {lecture.description || "No specific lesson notes provided."}
                </p>
              </div>
            )}

            {activeTab === "notes" && (
              <div className="notes-container">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ fontSize: "1.05rem" }}>Private Lesson Notes</h3>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    Only visible to you
                  </span>
                </div>

                <textarea
                  className="notes-editor"
                  rows={6}
                  placeholder="Record key takeaways, syntax snippets, or questions for this lecture..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button
                    className="btn-primary btn-sm"
                    onClick={saveNote}
                    disabled={savingNote}
                  >
                    <Save size={15} />
                    <span>{savingNote ? "Saving..." : "Save Note"}</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === "comments" && (
              <div>
                <form onSubmit={postComment} className="comment-composer">
                  <input
                    className="form-input"
                    placeholder="Ask a question or share feedback on this lesson..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="btn-primary btn-sm"
                    disabled={postingComment}
                  >
                    <Send size={15} />
                    <span>Post</span>
                  </button>
                </form>

                <div className="comments-timeline">
                  {comments.length === 0 ? (
                    <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "1.5rem" }}>
                      No discussions yet. Ask the first question!
                    </p>
                  ) : (
                    comments.map((c) => {
                      const isOwner = c.user?._id?.toString() === user?._id?.toString();
                      const isAdmin = user?.role === "admin";

                      return (
                        <div key={c._id} className="comment-bubble">
                          <div className="comment-bubble-header">
                            <strong style={{ color: "var(--text-primary)", fontSize: "0.9rem" }}>
                              {c.user?.name || "Student"}
                            </strong>

                            {(isOwner || isAdmin) && (
                              <button
                                onClick={() => deleteComment(c._id)}
                                className="btn-icon"
                                style={{ width: "24px", height: "24px", color: "var(--status-danger)" }}
                                title="Delete comment"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                          <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", marginTop: "2px" }}>
                            {c.text}
                          </p>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Right Syllabus / Playlist Sidebar */}
        <aside className="studio-sidebar">
          <div className="studio-sidebar-head">
            <h3 style={{ fontSize: "1.1rem" }}>Course Syllabus</h3>
            {progress && (
              <ProgressBar
                value={progress.percentage || 0}
                showLabel={true}
                height={6}
              />
            )}
          </div>

          <div className="studio-playlist">
            {courseLectures.map((item, idx) => {
              const isActive = item._id.toString() === id.toString();
              const isItemDone = progress?.completedLectures?.some(
                (cId) => (cId._id || cId).toString() === item._id.toString()
              );

              return (
                <div
                  key={item._id}
                  className={`playlist-item ${isActive ? "active" : ""}`}
                  onClick={() => navigate(`/lecture/${item._id}`)}
                >
                  <div className="playlist-item-index">
                    {isItemDone ? (
                      <Check size={14} color="var(--status-success)" />
                    ) : (
                      idx + 1
                    )}
                  </div>

                  <div className="playlist-item-title" title={item.title}>
                    {item.title}
                  </div>

                  {isActive && <PlayCircle size={16} color="var(--gold-primary)" />}
                </div>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default LecturePlayer;
