/**
 * Crops.jsx
 * Crop Advisory page – browse and filter crop guidance with MSP, tips, and best practices.
 */
import { useState } from "react";
import { X, Droplets, Calendar, TrendingUp, IndianRupee, ChevronDown, ChevronUp, Leaf } from "lucide-react";
import { cropData } from "../data/mockData";
import { useLang } from "../context/LangContext";

// ─── Static filter options ────────────────────────────────────────────────────
const SEASONS = [
  { value: "all",    label: "All Seasons",  labelHi: "सभी मौसम",  emoji: "🌍" },
  { value: "kharif", label: "Kharif",       labelHi: "खरीफ",      emoji: "☀️" },
  { value: "rabi",   label: "Rabi",         labelHi: "रबी",       emoji: "❄️" },
  { value: "zaid",   label: "Zaid",         labelHi: "जायद",      emoji: "🌿" },
];

const REGIONS = [
  { value: "all",     label: "All Regions" },
  { value: "north",   label: "North" },
  { value: "south",   label: "South" },
  { value: "east",    label: "East" },
  { value: "west",    label: "West" },
  { value: "central", label: "Central" },
];

const SOIL_TYPES = [
  { value: "all",       label: "All Soils" },
  { value: "alluvial",  label: "Alluvial" },
  { value: "black",     label: "Black" },
  { value: "red",       label: "Red" },
  { value: "sandy-loam",label: "Sandy Loam" },
  { value: "clay-loam", label: "Clay Loam" },
  { value: "loam",      label: "Loam" },
];

// ─── Season badge colours ─────────────────────────────────────────────────────
const seasonBadge = {
  kharif: "badge badge-green",
  rabi:   "badge badge-blue",
  zaid:   "badge badge-orange",
};

