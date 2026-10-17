/**
 * Community.jsx
 * Farmer Community Q&A – post questions, browse answers,
 * like posts, expand inline, and post replies.
 */
import { useState, useMemo } from "react";
import {
  MessageCircle, Heart, Eye, Search, Plus, X,
  Star, Send, Tag, ChevronDown, ChevronUp, Users,
} from "lucide-react";
import { communityPosts } from "../data/mockData";
import { useLang } from "../context/LangContext";
import { useAuth } from "../context/AuthContext";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function Avatar({ initials, size = 40, color }) {
  const colors = [
    "#16a34a", "#2563eb", "#d97706", "#9333ea",
    "#dc2626", "#0891b2", "#ca8a04", "#4f46e5",
  ];
  const bg = color || colors[(initials.charCodeAt(0) || 0) % colors.length];
  return (
    <div style={{
      width: size, height: size, minWidth: size, borderRadius: "50%",
      background: bg, color: "#fff",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 700, fontSize: size * 0.36,
      userSelect: "none",
    }}>
      {initials}
    </div>
  );
}

function formatDate(dateStr) {
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });
  } catch { return dateStr; }
}

// ─── Answer Item ──────────────────────────────────────────────────────────────
function AnswerItem({ answer, onLike }) {
  const initials = answer.author.slice(0, 2).toUpperCase();
  return (
    <div style={{
      background: answer.isExpert ? "#f0fdf4" : "var(--gray-50)",
      border: answer.isExpert ? "1px solid #bbf7d0" : "1px solid var(--gray-200)",
      borderRadius: 10,
      padding: "14px 16px",
      marginBottom: 10,
    }}>
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        <Avatar initials={initials} size={34} color={answer.isExpert ? "#16a34a" : undefined} />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 4 }}>
            <span style={{ fontWeight: 600, fontSize: 13 }}>{answer.author}</span>
            {answer.isExpert && (
              <span className="badge badge-green" style={{ display: "flex", alignItems: "center", gap: 3 }}>
                <Star size={10} fill="currentColor" /> Expert
              </span>
            )}
            <span style={{ fontSize: 11, color: "var(--gray-400)" }}>{formatDate(answer.date)}</span>
          </div>
          <p style={{ margin: 0, fontSize: 13.5, color: "var(--gray-700)", lineHeight: 1.65 }}>
            {answer.body}
          </p>
          <button
            onClick={onLike}
            style={{
              marginTop: 8, background: "none", border: "none",
              cursor: "pointer", color: "var(--gray-500)", fontSize: 12,
              display: "flex", alignItems: "center", gap: 4, padding: 0,
            }}
          >
            <Heart size={13} /> {answer.likes}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Post Card ────────────────────────────────────────────────────────────────
