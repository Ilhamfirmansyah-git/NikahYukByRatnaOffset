'use client';

import { useState, useEffect, useRef } from 'react';
import { TemplateProps } from './TemplateProps';
import MusicPlayer from '@/components/invitation/MusicPlayer';
import RsvpForm from '@/components/invitation/RsvpForm';
import GuestbookForm from '@/components/invitation/GuestbookForm';
import AmplopDigitalComponent from '@/components/invitation/AmplopDigital';
import ShareButton from '@/components/invitation/ShareButton';

// ── Palette ────────────────────────────────────────────────────────────────────
const DARK    = '#120D08';
const DARK2   = '#1e1610';
const GOLD    = '#C9A84C';
const GOLD_L  = '#E8C547';
const GOLD_D  = '#8B6914';
const TEAL    = '#1B7A8C';
const TEAL_L  = '#2ea8bf';
const CREAM   = '#FAF7F0';
const CREAM2  = '#F5EDE0';
const MUTED   = 'rgba(18,13,8,0.55)';

// ── Format date ────────────────────────────────────────────────────────────────
const fmt = (t: string) =>
  t ? new Date(t).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '';

const fmtTime = (t: string) =>
  t ? new Date(`1970-01-01T${t}`).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '';

// ── Scroll reveal ──────────────────────────────────────────────────────────────
function FadeIn({ children, delay = 0, from = 'bottom' }: {
  children: React.ReactNode; delay?: number; from?: 'bottom' | 'left' | 'right' | 'none';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const tx = from === 'left' ? 'translateX(-30px)' : from === 'right' ? 'translateX(30px)' : from === 'none' ? 'none' : 'translateY(30px)';
  return (
    <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? 'none' : tx, transition: `opacity 0.9s ease ${delay}ms, transform 0.9s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

// ── Countdown ─────────────────────────────────────────────────────────────────
function FaunaCountdown({ targetDate }: { targetDate: string }) {
  const calc = () => {
    const diff = new Date(targetDate).getTime() - Date.now();
    if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 };
    return { d: Math.floor(diff / 86400000), h: Math.floor(diff / 3600000 % 24), m: Math.floor(diff / 60000 % 60), s: Math.floor(diff / 1000 % 60) };
  };
  const [t, setT] = useState(calc);
  useEffect(() => { const id = setInterval(() => setT(calc()), 1000); return () => clearInterval(id); }, [targetDate]);
  const pad = (n: number) => String(n).padStart(2, '0');
  const units = [{ v: t.d, l: 'Hari' }, { v: t.h, l: 'Jam' }, { v: t.m, l: 'Menit' }, { v: t.s, l: 'Detik' }];
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
      {units.map(u => (
        <div key={u.l} style={{ textAlign: 'center', minWidth: 64 }}>
          <div style={{
            background: DARK2, border: `1.5px solid ${GOLD_D}`, borderRadius: 10,
            padding: '10px 6px', marginBottom: 6,
            boxShadow: `0 2px 16px rgba(201,168,76,0.2), inset 0 1px 0 rgba(201,168,76,0.15)`,
          }}>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 600, color: GOLD_L, display: 'block', lineHeight: 1 }}>
              {pad(u.v)}
            </span>
          </div>
          <span style={{ fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: GOLD_D, fontFamily: "'Inter', sans-serif" }}>{u.l}</span>
        </div>
      ))}
    </div>
  );
}

// ── Peacock feather "eye" divider ──────────────────────────────────────────────
function PeacockDivider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, margin: '22px 0' }}>
      <div style={{ height: 1, flex: 1, maxWidth: 80, background: `linear-gradient(to right, transparent, ${GOLD_D})` }} />
      {/* Peacock eye */}
      <svg width="32" height="32" viewBox="0 0 32 32">
        <ellipse cx="16" cy="16" rx="14" ry="14" fill="none" stroke={GOLD_D} strokeWidth="0.8" opacity="0.5" />
        <ellipse cx="16" cy="16" rx="9" ry="9" fill={TEAL} opacity="0.25" />
        <ellipse cx="16" cy="16" rx="5" ry="5" fill={GOLD} opacity="0.6" />
        <circle cx="16" cy="16" r="2.5" fill={DARK} />
        <circle cx="14.5" cy="14.5" r="0.8" fill="white" opacity="0.7" />
      </svg>
      <div style={{ height: 1, flex: 1, maxWidth: 80, background: `linear-gradient(to left, transparent, ${GOLD_D})` }} />
    </div>
  );
}

// ── Gold arch SVG for cover ────────────────────────────────────────────────────
function GoldArch({ width, height }: { width: number; height: number }) {
  const r = width * 0.48;
  const cx = width / 2;
  const archTop = height * 0.08;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <defs>
        <linearGradient id="archGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={GOLD_D} />
          <stop offset="40%" stopColor={GOLD_L} />
          <stop offset="60%" stopColor={GOLD} />
          <stop offset="100%" stopColor={GOLD_D} />
        </linearGradient>
      </defs>
      {/* Outer arch */}
      <path
        d={`M ${cx - r} ${height * 0.85} L ${cx - r} ${archTop + r} A ${r} ${r} 0 0 1 ${cx + r} ${archTop + r} L ${cx + r} ${height * 0.85}`}
        fill="none" stroke="url(#archGold)" strokeWidth="1.8" opacity="0.75"
      />
      {/* Inner arch */}
      <path
        d={`M ${cx - r * 0.88} ${height * 0.85} L ${cx - r * 0.88} ${archTop + r * 1.12} A ${r * 0.88} ${r * 0.88} 0 0 1 ${cx + r * 0.88} ${archTop + r * 1.12} L ${cx + r * 0.88} ${height * 0.85}`}
        fill="none" stroke="url(#archGold)" strokeWidth="0.8" opacity="0.4"
      />
      {/* Top ornament */}
      <g transform={`translate(${cx}, ${archTop + 2})`}>
        <polygon points="0,-8 6,0 0,8 -6,0" fill={GOLD} opacity="0.9" />
        <polygon points="0,-8 6,0 0,8 -6,0" fill="none" stroke={GOLD_L} strokeWidth="0.5" opacity="0.6" />
        <circle cx="-12" cy="0" r="2.5" fill={GOLD} opacity="0.5" />
        <circle cx="12" cy="0" r="2.5" fill={GOLD} opacity="0.5" />
      </g>
      {/* Base line */}
      <line x1={cx - r} y1={height * 0.85} x2={cx + r} y2={height * 0.85} stroke="url(#archGold)" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

// ── Floral wreath frame ────────────────────────────────────────────────────────
function FloralWreathFrame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: 'relative', display: 'inline-block', maxWidth: 380, width: '100%' }}>
      {/* Wreath image behind content */}
      <img
        src="/assets/templates/flora-fauna/floral-wreath.jpg"
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute', inset: '-14% -10%',
          width: '120%', height: '120%',
          objectFit: 'contain',
          mixBlendMode: 'multiply',
          pointerEvents: 'none',
          opacity: 0.85,
        }}
      />
      {/* Content inside wreath */}
      <div style={{ position: 'relative', zIndex: 1, padding: '48px 36px 44px' }}>
        {children}
      </div>
    </div>
  );
}

// ── Gold divider line ──────────────────────────────────────────────────────────
function GoldLine() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '16px 0' }}>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${GOLD_D})` }} />
      <svg width="10" height="10" viewBox="0 0 10 10">
        <polygon points="5,0 10,5 5,10 0,5" fill={GOLD_D} opacity="0.6" />
      </svg>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, ${GOLD_D})` }} />
    </div>
  );
}

// ── Section heading ────────────────────────────────────────────────────────────
function SectionTitle({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 36 }}>
      <PeacockDivider />
      <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: GOLD_D, margin: '10px 0 4px' }}>
        {children}
      </h2>
      {sub && <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, color: MUTED, fontStyle: 'italic', margin: '0 0 8px' }}>{sub}</p>}
      <PeacockDivider />
    </div>
  );
}

// ── Corner peacock feather (SVG) ───────────────────────────────────────────────
function FeatherCorner({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  const sx = pos === 'tr' || pos === 'br' ? -1 : 1;
  const sy = pos === 'bl' || pos === 'br' ? -1 : 1;
  const posStyle: React.CSSProperties =
    pos === 'tl' ? { top: 0, left: 0 } :
    pos === 'tr' ? { top: 0, right: 0 } :
    pos === 'bl' ? { bottom: 0, left: 0 } :
    { bottom: 0, right: 0 };
  return (
    <div style={{ position: 'absolute', width: 80, height: 80, pointerEvents: 'none', ...posStyle }}>
      <svg width="80" height="80" viewBox="0 0 80 80" style={{ transform: `scale(${sx}, ${sy})` }} opacity="0.22">
        {/* Feather spine */}
        <path d="M 5 75 Q 30 50 60 10" stroke={TEAL} strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* Feather barbs */}
        {[20, 35, 50, 65].map((pct, i) => {
          const t = pct / 100;
          const x = 5 + t * 55; const y = 75 - t * 65;
          const len = 12 - i * 2;
          return (
            <g key={i}>
              <line x1={x} y1={y} x2={x - len} y2={y - 8} stroke={TEAL_L} strokeWidth="0.8" strokeLinecap="round" />
              <line x1={x} y1={y} x2={x + len * 0.4} y2={y - 9} stroke={TEAL_L} strokeWidth="0.8" strokeLinecap="round" />
            </g>
          );
        })}
        {/* Eye at tip */}
        <ellipse cx="61" cy="9" rx="7" ry="7" fill="none" stroke={GOLD} strokeWidth="0.8" />
        <ellipse cx="61" cy="9" rx="4" ry="4" fill={TEAL} opacity="0.4" />
        <circle cx="61" cy="9" r="2" fill={GOLD} opacity="0.7" />
      </svg>
    </div>
  );
}

// ── Falling petals data ────────────────────────────────────────────────────────
const PETAL_COLORS = ['#ff9f7f', '#ffbfcc', '#7fc4d4', '#f9df8a', '#c8a8e9', '#a8dab5', '#f4a0c0', '#80c8e0'];
const PETALS_DATA = Array.from({ length: 28 }, (_, i) => ({
  left:  ((i * 17 + 5) % 100),
  delay: ((i * 0.53) % 9),
  dur:   5.5 + (i % 6) * 0.9,
  size:  7 + (i % 5) * 3,
  color: PETAL_COLORS[i % PETAL_COLORS.length],
  sway:  ((i % 3) - 1) * 45,
  shape: i % 3, // 0=circle, 1=ellipse petal, 2=leaf
}));

// ── Flower petal SVG ───────────────────────────────────────────────────────────
function FloralPetal({ size, color, shape }: { size: number; color: string; shape: number }) {
  if (shape === 1) {
    return (
      <svg width={size} height={size * 1.7} viewBox="0 0 14 22" style={{ display: 'block' }}>
        <path d="M7,0 C7,0 14,7 14,13 C14,18 11,21 7,22 C3,21 0,18 0,13 C0,7 7,0 7,0Z" fill={color} opacity="0.85" />
      </svg>
    );
  }
  if (shape === 2) {
    return (
      <svg width={size * 1.4} height={size} viewBox="0 0 24 14" style={{ display: 'block' }}>
        <ellipse cx="12" cy="7" rx="11" ry="6" fill={color} opacity="0.75" />
        <line x1="1" y1="7" x2="23" y2="7" stroke="rgba(255,255,255,0.3)" strokeWidth="0.7" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" style={{ display: 'block' }}>
      {[0, 60, 120, 180, 240, 300].map(a => (
        <ellipse key={a} cx="7" cy="7" rx="3" ry="5.5"
          fill={color} transform={`rotate(${a}, 7, 7) translate(0,-3)`} opacity="0.8" />
      ))}
      <circle cx="7" cy="7" r="2.5" fill="rgba(255,255,255,0.7)" />
    </svg>
  );
}

// ── Animated peacock SVG (decorative, on cover) ────────────────────────────────
function PeacockSVG({ size = 180 }: { size?: number }) {
  const s = size / 180;
  return (
    <svg
      width={size} height={size * 1.1}
      viewBox="0 0 180 198"
      style={{ display: 'block', animation: 'peacockSway 4s ease-in-out infinite', transformOrigin: 'bottom center' }}
    >
      {/* Tail feathers (fan behind body) */}
      <g style={{ animation: 'featherSpread 5s ease-in-out infinite', transformOrigin: '90px 140px' }}>
        {[-60,-45,-30,-15,0,15,30,45,60].map((angle, i) => (
          <g key={i} transform={`rotate(${angle} 90 145)`}>
            {/* Feather stem */}
            <line x1="90" y1="145" x2="90" y2="30" stroke="#1a6e7e" strokeWidth="1.2" opacity="0.6" />
            {/* Feather eye */}
            <ellipse cx="90" cy="28" rx="9" ry="12" fill="#1a8fa8" opacity="0.3" style={{ animation: `eyeGlow ${2.5 + i * 0.3}s ease-in-out infinite` }} />
            <ellipse cx="90" cy="28" rx="5.5" ry="7.5" fill="#0d5c70" opacity="0.5" style={{ animation: `eyeGlow ${2 + i * 0.3}s ease-in-out infinite` }} />
            <ellipse cx="90" cy="28" rx="3" ry="4" fill={GOLD} opacity="0.75" />
            <circle cx="90" cy="28" r="1.5" fill="#08303a" />
            {/* Feather barbs */}
            {[-12,-7,7,12].map((bx, j) => (
              <line key={j} x1="90" y1={50 + j * 18} x2={90 + bx * (1 + j * 0.1)} y2={44 + j * 18} stroke="#2da8c0" strokeWidth="0.7" opacity="0.4" />
            ))}
          </g>
        ))}
      </g>

      {/* Body */}
      <ellipse cx="90" cy="148" rx="20" ry="28" fill="#1a6e7e" opacity="0.9" />
      {/* Wing sheen */}
      <ellipse cx="83" cy="152" rx="14" ry="20" fill="#0d4d5a" opacity="0.5" transform="rotate(-8 83 152)" />
      {/* Chest - iridescent teal */}
      <ellipse cx="90" cy="140" rx="14" ry="18" fill="#29b8d4" opacity="0.7" />
      {/* Neck */}
      <path d="M 83 126 Q 78 110 82 96 Q 86 84 90 80 Q 94 84 98 96 Q 102 110 97 126 Z" fill="#1a6e7e" />
      {/* Head */}
      <circle cx="90" cy="76" r="13" fill="#1a7a8c" />
      <circle cx="90" cy="76" r="11" fill="#29b8d4" opacity="0.7" />
      {/* Eye */}
      <circle cx="94" cy="73" r="3.5" fill="white" />
      <circle cx="94.5" cy="73" r="2.5" fill="#08202a" />
      <circle cx="95.2" cy="72.2" r="0.9" fill="white" />
      {/* Beak */}
      <path d="M 90 84 L 84 90 L 90 88 Z" fill={GOLD} opacity="0.9" />
      {/* Crown feathers */}
      {[-1,0,1].map((ox, ci) => (
        <g key={ci}>
          <line x1={90 + ox * 6} y1="64" x2={90 + ox * 9} y2="48" stroke="#2da8c0" strokeWidth="1.2" />
          <circle cx={90 + ox * 9} cy="47" r="2.5" fill={GOLD} opacity="0.85" />
        </g>
      ))}
      {/* Gold breast spot */}
      <ellipse cx="90" cy="138" rx="6" ry="8" fill={GOLD} opacity="0.3" />
      {/* Legs */}
      <line x1="84" y1="174" x2="80" y2="192" stroke="#0d4d5a" strokeWidth="2.5" />
      <line x1="96" y1="174" x2="100" y2="192" stroke="#0d4d5a" strokeWidth="2.5" />
      {/* Feet */}
      <path d="M80,192 L74,196 M80,192 L78,198 M80,192 L84,197" stroke="#0d4d5a" strokeWidth="1.5" />
      <path d="M100,192 L94,196 M100,192 L98,198 M100,192 L104,197" stroke="#0d4d5a" strokeWidth="1.5" />
    </svg>
  );
}

// ── Floating feather eye (background decoration) ───────────────────────────────
const FLOAT_EYES = Array.from({ length: 10 }, (_, i) => ({
  left:  ((i * 23 + 8) % 90),
  delay: ((i * 0.8) % 7),
  dur:   8 + (i % 5) * 1.5,
  size:  14 + (i % 4) * 6,
}));

// ── Bottom navigation ──────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'beranda', label: 'Beranda', d: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z' },
  { id: 'mempelai', label: 'Mempelai', d: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' },
  { id: 'acara', label: 'Acara', d: 'M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z' },
  { id: 'galeri', label: 'Galeri', d: 'M22 16V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zm-11-4l2.03 2.71L16 11l4 5H8l3-4zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z' },
  { id: 'ucapan', label: 'Ucapan', d: 'M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z' },
];

// ══════════════════════════════════════════════════════════════════════════════
export default function FloraFauna({
  data, guestName, slug, onRsvpSubmit, onGuestbookSubmit, rsvps, guestbook,
}: TemplateProps) {
  const [opened, setOpened] = useState(false);
  const [activeNav, setActiveNav] = useState('beranda');
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [archSize, setArchSize] = useState({ w: 340, h: 520 });
  const coverRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const pria   = data.mempelai.pria;
  const wanita = data.mempelai.wanita;
  const primaFirst = data.mempelai.urutanTampil !== 'wanita-dulu';
  const m1 = primaFirst ? pria : wanita;
  const m2 = primaFirst ? wanita : pria;
  const firstAcara = data.acara[0];
  const countdownTarget = data.countdown.tanggal || firstAcara?.tanggal || '';

  // Measure cover for arch sizing
  useEffect(() => {
    const el = coverRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect;
      setArchSize({ w: Math.min(width * 0.9, 340), h: Math.min(height * 0.85, 520) });
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Scroll spy
  useEffect(() => {
    if (!opened) return;
    const onScroll = () => {
      const y = window.scrollY + 180;
      for (const [id, el] of Object.entries(sectionRefs.current)) {
        if (el && el.offsetTop <= y) setActiveNav(id);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [opened]);

  const setRef = (id: string) => (el: HTMLElement | null) => { sectionRefs.current[id] = el; };
  const scrollTo = (id: string) => sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div style={{ background: CREAM, color: DARK, minHeight: '100vh', fontFamily: "'Cormorant Garamond', serif" }}>

      {/* ── CSS animations ── */}
      <style>{`
        @keyframes floraFadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        @keyframes archGlow { 0%,100% { opacity: 0.75; } 50% { opacity: 1; } }
        @keyframes petalFall {
          0%   { transform: translateY(-60px) rotate(0deg) translateX(0px); opacity: 0; }
          8%   { opacity: 0.85; }
          92%  { opacity: 0.6; }
          100% { transform: translateY(110vh) rotate(480deg) translateX(var(--sway,30px)); opacity: 0; }
        }
        @keyframes floatUp {
          0%   { transform: translateY(0) scale(1) rotate(0deg); opacity: 0; }
          10%  { opacity: 0.35; }
          90%  { opacity: 0.2; }
          100% { transform: translateY(-110vh) scale(0.7) rotate(180deg); opacity: 0; }
        }
        @keyframes peacockSway {
          0%,100% { transform: rotate(-3deg) translateY(0); }
          50%     { transform: rotate(3deg) translateY(-6px); }
        }
        @keyframes featherSpread {
          0%,100% { transform: scaleX(1) scaleY(1); }
          50%     { transform: scaleX(1.06) scaleY(1.04); }
        }
        @keyframes eyeGlow {
          0%,100% { opacity: 0.55; }
          50%     { opacity: 0.9; }
        }
        @keyframes petalBob {
          0%,100% { transform: translateY(0) rotate(0deg); }
          33%     { transform: translateY(-5px) rotate(8deg); }
          66%     { transform: translateY(3px) rotate(-5deg); }
        }
      `}</style>

      {/* ── Music ── */}
      {data.musik.url && (
        <MusicPlayer
          url={data.musik.url}
          autoplay={data.musik.autoplay && opened}
          color={GOLD}
          bgColor="rgba(18,13,8,0.92)"
          borderColor={GOLD_D}
          positionClassName="fixed bottom-20 right-4 z-50"
        />
      )}

      <ShareButton
        slug={slug}
        pria={pria.namaPanggilan || pria.namaLengkap}
        wanita={wanita.namaPanggilan || wanita.namaLengkap}
        primaryColor={GOLD}
      />

      {/* ════════════════════════ COVER ════════════════════════ */}
      {!opened && (
        <div
          ref={coverRef}
          style={{
            position: 'fixed', inset: 0, zIndex: 40,
            backgroundImage: "url('/assets/templates/flora-fauna/peacock.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'bottom center',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            textAlign: 'center', overflow: 'hidden',
          }}
        >
          {/* Dark center overlay for text readability */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse 65% 70% at 50% 45%, rgba(18,13,8,0.68) 0%, rgba(18,13,8,0.25) 70%, transparent 100%)',
          }} />

          {/* Falling flower petals */}
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
            {PETALS_DATA.map((p, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: `${p.left}%`,
                  top: -40,
                  // @ts-ignore
                  '--sway': `${p.sway}px`,
                  animation: `petalFall ${p.dur}s ${p.delay}s linear infinite`,
                }}
              >
                <FloralPetal size={p.size} color={p.color} shape={p.shape} />
              </div>
            ))}
          </div>

          {/* Animated peacock SVG (bottom-left overlay) */}
          <div style={{
            position: 'absolute', bottom: 0, left: '5%',
            zIndex: 3, pointerEvents: 'none',
            filter: 'drop-shadow(0 4px 16px rgba(29,122,140,0.5))',
          }}>
            <PeacockSVG size={160} />
          </div>
          {/* Mirror peacock (bottom-right) */}
          <div style={{
            position: 'absolute', bottom: 0, right: '5%',
            zIndex: 3, pointerEvents: 'none',
            transform: 'scaleX(-1)',
            filter: 'drop-shadow(0 4px 16px rgba(29,122,140,0.5))',
          }}>
            <PeacockSVG size={140} />
          </div>

          {/* Gold arch */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: archSize.w, height: archSize.h, animation: 'archGlow 3s ease-in-out infinite' }}>
              <GoldArch width={archSize.w} height={archSize.h} />
            </div>
          </div>

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 2, padding: '32px 28px', animation: 'floraFadeIn 1.2s ease forwards' }}>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: 12, letterSpacing: '0.3em',
              color: GOLD_L, fontStyle: 'italic', marginBottom: 16, opacity: 0.9,
            }}>
              The Wedding of
            </p>

            {guestName && (
              <div style={{
                marginBottom: 20, padding: '10px 22px',
                border: `1px solid ${GOLD_D}`, borderRadius: 3,
                background: 'rgba(18,13,8,0.45)',
              }}>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: GOLD_D, marginBottom: 4 }}>
                  Kepada Yth.
                </p>
                <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: 28, color: GOLD_L, margin: 0 }}>
                  {guestName}
                </p>
              </div>
            )}

            <h1 style={{
              fontFamily: "'Great Vibes', cursive", fontSize: 58,
              color: GOLD_L, lineHeight: 1.1, margin: '0 0 4px',
              textShadow: `0 2px 24px rgba(201,168,76,0.5), 0 0 40px rgba(201,168,76,0.2)`,
            }}>
              {m1.namaPanggilan || m1.namaLengkap || '—'}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, margin: '6px 0' }}>
              <div style={{ height: 1, width: 36, background: GOLD_D, opacity: 0.7 }} />
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: GOLD, fontStyle: 'italic' }}>&amp;</span>
              <div style={{ height: 1, width: 36, background: GOLD_D, opacity: 0.7 }} />
            </div>

            <h1 style={{
              fontFamily: "'Great Vibes', cursive", fontSize: 58,
              color: GOLD_L, lineHeight: 1.1, margin: '4px 0 18px',
              textShadow: `0 2px 24px rgba(201,168,76,0.5), 0 0 40px rgba(201,168,76,0.2)`,
            }}>
              {m2.namaPanggilan || m2.namaLengkap || '—'}
            </h1>

            {firstAcara && (
              <p style={{
                fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: '0.28em',
                textTransform: 'uppercase', color: GOLD_D, marginBottom: 28, opacity: 0.9,
              }}>
                {new Date(firstAcara.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            )}

            <button
              onClick={() => setOpened(true)}
              style={{
                padding: '13px 44px', background: 'transparent',
                border: `1.5px solid ${GOLD}`, color: GOLD,
                fontSize: 9, letterSpacing: '0.45em', textTransform: 'uppercase',
                cursor: 'pointer', fontFamily: "'Inter', sans-serif", borderRadius: 2,
                transition: 'background 0.3s, color 0.3s',
              }}
              onMouseEnter={e => { (e.target as HTMLButtonElement).style.background = GOLD; (e.target as HTMLButtonElement).style.color = DARK; }}
              onMouseLeave={e => { (e.target as HTMLButtonElement).style.background = 'transparent'; (e.target as HTMLButtonElement).style.color = GOLD; }}
            >
              Buka Undangan
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════ MAIN CONTENT ════════════════════════ */}
      {opened && (
        <div>

          {/* ── HERO BANNER (after open) ── */}
          <section
            ref={setRef('beranda')}
            style={{
              position: 'relative', height: 280, overflow: 'hidden',
              backgroundImage: "url('/assets/templates/flora-fauna/peacock.jpg')",
              backgroundSize: 'cover', backgroundPosition: 'top center',
            }}
          >
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(18,13,8,0.4) 0%, rgba(18,13,8,0.7) 100%)' }} />
            <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 24px' }}>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 11, letterSpacing: '0.3em', color: GOLD_D, fontStyle: 'italic', marginBottom: 8 }}>The Wedding of</p>
              <h2 style={{ fontFamily: "'Great Vibes', cursive", fontSize: 48, color: GOLD_L, margin: 0, textShadow: `0 2px 20px rgba(201,168,76,0.4)` }}>
                {m1.namaPanggilan || m1.namaLengkap} &amp; {m2.namaPanggilan || m2.namaLengkap}
              </h2>
              {firstAcara && (
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: GOLD_D, marginTop: 12 }}>
                  {fmt(firstAcara.tanggal)}
                </p>
              )}
            </div>
          </section>

          {/* ── BISMILLAH / QUOTE ── */}
          <section style={{ background: CREAM, padding: '56px 28px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            {/* Floating feather eyes background */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
              {FLOAT_EYES.map((fe, i) => (
                <div key={i} style={{
                  position: 'absolute', left: `${fe.left}%`, bottom: '-20px',
                  animation: `floatUp ${fe.dur}s ${fe.delay}s linear infinite`,
                }}>
                  <svg width={fe.size} height={fe.size} viewBox="0 0 32 32" style={{ animation: `eyeGlow ${2 + i * 0.4}s ease-in-out infinite` }}>
                    <ellipse cx="16" cy="16" rx="14" ry="14" fill="none" stroke={GOLD_D} strokeWidth="0.7" opacity="0.3" />
                    <ellipse cx="16" cy="16" rx="9" ry="9" fill={TEAL} opacity="0.15" />
                    <ellipse cx="16" cy="16" rx="5" ry="5" fill={GOLD} opacity="0.35" />
                    <circle cx="16" cy="16" r="2.5" fill={DARK} opacity="0.4" />
                  </svg>
                </div>
              ))}
            </div>
            <FadeIn>
              {data.quote.teks ? (
                <div style={{ maxWidth: 520, margin: '0 auto' }}>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontStyle: 'italic', color: DARK, lineHeight: 1.8, marginBottom: 12 }}>
                    &ldquo;{data.quote.teks}&rdquo;
                  </p>
                  {data.quote.sumber && (
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: GOLD_D, opacity: 0.7 }}>
                      — {data.quote.sumber}
                    </p>
                  )}
                </div>
              ) : (
                <div style={{ maxWidth: 480, margin: '0 auto' }}>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontStyle: 'italic', color: MUTED, lineHeight: 1.9 }}>
                    &ldquo;Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu istri-istri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya.&rdquo;
                  </p>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', color: GOLD_D, marginTop: 10, opacity: 0.7 }}>
                    — Q.S. Ar-Rum: 21
                  </p>
                </div>
              )}
            </FadeIn>
            <PeacockDivider />
          </section>

          {/* ── MEMPELAI ── */}
          <section
            ref={setRef('mempelai')}
            style={{ background: CREAM2, padding: '48px 20px 56px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}
          >
            {/* Gentle petals on couple section */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
              {PETALS_DATA.filter((_, i) => i % 3 === 0).map((p, i) => (
                <div key={i} style={{
                  position: 'absolute', left: `${p.left}%`, top: -30,
                  // @ts-ignore
                  '--sway': `${p.sway * 0.5}px`,
                  animation: `petalFall ${p.dur * 1.4}s ${p.delay * 0.8}s linear infinite`,
                  opacity: 0.5,
                }}>
                  <FloralPetal size={p.size - 2} color={p.color} shape={p.shape} />
                </div>
              ))}
            </div>
            <FadeIn>
              <SectionTitle sub="Dengan penuh rasa syukur, kami mengundang Anda">Mempelai</SectionTitle>
            </FadeIn>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 40, alignItems: 'center', maxWidth: 480, margin: '0 auto' }}>
              {[m1, m2].map((m, i) => (
                <FadeIn key={i} delay={i * 150}>
                  <FloralWreathFrame>
                    {m.foto && (
                      <div style={{ marginBottom: 16 }}>
                        <img
                          src={m.foto}
                          alt={m.namaLengkap}
                          style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${GOLD_D}`, boxShadow: `0 4px 20px rgba(201,168,76,0.25)` }}
                        />
                      </div>
                    )}
                    <h3 style={{ fontFamily: "'Great Vibes', cursive", fontSize: 40, color: DARK, margin: '0 0 4px', lineHeight: 1.1 }}>
                      {m.namaPanggilan || m.namaLengkap}
                    </h3>
                    {m.namaPanggilan && (
                      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, color: MUTED, fontStyle: 'italic', margin: '0 0 10px' }}>
                        {m.namaLengkap}
                      </p>
                    )}
                    {m.anakKe && (
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: GOLD_D, letterSpacing: '0.15em', marginBottom: 6 }}>
                        Putra/i ke-{m.anakKe}
                      </p>
                    )}
                    {(m.ayah || m.ibu) && (
                      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, color: MUTED, lineHeight: 1.7, margin: 0 }}>
                        {m.ayah && <span>{m.ayah}</span>}
                        {m.ayah && m.ibu && <span style={{ color: GOLD_D }}> &amp; </span>}
                        {m.ibu && <span>{m.ibu}</span>}
                      </p>
                    )}
                    {m.instagram && (
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: TEAL, marginTop: 8 }}>
                        @{m.instagram}
                      </p>
                    )}
                  </FloralWreathFrame>
                </FadeIn>
              ))}
            </div>
          </section>

          {/* ── ACARA ── */}
          <section
            ref={setRef('acara')}
            style={{ background: DARK2, padding: '56px 24px' }}
          >
            <FadeIn>
              <div style={{ textAlign: 'center', marginBottom: 36 }}>
                <PeacockDivider />
                <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: GOLD_D, margin: '10px 0 4px' }}>
                  Acara Pernikahan
                </h2>
                <PeacockDivider />
              </div>
            </FadeIn>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 480, margin: '0 auto' }}>
              {data.acara.map((acara, i) => (
                <FadeIn key={i} delay={i * 150}>
                  <div style={{
                    background: 'rgba(255,255,255,0.04)', border: `1px solid ${GOLD_D}`,
                    borderRadius: 12, padding: '28px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden',
                  }}>
                    <FeatherCorner pos="tl" />
                    <FeatherCorner pos="tr" />
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontStyle: 'italic', color: GOLD_L, marginBottom: 16 }}>
                      {acara.nama}
                    </h3>
                    <GoldLine />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, justifyContent: 'center' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill={GOLD_D} style={{ flexShrink: 0, marginTop: 2 }}>
                          <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/>
                        </svg>
                        <div>
                          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, color: CREAM, margin: 0, fontStyle: 'italic' }}>{fmt(acara.tanggal)}</p>
                          {(acara.waktuMulai || acara.waktuSelesai) && (
                            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: GOLD_D, margin: '2px 0 0', letterSpacing: '0.1em' }}>
                              {fmtTime(acara.waktuMulai)}{acara.waktuSelesai ? ` – ${fmtTime(acara.waktuSelesai)}` : ''} WIB
                            </p>
                          )}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, justifyContent: 'center' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill={GOLD_D} style={{ flexShrink: 0, marginTop: 2 }}>
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                        <div>
                          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, color: CREAM, margin: 0 }}>{acara.lokasi}</p>
                          {acara.alamat && (
                            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: GOLD_D, margin: '2px 0 0', lineHeight: 1.5 }}>{acara.alamat}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    {acara.mapsUrl && (
                      <a
                        href={acara.mapsUrl} target="_blank" rel="noopener noreferrer"
                        style={{
                          display: 'inline-block', marginTop: 20, padding: '9px 28px',
                          border: `1px solid ${GOLD_D}`, color: GOLD, borderRadius: 4,
                          fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase',
                          textDecoration: 'none', transition: 'background 0.2s',
                        }}
                      >
                        Lihat Peta
                      </a>
                    )}
                  </div>
                </FadeIn>
              ))}
            </div>
          </section>

          {/* ── COUNTDOWN ── */}
          {countdownTarget && (
            <section style={{ background: DARK, padding: '52px 24px', textAlign: 'center' }}>
              <FadeIn>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, fontStyle: 'italic', color: GOLD_D, marginBottom: 6 }}>
                  Menghitung hari menuju hari bahagia
                </p>
                <h3 style={{ fontFamily: "'Great Vibes', cursive", fontSize: 36, color: GOLD_L, marginBottom: 28 }}>
                  {m1.namaPanggilan || m1.namaLengkap} &amp; {m2.namaPanggilan || m2.namaLengkap}
                </h3>
                <FaunaCountdown targetDate={countdownTarget} />
              </FadeIn>
            </section>
          )}

          {/* ── GALERI ── */}
          {data.galeri.length > 0 && (
            <section
              ref={setRef('galeri')}
              style={{ background: CREAM, padding: '56px 20px' }}
            >
              <FadeIn><SectionTitle>Galeri</SectionTitle></FadeIn>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, maxWidth: 500, margin: '0 auto' }}>
                {data.galeri.map((src, i) => (
                  <FadeIn key={i} delay={i * 80}>
                    <div
                      onClick={() => setLightboxImg(src)}
                      style={{
                        cursor: 'zoom-in', borderRadius: 8, overflow: 'hidden',
                        border: `1.5px solid ${GOLD_D}`, aspectRatio: '1/1',
                        transition: 'transform 0.3s, box-shadow 0.3s',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.03)'; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 24px rgba(201,168,76,0.3)`; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}
                    >
                      <img src={src} alt={`Foto ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                  </FadeIn>
                ))}
              </div>
              {/* Lightbox */}
              {lightboxImg && (
                <div
                  onClick={() => setLightboxImg(null)}
                  style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(18,13,8,0.94)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out' }}
                >
                  <img src={lightboxImg} alt="Foto besar" style={{ maxWidth: '92vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: 8, border: `2px solid ${GOLD_D}` }} />
                </div>
              )}
            </section>
          )}

          {/* ── LOVE STORY ── */}
          {data.loveStory.length > 0 && (
            <section style={{ background: CREAM2, padding: '56px 24px' }}>
              <FadeIn><SectionTitle sub="Perjalanan cinta kami">Love Story</SectionTitle></FadeIn>
              <div style={{ maxWidth: 480, margin: '0 auto', position: 'relative' }}>
                {/* Timeline line */}
                <div style={{ position: 'absolute', left: 20, top: 0, bottom: 0, width: 1, background: `linear-gradient(to bottom, transparent, ${GOLD_D}, transparent)` }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 32, paddingLeft: 48 }}>
                  {data.loveStory.map((item, i) => (
                    <FadeIn key={i} delay={i * 120} from="left">
                      <div style={{ position: 'relative' }}>
                        {/* Timeline bullet - peacock eye */}
                        <div style={{ position: 'absolute', left: -42, top: 4, width: 16, height: 16 }}>
                          <svg width="16" height="16" viewBox="0 0 16 16">
                            <ellipse cx="8" cy="8" rx="7" ry="7" fill="none" stroke={GOLD_D} strokeWidth="0.8" />
                            <ellipse cx="8" cy="8" rx="4" ry="4" fill={TEAL} opacity="0.4" />
                            <circle cx="8" cy="8" r="2" fill={GOLD} />
                          </svg>
                        </div>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: '0.2em', color: GOLD_D, textTransform: 'uppercase' }}>
                          {item.tahun}
                        </span>
                        <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontStyle: 'italic', color: DARK, margin: '4px 0 6px' }}>
                          {item.judul}
                        </h4>
                        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, color: MUTED, lineHeight: 1.7, margin: 0 }}>
                          {item.cerita}
                        </p>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ── RSVP ── */}
          {data.rsvpAktif && (
            <section
              ref={setRef('ucapan')}
              style={{ background: DARK2, padding: '56px 24px' }}
            >
              <FadeIn>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                  <PeacockDivider />
                  <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: GOLD_D, margin: '10px 0 4px' }}>
                    Konfirmasi Kehadiran
                  </h2>
                  <PeacockDivider />
                </div>
              </FadeIn>
              <div style={{ maxWidth: 480, margin: '0 auto' }}>
                <RsvpForm
                  slug={slug}
                  onSubmit={onRsvpSubmit}
                  rsvps={rsvps}
                  primaryColor={GOLD}
                />
              </div>
            </section>
          )}

          {/* ── GUESTBOOK ── */}
          {data.guestbookAktif && (
            <section style={{ background: CREAM, padding: '56px 24px' }}>
              <FadeIn>
                <SectionTitle sub="Sampaikan doa dan ucapan terbaik Anda">Buku Tamu</SectionTitle>
              </FadeIn>
              <div style={{ maxWidth: 480, margin: '0 auto' }}>
                <GuestbookForm
                  onSubmit={onGuestbookSubmit}
                  guestbook={guestbook}
                  primaryColor={GOLD}
                />
              </div>
            </section>
          )}

          {/* ── AMPLOP DIGITAL ── */}
          {data.amplopDigital.aktif && (
            <section style={{ background: CREAM2, padding: '56px 24px' }}>
              <FadeIn>
                <SectionTitle sub="Hadiah terbaik adalah doa restu Anda">Amplop Digital</SectionTitle>
              </FadeIn>
              <div style={{ maxWidth: 480, margin: '0 auto' }}>
                <AmplopDigitalComponent amplop={data.amplopDigital} primaryColor={GOLD} />
              </div>
            </section>
          )}

          {/* ── LIVESTREAM ── */}
          {data.livestream.aktif && data.livestream.url && (
            <section style={{ background: DARK, padding: '56px 24px', textAlign: 'center' }}>
              <FadeIn>
                <PeacockDivider />
                <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: GOLD_D, margin: '10px 0 12px' }}>
                  Live Streaming
                </h2>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, color: GOLD_D, fontStyle: 'italic', marginBottom: 24 }}>
                  Saksikan momen bahagia kami secara online
                </p>
                <a
                  href={data.livestream.url} target="_blank" rel="noopener noreferrer"
                  style={{
                    display: 'inline-block', padding: '13px 44px',
                    background: GOLD_D, color: DARK, borderRadius: 4,
                    fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase',
                    textDecoration: 'none', fontWeight: 600,
                  }}
                >
                  Tonton Live →
                </a>
                <PeacockDivider />
              </FadeIn>
            </section>
          )}

          {/* ── FOOTER ── */}
          <section style={{
            background: DARK,
            backgroundImage: "url('/assets/templates/flora-fauna/peacock.jpg')",
            backgroundSize: 'cover', backgroundPosition: 'top center',
            padding: '64px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(18,13,8,0.82)' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <FadeIn>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 12, letterSpacing: '0.3em', color: GOLD_D, fontStyle: 'italic', marginBottom: 8 }}>
                  Kami yang berbahagia
                </p>
                <h2 style={{ fontFamily: "'Great Vibes', cursive", fontSize: 52, color: GOLD_L, margin: '0 0 4px', textShadow: `0 2px 20px rgba(201,168,76,0.4)` }}>
                  {m1.namaPanggilan || m1.namaLengkap}
                </h2>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: GOLD, fontStyle: 'italic', margin: '6px 0' }}>&amp;</div>
                <h2 style={{ fontFamily: "'Great Vibes', cursive", fontSize: 52, color: GOLD_L, margin: '0 0 28px', textShadow: `0 2px 20px rgba(201,168,76,0.4)` }}>
                  {m2.namaPanggilan || m2.namaLengkap}
                </h2>
                <GoldLine />
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, color: GOLD_D, fontStyle: 'italic', margin: '20px 0 28px', opacity: 0.8 }}>
                  Terima kasih atas doa dan kehadiran Anda. Merupakan kehormatan bagi kami.
                </p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 8, letterSpacing: '0.35em', textTransform: 'uppercase', color: GOLD_D, opacity: 0.4, marginTop: 32 }}>
                  Nikah Yuk · By Ratna Offset
                </p>
              </FadeIn>
            </div>
          </section>

          {/* ── BOTTOM NAV ── */}
          <nav style={{
            position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
            background: 'rgba(18,13,8,0.96)', borderTop: `1px solid ${GOLD_D}`,
            display: 'flex', justifyContent: 'space-around', padding: '10px 0 12px',
          }}>
            {NAV_ITEMS.map(item => {
              const active = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { scrollTo(item.id); setActiveNav(item.id); }}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: active ? GOLD_L : GOLD_D, transition: 'color 0.2s',
                    padding: '2px 8px',
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d={item.d} />
                  </svg>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, letterSpacing: '0.08em' }}>{item.label}</span>
                </button>
              );
            })}
          </nav>
          <div style={{ height: 72 }} />
        </div>
      )}
    </div>
  );
}
