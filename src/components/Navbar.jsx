/**
 * Navbar.jsx – Top navigation with language switcher & auth state
 */
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LangContext";
import { languages } from "../i18n/translations";
import {
  Sun, CloudRain, ShoppingCart, FileText, Leaf, Bug,
  Users, Menu, X, Globe, LogOut, User, Shield, Home,
} from "lucide-react";

const navItems = (t) => [
  { to: "/", label: t("home"), icon: <Home size={18} /> },
  { to: "/weather", label: t("weather"), icon: <Sun size={18} /> },
  { to: "/crops", label: t("crops"), icon: <Leaf size={18} /> },
  { to: "/market", label: t("market"), icon: <ShoppingCart size={18} /> },
  { to: "/schemes", label: t("schemes"), icon: <FileText size={18} /> },
  { to: "/soil", label: t("soil"), icon: <CloudRain size={18} /> },
  { to: "/pest", label: t("pest"), icon: <Bug size={18} /> },
  { to: "/community", label: t("community"), icon: <Users size={18} /> },
];

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { t, lang, setLang } = useLang();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <nav style={{
      background: "white",
      borderBottom: "2px solid #dcfce7",
      position: "sticky",
      top: 0,
      zIndex: 200,
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    }}>
      <div className="container" style={{ display: "flex", alignItems: "center", height: 64 }}>
        {/* Logo */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
          <span style={{ fontSize: 28 }}>🌾</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--green-700)", lineHeight: 1 }}>
              Kisan Seva
            </div>
            <div style={{ fontSize: "0.65rem", color: "var(--gray-500)", lineHeight: 1 }}>
              किसान सेवा पोर्टल
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div style={{
          display: "flex", alignItems: "center", gap: 2,
          marginLeft: "auto", marginRight: "1rem",
          "@media(maxWidth:1024px)": { display: "none" },
        }} className="desktop-nav">
          {navItems(t).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "0.45rem 0.7rem",
                borderRadius: 8,
                fontSize: "0.82rem",
                fontWeight: 600,
                color: isActive(item.to) ? "var(--green-700)" : "var(--gray-600)",
                background: isActive(item.to) ? "var(--green-50)" : "transparent",
                textDecoration: "none",
                transition: "all 0.15s",
                whiteSpace: "nowrap",
              }}
            >
              {item.icon}
              <span style={{ display: "none" }} className="nav-label">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Right Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
          {/* Language Picker */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "0.45rem 0.75rem",
                border: "2px solid var(--gray-200)",
                borderRadius: 8, background: "white",
                fontSize: "0.82rem", fontWeight: 600, cursor: "pointer",
                color: "var(--gray-700)",
              }}
            >
              <Globe size={16} />
              {languages.find(l => l.code === lang)?.flag || "🌐"}
            </button>
            {langOpen && (
              <div style={{
                position: "absolute", top: "calc(100% + 8px)", right: 0,
                background: "white", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                border: "1px solid var(--gray-100)", minWidth: 150, zIndex: 300,
                overflow: "hidden",
              }}>
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => { setLang(l.code); setLangOpen(false); }}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      width: "100%", padding: "0.65rem 1rem",
                      border: "none", background: lang === l.code ? "var(--green-50)" : "white",
                      cursor: "pointer", fontSize: "0.9rem",
                      color: lang === l.code ? "var(--green-700)" : "var(--gray-700)",
                      fontWeight: lang === l.code ? 700 : 400,
                    }}
                  >
                    <span>{l.flag}</span> {l.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Auth */}
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {isAdmin && (
                <Link to="/admin" style={{ textDecoration: "none" }}>
                  <button className="btn btn-sm" style={{ background: "#7c3aed", color: "white", borderRadius: 8 }}>
                    <Shield size={15} /> <span style={{ display: "none" }} className="nav-label">{t("admin")}</span>
                  </button>
                </Link>
              )}
              <Link to="/dashboard" style={{ textDecoration: "none" }}>
                <button className="btn btn-sm btn-secondary" style={{ borderRadius: 8 }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%",
                    background: "var(--green-600)", color: "white",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.65rem", fontWeight: 700,
                  }}>{user.avatar}</div>
                  <span className="nav-label" style={{ display: "none" }}>{user.name.split(" ")[0]}</span>
                </button>
              </Link>
              <button className="btn btn-sm" onClick={handleLogout}
                style={{ border: "none", background: "#fef2f2", color: "#b91c1c", borderRadius: 8 }}>
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 6 }}>
              <Link to="/login"><button className="btn btn-sm btn-secondary">{t("login")}</button></Link>
              <Link to="/register"><button className="btn btn-sm btn-primary">{t("register")}</button></Link>
            </div>
          )}

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              padding: 8, color: "var(--gray-600)", display: "none",
            }}
            className="hamburger"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          borderTop: "1px solid var(--gray-100)",
          background: "white",
          padding: "0.75rem 1rem",
        }}>
          {navItems(t).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMenuOpen(false)}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "0.75rem 0.5rem",
                borderRadius: 8, textDecoration: "none",
                color: isActive(item.to) ? "var(--green-700)" : "var(--gray-700)",
                background: isActive(item.to) ? "var(--green-50)" : "transparent",
                fontWeight: isActive(item.to) ? 600 : 400,
                fontSize: "1rem",
              }}
            >
              {item.icon} {item.label}
            </Link>
          ))}
          {user && (
            <button
              onClick={handleLogout}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "0.75rem 0.5rem", width: "100%",
                border: "none", background: "none",
                color: "#b91c1c", fontWeight: 600, cursor: "pointer", fontSize: "1rem",
              }}
            >
              <LogOut size={18} /> {t("logout")}
            </button>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: block !important; }
        }
        @media (min-width: 901px) {
          .nav-label { display: inline !important; }
        }
      `}</style>
    </nav>
  );
}