// ─── Detail Modal ─────────────────────────────────────────────────────────────
function CropModal({ crop, lang, onClose }) {
  if (!crop) return null;
  const name = lang === "hi" ? crop.nameHi : crop.name;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1000 }}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 560, width: "95%", maxHeight: "90vh", overflowY: "auto" }}
      >
        {/* Header */}
        <div
          className="modal-header"
          style={{
            background: `linear-gradient(135deg, ${crop.color}22, ${crop.color}11)`,
            borderBottom: `3px solid ${crop.color}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 40 }}>{crop.icon}</span>
            <div>
              <h2 style={{ margin: 0, fontSize: "1.4rem", color: "var(--gray-900)" }}>{name}</h2>
              <span className={seasonBadge[crop.season] || "badge badge-gray"} style={{ marginTop: 4, display: "inline-block" }}>
                {crop.season.charAt(0).toUpperCase() + crop.season.slice(1)}
              </span>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ padding: "20px 24px" }}>
          {/* Stats grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
            {[
              { icon: <Calendar size={16} color={crop.color} />, label: "Growing Days", value: crop.growingDays },
              { icon: <Droplets size={16} color={crop.color} />, label: "Water Required", value: crop.waterRequired },
              { icon: <TrendingUp size={16} color={crop.color} />, label: "Yield / Acre", value: crop.yieldPerAcre },
              { icon: <IndianRupee size={16} color={crop.color} />, label: "MSP Price", value: crop.msp },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  padding: "12px 14px",
                  background: "var(--gray-50)",
                  borderRadius: 10,
                  border: "1px solid var(--gray-200)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  {stat.icon}
                  <span style={{ fontSize: "0.72rem", color: "var(--gray-500)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    {stat.label}
                  </span>
                </div>
                <p style={{ margin: 0, fontWeight: 700, color: "var(--gray-900)", fontSize: "0.95rem" }}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Regions */}
          <div style={{ marginBottom: 16 }}>
            <p style={{ margin: "0 0 8px", fontWeight: 600, color: "var(--gray-700)", fontSize: "0.9rem" }}>
              🗺️ Suitable Regions
            </p>
            <div className="chips">
              {(crop.region.includes("all") ? ["north", "south", "east", "west", "central"] : crop.region).map((r) => (
                <span key={r} className="chip" style={{ textTransform: "capitalize" }}>{r}</span>
              ))}
            </div>
          </div>

          {/* Soil types */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ margin: "0 0 8px", fontWeight: 600, color: "var(--gray-700)", fontSize: "0.9rem" }}>
              🌱 Soil Types
            </p>
            <div className="chips">
              {crop.soilTypes.map((s) => (
                <span key={s} className="chip" style={{ textTransform: "capitalize" }}>{s}</span>
              ))}
            </div>
          </div>

          {/* Best practices */}
          <div
            style={{
              background: `${crop.color}10`,
              border: `1px solid ${crop.color}40`,
              borderRadius: 12,
              padding: "16px 18px",
            }}
          >
            <p style={{ margin: "0 0 12px", fontWeight: 700, color: crop.color, display: "flex", alignItems: "center", gap: 6 }}>
              <Leaf size={16} /> Best Practices & Growing Tips
            </p>
            <ol style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
              {crop.tips.map((tip, i) => (
                <li key={i} style={{ color: "var(--gray-700)", lineHeight: 1.55, fontSize: "0.9rem" }}>{tip}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Crop Card ────────────────────────────────────────────────────────────────
function CropCard({ crop, lang, onExpand }) {
  const [showTips, setShowTips] = useState(false);
  const name = lang === "hi" ? crop.nameHi : crop.name;

  return (
    <div
      className="card"
      style={{
        borderTop: `4px solid ${crop.color}`,
        transition: "box-shadow 0.2s, transform 0.15s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 8px 24px ${crop.color}30`;
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "";
        e.currentTarget.style.transform = "";
      }}
    >
      <div className="card-body">
        {/* Top row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 32 }}>{crop.icon}</span>
            <div>
              <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "var(--gray-900)" }}>{name}</h3>
              <span className={seasonBadge[crop.season] || "badge badge-gray"} style={{ marginTop: 2, display: "inline-block" }}>
                {crop.season.charAt(0).toUpperCase() + crop.season.slice(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
          {[
            { icon: <Calendar size={13} />, text: crop.growingDays },
            { icon: <Droplets size={13} />, text: crop.waterRequired },
            { icon: <TrendingUp size={13} />, text: crop.yieldPerAcre },
            { icon: <IndianRupee size={13} />, text: crop.msp },
          ].map((row, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--gray-600)", fontSize: "0.82rem" }}>
              <span style={{ color: crop.color }}>{row.icon}</span>
              {row.text}
            </div>
          ))}
        </div>

        {/* Expandable Best Practices */}
        <button
          onClick={(e) => { e.stopPropagation(); setShowTips((v) => !v); }}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 10px",
            background: `${crop.color}15`,
            border: `1px solid ${crop.color}40`,
            borderRadius: 8,
            cursor: "pointer",
            fontSize: "0.82rem",
            fontWeight: 600,
            color: crop.color,
            marginBottom: showTips ? 8 : 0,
          }}
        >
          <span>🌿 Best Practices</span>
          {showTips ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {showTips && (
          <ul style={{ margin: 0, padding: "4px 0 4px 18px", display: "flex", flexDirection: "column", gap: 5 }}>
            {crop.tips.slice(0, 3).map((tip, i) => (
              <li key={i} style={{ fontSize: "0.8rem", color: "var(--gray-700)", lineHeight: 1.5 }}>{tip}</li>
            ))}
          </ul>
        )}

        {/* View Details */}
        <button
          className="btn btn-sm btn-primary btn-full"
          style={{ marginTop: 12 }}
          onClick={() => onExpand(crop)}
        >
          View Full Details
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Crops() {
  const { lang, t } = useLang();

  const [season,   setSeason]   = useState("all");
  const [region,   setRegion]   = useState("all");
  const [soilType, setSoilType] = useState("all");
  const [selected, setSelected] = useState(null);

  // ── Filtering ──────────────────────────────────────────────────────────────
  const filtered = cropData.filter((crop) => {
    const matchSeason = season === "all" || crop.season === season;
    const matchRegion =
      region === "all" ||
      crop.region.includes("all") ||
      crop.region.includes(region);
    const matchSoil =
      soilType === "all" ||
      crop.soilTypes.includes(soilType);
    return matchSeason && matchRegion && matchSoil;
  });

  return (
    <div className="page-content">
      {/* ── Page Header ── */}
      <div className="page-header">
        <h1 style={{ display: "flex", alignItems: "center", gap: 10 }}>
          🌱 {t("nav_crop_advisory") || "Crop Advisory"}
        </h1>
        <p style={{ color: "var(--gray-600)", marginTop: 4, marginBottom: 0 }}>
          {lang === "hi"
            ? "सही फसल चुनें – मौसम, क्षेत्र और मिट्टी के आधार पर फ़िल्टर करें"
            : "Choose the right crop – filter by season, region, and soil type"}
        </p>
      </div>

      <div className="container">
        {/* ── Season Quick-Filter Chips ── */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--gray-500)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Quick Season Filter
          </p>
          <div className="chips">
            {SEASONS.map((s) => (
              <button
                key={s.value}
                className={`chip${season === s.value ? " chip-active" : ""}`}
                onClick={() => setSeason(s.value)}
                style={{
                  background: season === s.value ? "var(--primary)" : "var(--gray-100)",
                  color: season === s.value ? "#fff" : "var(--gray-700)",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: season === s.value ? 700 : 500,
                  padding: "6px 14px",
                  borderRadius: 20,
                  fontSize: "0.85rem",
                  transition: "all 0.15s",
                }}
              >
                {s.emoji} {lang === "hi" ? s.labelHi : s.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Dropdown Filters ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 24 }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">🗓 Season</label>
            <select className="select" value={season} onChange={(e) => setSeason(e.target.value)}>
              {SEASONS.map((s) => (
                <option key={s.value} value={s.value}>{s.emoji} {lang === "hi" ? s.labelHi : s.label}</option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">🗺 Region</label>
            <select className="select" value={region} onChange={(e) => setRegion(e.target.value)}>
              {REGIONS.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">🌍 Soil Type</label>
            <select className="select" value={soilType} onChange={(e) => setSoilType(e.target.value)}>
              {SOIL_TYPES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Result Count ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <p style={{ margin: 0, color: "var(--gray-600)", fontSize: "0.9rem" }}>
            Showing <strong style={{ color: "var(--primary)" }}>{filtered.length}</strong> of {cropData.length} crops
          </p>
          {(season !== "all" || region !== "all" || soilType !== "all") && (
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => { setSeason("all"); setRegion("all"); setSoilType("all"); }}
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* ── Crop Grid ── */}
        {filtered.length > 0 ? (
          <div className="grid-3">
            {filtered.map((crop) => (
              <CropCard
                key={crop.id}
                crop={crop}
                lang={lang}
                onExpand={setSelected}
              />
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
            <span style={{ fontSize: 48 }}>🌾</span>
            <p style={{ marginTop: 12, fontSize: "1.05rem", fontWeight: 600 }}>No crops found</p>
            <p style={{ fontSize: "0.9rem" }}>Try changing your filter selections</p>
          </div>
        )}
      </div>

      {/* ── Detail Modal ── */}
      {selected && (
        <CropModal
          crop={selected}
          lang={lang}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
