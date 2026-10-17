import { Link } from 'react-router-dom';
import {
  CloudSun, Wheat, BarChart2, Landmark, Leaf, Bug,
  ArrowRight, Lightbulb
} from 'lucide-react';
import { useLang } from '../context/LangContext';

const features = [
  {
    emoji: '🌤',
    icon: CloudSun,
    title: 'Weather',
    titleHi: 'मौसम',
    desc: 'Real-time forecasts & alerts for your region',
    route: '/weather',
    color: '#0ea5e9',
    bg: '#f0f9ff',
  },
  {
    emoji: '🌾',
    icon: Wheat,
    title: 'Crop Advisory',
    titleHi: 'फसल सलाह',
    desc: 'Expert guidance for better yield & planning',
    route: '/crop-advisory',
    color: '#16a34a',
    bg: '#f0fdf4',
  },
  {
    emoji: '📊',
    icon: BarChart2,
    title: 'Market Prices',
    titleHi: 'बाजार भाव',
    desc: 'Live mandi rates across 28 states',
    route: '/market-prices',
    color: '#d97706',
    bg: '#fffbeb',
  },
  {
    emoji: '🏛',
    icon: Landmark,
    title: 'Gov Schemes',
    titleHi: 'सरकारी योजनाएं',
    desc: '500+ schemes — check your eligibility',
    route: '/schemes',
    color: '#7c3aed',
    bg: '#f5f3ff',
  },
  {
    emoji: '🌿',
    icon: Leaf,
    title: 'Soil Helper',
    titleHi: 'मिट्टी सहायक',
    desc: 'Soil health cards & fertilizer advice',
    route: '/soil',
    color: '#15803d',
    bg: '#f0fdf4',
  },
  {
    emoji: '🐛',
    icon: Bug,
    title: 'Pest Guide',
    titleHi: 'कीट मार्गदर्शन',
    desc: 'Identify & treat crop pests & diseases',
    route: '/pest-guide',
    color: '#dc2626',
    bg: '#fef2f2',
  },
];

const stats = [
  { value: '10M+', label: 'Farmers', labelHi: 'किसान' },
  { value: '500+', label: 'Schemes', labelHi: 'योजनाएं' },
  { value: '150+', label: 'Crops', labelHi: 'फसलें' },
  { value: '28', label: 'States', labelHi: 'राज्य' },
];

const tips = [
  'Sow green manure crops like Dhaincha before Kharif season for natural nitrogen.',
  'Apply neem-based pesticides in the evening to reduce evaporation.',
  'Mulching conserves soil moisture and reduces weed growth by up to 70%.',
  'Check PM-KISAN portal for your next installment date and ensure Aadhaar linking.',
];

export default function Home() {
  const { t, lang } = useLang();
  const todayTip = tips[new Date().getDay() % tips.length];

  return (
    <div style={{ fontFamily: 'inherit' }}>
      {/* ── Hero ─────────────────────────────────────── */}
      <section
        style={{
          background: 'linear-gradient(135deg, #14532d 0%, #16a34a 50%, #4ade80 100%)',
          color: '#fff',
          padding: '80px 20px 60px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: -80, right: -80,
          width: 300, height: 300, borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
        }} />
        <div style={{
          position: 'absolute', bottom: -60, left: -60,
          width: 220, height: 220, borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 700, margin: '0 auto' }}>
          <div style={{ fontSize: 72, marginBottom: 16, lineHeight: 1 }}>🌾</div>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 800,
            margin: '0 0 8px',
            letterSpacing: '-0.5px',
            textShadow: '0 2px 12px rgba(0,0,0,0.2)',
          }}>
            Kisan Seva — किसान सेवा
          </h1>
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            opacity: 0.9,
            margin: '0 0 36px',
            fontWeight: 400,
          }}>
            Your Complete Farming Companion · आपका पूर्ण कृषि साथी
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/weather"
              className="btn btn-lg"
              style={{
                background: '#fff',
                color: '#16a34a',
                fontWeight: 700,
                borderRadius: 10,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                textDecoration: 'none',
                padding: '12px 28px',
              }}
            >
              Explore Features <ArrowRight size={18} />
            </Link>
            <Link
              to="/login"
              className="btn btn-lg"
              style={{
                background: 'rgba(255,255,255,0.15)',
                color: '#fff',
                border: '2px solid rgba(255,255,255,0.6)',
                fontWeight: 700,
                borderRadius: 10,
                textDecoration: 'none',
                padding: '12px 28px',
                backdropFilter: 'blur(4px)',
              }}
            >
              Login · लॉग इन
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ─────────────────────────────────── */}
      <section style={{ background: '#14532d', color: '#fff', padding: '18px 20px' }}>
        <div style={{
          maxWidth: 900,
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
          gap: 16,
        }}>
          {stats.map((s) => (
            <div key={s.label} style={{ textAlign: 'center', minWidth: 100 }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#4ade80' }}>{s.value}</div>
              <div style={{ fontSize: '0.85rem', opacity: 0.85 }}>
                {lang === 'hi' ? s.labelHi : s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features Grid ─────────────────────────────── */}
      <section style={{ padding: '60px 20px', background: '#f9fafb' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{
            textAlign: 'center',
            fontSize: '1.75rem',
            fontWeight: 700,
            color: '#14532d',
            marginBottom: 8,
          }}>
            Everything a Farmer Needs · किसान की हर जरूरत
          </h2>
          <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: 40, fontSize: '1rem' }}>
            One platform for all your farming needs
          </p>

          <div className="grid-3" style={{ gap: 20 }}>
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <Link
                  key={f.title}
                  to={f.route}
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    className="card"
                    style={{
                      background: f.bg,
                      border: `1.5px solid ${f.color}22`,
                      borderRadius: 14,
                      padding: '28px 24px',
                      cursor: 'pointer',
                      transition: 'transform 0.18s, box-shadow 0.18s',
                      height: '100%',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = `0 8px 24px ${f.color}30`;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '';
                    }}
                  >
                    <div style={{
                      width: 52, height: 52, borderRadius: 12,
                      background: `${f.color}18`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: 14,
                    }}>
                      <Icon size={26} color={f.color} />
                    </div>
                    <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>{f.emoji}</div>
                    <h3 style={{
                      fontSize: '1.05rem', fontWeight: 700,
                      color: '#1f2937', margin: '0 0 6px',
                    }}>
                      {lang === 'hi' ? f.titleHi : f.title}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0, lineHeight: 1.5 }}>
                      {f.desc}
                    </p>
                    <div style={{
                      marginTop: 14, display: 'flex', alignItems: 'center',
                      gap: 4, color: f.color, fontWeight: 600, fontSize: '0.85rem',
                    }}>
                      Explore <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Tip of the Day ────────────────────────────── */}
      <section style={{ padding: '0 20px 60px', background: '#f9fafb' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{
            background: 'linear-gradient(135deg, #14532d, #16a34a)',
            borderRadius: 16,
            padding: '28px 32px',
            color: '#fff',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 18,
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: 'rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Lightbulb size={26} color="#fde68a" />
            </div>
            <div>
              <div style={{
                fontSize: '0.75rem', fontWeight: 700, letterSpacing: 1,
                textTransform: 'uppercase', opacity: 0.75, marginBottom: 6,
              }}>
                💡 Tip of the Day · आज की सलाह
              </div>
              <p style={{ margin: 0, fontSize: '1rem', lineHeight: 1.6, opacity: 0.95 }}>
                {todayTip}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
