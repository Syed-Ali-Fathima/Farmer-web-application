/**
 * App.jsx – Root router setup
 */
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Weather from "./pages/Weather";
import Crops from "./pages/Crops";
import Market from "./pages/Market";
import Schemes from "./pages/Schemes";
import Soil from "./pages/Soil";
import Pest from "./pages/Pest";
import Community from "./pages/Community";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";

function Footer() {
  return (
    <footer style={{
      background: "var(--green-900)", color: "#a7f3d0",
      padding: "2rem 0", marginTop: "auto",
      fontSize: "0.9rem",
    }}>
      <div className="container" style={{ textAlign: "center" }}>
        <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>🌾</div>
        <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "white", marginBottom: 4 }}>
          Kisan Seva Portal
        </div>
        <div style={{ marginBottom: 12, opacity: 0.8 }}>
          किसानों की सेवा में – Inspired by Smart India Hackathon
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap", opacity: 0.7 }}>
          <span>🌾 Crop Advisory</span>
          <span>🌤 Weather</span>
          <span>📊 Market Prices</span>
          <span>🏛 Gov. Schemes</span>
          <span>🌿 Soil Helper</span>
          <span>🐛 Pest Guide</span>
        </div>
        <div style={{ marginTop: 16, opacity: 0.5, fontSize: "0.8rem" }}>
          © 2026 Kisan Seva · Built for Indian Farmers · Data for demonstration purposes
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/crops" element={<Crops />} />
            <Route path="/market" element={<Market />} />
            <Route path="/schemes" element={<Schemes />} />
            <Route path="/soil" element={<Soil />} />
            <Route path="/pest" element={<Pest />} />
            <Route path="/community" element={<Community />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
