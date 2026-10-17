/**
 * Schemes.jsx
 * Government Schemes page – browse, filter by category, and search central/state schemes.
 */
import { useState, useMemo } from "react";
import { Search, User, ExternalLink, Calendar, Award } from "lucide-react";
import { govSchemes } from "../data/mockData";
import { useLang } from "../context/LangContext";

// ─── Category definitions ─────────────────────────────────────────────────────
const CATEGORIES = [
  { value: "all",       label: "All",       emoji: "🏛" },
  { value: "loan",      label: "Loan",      emoji: "💰" },
  { value: "insurance", label: "Insurance", emoji: "🛡" },
  { value: "subsidy",   label: "Subsidy",   emoji: "💸" },
  { value: "equipment", label: "Equipment", emoji: "🚜" },
  { value: "training",  label: "Training",  emoji: "📚" },
  { value: "pension",   label: "Pension",   emoji: "👴" },
];

// ─── Per-scheme accent colours (uses data.color, fallback map) ────────────────
const COLOR_MAP = {
  green:  { border: "#16a34a", bg: "#dcfce7", text: "#15803d" },
  blue:   { border: "#2563eb", bg: "#dbeafe", text: "#1d4ed8" },
  orange: { border: "#ea580c", bg: "#ffedd5", text: "#c2410c" },
  yellow: { border: "#ca8a04", bg: "#fef9c3", text: "#a16207" },
  red:    { border: "#dc2626", bg: "#fee2e2", text: "#b91c1c" },
};

function getColor(key) {
  return COLOR_MAP[key] || COLOR_MAP.blue;
}

// ─── Category badge ───────────────────────────────────────────────────────────
function CategoryBadge({ category }) {
  const cat = CATEGORIES.find((c) => c.value === category);
  const colors = {
    loan:      "badge badge-orange",
    insurance: "badge badge-blue",
    subsidy:   "badge badge-green",
    equipment: "badge badge-blue",
    training:  "badge badge-yellow",
    pension:   "badge badge-gray",
  };
  return (
    <span className={colors[category] || "badge badge-gray"}>
      {cat?.emoji} {cat?.label || category}
    </span>
  );
}

