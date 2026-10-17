/**
 * Market.jsx
 * Market (Mandi) prices page with table and card grid view,
 * search/filter, trend indicators, and price colour-coding.
 */
import { useState, useMemo } from 'react';
import { Search, LayoutGrid, List, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { useLang } from '../context/LangContext';
import { marketPrices, indianStates } from '../data/mockData';

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Deterministic pseudo-random trend per crop id: even = up, odd = down
const getTrend = (id) => (id % 2 === 0 ? 'up' : 'down');

function priceColor(modal) {
  if (modal > 3000) return { dot: '🟢', color: '#16a34a', bg: '#f0fdf4' };
  if (modal >= 1500) return { dot: '🟡', color: '#ca8a04', bg: '#fefce8' };
  return { dot: '🔴', color: '#dc2626', bg: '#fef2f2' };
}

const LAST_UPDATED = new Date().toLocaleString('en-IN', {
  day: '2-digit', month: 'short', year: 'numeric',
  hour: '2-digit', minute: '2-digit', hour12: true,
});

// ─── Table Row ────────────────────────────────────────────────────────────────
function TableRow({ item, lang }) {
  const trend = getTrend(item.id);
  const { dot, color } = priceColor(item.modalPrice);
  return (
    <tr style={{ borderBottom: '1px solid var(--gray-100)' }}>
      <td style={{ padding: '11px 14px', fontWeight: 600 }}>
        <span style={{ marginRight: 6 }}>{dot}</span>
        {lang === 'hi' ? item.cropHi : item.crop}
      </td>
      <td style={{ padding: '11px 14px', color: 'var(--gray-600)', fontSize: 13 }}>{item.market}</td>
      <td style={{ padding: '11px 14px', color: 'var(--gray-600)', fontSize: 13 }}>{item.state}</td>
      <td style={{ padding: '11px 14px', color: 'var(--gray-700)', fontSize: 13 }}>₹{item.minPrice.toLocaleString('en-IN')}</td>
      <td style={{ padding: '11px 14px', color: 'var(--gray-700)', fontSize: 13 }}>₹{item.maxPrice.toLocaleString('en-IN')}</td>
      <td style={{ padding: '11px 14px', fontWeight: 700, color }}>
        ₹{item.modalPrice.toLocaleString('en-IN')}
      </td>
      <td style={{ padding: '11px 14px' }}>
        {trend === 'up'
          ? <span style={{ color: '#16a34a', display: 'flex', alignItems: 'center', gap: 3 }}><TrendingUp size={14} /> Up</span>
          : <span style={{ color: '#dc2626', display: 'flex', alignItems: 'center', gap: 3 }}><TrendingDown size={14} /> Down</span>
        }
      </td>
    </tr>
  );
}

// ─── Price Card ───────────────────────────────────────────────────────────────
function PriceCard({ item, lang }) {
  const trend = getTrend(item.id);
  const { dot, color, bg } = priceColor(item.modalPrice);
  return (
    <div className="card" style={{ background: bg, border: `1.5px solid ${color}22`, borderRadius: 14, overflow: 'hidden' }}>
      <div style={{ padding: '16px 16px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--gray-800)', marginBottom: 2 }}>
              <span style={{ marginRight: 6 }}>{dot}</span>
              {lang === 'hi' ? item.cropHi : item.crop}
            </div>
            <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{item.market} • {item.state}</div>
          </div>
          <span style={{
            background: trend === 'up' ? '#dcfce7' : '#fee2e2',
            color: trend === 'up' ? '#16a34a' : '#dc2626',
            borderRadius: 20, padding: '3px 8px', fontSize: 11, fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 3,
          }}>
            {trend === 'up' ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {trend === 'up' ? 'Up' : 'Down'}
          </span>
        </div>

        {/* Modal price – large */}
        <div style={{ margin: '12px 0 8px' }}>
          <span style={{ fontSize: 36, fontWeight: 800, color }}> ₹{item.modalPrice.toLocaleString('en-IN')}</span>
          <span style={{ fontSize: 12, color: 'var(--gray-500)', marginLeft: 4 }}>/{item.unit}</span>
        </div>
      </div>

      <div style={{ background: `${color}12`, padding: '8px 16px', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12, color: 'var(--gray-600)' }}>
          Min: <strong>₹{item.minPrice.toLocaleString('en-IN')}</strong>
        </span>
        <span style={{ fontSize: 12, color: 'var(--gray-600)' }}>
          Max: <strong>₹{item.maxPrice.toLocaleString('en-IN')}</strong>
        </span>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Market() {
  const { t, lang } = useLang();
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'card'

  // Filter logic
  const filtered = useMemo(() => {
    return marketPrices.filter((item) => {
      const searchLower = search.toLowerCase();
      const matchCrop =
        !search ||
        item.crop.toLowerCase().includes(searchLower) ||
        item.cropHi.includes(search) ||
        item.market.toLowerCase().includes(searchLower);
      const matchState = !stateFilter || item.state === stateFilter;
      return matchCrop && matchState;
    });
  }, [search, stateFilter]);

  return (
    <div className="page-content">
      <div className="container" style={{ maxWidth: 1100 }}>

        {/* ── Page Header ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--gray-900)', marginBottom: 4 }}>
              🏪 {t('marketTitle') || 'Mandi Prices'}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--gray-500)' }}>
              <RefreshCw size={12} />
              {t('lastUpdated') || 'Last updated'}: {LAST_UPDATED}
            </div>
          </div>

          {/* View toggle */}
          <div style={{ display: 'flex', background: 'var(--gray-100)', borderRadius: 8, padding: 3, gap: 2 }}>
            <button
              onClick={() => setViewMode('table')}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '6px 14px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 13,
                background: viewMode === 'table' ? '#fff' : 'transparent',
                color: viewMode === 'table' ? 'var(--primary)' : 'var(--gray-600)',
                fontWeight: viewMode === 'table' ? 700 : 400,
                boxShadow: viewMode === 'table' ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s',
              }}
            >
              <List size={15} /> Table
            </button>
            <button
              onClick={() => setViewMode('card')}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '6px 14px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 13,
                background: viewMode === 'card' ? '#fff' : 'transparent',
                color: viewMode === 'card' ? 'var(--primary)' : 'var(--gray-600)',
                fontWeight: viewMode === 'card' ? 700 : 400,
                boxShadow: viewMode === 'card' ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s',
              }}
            >
              <LayoutGrid size={15} /> Cards
            </button>
          </div>
        </div>

        {/* ── Filters ── */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 240px' }}>
            <Search size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
            <input
              className="input"
              type="text"
              placeholder={t('searchCrop') || 'Search crop or mandi...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: 34, width: '100%' }}
            />
          </div>

          {/* State dropdown */}
          <select
            className="select"
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            style={{ flex: '1 1 180px', maxWidth: 220 }}
          >
            <option value="">{t('allStates') || 'All States'}</option>
            {indianStates.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Result count badge */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span className="badge badge-green" style={{ fontSize: 13, padding: '4px 12px' }}>
              {filtered.length} {t('results') || 'results'}
            </span>
          </div>
        </div>

        {/* ── Legend ── */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 16, fontSize: 12, color: 'var(--gray-500)' }}>
          <span>🟢 Modal price &gt; ₹3,000</span>
          <span>🟡 ₹1,500 – ₹3,000</span>
          <span>🔴 Below ₹1,500</span>
          <span style={{ marginLeft: 'auto' }}>* Prices per quintal (100 kg)</span>
        </div>

        {/* ── Table View ── */}
        {viewMode === 'table' && (
          <div className="table-wrap" style={{ borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
              <thead>
                <tr style={{ background: 'var(--green-50)', borderBottom: '2px solid var(--green-100)' }}>
                  {[
                    t('cropName') || 'Crop',
                    t('market')   || 'Market (Mandi)',
                    t('state')    || 'State',
                    t('minPrice') || 'Min ₹',
                    t('maxPrice') || 'Max ₹',
                    t('modalPrice')|| 'Modal ₹',
                    t('trend')    || 'Trend',
                  ].map((col) => (
                    <th key={col} style={{
                      padding: '12px 14px', textAlign: 'left', fontSize: 12,
                      fontWeight: 700, color: 'var(--green-800)', textTransform: 'uppercase', letterSpacing: 0.5,
                    }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0
                  ? filtered.map((item) => <TableRow key={item.id} item={item} lang={lang} />)
                  : (
                    <tr>
                      <td colSpan={7} style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--gray-400)' }}>
                        No results found for "{search || stateFilter}". Try a different search.
                      </td>
                    </tr>
                  )
                }
              </tbody>
            </table>
          </div>
        )}

        {/* ── Card Grid View ── */}
        {viewMode === 'card' && (
          filtered.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: 14,
            }}>
              {filtered.map((item) => <PriceCard key={item.id} item={item} lang={lang} />)}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--gray-400)' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
              <p>No results found. Try adjusting your search or filter.</p>
            </div>
          )
        )}

        {/* ── Footer note ── */}
        <p style={{ fontSize: 11, color: 'var(--gray-400)', textAlign: 'center', marginTop: 20 }}>
          * {t('priceDisclaimer') || 'Prices are indicative. Source: Agmarknet / State Mandi Boards.'}
        </p>
      </div>
    </div>
  );
}
