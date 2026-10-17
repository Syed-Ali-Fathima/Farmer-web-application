/**
 * Soil.jsx
 * Soil & Fertilizer Helper – calculates N-P-K requirements based on
 * soil type, crop type, and land area; shows fertilizer equivalents and tips.
 */
import { useState } from "react";
import { FlaskConical, Leaf, Zap, Printer, Share2, ChevronDown, ChevronUp, Info } from "lucide-react";
import { fertilizerData } from "../data/mockData";
import { useLang } from "../context/LangContext";

// ─── Nutrient info ────────────────────────────────────────────────────────────
const NUTRIENT_INFO = [
  {
    key: "N",
    label: "Nitrogen (N)",
    labelHi: "नाइट्रोजन (N)",
    role: "Drives vegetative growth – leaves, stems, and overall plant green color (chlorophyll). Deficiency causes yellowing of older leaves.",
    roleHi: "वनस्पति वृद्धि को बढ़ावा देता है – पत्तियां, तने और हरा रंग। कमी से पुरानी पत्तियां पीली पड़ती हैं।",
    icon: <Leaf size={18} />,
    color: "#3b82f6",
    bg: "#eff6ff",
    border: "#bfdbfe",
  },
  {
    key: "P",
    label: "Phosphorus (P)",
    labelHi: "फॉस्फोरस (P)",
    role: "Supports root development, flowering, seed formation and energy transfer within plant. Deficiency causes purple/red tints on leaves.",
    roleHi: "जड़ विकास, फूल, बीज और ऊर्जा स्थानांतरण। कमी से पत्तियों पर बैंगनी/लाल रंग आता है।",
    icon: <FlaskConical size={18} />,
    color: "#f97316",
    bg: "#fff7ed",
    border: "#fed7aa",
  },
  {
    key: "K",
    label: "Potassium (K)",
    labelHi: "पोटेशियम (K)",
    role: "Regulates water use, improves disease resistance, grain/fruit quality, and winter hardiness. Deficiency causes brown leaf edges.",
    roleHi: "जल उपयोग, रोग प्रतिरोध, दाने/फल की गुणवत्ता। कमी से पत्तियों के किनारे भूरे पड़ते हैं।",
    icon: <Zap size={18} />,
    color: "#10b981",
    bg: "#f0fdf4",
    border: "#bbf7d0",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function Soil() {
  const { lang, t } = useLang();

  const [soilType, setSoilType] = useState("");
  const [cropType, setCropType] = useState("");
  const [area, setArea] = useState(1);
  const [result, setResult] = useState(null);
  const [tipsOpen, setTipsOpen] = useState(true);
  const [infoOpen, setInfoOpen] = useState(false);

  // ── Calculate ──────────────────────────────────────────────────────────────
  const handleCalculate = () => {
    if (!soilType || !cropType) return;
    const base = fertilizerData.recommendations[cropType]?.[soilType];
    if (!base) return;
    const [n, p, k] = base.map((v) => +(v * area).toFixed(1));
    setResult({
      N: n,
      P: p,
      K: k,
      urea: +(n * 2.17).toFixed(1),
      dap: +(p * 2.17).toFixed(1),
      mop: +(k * 1.67).toFixed(1),
      tips: fertilizerData.tips[cropType] || [],
      crop: cropType,
      soil: soilType,
      area,
    });
    setTipsOpen(true);
  };

  const handlePrint = () => window.print();

  const handleShare = async () => {
    if (!result) return;
    const text =
      `Kisan Seva – NPK Recommendation\nCrop: ${cropType} | Soil: ${soilType} | Area: ${area} acre(s)\n` +
      `N: ${result.N} kg | P: ${result.P} kg | K: ${result.K} kg\n` +
      `Urea: ${result.urea} kg | DAP: ${result.dap} kg | MOP: ${result.mop} kg`;
    if (navigator.share) {
      await navigator.share({ title: "Fertilizer Recommendation", text });
    } else {
      await navigator.clipboard.writeText(text);
      alert("Summary copied to clipboard!");
    }
  };

  const soilLabel = (v) => {
    const s = fertilizerData.soilTypes.find((x) => x.value === v);
    return s ? (lang === "hi" ? s.labelHi : s.label) : v;
  };

  const cropLabel = (v) => {
    const c = fertilizerData.cropTypes.find((x) => x.value === v);
    return c ? (lang === "hi" ? c.labelHi : c.label) : v;
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="page-content" style={{ maxWidth: 860, margin: "0 auto" }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 24 }}>
        <h1 style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 26, fontWeight: 700, color: "var(--green-800)" }}>
          <FlaskConical size={28} color="var(--primary)" />
          {lang === "hi" ? "मिट्टी और खाद सहायक" : "Soil & Fertilizer Helper"}
        </h1>
        <p style={{ color: "var(--gray-600)", marginTop: 4 }}>
          {lang === "hi"
            ? "अपनी मिट्टी और फसल के अनुसार उर्वरक की मात्रा जानें"
            : "Get accurate NPK fertilizer recommendations based on your soil and crop"}
        </p>
      </div>

      {/* Calculator Form */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <h2 style={{ fontSize: 17, fontWeight: 600, color: "var(--green-800)" }}>
            {lang === "hi" ? "📋 अपनी जानकारी दर्ज करें" : "📋 Enter Your Field Details"}
          </h2>
        </div>
        <div className="card-body">
          <div className="grid-3" style={{ gap: 16, marginBottom: 20 }}>
            {/* Soil Type */}
            <div className="form-group">
              <label className="form-label">
                {lang === "hi" ? "मिट्टी का प्रकार" : "Soil Type"}
              </label>
              <select
                className="select"
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
              >
                <option value="">{lang === "hi" ? "-- चुनें --" : "-- Select --"}</option>
                {fertilizerData.soilTypes.map((s) => (
                  <option key={s.value} value={s.value}>
                    {lang === "hi" ? s.labelHi : s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Crop Type */}
            <div className="form-group">
              <label className="form-label">
                {lang === "hi" ? "फसल का प्रकार" : "Crop Type"}
              </label>
              <select
                className="select"
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
              >
                <option value="">{lang === "hi" ? "-- चुनें --" : "-- Select --"}</option>
                {fertilizerData.cropTypes.map((c) => (
                  <option key={c.value} value={c.value}>
                    {lang === "hi" ? c.labelHi : c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Land Area */}
            <div className="form-group">
              <label className="form-label">
                {lang === "hi" ? "भूमि क्षेत्र (एकड़)" : "Land Area (Acres)"}
              </label>
              <input
                type="number"
                className="input"
                min={0.1}
                step={0.1}
                value={area}
                onChange={(e) => setArea(parseFloat(e.target.value) || 1)}
              />
            </div>
          </div>

          <button
            className="btn btn-primary btn-lg"
            onClick={handleCalculate}
            disabled={!soilType || !cropType}
            style={{ minWidth: 180 }}
          >
            {lang === "hi" ? "🔢 गणना करें" : "🔢 Calculate"}
          </button>

          {(!soilType || !cropType) && (
            <p style={{ marginTop: 8, fontSize: 13, color: "var(--gray-500)" }}>
              {lang === "hi" ? "कृपया मिट्टी और फसल चुनें।" : "Please select both soil type and crop type."}
            </p>
          )}
        </div>
      </div>

      {/* Results */}
      {result && (
        <div style={{ animation: "fadeIn 0.3s ease" }}>
          {/* Context bar */}
          <div style={{
            background: "var(--green-50)",
            border: "1px solid var(--green-200)",
            borderRadius: 10,
            padding: "10px 16px",
            marginBottom: 16,
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <span style={{ fontSize: 14, color: "var(--green-800)", fontWeight: 500 }}>
              📍 {cropLabel(result.crop)} &nbsp;·&nbsp; {soilLabel(result.soil)} &nbsp;·&nbsp; {result.area} {lang === "hi" ? "एकड़" : "acre(s)"}
            </span>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-secondary btn-sm" onClick={handlePrint}>
                <Printer size={14} /> {lang === "hi" ? "प्रिंट" : "Print"}
              </button>
              <button className="btn btn-secondary btn-sm" onClick={handleShare}>
                <Share2 size={14} /> {lang === "hi" ? "शेयर" : "Share"}
              </button>
            </div>
          </div>

          {/* NPK Cards */}
          <div className="grid-3" style={{ gap: 16, marginBottom: 20 }}>
            {NUTRIENT_INFO.map((n) => (
              <div key={n.key} style={{
                background: n.bg,
                border: `2px solid ${n.border}`,
                borderRadius: 12,
                padding: "20px 16px",
                textAlign: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: "50%",
                  background: n.color, color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 10px", fontWeight: 700, fontSize: 18,
                }}>
                  {n.key}
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: n.color }}>
                  {result[n.key]} <span style={{ fontSize: 14 }}>kg</span>
                </div>
                <div style={{ fontSize: 13, color: "var(--gray-600)", marginTop: 4 }}>
                  {lang === "hi" ? n.labelHi : n.label}
                </div>
                <div style={{ fontSize: 11, color: "var(--gray-400)", marginTop: 2 }}>
                  {lang === "hi" ? `${n.key === "N" ? result.area : result.area} एकड़ के लिए` : `for ${result.area} acre(s)`}
                </div>
              </div>
            ))}
          </div>

          {/* Fertilizer Equivalents */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-header">
              <h3 style={{ fontSize: 15, fontWeight: 600 }}>
                {lang === "hi" ? "⚗️ उर्वरक समतुल्य (कितना खरीदें)" : "⚗️ Fertilizer Equivalents (How Much to Buy)"}
              </h3>
            </div>
            <div className="card-body">
              <div className="grid-3" style={{ gap: 12 }}>
                {[
                  {
                    name: lang === "hi" ? "यूरिया (Urea)" : "Urea",
                    sub: lang === "hi" ? "नाइट्रोजन स्रोत" : "Nitrogen source (46% N)",
                    value: result.urea,
                    color: "#3b82f6",
                    bg: "#eff6ff",
                  },
                  {
                    name: "DAP",
                    sub: lang === "hi" ? "फॉस्फोरस स्रोत" : "Phosphorus source (18% N, 46% P₂O₅)",
                    value: result.dap,
                    color: "#f97316",
                    bg: "#fff7ed",
                  },
                  {
                    name: "MOP",
                    sub: lang === "hi" ? "पोटेशियम स्रोत" : "Potassium source (60% K₂O)",
                    value: result.mop,
                    color: "#10b981",
                    bg: "#f0fdf4",
                  },
                ].map((f) => (
                  <div key={f.name} style={{
                    background: f.bg,
                    borderRadius: 10,
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                  }}>
                    <span style={{ fontWeight: 700, fontSize: 16, color: f.color }}>{f.name}</span>
                    <span style={{ fontSize: 11, color: "var(--gray-500)" }}>{f.sub}</span>
                    <span style={{ fontWeight: 800, fontSize: 22, color: "var(--gray-800)" }}>
                      {f.value} <span style={{ fontSize: 13, fontWeight: 400 }}>kg</span>
                    </span>
                  </div>
                ))}
              </div>
              <p style={{ marginTop: 12, fontSize: 12, color: "var(--gray-500)" }}>
                <Info size={12} style={{ verticalAlign: "middle" }} />{" "}
                {lang === "hi"
                  ? "रूपांतरण: यूरिया = N×2.17 | DAP = P×2.17 | MOP = K×1.67"
                  : "Conversion: Urea = N×2.17 | DAP = P×2.17 | MOP = K×1.67"}
              </p>
            </div>
          </div>

          {/* Application Tips */}
          {result.tips.length > 0 && (
            <div className="card" style={{ marginBottom: 20 }}>
              <button
                onClick={() => setTipsOpen(!tipsOpen)}
                style={{
                  width: "100%", display: "flex", justifyContent: "space-between",
                  alignItems: "center", padding: "14px 20px",
                  background: "none", border: "none", cursor: "pointer",
                  fontWeight: 600, fontSize: 15, color: "var(--green-800)",
                }}
              >
                <span>🌱 {lang === "hi" ? "उपयोग के सुझाव" : "Application Tips"}</span>
                {tipsOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {tipsOpen && (
                <div className="card-body" style={{ paddingTop: 0 }}>
                  <ul style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 10 }}>
                    {result.tips.map((tip, i) => (
                      <li key={i} style={{ color: "var(--gray-700)", lineHeight: 1.6, fontSize: 14 }}>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Nutrient Info Boxes */}
      <div className="card">
        <button
          onClick={() => setInfoOpen(!infoOpen)}
          style={{
            width: "100%", display: "flex", justifyContent: "space-between",
            alignItems: "center", padding: "14px 20px",
            background: "none", border: "none", cursor: "pointer",
            fontWeight: 600, fontSize: 15, color: "var(--gray-700)",
          }}
        >
          <span><Info size={16} style={{ verticalAlign: "middle", marginRight: 6 }} />
            {lang === "hi" ? "NPK के बारे में जानें" : "Learn About N, P & K Nutrients"}
          </span>
          {infoOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {infoOpen && (
          <div className="card-body" style={{ paddingTop: 0 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {NUTRIENT_INFO.map((n) => (
                <div key={n.key} style={{
                  background: n.bg,
                  border: `1px solid ${n.border}`,
                  borderRadius: 10,
                  padding: "14px 16px",
                  display: "flex",
                  gap: 14,
                  alignItems: "flex-start",
                }}>
                  <div style={{
                    width: 36, height: 36, minWidth: 36, borderRadius: "50%",
                    background: n.color, color: "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 700, fontSize: 15,
                  }}>{n.key}</div>
                  <div>
                    <div style={{ fontWeight: 600, color: n.color, marginBottom: 4 }}>
                      {lang === "hi" ? n.labelHi : n.label}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--gray-700)", lineHeight: 1.6 }}>
                      {lang === "hi" ? n.roleHi : n.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