// ─── Scheme Card ──────────────────────────────────────────────────────────────
function SchemeCard({ scheme, lang }) {
  const colors = getColor(scheme.color);
  const name = lang === "hi" ? scheme.nameHi : scheme.name;
  const description = lang === "hi" ? scheme.descriptionHi : scheme.description;

  return (
    <div
      className="card"
      style={{
        borderLeft: `5px solid ${colors.border}`,
        transition: "box-shadow 0.2s, transform 0.15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 8px 28px ${colors.border}28`;
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "";
        e.currentTarget.style.transform = "";
      }}
    >
      <div className="card-body">
        {/* Scheme name */}
        <h3
          style={{
            margin: "0 0 10px",
            fontSize: "1.05rem",
            fontWeight: 800,
            color: "var(--gray-900)",
            lineHeight: 1.3,
          }}
        >
          {name}
        </h3>

        {/* Badge row */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          <CategoryBadge category={scheme.category} />
          <span
            className="badge"
            style={{
              background: scheme.central ? "#dbeafe" : "#f3e8ff",
              color: scheme.central ? "#1d4ed8" : "#7c3aed",
            }}
          >
            {scheme.central ? "🏛 Central" : "🏢 State"}
          </span>
        </div>

        {/* Description */}
        <p style={{ margin: "0 0 14px", color: "var(--gray-600)", fontSize: "0.88rem", lineHeight: 1.6 }}>
          {description}
        </p>

        {/* Eligibility */}
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "flex-start",
            marginBottom: 12,
            padding: "10px 12px",
            background: "var(--gray-50)",
            borderRadius: 10,
            border: "1px solid var(--gray-200)",
          }}
        >
          <User size={15} style={{ color: "var(--gray-500)", flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ margin: "0 0 2px", fontSize: "0.72rem", fontWeight: 700, color: "var(--gray-500)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Eligibility
            </p>
            <p style={{ margin: 0, fontSize: "0.84rem", color: "var(--gray-700)", lineHeight: 1.5 }}>
              {scheme.eligibility}
            </p>
          </div>
        </div>

        {/* Benefit highlight */}
        <div
          style={{
            padding: "10px 14px",
            background: colors.bg,
            border: `1px solid ${colors.border}40`,
            borderRadius: 10,
            marginBottom: 12,
            display: "flex",
            alignItems: "flex-start",
            gap: 8,
          }}
        >
          <Award size={15} style={{ color: colors.text, flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ margin: "0 0 2px", fontSize: "0.72rem", fontWeight: 700, color: colors.text, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Benefit
            </p>
            <p style={{ margin: 0, fontSize: "0.9rem", fontWeight: 700, color: colors.text }}>
              {scheme.benefit}
            </p>
          </div>
        </div>

        {/* Deadline + Apply */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--gray-500)", fontSize: "0.8rem" }}>
            <Calendar size={13} />
            <span>{scheme.deadline}</span>
          </div>
          <a
            href={scheme.link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-primary"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none" }}
          >
            Apply / Official Website <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Schemes() {
  const { lang, t } = useLang();

  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery,    setSearchQuery]    = useState("");

  // ── Filtering ──────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return govSchemes.filter((s) => {
      const matchCat    = activeCategory === "all" || s.category === activeCategory;
      const matchSearch = !q || s.name.toLowerCase().includes(q) || s.nameHi.includes(q);
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="page-content">
      {/* ── Page Header ── */}
      <div className="page-header">
        <h1 style={{ display: "flex", alignItems: "center", gap: 10 }}>
          🏛 {t("nav_schemes") || "Government Schemes"}
        </h1>
        <p style={{ color: "var(--gray-600)", marginTop: 4, marginBottom: 0 }}>
          {lang === "hi"
            ? "केंद्र और राज्य सरकार की किसान योजनाओं की जानकारी और आवेदन लिंक"
            : "Explore central & state government schemes – benefits, eligibility & application links"}
        </p>
      </div>

      <div className="container">
        {/* ── Search Bar ── */}
        <div
          style={{
            position: "relative",
            maxWidth: 500,
            marginBottom: 20,
          }}
        >
          <Search
            size={16}
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--gray-400)",
              pointerEvents: "none",
            }}
          />
          <input
            className="input"
            type="text"
            placeholder={lang === "hi" ? "योजना खोजें…" : "Search schemes by name…"}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: 38 }}
          />
        </div>

        {/* ── Category Filter Chips ── */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--gray-500)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Filter by Category
          </p>
          <div className="chips" style={{ flexWrap: "wrap" }}>
            {CATEGORIES.map((cat) => {
              const active = activeCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "7px 16px",
                    borderRadius: 20,
                    border: active ? "2px solid var(--primary)" : "2px solid var(--gray-200)",
                    background: active ? "var(--primary)" : "#fff",
                    color: active ? "#fff" : "var(--gray-700)",
                    fontWeight: active ? 700 : 500,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    whiteSpace: "nowrap",
                  }}
                >
                  {cat.emoji} {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Result Count ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--gray-600)" }}>
            Showing{" "}
            <strong style={{ color: "var(--primary)" }}>{filtered.length}</strong>{" "}
            of {govSchemes.length} schemes
          </p>
          {(activeCategory !== "all" || searchQuery) && (
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => { setActiveCategory("all"); setSearchQuery(""); }}
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* ── Schemes Grid ── */}
        {filtered.length > 0 ? (
          <div className="grid-2">
            {filtered.map((scheme) => (
              <SchemeCard key={scheme.id} scheme={scheme} lang={lang} />
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "var(--gray-500)",
              background: "var(--gray-50)",
              borderRadius: 16,
              border: "2px dashed var(--gray-200)",
            }}
          >
            <span style={{ fontSize: 48 }}>🏛</span>
            <p style={{ marginTop: 12, fontSize: "1.05rem", fontWeight: 600 }}>No schemes found</p>
            <p style={{ fontSize: "0.9rem" }}>Try a different category or search term</p>
          </div>
        )}

        {/* ── Help Note ── */}
        <div className="alert alert-info" style={{ marginTop: 32 }}>
          <strong>💡 Tip:</strong>{" "}
          {lang === "hi"
            ? "किसी भी योजना के लिए आवेदन करने हेतु अपने नजदीकी CSC (Common Service Centre) या कृषि विभाग कार्यालय से संपर्क करें।"
            : "To apply for any scheme, contact your nearest CSC (Common Service Centre) or local Agriculture Department office for assisted enrollment."}
        </div>
      </div>
    </div>
  );
}
