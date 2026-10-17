/**
 * Dashboard.jsx
 * Farmer Dashboard – requires login (redirects to /login if no user)
 * Shows personalized greeting, profile, stats, quick links, market prices,
 * latest schemes, and community activity.
 */
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Cloud, TrendingUp, FileText, MessageCircle,
  Thermometer, Wheat, Building2, Users,
  MapPin, Phone, Mail, Calendar, ShieldCheck,
  ArrowRight, Eye,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LangContext";
import { marketPrices, govSchemes, communityPosts } from "../data/mockData";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color }) {
  return (
    <div
      className="card"
      style={{
        flex: 1, minWidth: 0,
        borderTop: `4px solid ${color}`,
        transition: "transform 0.15s",
        cursor: "default",
      }}
      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"}
      onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
    >
      <div className="card-body" style={{ padding: "1rem 1.1rem" }}>
        <div style={{ fontSize: "2rem", marginBottom: "0.4rem" }}>{icon}</div>
        <div style={{ fontSize: "0.75rem", color: "var(--gray-500)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          {label}
        </div>
        <div style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--gray-900)", marginTop: "0.2rem" }}>
          {value}
        </div>
        {sub && <div style={{ fontSize: "0.78rem", color: "var(--gray-500)", marginTop: "0.2rem" }}>{sub}</div>}
      </div>
    </div>
  );
}

function QuickLinkBtn({ to, icon, label, color }) {
  return (
    <Link
      to={to}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", gap: "0.5rem",
        padding: "1.2rem 0.75rem",
        background: color + "12",
        border: `2px solid ${color}30`,
        borderRadius: "14px",
        textDecoration: "none",
        color: "var(--gray-800)",
        fontWeight: 600, fontSize: "0.88rem",
        transition: "all 0.18s",
        minHeight: "90px",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = color + "22";
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.transform = "translateY(-3px)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = color + "12";
        e.currentTarget.style.borderColor = color + "30";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <span style={{ fontSize: "1.8rem" }}>{icon}</span>
      <span style={{ textAlign: "center", lineHeight: 1.2 }}>{label}</span>
    </Link>
  );
}

function SchemeBadge({ category }) {
  const map = {
    subsidy: "badge-green", insurance: "badge-blue", loan: "badge-orange",
    pension: "badge-yellow", equipment: "badge-blue", training: "badge-green",
  };
  return (
    <span className={`badge ${map[category] || "badge-gray"}`} style={{ textTransform: "capitalize" }}>
      {category}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user } = useAuth();
  const { lang } = useLang();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  if (!user) return null;

  const greeting = getGreeting();
  const recentPrices = marketPrices.slice(0, 5);
  const latestSchemes = govSchemes.slice(0, 3);
  const recentPosts = communityPosts.slice(0, 2);

  return (
    <div className="page-content" style={{ background: "var(--gray-50)", minHeight: "100vh" }}>
      {/* ── Page Header ── */}
      <div
        style={{
          background: "linear-gradient(135deg, var(--green-700) 0%, var(--green-500) 100%)",
          color: "#fff", padding: "2rem 0 3.5rem",
          marginBottom: "-2rem",
        }}
      >
        <div className="container">
          <p style={{ fontSize: "1rem", opacity: 0.85, marginBottom: "0.2rem" }}>
            🌤️ {greeting},
          </p>
          <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2.2rem)", fontWeight: 800, margin: 0 }}>
            {user.name} 👋
          </h1>
          <p style={{ opacity: 0.8, marginTop: "0.4rem", fontSize: "0.9rem" }}>
            Welcome back to your Kisan Seva dashboard
          </p>
        </div>
      </div>

      <div className="container" style={{ position: "relative", zIndex: 1 }}>

        {/* ── Stat Cards ── */}
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
          <StatCard icon="☀️" label="Today's Weather" value="28°C" sub="New Delhi · Sunny" color="#f59e0b" />
          <StatCard icon="🌾" label="Top Price" value="₹2,150" sub="Wheat / quintal" color="#10b981" />
          <StatCard icon="🏛️" label="Active Schemes" value="8 Schemes" sub="Central Government" color="#6366f1" />
          <StatCard icon="💬" label="Community" value="4 Questions" sub="Active discussions" color="#ec4899" />
        </div>

        {/* ── Profile + Quick Links ── */}
        <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: "1.5rem", marginBottom: "1.5rem", alignItems: "start" }}>

          {/* Profile Card */}
          <div className="card">
            <div className="card-body" style={{ padding: "1.5rem" }}>
              <div style={{ textAlign: "center", marginBottom: "1.2rem" }}>
                {/* Avatar */}
                <div
                  style={{
                    width: 72, height: 72, borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--green-500), var(--green-700))",
                    color: "#fff", fontSize: "1.6rem", fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 0.75rem",
                    boxShadow: "0 4px 14px rgba(34,197,94,0.35)",
                  }}
                >
                  {user.avatar || user.name?.slice(0, 2).toUpperCase()}
                </div>
                <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--gray-900)" }}>{user.name}</div>
                <span className={`badge ${user.role === "admin" ? "badge-red" : "badge-green"}`} style={{ marginTop: "0.3rem", display: "inline-block" }}>
                  {user.role === "admin" ? "🛡️ Admin" : "🌾 Farmer"}
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                {[
                  { icon: <Mail size={14} />, val: user.email },
                  { icon: <Phone size={14} />, val: user.phone },
                  { icon: <MapPin size={14} />, val: user.village || "—" },
                  { icon: <Calendar size={14} />, val: `Joined ${formatDate(user.joinDate)}` },
                ].map(({ icon, val }, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "var(--gray-600)" }}>
                    <span style={{ color: "var(--green-600)", flexShrink: 0 }}>{icon}</span>
                    <span style={{ wordBreak: "break-all" }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="card">
            <div className="card-header" style={{ padding: "1rem 1.25rem 0.6rem" }}>
              <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700 }}>⚡ Quick Access</h3>
            </div>
            <div className="card-body" style={{ padding: "1rem 1.25rem 1.25rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
                <QuickLinkBtn to="/weather"    icon="🌤️" label="Weather"       color="#f59e0b" />
                <QuickLinkBtn to="/market"     icon="📊" label="Market"        color="#10b981" />
                <QuickLinkBtn to="/schemes"    icon="🏛️" label="Schemes"       color="#6366f1" />
                <QuickLinkBtn to="/crops"      icon="🌾" label="Crop Advisory" color="#16a34a" />
                <QuickLinkBtn to="/pests"      icon="🐛" label="Pest Guide"    color="#dc2626" />
                <QuickLinkBtn to="/community"  icon="💬" label="Community"     color="#ec4899" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Market Prices Table ── */}
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <div className="card-header" style={{ padding: "1rem 1.25rem 0.6rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700 }}>📈 Recent Market Prices</h3>
            <Link to="/market" style={{ fontSize: "0.82rem", color: "var(--green-600)", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: "0.2rem" }}>
              View All <ArrowRight size={13} />
            </Link>
          </div>
          <div className="card-body" style={{ padding: "0 0 1rem" }}>
            <div className="table-wrap">
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.87rem" }}>
                <thead>
                  <tr style={{ background: "var(--gray-50)", borderBottom: "1px solid var(--gray-200)" }}>
                    {["Crop", "Market", "State", "Min ₹", "Max ₹", "Modal ₹"].map(h => (
                      <th key={h} style={{ padding: "0.65rem 1rem", textAlign: "left", fontWeight: 600, color: "var(--gray-600)", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentPrices.map((p, i) => (
                    <tr
                      key={p.id}
                      style={{
                        borderBottom: i < recentPrices.length - 1 ? "1px solid var(--gray-100)" : "none",
                        background: i % 2 === 0 ? "#fff" : "var(--gray-50)",
                      }}
                    >
                      <td style={{ padding: "0.65rem 1rem", fontWeight: 600, color: "var(--gray-800)" }}>
                        {lang === "hi" ? p.cropHi : p.crop}
                      </td>
                      <td style={{ padding: "0.65rem 1rem", color: "var(--gray-600)" }}>{p.market}</td>
                      <td style={{ padding: "0.65rem 1rem", color: "var(--gray-600)" }}>{p.state}</td>
                      <td style={{ padding: "0.65rem 1rem", color: "var(--gray-700)" }}>₹{p.minPrice.toLocaleString("en-IN")}</td>
                      <td style={{ padding: "0.65rem 1rem", color: "var(--gray-700)" }}>₹{p.maxPrice.toLocaleString("en-IN")}</td>
                      <td style={{ padding: "0.65rem 1rem" }}>
                        <span style={{ fontWeight: 700, color: "var(--green-700)" }}>₹{p.modalPrice.toLocaleString("en-IN")}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── Bottom Row: Schemes + Community ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>

          {/* Latest Schemes */}
          <div className="card">
            <div className="card-header" style={{ padding: "1rem 1.25rem 0.6rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700 }}>🏛️ Latest Schemes</h3>
              <Link to="/schemes" style={{ fontSize: "0.82rem", color: "var(--green-600)", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: "0.2rem" }}>
                View All <ArrowRight size={13} />
              </Link>
            </div>
            <div className="card-body" style={{ padding: "0.75rem 1.25rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {latestSchemes.map(s => (
                <div
                  key={s.id}
                  style={{
                    padding: "0.85rem", borderRadius: "10px",
                    border: "1px solid var(--gray-200)",
                    background: "var(--green-50)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem", marginBottom: "0.35rem" }}>
                    <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--gray-900)", lineHeight: 1.3 }}>
                      {lang === "hi" ? s.nameHi : s.name}
                    </div>
                    <SchemeBadge category={s.category} />
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "var(--gray-600)", margin: "0 0 0.5rem", lineHeight: 1.4 }}>
                    {lang === "hi" ? s.descriptionHi : s.description}
                  </p>
                  <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--green-700)" }}>
                    Benefit: {s.benefit}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Community Activity */}
          <div className="card">
            <div className="card-header" style={{ padding: "1rem 1.25rem 0.6rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700 }}>💬 Community Activity</h3>
              <Link to="/community" style={{ fontSize: "0.82rem", color: "var(--green-600)", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: "0.2rem" }}>
                View All <ArrowRight size={13} />
              </Link>
            </div>
            <div className="card-body" style={{ padding: "0.75rem 1.25rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {recentPosts.map(post => (
                <div
                  key={post.id}
                  style={{
                    padding: "0.85rem", borderRadius: "10px",
                    border: "1px solid var(--gray-200)",
                    background: "#fff",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
                    <div
                      style={{
                        width: 32, height: 32, borderRadius: "50%",
                        background: "linear-gradient(135deg, var(--green-400), var(--green-600))",
                        color: "#fff", fontSize: "0.72rem", fontWeight: 700,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {post.authorAvatar}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.8rem", color: "var(--gray-800)" }}>{post.author}</div>
                      <div style={{ fontSize: "0.72rem", color: "var(--gray-500)" }}>
                        <MapPin size={10} style={{ display: "inline", marginRight: 2 }} />
                        {post.village}
                      </div>
                    </div>
                  </div>

                  <p style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--gray-800)", margin: "0 0 0.35rem", lineHeight: 1.35 }}>
                    {lang === "hi" ? post.titleHi : post.title}
                  </p>

                  <div style={{ display: "flex", gap: "0.75rem", fontSize: "0.75rem", color: "var(--gray-500)" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
                      <Eye size={12} /> {post.views} views
                    </span>
                    <span>❤️ {post.likes}</span>
                    <span>💬 {post.answers?.length || 0} answers</span>
                  </div>

                  {post.tags?.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "0.5rem" }}>
                      {post.tags.map(tag => (
                        <span key={tag} className="badge badge-gray" style={{ fontSize: "0.7rem" }}>#{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
