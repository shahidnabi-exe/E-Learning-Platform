import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { server } from "../../config/server.js";
import "./lecture.css";

function LecturePlayer() {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const [lecture, setLecture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [marking, setMarking] = useState(false);

  const [note, setNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [postingComment, setPostingComment] = useState(false);

  const fetchLecture = async () => {
    try {
      const { data } = await axios.get(`${server}/api/lecture/${id}`, authHeader);
      setLecture(data.lecture);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load lecture");
    }
  };

  const fetchNote = async () => {
    try {
      const { data } = await axios.get(`${server}/api/lecture/${id}/note`, authHeader);
      setNote(data.note?.content || "");
    } catch (error) {
      // no note yet — fine
    }
  };

  const fetchComments = async () => {
    try {
      const { data } = await axios.get(`${server}/api/lecture/${id}/comments`, authHeader);
      setComments(data.comments);
    } catch (error) {
      toast.error("Failed to load comments");
    }
  };

  useEffect(() => {
    const load = async () => {
      await Promise.all([fetchLecture(), fetchNote(), fetchComments()]);
      setLoading(false);
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const saveNote = async () => {
    setSavingNote(true);
    try {
      await axios.post(`${server}/api/lecture/${id}/note`, { content: note }, authHeader);
      toast.success("Note saved");
    } catch (error) {
      toast.error("Failed to save note");
    } finally {
      setSavingNote(false);
    }
  };

  const postComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setPostingComment(true);
    try {
      const { data } = await axios.post(
        `${server}/api/lecture/${id}/comment`,
        { text: commentText },
        authHeader
      );
      setComments((prev) => [data.comment, ...prev]);
      setCommentText("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post comment");
    } finally {
      setPostingComment(false);
    }
  };

  const markComplete = async () => {
    setMarking(true);
    try {
      await axios.post(`${server}/api/lecture/${id}/complete`, {}, authHeader);
      setCompleted(true);
      toast.success("Marked as complete");
    } catch (error) {
      toast.error("Failed to mark complete");
    } finally {
      setMarking(false);
    }
  };

  if (loading) return <div className="lecture-page"><p>Loading...</p></div>;
  if (!lecture) return <div className="lecture-page"><p>Lecture not found.</p></div>;

  const videoUrl = `${server}/${lecture.video.replace(/\\/g, "/")}`;

  return (
    <div className="lecture-page">
      <h2>{lecture.title}</h2>
      <p>{lecture.description}</p>

      <video src={videoUrl} controls className="lecture-video" />

      <button className="common-btn" onClick={markComplete} disabled={marking || completed}>
        {completed ? "✓ Completed" : marking ? "Saving..." : "Mark as Complete"}
      </button>

      <div className="notes-section">
        <h3>My Notes</h3>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Write private notes for yourself on this lecture..."
          rows={5}
        />
        <button className="common-btn" onClick={saveNote} disabled={savingNote}>
          {savingNote ? "Saving..." : "Save Note"}
        </button>
      </div>

      <div className="comments-section">
        <h3>Comments</h3>
        <form onSubmit={postComment} className="comment-form">
          <input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
          />
          <button className="common-btn" type="submit" disabled={postingComment}>
            {postingComment ? "Posting..." : "Post"}
          </button>
        </form>

        <div className="comment-list">
          {comments.length === 0 && <p>No comments yet. Be the first!</p>}
          {comments.map((c) => (
            <div key={c._id} className="comment-item">
              <strong>{c.user?.name || "User"}</strong>
              <p>{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LecturePlayer;