function PostCard({ post, onLike, onAnswerLike, onAddAnswer, lang }) {
  const [expanded, setExpanded] = useState(false);
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [answerText, setAnswerText] = useState("");

  const { user } = useAuth();

  const handleSubmitAnswer = () => {
    if (!answerText.trim()) return;
    onAddAnswer(post.id, {
      id: Date.now(),
      body: answerText.trim(),
      author: user?.name || "Anonymous Farmer",
      date: new Date().toISOString().split("T")[0],
      likes: 0,
      isExpert: user?.role === "admin",
    });
    setAnswerText("");
    setShowAnswerForm(false);
  };

  const authorInitials = post.authorAvatar || post.author.slice(0, 2).toUpperCase();

  return (
    <div className="card" style={{ overflow: "hidden" }}>
      {/* Header */}
      <div className="card-body" style={{ paddingBottom: expanded ? 8 : 16 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <Avatar initials={authorInitials} size={42} />
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Title */}
            <h3
              onClick={() => setExpanded((p) => !p)}
              style={{
                margin: "0 0 6px", fontSize: 15, fontWeight: 700,
                color: "var(--green-800)", cursor: "pointer",
                lineHeight: 1.4,
              }}
            >
              {lang === "hi" ? post.titleHi : post.title}
            </h3>
            {/* Meta */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, fontSize: 12, color: "var(--gray-500)", marginBottom: 8 }}>
              <span>👤 {post.author}</span>
              <span>📍 {post.village}</span>
              <span>📅 {formatDate(post.date)}</span>
            </div>
            {/* Body preview */}
            {!expanded && (
              <p style={{ margin: "0 0 10px", fontSize: 13, color: "var(--gray-600)", lineHeight: 1.6 }}>
                {(lang === "hi" ? post.bodyHi : post.body).slice(0, 140)}
                {(lang === "hi" ? post.bodyHi : post.body).length > 140 ? "…" : ""}
              </p>
            )}
            {/* Tags */}
            {post.tags?.length > 0 && (
              <div className="chips" style={{ marginBottom: 10 }}>
                {post.tags.map((tag) => (
                  <span key={tag} className="chip" style={{ fontSize: 11 }}>
                    <Tag size={9} style={{ verticalAlign: "middle" }} /> {tag}
                  </span>
                ))}
              </div>
            )}
            {/* Stats row */}
            <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
              <button
                onClick={() => onLike(post.id)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 5,
                  color: "var(--gray-500)", fontSize: 13, padding: 0,
                }}
              >
                <Heart size={14} /> {post.likes}
              </button>
              <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "var(--gray-500)" }}>
                <Eye size={14} /> {post.views}
              </span>
              <button
                onClick={() => setExpanded((p) => !p)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 5,
                  color: "var(--primary)", fontSize: 13, fontWeight: 500, padding: 0,
                }}
              >
                <MessageCircle size={14} /> {post.answers.length} {lang === "hi" ? "उत्तर" : "Answers"}
                {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded view */}
      {expanded && (
        <div style={{ borderTop: "1px solid var(--gray-100)", padding: "16px 20px" }}>
          {/* Full body */}
          <p style={{ fontSize: 14, color: "var(--gray-700)", lineHeight: 1.7, marginBottom: 20 }}>
            {lang === "hi" ? post.bodyHi : post.body}
          </p>

          {/* Answers */}
          {post.answers.length > 0 ? (
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--gray-700)", marginBottom: 10 }}>
                💬 {lang === "hi" ? "उत्तर" : "Answers"} ({post.answers.length})
              </h4>
              {post.answers.map((ans) => (
                <AnswerItem
                  key={ans.id}
                  answer={ans}
                  onLike={() => onAnswerLike(post.id, ans.id)}
                />
              ))}
            </div>
          ) : (
            <p style={{ fontSize: 13, color: "var(--gray-400)", marginBottom: 12 }}>
              {lang === "hi" ? "अभी कोई उत्तर नहीं। पहले जवाब दें!" : "No answers yet. Be the first to answer!"}
            </p>
          )}

          {/* Post Answer button / form */}
          {!showAnswerForm ? (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setShowAnswerForm(true)}
              style={{ marginTop: 8 }}
            >
              ✍️ {lang === "hi" ? "उत्तर दें" : "Post Answer"}
            </button>
          ) : (
            <div style={{
              marginTop: 12,
              background: "var(--gray-50)",
              border: "1px solid var(--gray-200)",
              borderRadius: 10,
              padding: 16,
            }}>
              <textarea
                className="textarea"
                rows={3}
                placeholder={lang === "hi" ? "अपना उत्तर लिखें..." : "Write your answer here..."}
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                style={{ marginBottom: 10 }}
              />
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleSubmitAnswer}
                  disabled={!answerText.trim()}
                >
                  <Send size={13} /> {lang === "hi" ? "भेजें" : "Submit"}
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => { setShowAnswerForm(false); setAnswerText(""); }}
                >
                  {lang === "hi" ? "रद्द करें" : "Cancel"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Ask Question Modal ───────────────────────────────────────────────────────
function AskModal({ onClose, onSubmit, lang }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = () => {
    if (!title.trim() || !body.trim()) return;
    onSubmit({
      title: title.trim(),
      body: body.trim(),
      tags: tags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean),
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 560, width: "95%" }}>
        <div className="modal-header">
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
            ❓ {lang === "hi" ? "प्रश्न पूछें" : "Ask a Question"}
          </h2>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">
              {lang === "hi" ? "शीर्षक *" : "Title *"}
            </label>
            <input
              type="text"
              className="input"
              placeholder={lang === "hi" ? "जैसे: मेरी गेहूं में पीलापन क्यों आ रहा है?" : "e.g. Why are my wheat leaves turning yellow?"}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              {lang === "hi" ? "विवरण *" : "Description *"}
            </label>
            <textarea
              className="textarea"
              rows={4}
              placeholder={lang === "hi" ? "अपनी समस्या विस्तार से लिखें..." : "Describe your issue in detail..."}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              <Tag size={13} style={{ verticalAlign: "middle" }} />{" "}
              {lang === "hi" ? "टैग (अल्पविराम से अलग)" : "Tags (comma separated)"}
            </label>
            <input
              type="text"
              className="input"
              placeholder={lang === "hi" ? "जैसे: गेहूं, रोग, हरियाणा" : "e.g. wheat, disease, haryana"}
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
          <button
            className="btn btn-primary btn-full"
            onClick={handleSubmit}
            disabled={!title.trim() || !body.trim()}
          >
            <Send size={15} /> {lang === "hi" ? "प्रश्न पोस्ट करें" : "Post Question"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Community() {
  const { lang } = useLang();
  const { user } = useAuth();

  const [posts, setPosts] = useState(communityPosts);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  // ── Filter ─────────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return posts;
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.titleHi && p.titleHi.includes(q)) ||
        p.tags?.some((t) => t.includes(q))
    );
  }, [posts, search]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleLike = (postId) => {
    setPosts((prev) =>
      prev.map((p) => p.id === postId ? { ...p, likes: p.likes + 1 } : p)
    );
  };

  const handleAnswerLike = (postId, answerId) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              answers: p.answers.map((a) =>
                a.id === answerId ? { ...a, likes: a.likes + 1 } : a
              ),
            }
          : p
      )
    );
  };

  const handleAddAnswer = (postId, answer) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, answers: [...p.answers, answer] } : p
      )
    );
  };

  const handleAskSubmit = ({ title, body, tags }) => {
    const authorName = user?.name || "Anonymous Farmer";
    const authorInitials = authorName.slice(0, 2).toUpperCase();
    const newPost = {
      id: Date.now(),
      title,
      titleHi: title,
      body,
      bodyHi: body,
      author: authorName,
      authorAvatar: authorInitials,
      village: user?.village || "India",
      date: new Date().toISOString().split("T")[0],
      views: 0,
      likes: 0,
      tags,
      answers: [],
    };
    setPosts((prev) => [newPost, ...prev]);
    setShowModal(false);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="page-content" style={{ maxWidth: 860, margin: "0 auto" }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 26, fontWeight: 700, color: "var(--green-800)", margin: 0 }}>
              <Users size={28} color="var(--primary)" />
              {lang === "hi" ? "किसान समुदाय" : "Farmer Community"}
            </h1>
            <p style={{ color: "var(--gray-600)", marginTop: 4, marginBottom: 0 }}>
              {lang === "hi"
                ? "सवाल पूछें, अनुभव साझा करें और विशेषज्ञ जवाब पाएं"
                : "Ask questions, share experiences, and get expert answers"}
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            <Plus size={16} /> {lang === "hi" ? "प्रश्न पूछें" : "Ask a Question"}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20,
      }}>
        {[
          { icon: "📝", val: posts.length, label: lang === "hi" ? "कुल प्रश्न" : "Total Questions" },
          { icon: "💬", val: posts.reduce((s, p) => s + p.answers.length, 0), label: lang === "hi" ? "उत्तर" : "Answers" },
          { icon: "👁️", val: posts.reduce((s, p) => s + p.views, 0), label: lang === "hi" ? "व्यूज़" : "Views" },
        ].map((stat) => (
          <div key={stat.label} style={{
            flex: "1 1 120px",
            background: "var(--green-50)",
            border: "1px solid var(--green-100)",
            borderRadius: 10,
            padding: "12px 16px",
            textAlign: "center",
          }}>
            <div style={{ fontSize: 22 }}>{stat.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 20, color: "var(--green-800)" }}>{stat.val}</div>
            <div style={{ fontSize: 12, color: "var(--gray-500)" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 20 }}>
        <Search size={16} style={{
          position: "absolute", left: 12, top: "50%",
          transform: "translateY(-50%)", color: "var(--gray-400)",
        }} />
        <input
          type="text"
          className="input"
          placeholder={lang === "hi" ? "शीर्षक या टैग खोजें..." : "Search by title or tags..."}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ paddingLeft: 38 }}
        />
      </div>

      {/* Result count */}
      <div style={{ marginBottom: 14, fontSize: 13, color: "var(--gray-500)" }}>
        {lang === "hi"
          ? `${filtered.length} प्रश्न मिले`
          : `${filtered.length} question${filtered.length !== 1 ? "s" : ""}`}
      </div>

      {/* Post list */}
      {filtered.length === 0 ? (
        <div className="alert alert-info">
          {lang === "hi"
            ? "कोई प्रश्न नहीं मिला। पहले सवाल पूछें!"
            : "No questions found. Be the first to ask!"}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {filtered.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onAnswerLike={handleAnswerLike}
              onAddAnswer={handleAddAnswer}
              lang={lang}
            />
          ))}
        </div>
      )}

      {/* Ask Question Modal */}
      {showModal && (
        <AskModal
          onClose={() => setShowModal(false)}
          onSubmit={handleAskSubmit}
          lang={lang}
        />
      )}
    </div>
  );
}
