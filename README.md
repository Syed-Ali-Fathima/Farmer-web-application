# 🌾 Kisan Seva - Farmer Support Web Application

A modern, responsive, and accessible web application designed to empower Indian farmers with practical daily agricultural support (inspired by Smart India Hackathon).

![React](https://img.shields.io/badge/React-19-blue)
![Vite](https://img.shields.io/badge/Vite-6-purple)
![Multilingual](https://img.shields.io/badge/Languages-5%20Supported-green)
![License](https://img.shields.io/badge/License-MIT-brightgreen)

---

## 🌟 Key Features

1. **🌤 Weather Forecast & Agricultural Advice**
   - Real-time location-based weather and 7-day extended forecasts.
   - GPS-enabled location detection.
   - Weather condition-specific farming advice (spraying, irrigation, harvesting).
   - High rainfall / thunderstorm alert warnings.

2. **🌾 Crop Advisory Engine**
   - Recommendations based on Season (Kharif, Rabi, Zaid), Soil Type, and Region.
   - Comprehensive crop cards with growing duration, water needs, MSP data, and yield benchmarks.
   - Step-by-step agronomic tips and disease prevention guidelines.

3. **📊 Market Prices (Mandi Bhav)**
   - Daily commodity prices across major APMC Mandis throughout India.
   - Filter by crop name and state.
   - Visual market trend analysis (🟢 Above ₹3,000 | 🟡 ₹1,500–₹3,000 | 🔴 Below ₹1,500).
   - Table and Grid Card views.

4. **🏛 Government Schemes & Subsidies**
   - Filter by Loans, Insurance, Subsidies, Farm Equipment, Training, and Pensions.
   - Direct eligibility criteria, benefit breakdowns, deadlines, and official portal links (PM-KISAN, PMFBY, KCC, E-NAM, etc.).

5. **🌿 Soil & Fertilizer Helper**
   - Precise N-P-K nutrient recommendation calculator based on soil type, crop, and farm area in acres.
   - Chemical fertilizer equivalents calculated for Urea, DAP, and MOP.
   - Application split stages and nutritional guidance.

6. **🐛 Pest & Disease Diagnostic Guide**
   - Searchable and categorized database of crop pests and diseases.
   - Severity tags with dual solutions: **Organic / Biological** and **Chemical / Remedial**.

7. **💬 Farmer Community Forum (Q&A)**
   - Interactive Q&A board where farmers share experiences, ask questions, and like answers.
   - Verified Agriculture Expert badge for official guidance.

8. **🌐 Multilingual Support (5 Languages)**
   - 🇬🇧 English
   - 🇮🇳 हिन्दी (Hindi)
   - 🇮🇳 मराठी (Marathi)
   - 🇮🇳 ਪੰਜਾਬੀ (Punjabi)
   - 🇮🇳 বাংলা (Bengali)

9. **📱 Farmer-Friendly UI & Dashboard**
   - Accessible UI with high contrast, large buttons, clean iconography, and mobile navigation.
   - Personalized dashboard after login with quick weather summary, top crop prices, and recent schemes.

10. **🛡 Admin Management Panel**
    - Portal for administrators to manage and add new schemes, crop varieties, and mandi prices.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/Syed-Ali-Fathima/Farmer-web-application.git

# Navigate to project directory
cd Farmer-web-application

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be accessible at `http://localhost:5173`.

---

## 🔑 Demo Credentials

| Role | Username / Phone | Password |
|---|---|---|
| **Farmer** | `farmer@kisanseva.in` / `9876543210` | `farmer123` |
| **Admin** | `admin@kisanseva.in` / `9000000001` | `admin123` |

*(Convenient one-click fill buttons are also available on the Login screen)*

---

## 🛠 Tech Stack
- **Frontend:** React, React Router v7, Lucide Icons
- **Build Tool:** Vite
- **Styling:** Custom CSS Design System (CSS Variables, Flexbox/Grid, Responsive Mobile Drawer)
- **Internationalization:** Custom Context-based i18n
