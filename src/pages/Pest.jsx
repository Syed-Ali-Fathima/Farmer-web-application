/**
 * Pest.jsx
 * Pest & Disease Guide – searchable, filterable cards with
 * accordion-style expandable symptom/solution/prevention sections.
 */
import { useState, useMemo } from "react";
import { Search, ChevronDown, ChevronUp, Bug, Leaf, Shield, FlaskConical, AlertTriangle } from "lucide-react";
import { pestGuide as pestData } from "../data/mockData";
import { useLang } from "../context/LangContext";

const SEVERITY_MAP = {
  high:   { label: "High",   labelHi: "अधिक",   badge: "badge badge-red" },
  medium: { label: "Medium", labelHi: "मध्यम",   badge: "badge badge-yellow" },
  low:    { label: "Low",    labelHi: "कम",      badge: "badge badge-green" },
};

const TABS = [
  { key: "all",     label: "All",       labelHi: "सभी",    icon: "🌿" },
  { key: "pest",    label: "Pests",     labelHi: "कीट",    icon: "🐛" },
  { key: "disease", label: "Diseases",  labelHi: "रोग",    icon: "🍂" },
];

// ─── Single Pest/Disease Card ─────────────────────────────────────────────────
function PestCard({ item, lang }) {
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState(null); // "symptoms"|"organic"|"chemical"|"prevention"

  const toggleSection = (s) => setSection((prev) => (prev === s ? null : s));

  const sev = SEVERITY_MAP[item.severity] || SEVERITY_MAP.medium;

  const sections = [
    {
      key: "symptoms",
      icon: <AlertTriangle size={14} />,
      label: lang === "hi" ? "लक्षण" : "Symptoms",
      content: lang === "hi" ? item.symptomsHi : item.symptoms,
      bg: "#fef9c3",
      border: "#fde68a",
    },
    {
      key: "organic",
      icon: <Leaf size={14} />,
      label: lang === "hi" ? "जैविक समाधान" : "Organic Solution",
      content: item.organicSolution,
      bg: "#f0fdf4",
      border: "#bbf7d0",
    },
    {
      key: "chemical",
      icon: <FlaskConical size={14} />,
      label: lang === "hi" ? "रासायनिक समाधान" : "Chemical Solution",
      content: item.chemicalSolution,
      bg: "#fffbeb",
      border: "#fcd34d",
    },
    {
      key: "prevention",
      icon: <Shield size={14} />,
      label: lang === "hi" ? "रोकथाम" : "Prevention",
      content: item.prevention,
      bg: "#eff6ff",
      border: "#bfdbfe",
    },
  ];

  return (
    <div className="card" style={{ overflow: "hidden" }}>
      {/* Card header */}
      <div
        className="card-body"
        style={{ cursor: "pointer", paddingBottom: open ? 8 : 16 }}
        onClick={() => setOpen((p) => !p)}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start", flex: 1 }}>
            <span style={{ fontSize: 32, lineHeight: 1 }}>{item.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", marginBottom: 6 }}>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "var(--gray-800)" }}>
                  {lang === "hi" ? item.nameHi : item.name}
                </h3>
                <span className={sev.badge}>
                  {lang === "hi" ? sev.labelHi : sev.label}
                </span>
                <span className={item.type === "pest" ? "badge badge-orange" : "badge badge-blue"}>
                  {item.type === "pest"
                    ? (lang === "hi" ? "कीट 🐛" : "Pest 🐛")
                    : (lang === "hi" ? "रोग 🍂" : "Disease 🍂")}
                </span>
              </div>
              {/* Affected crops */}
              <div className="chips" style={{ flexWrap: "wrap" }}>
                {item.affectedCrops.map((c) => (
                  <span key={c} className="chip" style={{ fontSize: 11, textTransform: "capitalize" }}>
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <button style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            {open ? <ChevronUp size={18} color="var(--gray-500)" /> : <ChevronDown size={18} color="var(--gray-500)" />}
          </button>
        </div>
      </div>

      {/* Expandable accordion sections */}
      {open && (
        <div style={{ borderTop: "1px solid var(--gray-100)" }}>
          {sections.map((sec) => (
            <div key={sec.key} style={{ borderBottom: "1px solid var(--gray-100)" }}>
              <button
                onClick={() => toggleSection(sec.key)}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 20px",
                  background: section === sec.key ? sec.bg : "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: 13,
                  color: "var(--gray-700)",
                  transition: "background 0.2s",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  {sec.icon} {sec.label}
                </span>
                {section === sec.key ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {section === sec.key && (
                <div style={{
                  padding: "12px 20px 14px",
                  background: sec.bg,
                  borderLeft: `3px solid ${sec.border}`,
                  fontSize: 13,
                  color: "var(--gray-700)",
                  lineHeight: 1.7,
                }}>
                  {sec.content}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Pest() {
  const { lang } = useLang();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return pestData.filter((item) => {
      const matchType = activeTab === "all" || item.type === activeTab;
      const matchSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.nameHi.includes(q) ||
        item.affectedCrops.some((c) => c.toLowerCase().includes(q));
      return matchType && matchSearch;
    });
  }, [search, activeTab]);

  return (
    <div className="page-content" style={{ maxWidth: 860, margin: "0 auto" }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 20 }}>
        <h1 style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 26, fontWeight: 700, color: "var(--green-800)" }}>
          <Bug size={28} color="var(--primary)" />
          {lang === "hi" ? "कीट और रोग मार्गदर्शिका" : "Pest & Disease Guide"}
        </h1>
        <p style={{ color: "var(--gray-600)", marginTop: 4 }}>
          {lang === "hi"
            ? "अपनी फसल के कीट या रोग खोजें और समाधान पाएं"
            : "Identify pests and diseases in your crops and find solutions"}
        </p>
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 16 }}>
        <Search size={16} style={{
          position: "absolute", left: 12, top: "50%",
          transform: "translateY(-50%)", color: "var(--gray-400)",
        }} />
        <input
          type="text"
          className="input"
          placeholder={lang === "hi" ? "फसल, कीट या रोग खोजें..." : "Search by crop, pest or disease name..."}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ paddingLeft: 38 }}
        />
      </div>

      {/* Filter Tabs */}
      <div className="tabs" style={{ marginBottom: 20 }}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`tab-btn${activeTab === tab.key ? " active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.icon} {lang === "hi" ? tab.labelHi : tab.label}
          </button>
        ))}
      </div>

      {/* Result count */}
      <div style={{ marginBottom: 14, fontSize: 13, color: "var(--gray-500)" }}>
        {lang === "hi"
          ? `${filtered.length} परिणाम मिले`
          : `${filtered.length} result${filtered.length !== 1 ? "s" : ""} found`}
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="alert alert-info">
          {lang === "hi"
            ? "कोई परिणाम नहीं मिला। खोज बदलकर दोबारा कोशिश करें।"
            : "No results found. Try a different search term."}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {filtered.map((item) => (
            <PestCard key={item.id} item={item} lang={lang} />
          ))}
        </div>
      )}
    </div>
  );
}
