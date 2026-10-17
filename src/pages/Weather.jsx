/**
 * Weather.jsx
 * Weather forecast page with mock data, farming advice, and 7-day forecast.
 * No real API – uses static mock data; search/geolocation are cosmetic UI.
 */
import { useState } from 'react';
import { MapPin, Search, Wind, Droplets, Thermometer, Eye, AlertTriangle, Leaf } from 'lucide-react';
import { useLang } from '../context/LangContext';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_CURRENT = {
  city: 'New Delhi',
  temp: 28,
  feelsLike: 31,
  humidity: 65,
  windSpeed: 12,
  rainfall: 0,
  uvIndex: 7,
  condition: 'Partly Cloudy',
  conditionHi: 'आंशिक रूप से बादल',
  icon: '⛅',
};

const MOCK_FORECAST = [
  { day: 'Mon', date: 'Oct 20', high: 30, low: 19, condition: 'Sunny',        icon: '☀️',  rain: 5  },
  { day: 'Tue', date: 'Oct 21', high: 28, low: 18, condition: 'Partly Cloudy',icon: '⛅',  rain: 20 },
  { day: 'Wed', date: 'Oct 22', high: 24, low: 16, condition: 'Rainy',        icon: '🌧️', rain: 75 },
  { day: 'Thu', date: 'Oct 23', high: 22, low: 15, condition: 'Thunderstorm', icon: '🌩️', rain: 90 },
  { day: 'Fri', date: 'Oct 24', high: 25, low: 16, condition: 'Cloudy',       icon: '🌤️', rain: 35 },
  { day: 'Sat', date: 'Oct 25', high: 29, low: 18, condition: 'Partly Cloudy',icon: '⛅',  rain: 15 },
  { day: 'Sun', date: 'Oct 26', high: 31, low: 20, condition: 'Sunny',        icon: '☀️',  rain: 5  },
];

// Map condition → farming advice
const FARMING_ADVICE = {
  Sunny: {
    icon: '☀️',
    color: '#f59e0b',
    bg: '#fffbeb',
    border: '#fcd34d',
    tips: [
      'Good day for spraying pesticides and fertilizers.',
      'Ensure adequate irrigation – evaporation rate is high today.',
      'Apply mulching to conserve soil moisture.',
    ],
    tipsHi: [
      'कीटनाशक और उर्वरक छिड़काव के लिए अच्छा दिन।',
      'पर्याप्त सिंचाई सुनिश्चित करें – वाष्पीकरण अधिक है।',
      'मिट्टी की नमी बचाने के लिए मल्चिंग करें।',
    ],
  },
  'Partly Cloudy': {
    icon: '⛅',
    color: '#0ea5e9',
    bg: '#f0f9ff',
    border: '#7dd3fc',
    tips: [
      'Good conditions for transplanting seedlings – less heat stress.',
      'Moderate evaporation – check irrigation schedules.',
      'Suitable for most field operations.',
    ],
    tipsHi: [
      'पौध रोपण के लिए अच्छी स्थिति – कम गर्मी का तनाव।',
      'सिंचाई कार्यक्रम जांचें।',
      'अधिकांश खेती कार्यों के लिए उपयुक्त।',
    ],
  },
  Cloudy: {
    icon: '🌤️',
    color: '#6b7280',
    bg: '#f9fafb',
    border: '#d1d5db',
    tips: [
      'Ideal for transplanting seedlings – minimal transplant shock.',
      'Good time for soil preparation and tilling.',
      'Avoid fungicide spraying – reduced effectiveness in humidity.',
    ],
    tipsHi: [
      'पौध रोपण के लिए आदर्श – कम रोपण आघात।',
      'मिट्टी की तैयारी के लिए अच्छा समय।',
      'फफूंदनाशी छिड़काव न करें – नमी में कम प्रभावकारिता।',
    ],
  },
  Rainy: {
    icon: '🌧️',
    color: '#3b82f6',
    bg: '#eff6ff',
    border: '#93c5fd',
    tips: [
      'Avoid field operations to prevent soil compaction.',
      'Check drainage channels to prevent waterlogging.',
      'Do NOT spray pesticides – rain will wash them off.',
      'Rainwater harvesting opportunity – maintain farm ponds.',
    ],
    tipsHi: [
      'मिट्टी दबाव से बचने के लिए खेती कार्य न करें।',
      'जलभराव रोकने के लिए जल निकासी नालियां जांचें।',
      'कीटनाशक न छिड़कें – बारिश में धुल जाएंगे।',
      'वर्षा जल संचयन करें – खेत तालाब बनाए रखें।',
    ],
  },
  Thunderstorm: {
    icon: '🌩️',
    color: '#7c3aed',
    bg: '#faf5ff',
    border: '#c4b5fd',
    tips: [
      'Stay indoors – avoid all field operations.',
      'Secure farm equipment and protect stored crops.',
      'Check for crop lodging after the storm passes.',
    ],
    tipsHi: [
      'घर के अंदर रहें – सभी खेती कार्य से बचें।',
      'कृषि उपकरण सुरक्षित करें और संग्रहित फसल की रक्षा करें।',
      'तूफान के बाद फसल के गिरने की जांच करें।',
    ],
  },
};

