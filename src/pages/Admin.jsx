/**
 * Admin.jsx
 * Admin Panel – requires admin role (redirects to / if not admin)
 * Tabs: Overview | Manage Schemes | Manage Crops | Manage Prices
 * Full CRUD local-state management with modal forms for each entity.
 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users, FileText, Leaf, BarChart2,
  PlusCircle, Edit2, Trash2, X, Save,
  Shield, TrendingUp, CheckCircle, AlertCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LangContext";
import { govSchemes, cropData, marketPrices } from "../data/mockData";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const TABS = ["Overview", "Manage Schemes", "Manage Crops", "Manage Prices"];

const CATEGORY_OPTIONS = ["subsidy", "insurance", "loan", "pension", "equipment", "training"];
const SEASON_OPTIONS = ["kharif", "rabi", "zaid"];

const ACTIVITY_LOG = [
  { id: 1, icon: "👤", action: "New farmer registered: Ramesh Kumar (Haryana)", time: "2 min ago", type: "success" },
  { id: 2, icon: "📝", action: "Scheme 'PM-KISAN' updated by Admin", time: "15 min ago", type: "info" },
  { id: 3, icon: "💬", action: "Community question flagged for review", time: "1 hr ago", type: "warning" },
  { id: 4, icon: "📊", action: "Market prices updated for Oct 17, 2026", time: "2 hr ago", type: "success" },
  { id: 5, icon: "🌾", action: "New crop entry added: Tomato advisory updated", time: "3 hr ago", type: "info" },
  { id: 6, icon: "⚠️", action: "Failed login attempt detected: 3 tries", time: "5 hr ago", type: "error" },
];

// ─── Shared Sub-components ────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color, iconColor }) {
  return (
    <div className="card" style={{ flex: 1, minWidth: 0, borderTop: `4px solid ${color}` }}>
      <div className="card-body" style={{ padding: "1.1rem 1.2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: "0.72rem", color: "var(--gray-500)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
            <div style={{ fontSize: "1.7rem", fontWeight: 800, color: "var(--gray-900)", marginTop: "0.3rem" }}>{value}</div>
          </div>
          <div style={{ background: color + "18", borderRadius: "10px", padding: "0.6rem" }}>
            <Icon size={22} color={iconColor || color} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ModalWrapper({ title, onClose, children }) {
  return (
    <div
      className="modal-overlay"
      style={{ zIndex: 1000 }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="modal"
        style={{ maxWidth: 560, width: "95%", maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column" }}
      >
        <div className="modal-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.1rem 1.4rem", borderBottom: "1px solid var(--gray-200)", flexShrink: 0 }}>
          <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700 }}>{title}</h3>
          <button className="modal-close" onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gray-500)", padding: "0.25rem" }}>
            <X size={20} />
          </button>
        </div>
        <div
          className="modal-body"
          style={{ padding: "1.25rem 1.4rem", overflowY: "auto", flex: 1 }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <div className="form-group" style={{ marginBottom: "0.9rem" }}>
      <label className="form-label" style={{ fontSize: "0.82rem", fontWeight: 600, marginBottom: "0.3rem", display: "block" }}>{label}</label>
      {children}
    </div>
  );
}

function ActionBtns({ onEdit, onDelete }) {
  return (
    <div style={{ display: "flex", gap: "0.4rem" }}>
      <button
        onClick={onEdit}
        style={{
          padding: "0.3rem 0.7rem", borderRadius: "6px", border: "1px solid var(--green-300)",
          background: "var(--green-50)", color: "var(--green-700)", cursor: "pointer",
          fontSize: "0.78rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.25rem",
        }}
      >
        <Edit2 size={12} /> Edit
      </button>
      <button
        onClick={onDelete}
        style={{
          padding: "0.3rem 0.7rem", borderRadius: "6px", border: "1px solid #fca5a5",
          background: "#fef2f2", color: "#dc2626", cursor: "pointer",
          fontSize: "0.78rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.25rem",
        }}
      >
        <Trash2 size={12} /> Delete
      </button>
    </div>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────
function OverviewTab() {
  return (
    <div>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
        <StatCard icon={Users}     label="Total Users"   value="1,247" color="#6366f1" />
        <StatCard icon={FileText}  label="Schemes"       value="8"     color="#10b981" />
        <StatCard icon={Leaf}      label="Crop Entries"  value="8"     color="#f59e0b" />
        <StatCard icon={BarChart2} label="Price Entries" value="15"    color="#ec4899" />
      </div>

      <div className="card">
        <div className="card-header" style={{ padding: "1rem 1.25rem 0.6rem" }}>
          <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700 }}>🕐 Recent Activity Log</h3>
        </div>
        <div className="card-body" style={{ padding: "0.5rem 1.25rem 1.25rem" }}>
          {ACTIVITY_LOG.map(item => {
            const typeColor = { success: "#10b981", info: "#6366f1", warning: "#f59e0b", error: "#ef4444" };
            return (
              <div
                key={item.id}
                style={{
                  display: "flex", alignItems: "flex-start", gap: "0.9rem",
                  padding: "0.75rem 0",
                  borderBottom: "1px solid var(--gray-100)",
                }}
              >
                <div
                  style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: typeColor[item.type] + "18",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1rem", flexShrink: 0,
                  }}
                >
                  {item.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "0.85rem", color: "var(--gray-800)", fontWeight: 500 }}>{item.action}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--gray-400)", marginTop: "0.15rem" }}>{item.time}</div>
                </div>
                <span
                  className={`badge badge-${item.type === "success" ? "green" : item.type === "warning" ? "yellow" : item.type === "error" ? "red" : "blue"}`}
                  style={{ flexShrink: 0, alignSelf: "center", textTransform: "capitalize" }}
                >
                  {item.type}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Manage Schemes Tab ───────────────────────────────────────────────────────
const BLANK_SCHEME = { name: "", category: "subsidy", description: "", eligibility: "", benefit: "", link: "", deadline: "Ongoing", central: true, color: "green" };

function ManageSchemesTab() {
  const [schemes, setSchemes] = useState([...govSchemes]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // null = new, else scheme obj
  const [form, setForm] = useState(BLANK_SCHEME);

  const openAdd = () => { setEditing(null); setForm(BLANK_SCHEME); setModalOpen(true); };
  const openEdit = s => { setEditing(s); setForm({ ...s }); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditing(null); };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (editing) {
      setSchemes(prev => prev.map(s => s.id === editing.id ? { ...form, id: editing.id } : s));
    } else {
      setSchemes(prev => [...prev, { ...form, id: Date.now() }]);
    }
    closeModal();
  };

  const handleDelete = id => {
    if (window.confirm("Delete this scheme?")) setSchemes(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700 }}>Government Schemes ({schemes.length})</h3>
        <button className="btn btn-primary btn-sm" onClick={openAdd} style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
          <PlusCircle size={15} /> Add New Scheme
        </button>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.84rem" }}>
            <thead>
              <tr style={{ background: "var(--gray-50)", borderBottom: "1px solid var(--gray-200)" }}>
                {["#", "Name", "Category", "Benefit", "Deadline", "Actions"].map(h => (
                  <th key={h} style={{ padding: "0.7rem 0.9rem", textAlign: "left", fontWeight: 600, color: "var(--gray-600)", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {schemes.map((s, i) => (
                <tr key={s.id} style={{ borderBottom: "1px solid var(--gray-100)", background: i % 2 === 0 ? "#fff" : "var(--gray-50)" }}>
                  <td style={{ padding: "0.7rem 0.9rem", color: "var(--gray-400)", fontSize: "0.78rem" }}>{i + 1}</td>
                  <td style={{ padding: "0.7rem 0.9rem", fontWeight: 600, color: "var(--gray-800)" }}>{s.name}</td>
                  <td style={{ padding: "0.7rem 0.9rem" }}>
                    <span className="badge badge-green" style={{ textTransform: "capitalize" }}>{s.category}</span>
                  </td>
                  <td style={{ padding: "0.7rem 0.9rem", color: "var(--gray-600)", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.benefit}</td>
                  <td style={{ padding: "0.7rem 0.9rem", color: "var(--gray-600)" }}>{s.deadline}</td>
                  <td style={{ padding: "0.7rem 0.9rem" }}>
                    <ActionBtns onEdit={() => openEdit(s)} onDelete={() => handleDelete(s.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <ModalWrapper title={editing ? "Edit Scheme" : "Add New Scheme"} onClose={closeModal}>
          <form onSubmit={handleSubmit}>
            <FormField label="Scheme Name *">
              <input className="input" name="name" value={form.name} onChange={handleChange} required placeholder="e.g. PM-KISAN Samman Nidhi" />
            </FormField>
            <FormField label="Category *">
              <select className="select" name="category" value={form.category} onChange={handleChange}>
                {CATEGORY_OPTIONS.map(c => <option key={c} value={c} style={{ textTransform: "capitalize" }}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </FormField>
            <FormField label="Description *">
              <textarea className="textarea" name="description" value={form.description} onChange={handleChange} required rows={3} placeholder="Brief description of the scheme..." />
            </FormField>
            <FormField label="Eligibility *">
              <textarea className="textarea" name="eligibility" value={form.eligibility} onChange={handleChange} required rows={2} placeholder="Who is eligible..." />
            </FormField>
            <FormField label="Benefit *">
              <input className="input" name="benefit" value={form.benefit} onChange={handleChange} required placeholder="e.g. ₹6,000/year" />
            </FormField>
            <FormField label="Official Link">
              <input className="input" name="link" value={form.link} onChange={handleChange} placeholder="https://..." type="url" />
            </FormField>
            <FormField label="Deadline">
              <input className="input" name="deadline" value={form.deadline} onChange={handleChange} placeholder="e.g. Ongoing, July 31" />
            </FormField>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "1rem" }}>
              <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
              <button type="submit" className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                <Save size={15} /> {editing ? "Update Scheme" : "Add Scheme"}
              </button>
            </div>
          </form>
        </ModalWrapper>
      )}
    </div>
  );
}

// ─── Manage Crops Tab ─────────────────────────────────────────────────────────
const BLANK_CROP = { name: "", nameHi: "", season: "kharif", region: [], soilTypes: [], growingDays: "", waterRequired: "", yieldPerAcre: "", msp: "", icon: "🌾" };

function ManageCropsTab() {
  const [crops, setCrops] = useState([...cropData]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(BLANK_CROP);

  const openAdd = () => { setEditing(null); setForm(BLANK_CROP); setModalOpen(true); };
  const openEdit = c => { setEditing(c); setForm({ ...c, region: Array.isArray(c.region) ? c.region.join(", ") : c.region, soilTypes: Array.isArray(c.soilTypes) ? c.soilTypes.join(", ") : c.soilTypes }); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditing(null); };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const normalized = {
      ...form,
      region: typeof form.region === "string" ? form.region.split(",").map(r => r.trim()).filter(Boolean) : form.region,
      soilTypes: typeof form.soilTypes === "string" ? form.soilTypes.split(",").map(s => s.trim()).filter(Boolean) : form.soilTypes,
    };
    if (editing) {
      setCrops(prev => prev.map(c => c.id === editing.id ? { ...normalized, id: editing.id } : c));
    } else {
      setCrops(prev => [...prev, { ...normalized, id: Date.now(), tips: [], color: "#10b981" }]);
    }
    closeModal();
  };

  const handleDelete = id => {
    if (window.confirm("Delete this crop entry?")) setCrops(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700 }}>Crop Advisory Entries ({crops.length})</h3>
        <button className="btn btn-primary btn-sm" onClick={openAdd} style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
          <PlusCircle size={15} /> Add New Crop
        </button>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.84rem" }}>
            <thead>
              <tr style={{ background: "var(--gray-50)", borderBottom: "1px solid var(--gray-200)" }}>
                {["#", "Icon", "Name", "Season", "Growing Days", "Water Required", "Yield/Acre", "MSP", "Actions"].map(h => (
                  <th key={h} style={{ padding: "0.7rem 0.9rem", textAlign: "left", fontWeight: 600, color: "var(--gray-600)", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {crops.map((c, i) => (
                <tr key={c.id} style={{ borderBottom: "1px solid var(--gray-100)", background: i % 2 === 0 ? "#fff" : "var(--gray-50)" }}>
                  <td style={{ padding: "0.7rem 0.9rem", color: "var(--gray-400)", fontSize: "0.78rem" }}>{i + 1}</td>
                  <td style={{ padding: "0.7rem 0.9rem", fontSize: "1.3rem" }}>{c.icon}</td>
                  <td style={{ padding: "0.7rem 0.9rem", fontWeight: 600, color: "var(--gray-800)" }}>{c.name}</td>
                  <td style={{ padding: "0.7rem 0.9rem" }}>
                    <span className={`badge ${c.season === "rabi" ? "badge-blue" : c.season === "zaid" ? "badge-yellow" : "badge-green"}`} style={{ textTransform: "capitalize" }}>
                      {c.season}
                    </span>
                  </td>
                  <td style={{ padding: "0.7rem 0.9rem", color: "var(--gray-600)" }}>{c.growingDays}</td>
                  <td style={{ padding: "0.7rem 0.9rem", color: "var(--gray-600)" }}>{c.waterRequired}</td>
                  <td style={{ padding: "0.7rem 0.9rem", color: "var(--gray-600)" }}>{c.yieldPerAcre}</td>
                  <td style={{ padding: "0.7rem 0.9rem", color: "var(--gray-600)" }}>{c.msp}</td>
                  <td style={{ padding: "0.7rem 0.9rem" }}>
                    <ActionBtns onEdit={() => openEdit(c)} onDelete={() => handleDelete(c.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <ModalWrapper title={editing ? "Edit Crop Entry" : "Add New Crop"} onClose={closeModal}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 0.75rem" }}>
              <FormField label="Crop Name (English) *">
                <input className="input" name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Wheat" />
              </FormField>
              <FormField label="Crop Name (Hindi)">
                <input className="input" name="nameHi" value={form.nameHi} onChange={handleChange} placeholder="e.g. गेहूं" />
              </FormField>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 0.75rem" }}>
              <FormField label="Season *">
                <select className="select" name="season" value={form.season} onChange={handleChange}>
                  {SEASON_OPTIONS.map(s => <option key={s} value={s} style={{ textTransform: "capitalize" }}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </FormField>
              <FormField label="Icon (emoji)">
                <input className="input" name="icon" value={form.icon} onChange={handleChange} placeholder="🌾" />
              </FormField>
            </div>
            <FormField label="Region(s) (comma-separated)">
              <input className="input" name="region" value={form.region} onChange={handleChange} placeholder="e.g. north, central, south" />
            </FormField>
            <FormField label="Soil Types (comma-separated)">
              <input className="input" name="soilTypes" value={form.soilTypes} onChange={handleChange} placeholder="e.g. loam, alluvial, clay" />
            </FormField>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 0.75rem" }}>
              <FormField label="Growing Days">
                <input className="input" name="growingDays" value={form.growingDays} onChange={handleChange} placeholder="e.g. 100–150 days" />
              </FormField>
              <FormField label="Water Required">
                <input className="input" name="waterRequired" value={form.waterRequired} onChange={handleChange} placeholder="e.g. 450–650 mm" />
              </FormField>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 0.75rem" }}>
              <FormField label="Yield Per Acre">
                <input className="input" name="yieldPerAcre" value={form.yieldPerAcre} onChange={handleChange} placeholder="e.g. 15–25 quintals" />
              </FormField>
              <FormField label="MSP">
                <input className="input" name="msp" value={form.msp} onChange={handleChange} placeholder="e.g. ₹2,275/quintal" />
              </FormField>
            </div>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "1rem" }}>
              <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
              <button type="submit" className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                <Save size={15} /> {editing ? "Update Crop" : "Add Crop"}
              </button>
            </div>
          </form>
        </ModalWrapper>
      )}
    </div>
  );
}

// ─── Manage Prices Tab ────────────────────────────────────────────────────────
const BLANK_PRICE = { crop: "", cropHi: "", market: "", state: "", minPrice: "", maxPrice: "", modalPrice: "", unit: "quintal", date: new Date().toISOString().split("T")[0] };

function ManagePricesTab() {
  const [prices, setPrices] = useState([...marketPrices]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(BLANK_PRICE);

  const openAdd = () => { setEditing(null); setForm(BLANK_PRICE); setModalOpen(true); };
  const openEdit = p => { setEditing(p); setForm({ ...p }); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditing(null); };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const normalized = {
      ...form,
      minPrice: Number(form.minPrice),
      maxPrice: Number(form.maxPrice),
      modalPrice: Number(form.modalPrice),
    };
    if (editing) {
      setPrices(prev => prev.map(p => p.id === editing.id ? { ...normalized, id: editing.id } : p));
    } else {
      setPrices(prev => [...prev, { ...normalized, id: Date.now() }]);
    }
    closeModal();
  };

  const handleDelete = id => {
    if (window.confirm("Delete this price entry?")) setPrices(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700 }}>Market Price Entries ({prices.length})</h3>
        <button className="btn btn-primary btn-sm" onClick={openAdd} style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
          <PlusCircle size={15} /> Add New Price
        </button>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.84rem" }}>
            <thead>
              <tr style={{ background: "var(--gray-50)", borderBottom: "1px solid var(--gray-200)" }}>
                {["#", "Crop", "Market", "State", "Min ₹", "Max ₹", "Modal ₹", "Date", "Actions"].map(h => (
                  <th key={h} style={{ padding: "0.7rem 0.9rem", textAlign: "left", fontWeight: 600, color: "var(--gray-600)", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {prices.map((p, i) => (
                <tr key={p.id} style={{ borderBottom: "1px solid var(--gray-100)", background: i % 2 === 0 ? "#fff" : "var(--gray-50)" }}>
                  <td style={{ padding: "0.7rem 0.9rem", color: "var(--gray-400)", fontSize: "0.78rem" }}>{i + 1}</td>
                  <td style={{ padding: "0.7rem 0.9rem", fontWeight: 600, color: "var(--gray-800)" }}>{p.crop}</td>
                  <td style={{ padding: "0.7rem 0.9rem", color: "var(--gray-600)" }}>{p.market}</td>
                  <td style={{ padding: "0.7rem 0.9rem", color: "var(--gray-600)" }}>{p.state}</td>
                  <td style={{ padding: "0.7rem 0.9rem", color: "var(--gray-700)" }}>₹{Number(p.minPrice).toLocaleString("en-IN")}</td>
                  <td style={{ padding: "0.7rem 0.9rem", color: "var(--gray-700)" }}>₹{Number(p.maxPrice).toLocaleString("en-IN")}</td>
                  <td style={{ padding: "0.7rem 0.9rem" }}>
                    <span style={{ fontWeight: 700, color: "var(--green-700)" }}>₹{Number(p.modalPrice).toLocaleString("en-IN")}</span>
                  </td>
                  <td style={{ padding: "0.7rem 0.9rem", color: "var(--gray-500)", fontSize: "0.78rem" }}>{p.date}</td>
                  <td style={{ padding: "0.7rem 0.9rem" }}>
                    <ActionBtns onEdit={() => openEdit(p)} onDelete={() => handleDelete(p.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <ModalWrapper title={editing ? "Edit Price Entry" : "Add New Price Entry"} onClose={closeModal}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 0.75rem" }}>
              <FormField label="Crop Name *">
                <input className="input" name="crop" value={form.crop} onChange={handleChange} required placeholder="e.g. Wheat" />
              </FormField>
              <FormField label="Crop Name (Hindi)">
                <input className="input" name="cropHi" value={form.cropHi} onChange={handleChange} placeholder="e.g. गेहूं" />
              </FormField>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 0.75rem" }}>
              <FormField label="Market Name *">
                <input className="input" name="market" value={form.market} onChange={handleChange} required placeholder="e.g. Karnal" />
              </FormField>
              <FormField label="State *">
                <input className="input" name="state" value={form.state} onChange={handleChange} required placeholder="e.g. Haryana" />
              </FormField>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 0.65rem" }}>
              <FormField label="Min Price (₹) *">
                <input className="input" name="minPrice" value={form.minPrice} onChange={handleChange} required type="number" min="0" placeholder="2050" />
              </FormField>
              <FormField label="Max Price (₹) *">
                <input className="input" name="maxPrice" value={form.maxPrice} onChange={handleChange} required type="number" min="0" placeholder="2250" />
              </FormField>
              <FormField label="Modal Price (₹) *">
                <input className="input" name="modalPrice" value={form.modalPrice} onChange={handleChange} required type="number" min="0" placeholder="2150" />
              </FormField>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 0.75rem" }}>
              <FormField label="Unit">
                <select className="select" name="unit" value={form.unit} onChange={handleChange}>
                  <option value="quintal">Quintal</option>
                  <option value="kg">Kg</option>
                  <option value="ton">Ton</option>
                </select>
              </FormField>
              <FormField label="Date *">
                <input className="input" name="date" value={form.date} onChange={handleChange} required type="date" />
              </FormField>
            </div>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "1rem" }}>
              <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
              <button type="submit" className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                <Save size={15} /> {editing ? "Update Price" : "Add Price"}
              </button>
            </div>
          </form>
        </ModalWrapper>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Admin() {
  const { user, isAdmin } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (!isAdmin) navigate("/");
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;

  const tabContent = [
    <OverviewTab />,
    <ManageSchemesTab />,
    <ManageCropsTab />,
    <ManagePricesTab />,
  ];

  return (
    <div className="page-content" style={{ background: "var(--gray-50)", minHeight: "100vh" }}>
      {/* ── Header ── */}
      <div style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)", color: "#fff", padding: "2rem 0 3rem" }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <Shield size={22} style={{ color: "#a5b4fc" }} />
            <span style={{ fontSize: "0.85rem", color: "#a5b4fc", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em" }}>Admin Panel</span>
          </div>
          <h1 style={{ fontSize: "clamp(1.4rem, 4vw, 2rem)", fontWeight: 800, margin: "0 0 0.3rem" }}>
            Kisan Seva Administration
          </h1>
          <p style={{ opacity: 0.7, margin: 0, fontSize: "0.9rem" }}>
            Manage schemes, crops, prices and monitor platform activity
          </p>
        </div>
      </div>

      <div className="container" style={{ position: "relative", zIndex: 1, marginTop: "-1rem" }}>
        {/* Admin badge */}
        <div
          className="alert alert-info"
          style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.25rem", fontSize: "0.84rem" }}
        >
          <Shield size={16} />
          <span>Logged in as <strong>{user?.name}</strong> · Admin access granted</span>
        </div>

        {/* ── Tabs ── */}
        <div className="tabs" style={{ marginBottom: "1.25rem" }}>
          {TABS.map((tab, i) => (
            <button
              key={tab}
              className={`tab-btn${activeTab === i ? " active" : ""}`}
              onClick={() => setActiveTab(i)}
              style={{ fontWeight: activeTab === i ? 700 : 500 }}
            >
              {["📊", "🏛️", "🌾", "📈"][i]} {tab}
            </button>
          ))}
        </div>

        {/* ── Tab Content ── */}
        <div style={{ paddingBottom: "2rem" }}>
          {tabContent[activeTab]}
        </div>
      </div>
    </div>
  );
}