// ─── Sub-Components ───────────────────────────────────────────────────────────

function StatBox({ icon, label, value }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.15)',
      backdropFilter: 'blur(6px)',
      borderRadius: 12,
      padding: '14px 16px',
      textAlign: 'center',
      minWidth: 100,
      flex: '1 1 100px',
    }}>
      <div style={{ fontSize: 22, marginBottom: 4 }}>{icon}</div>
      <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 2 }}>{label}</div>
      <div style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>{value}</div>
    </div>
  );
}

function ForecastCard({ day, date, icon, high, low, rain, condition }) {
  const hasAlert = rain > 30;
  return (
    <div style={{
      background: '#fff',
      borderRadius: 14,
      padding: '16px 14px',
      textAlign: 'center',
      minWidth: 100,
      flex: '0 0 110px',
      border: hasAlert ? '1.5px solid #fca5a5' : '1.5px solid var(--gray-100)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      position: 'relative',
    }}>
      {hasAlert && (
        <span style={{
          position: 'absolute', top: 6, right: 6,
          background: '#fef2f2', color: '#dc2626',
          borderRadius: 20, fontSize: 10, padding: '1px 6px', fontWeight: 600,
        }}>🌧 {rain}%</span>
      )}
      <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--gray-800)' }}>{day}</div>
      <div style={{ fontSize: 11, color: 'var(--gray-500)', marginBottom: 8 }}>{date}</div>
      <div style={{ fontSize: 30, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 11, color: 'var(--gray-500)', marginBottom: 6 }}>{condition}</div>
      <div style={{ fontWeight: 700, color: 'var(--gray-800)', fontSize: 14 }}>{high}°</div>
      <div style={{ color: 'var(--gray-500)', fontSize: 12 }}>{low}°</div>
      {!hasAlert && (
        <div style={{ marginTop: 6, fontSize: 10, color: 'var(--gray-400)' }}>💧 {rain}%</div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Weather() {
  const { t, lang } = useLang();
  const [city, setCity] = useState(MOCK_CURRENT.city);
  const [searchInput, setSearchInput] = useState('');
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError] = useState('');

  const weather = { ...MOCK_CURRENT, city };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setCity(searchInput.trim());
      setSearchInput('');
      setLocError('');
    }
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocError('Geolocation not supported by your browser.');
      return;
    }
    setLocLoading(true);
    setLocError('');
    navigator.geolocation.getCurrentPosition(
      () => {
        setCity('Your Location');
        setLocLoading(false);
      },
      (err) => {
        setLocError('Could not detect location. Please allow location access.');
        setLocLoading(false);
      },
      { timeout: 8000 }
    );
  };

  // Pick advice based on condition, fallback to Partly Cloudy
  const advice = FARMING_ADVICE[weather.condition] || FARMING_ADVICE['Partly Cloudy'];
  const adviceTips = lang === 'hi' ? advice.tipsHi : advice.tips;

  // UV index label
  const uvLabel = weather.uvIndex <= 2 ? 'Low' : weather.uvIndex <= 5 ? 'Moderate' : weather.uvIndex <= 7 ? 'High' : 'Very High';

  return (
    <div className="page-content">
      {/* ── Search Bar ── */}
      <div className="container" style={{ maxWidth: 800 }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', flex: '1 1 280px', gap: 8 }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
              <input
                className="input"
                type="text"
                placeholder={t('searchCity') || 'Search city or district...'}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                style={{ paddingLeft: 36, width: '100%' }}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              {t('search') || 'Search'}
            </button>
          </form>
          <button
            className="btn btn-secondary"
            onClick={handleDetectLocation}
            disabled={locLoading}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <MapPin size={15} />
            {locLoading ? (t('detecting') || 'Detecting...') : (t('detectLocation') || 'Detect My Location')}
          </button>
        </div>

        {locError && (
          <div className="alert alert-warning" style={{ marginBottom: 16 }}>
            {locError}
          </div>
        )}

        {/* ── Current Weather Card ── */}
        <div style={{
          background: 'linear-gradient(135deg, #1e3a5f 0%, #1a6b4a 100%)',
          borderRadius: 20,
          padding: '28px 24px 24px',
          marginBottom: 20,
          color: '#fff',
          boxShadow: '0 8px 30px rgba(30,58,95,0.25)',
        }}>
          {/* City & condition */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <MapPin size={15} style={{ opacity: 0.8 }} />
                <span style={{ fontSize: 16, fontWeight: 600 }}>{weather.city}</span>
              </div>
              <div style={{ opacity: 0.7, fontSize: 13 }}>
                {lang === 'hi' ? weather.conditionHi : weather.condition}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 80, lineHeight: 1 }}>{weather.icon}</div>
            </div>
          </div>

          {/* Big temperature */}
          <div style={{ margin: '12px 0 4px' }}>
            <span style={{ fontSize: 72, fontWeight: 800, lineHeight: 1 }}>{weather.temp}°</span>
            <span style={{ fontSize: 32, opacity: 0.7, verticalAlign: 'super' }}>C</span>
          </div>
          <div style={{ opacity: 0.75, fontSize: 14, marginBottom: 20 }}>
            {t('feelsLike') || 'Feels like'} {weather.feelsLike}°C
          </div>

          {/* Stat boxes row */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <StatBox icon={<Droplets size={18} color="#7dd3fc" />} label={t('humidity') || 'Humidity'} value={`${weather.humidity}%`} />
            <StatBox icon={<Wind size={18} color="#bae6fd" />} label={t('windSpeed') || 'Wind'} value={`${weather.windSpeed} km/h`} />
            <StatBox icon="🌡️" label={t('uvIndex') || 'UV Index'} value={`${weather.uvIndex} (${uvLabel})`} />
            <StatBox icon="🌧️" label={t('rainfall') || 'Rainfall'} value={`${weather.rainfall} mm`} />
          </div>
        </div>

        {/* ── Farming Advice Box ── */}
        <div style={{
          background: advice.bg,
          border: `1.5px solid ${advice.border}`,
          borderRadius: 14,
          padding: '18px 20px',
          marginBottom: 20,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Leaf size={18} color={advice.color} />
            <span style={{ fontWeight: 700, fontSize: 15, color: advice.color }}>
              {t('farmingAdvice') || 'Farming Advice'} — {advice.icon} {lang === 'hi' ? weather.conditionHi : weather.condition}
            </span>
          </div>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {adviceTips.map((tip, i) => (
              <li key={i} style={{ color: 'var(--gray-700)', fontSize: 14, marginBottom: 6, lineHeight: 1.5 }}>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* ── 7-Day Forecast ── */}
        <div style={{ marginBottom: 8 }}>
          <h3 style={{ fontWeight: 700, fontSize: 16, color: 'var(--gray-800)', marginBottom: 14 }}>
            📅 {t('sevenDayForecast') || '7-Day Forecast'}
          </h3>

          {/* Rain alert if any day > 30% */}
          {MOCK_FORECAST.some(d => d.rain > 30) && (
            <div className="alert alert-warning" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <AlertTriangle size={16} />
              <span style={{ fontSize: 13 }}>
                {t('rainAlert') || 'Rain expected in coming days. Plan field operations accordingly.'}
              </span>
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8 }}>
            {MOCK_FORECAST.map((d) => (
              <ForecastCard key={d.day} {...d} />
            ))}
          </div>
        </div>

        {/* ── Disclaimer ── */}
        <p style={{ fontSize: 11, color: 'var(--gray-400)', textAlign: 'center', marginTop: 12 }}>
          * {t('weatherDisclaimer') || 'Weather data is illustrative. Integrate with IMD / OpenWeatherMap API for live forecasts.'}
        </p>
      </div>
    </div>
  );
}
