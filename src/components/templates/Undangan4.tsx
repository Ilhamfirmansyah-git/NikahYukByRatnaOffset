'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { TemplateProps } from './TemplateProps';
import MusicPlayer from '@/components/invitation/MusicPlayer';
import RsvpForm from '@/components/invitation/RsvpForm';
import GuestbookForm from '@/components/invitation/GuestbookForm';
import AmplopDigitalComponent from '@/components/invitation/AmplopDigital';
import ShareButton from '@/components/invitation/ShareButton';
import GoogleMapsEmbed from '@/components/invitation/GoogleMapsEmbed';

// ── Assets ────────────────────────────────────────────────────────────────────
const BG_FALLBACK = '/assets/templates/undangan4/bg.webp';

// ── Theme ─────────────────────────────────────────────────────────────────────
type ThemeMode = 'light' | 'dark';

function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light';
  const stored = localStorage.getItem('undangan4-theme');
  if (stored === 'dark' || stored === 'light') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// ── Colors ────────────────────────────────────────────────────────────────────
function makeColors(mode: ThemeMode) {
  const d = mode === 'dark';
  return {
    bgLD: d ? '#212529' : '#f8f9fa',
    bgWB: d ? '#000000' : '#ffffff',
    bgCard: d ? '#343a40' : '#f8f9fa',
    text: d ? '#f8f9fa' : '#212529',
    textMuted: d ? 'rgba(248,249,250,0.55)' : 'rgba(33,37,41,0.55)',
    border: d ? '#495057' : '#dee2e6',
    navBg: d ? 'rgba(33,37,41,0.75)' : 'rgba(248,249,250,0.75)',
    navLink: d ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
    navLinkActive: d ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)',
    overlayBg: d ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)',
    btnBorder: d ? '#f8f9fa' : '#212529',
    btnText: d ? '#f8f9fa' : '#212529',
    btnHoverBg: d ? '#f8f9fa' : '#212529',
    btnHoverText: d ? '#000000' : '#ffffff',
    btnBg: d ? 'rgba(33,37,41,0.5)' : 'rgba(248,249,250,0.5)',
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatTanggal(dateStr: string): string {
  const d = new Date(dateStr);
  const days = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
  const months = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

// ── Fade In ───────────────────────────────────────────────────────────────────
function FadeIn({ children, from = 'bottom', delay = 0 }: {
  children: React.ReactNode; from?: 'bottom' | 'left' | 'right'; delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.08 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const tx = from === 'left' ? 'translateX(-30px)' : from === 'right' ? 'translateX(30px)' : 'translateY(30px)';
  return (
    <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? 'none' : tx, transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

// ── Countdown ─────────────────────────────────────────────────────────────────
function Countdown({ target, c }: { target: string; c: ReturnType<typeof makeColors> }) {
  const calc = useCallback(() => {
    const diff = new Date(target).getTime() - Date.now();
    if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 };
    return { d: Math.floor(diff / 86400000), h: Math.floor((diff / 3600000) % 24), m: Math.floor((diff / 60000) % 60), s: Math.floor((diff / 1000) % 60) };
  }, [target]);
  const [t, setT] = useState(calc);
  useEffect(() => { const id = setInterval(() => setT(calc()), 1000); return () => clearInterval(id); }, [calc]);
  const items = [{ v: t.d, l: 'Hari' }, { v: t.h, l: 'Jam' }, { v: t.m, l: 'Menit' }, { v: t.s, l: 'Detik' }];
  return (
    <div style={{ display: 'flex', border: `1px solid ${c.border}`, borderRadius: 50, padding: '8px 12px', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginTop: 8, marginBottom: 16 }}>
      {items.map((item) => (
        <div key={item.l} style={{ flex: 1, textAlign: 'center', padding: '4px 2px' }}>
          <span style={{ fontSize: '1.25rem', display: 'inline', fontFamily: "'Josefin Sans', sans-serif" }}>{item.v}</span>
          <small style={{ marginLeft: 3, fontSize: '0.75rem', display: 'inline', color: c.textMuted }}>{item.l}</small>
        </div>
      ))}
    </div>
  );
}

// ── Wave SVG ──────────────────────────────────────────────────────────────────
function Wave({ path, waveBg, waveFill }: { path: string; waveBg: string; waveFill: string }) {
  return (
    <div style={{ overflow: 'hidden', transform: 'translateZ(0)', marginBottom: '-0.75rem' }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" style={{ display: 'block', backgroundColor: waveBg, transition: 'color 350ms ease, background-color 350ms ease' }}>
        <path fill={waveFill} fillOpacity="1" d={path} style={{ transition: 'fill 350ms ease' }} />
      </svg>
    </div>
  );
}

// ── Heart SVG (floating animation) ───────────────────────────────────────────
const HEART_PATH = "m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15";

function Heart({ style }: { style?: React.CSSProperties }) {
  return (
    <div style={{ position: 'absolute', pointerEvents: 'none', ...style }}>
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 16 16" style={{ opacity: 0.5, animation: 'u4-love 5s ease-in-out infinite' }}>
        <path d={HEART_PATH} />
      </svg>
    </div>
  );
}

// ── Carousel ──────────────────────────────────────────────────────────────────
function Carousel({ images, id, c }: { images: string[]; id: string; c: ReturnType<typeof makeColors> }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<string | null>(null);
  useEffect(() => {
    if (images.length <= 1) return;
    const iv = setInterval(() => setActive(a => (a + 1) % images.length), 4000);
    return () => clearInterval(iv);
  }, [images.length]);
  if (images.length === 0) return null;
  return (
    <>
      <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', marginTop: 16 }}>
        {images.map((src, i) => (
          <img key={i} src={src} alt={`img ${i + 1}`} onClick={() => setLightbox(src)}
            style={{ display: i === active ? 'block' : 'none', width: '100%', cursor: 'pointer', objectFit: 'cover' }} />
        ))}
        {images.length > 1 && (
          <>
            <button onClick={() => setActive(a => (a - 1 + images.length) % images.length)}
              style={{ position: 'absolute', top: '50%', left: 8, transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.4)', border: 'none', borderRadius: '50%', width: 32, height: 32, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
            <button onClick={() => setActive(a => (a + 1) % images.length)}
              style={{ position: 'absolute', top: '50%', right: 8, transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.4)', border: 'none', borderRadius: '50%', width: 32, height: 32, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
            <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
              {images.map((_, i) => (
                <button key={i} onClick={() => setActive(i)}
                  style={{ width: 8, height: 8, borderRadius: '50%', border: 'none', background: i === active ? '#fff' : 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: 0 }} />
              ))}
            </div>
          </>
        )}
      </div>
      {lightbox && (
        <div onClick={() => setLightbox(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <img src={lightbox} alt="" style={{ maxWidth: '95vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: 12 }} onClick={e => e.stopPropagation()} />
          <button onClick={() => setLightbox(null)}
            style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: 40, height: 40, color: '#fff', cursor: 'pointer', fontSize: 20 }}>✕</button>
        </div>
      )}
    </>
  );
}

// ── Collapse card (Love Gift) ────────────────────────────────────────────────
function CollapseCard({ icon, title, name, children, c }: {
  icon: React.ReactNode; title: string; name: string; children: React.ReactNode; c: ReturnType<typeof makeColors>;
}) {
  const [open, setOpen] = useState(false);
  return (
    <FadeIn delay={200}>
      <div style={{ background: c.bgCard, borderRadius: 16, padding: 12, margin: '16px 32px 0', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          {icon}
          <span style={{ fontFamily: "'Josefin Sans', sans-serif", color: c.text }}>{title}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ margin: 0, fontSize: '0.95rem', color: c.text }}>{name}</p>
          <button onClick={() => setOpen(v => !v)}
            style={{ fontSize: '0.75rem', padding: '2px 10px', borderRadius: 8, border: `1px solid ${c.btnBorder}`, background: 'transparent', color: c.btnText, cursor: 'pointer' }}>
            Info
          </button>
        </div>
        {open && (
          <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${c.border}` }}>
            {children}
          </div>
        )}
      </div>
    </FadeIn>
  );
}

// ── Inline SVG icons ──────────────────────────────────────────────────────────
const IconHouse = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293z"/><path d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293z"/></svg>;
const IconPeople = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4"/></svg>;
const IconCalendar = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M8 7a.5.5 0 0 1 .5.5V9H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V10H6a.5.5 0 0 1 0-1h1.5V7.5A.5.5 0 0 1 8 7"/><path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/></svg>;
const IconImages = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M4.502 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"/><path d="M14.002 13a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V5A2 2 0 0 1 2 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-1.998 2M14 2H4a1 1 0 0 0-1 1h9.002a2 2 0 0 1 2 2v7A1 1 0 0 0 15 11V3a1 1 0 0 0-1-1M2.002 4a1 1 0 0 0-1 1v8l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094l1.777 1.947V5a1 1 0 0 0-1-1z"/></svg>;
const IconComments = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/><path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9 9 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.4 10.4 0 0 1-.524 2.318l-.003.011a11 11 0 0 1-.244.637c-.079.186.074.394.273.362a22 22 0 0 0 .693-.125m.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6-3.004 6-7 6a8 8 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a11 11 0 0 0 .398-2"/></svg>;
const IconMoney = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2.5 1a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm0 3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm10 0a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM5 7.5A.5.5 0 0 1 5.5 7h5a.5.5 0 0 1 0 1h-5A.5.5 0 0 1 5 7.5"/></svg>;
const IconQR = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M0 .5A.5.5 0 0 1 .5 0h3a.5.5 0 0 1 0 1H1v2.5a.5.5 0 0 1-1 0zm12 0a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0V1h-2.5a.5.5 0 0 1-.5-.5M.5 12a.5.5 0 0 1 .5.5V15h2.5a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1 0-1H15v-2.5a.5.5 0 0 1 .5-.5M4 4h1v1H4z"/><path d="M7 2H2v5h5zM3 3h3v3H3zm2 8H4v1h1z"/><path d="M7 9H2v5h5zm-4 1h3v3H3zm8-6h1v1h-1z"/><path d="M9 2h5v5H9zm1 1v3h3V3zM8 8v2h1v1H8v1h2v-2h1v2h1v-1h2v-1h-3V8zm2 2H9V9h1zm4 2h-1v1h-2v1h3zm-4 2v-1H8v1z"/><path d="M12 9h2V8h-2z"/></svg>;
const IconGift = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M3 2.5a2.5 2.5 0 0 1 5 0 2.5 2.5 0 0 1 5 0v.006c0 .07 0 .27-.038.494H15a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 14.5V7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h2.038A3 3 0 0 1 3 2.506zm1.068.5H7v-.5a1.5 1.5 0 1 0-3 0c0 .085.002.274.045.43zM9 3h2.932l.023-.07c.043-.156.045-.345.045-.43a1.5 1.5 0 0 0-3 0zM1 4v2h6V4zm8 0v2h6V4zm5 3H9v8h4.5a.5.5 0 0 0 .5-.5zm-7 8V7H2v7.5a.5.5 0 0 0 .5.5z"/></svg>;
const IconMap = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M15.817.113A.5.5 0 0 1 16 .5v14a.5.5 0 0 1-.402.49l-5 1a.5.5 0 0 1-.196 0L5.5 15.01l-4.902.98A.5.5 0 0 1 0 15.5v-14a.5.5 0 0 1 .402-.49l5-1a.5.5 0 0 1 .196 0L10.5.99l4.902-.98a.5.5 0 0 1 .415.103M10 1.91l-4-.8v12.98l4 .8zm1 12.98 4-.8V1.11l-4 .8zm-6-.8V1.11l-4 .8v12.98z"/></svg>;
const IconCircleHalf = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 0 8 1zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16"/></svg>;

// ── Wave paths ────────────────────────────────────────────────────────────────
const W1 = "M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,165.3C672,160,768,96,864,96C960,96,1056,160,1152,154.7C1248,149,1344,75,1392,37.3L1440,0L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z";
const W2 = "M0,192L40,181.3C80,171,160,149,240,149.3C320,149,400,171,480,165.3C560,160,640,128,720,128C800,128,880,160,960,186.7C1040,213,1120,235,1200,218.7C1280,203,1360,149,1400,122.7L1440,96L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z";
const W3 = "M0,96L30,106.7C60,117,120,139,180,154.7C240,171,300,181,360,186.7C420,192,480,192,540,181.3C600,171,660,149,720,154.7C780,160,840,192,900,208C960,224,1020,224,1080,208C1140,192,1200,160,1260,138.7C1320,117,1380,107,1410,101.3L1440,96L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z";
const W4 = "M0,96L30,106.7C60,117,120,139,180,154.7C240,171,300,181,360,186.7C420,192,480,192,540,181.3C600,171,660,149,720,154.7C780,160,840,192,900,208C960,224,1020,224,1080,208C1140,192,1200,160,1260,138.7C1320,117,1380,107,1410,101.3L1440,96L1440,0L1410,0C1380,0,1320,0,1260,0C1200,0,1140,0,1080,0C1020,0,960,0,900,0C840,0,780,0,720,0C660,0,600,0,540,0C480,0,420,0,360,0C300,0,240,0,180,0C120,0,60,0,30,0L0,0Z";
const W5 = "M0,224L34.3,234.7C68.6,245,137,267,206,266.7C274.3,267,343,245,411,234.7C480,224,549,224,617,213.3C685.7,203,754,181,823,197.3C891.4,213,960,267,1029,266.7C1097.1,267,1166,213,1234,192C1302.9,171,1371,181,1406,186.7L1440,192L1440,320L1405.7,320C1371.4,320,1303,320,1234,320C1165.7,320,1097,320,1029,320C960,320,891,320,823,320C754.3,320,686,320,617,320C548.6,320,480,320,411,320C342.9,320,274,320,206,320C137.1,320,69,320,34,320L0,320Z";

// ── Main Component ─────────────────────────────────────────────────────────────
export default function Undangan4({
  data, guestName, slug,
  onRsvpSubmit, onGuestbookSubmit,
  rsvps, guestbook,
}: TemplateProps) {
  const [opened, setOpened] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [slideIdx, setSlideIdx] = useState(0);
  const [activeNav, setActiveNav] = useState('home');
  const [storyExpanded, setStoryExpanded] = useState(false);

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const setRef = (id: string) => (el: HTMLElement | null) => { sectionRefs.current[id] = el; };

  // Init theme
  useEffect(() => { setTheme(getInitialTheme()); }, []);

  // Persist theme
  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem('undangan4-theme', theme);
  }, [theme]);

  // Desktop slideshow
  const galeri = data.galeri.length > 0 ? data.galeri : [BG_FALLBACK];
  useEffect(() => {
    if (!opened || galeri.length <= 1) return;
    const iv = setInterval(() => setSlideIdx(i => (i + 1) % galeri.length), 4000);
    return () => clearInterval(iv);
  }, [opened, galeri.length]);

  // Scroll spy
  useEffect(() => {
    if (!opened) return;
    const ids = ['home', 'bride', 'wedding-date', 'gallery', 'comment'];
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActiveNav(e.target.id); });
    }, { threshold: 0.3, rootMargin: '-20% 0px -60% 0px' });
    ids.forEach(id => { const el = sectionRefs.current[id]; if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [opened]);

  const scrollTo = (id: string) => {
    const el = sectionRefs.current[id];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const c = makeColors(theme);
  const m1 = data.mempelai.urutanTampil === 'pria-dulu' ? data.mempelai.pria : data.mempelai.wanita;
  const m2 = data.mempelai.urutanTampil === 'pria-dulu' ? data.mempelai.wanita : data.mempelai.pria;
  const firstDate = data.acara[0]?.tanggal || data.countdown.tanggal || '';
  const countdownDate = data.countdown.tanggal || firstDate;
  const coverImg = galeri[0];

  const nameStr = m1.namaPanggilan && m2.namaPanggilan
    ? `${m1.namaPanggilan} & ${m2.namaPanggilan}`
    : m1.namaLengkap && m2.namaLengkap
      ? `${m1.namaLengkap} & ${m2.namaLengkap}`
      : 'Pasangan Bahagia';

  const btnOutlineStyle: React.CSSProperties = {
    border: `1px solid ${c.btnBorder}`, borderRadius: 50, background: 'transparent',
    color: c.btnText, padding: '4px 14px', fontSize: '0.825rem', cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: 6, boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans&family=Sacramento&family=Noto+Naskh+Arabic&display=swap');
        @keyframes u4-scroll { 0%{transform:translateY(1rem);opacity:0} 10%{transform:translateY(0);opacity:1} 100%{transform:translateY(0);opacity:0} }
        @keyframes u4-love { 50%{transform:translateY(1rem)} }
        @keyframes u4-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes u4-slide { 0%,100%{opacity:0} 5%,95%{opacity:1} }
        .u4-scroll-dot { width:0.25rem;height:0.625rem;animation:u4-scroll 3s linear infinite; }
        .u4-spin-btn { animation:u4-spin 5s linear infinite; }
      `}</style>

      {/* ── Welcome / Cover ──────────────────────────────────────────────── */}
      {!opened && (
        <div style={{ position: 'fixed', inset: 0, background: c.bgWB, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'auto', fontFamily: "'Josefin Sans', sans-serif", color: c.text, transition: 'background-color 350ms ease' }}>
          <div style={{ textAlign: 'center', padding: '32px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 style={{ fontFamily: "'Sacramento', cursive", fontSize: '2.25rem', marginBottom: 16, fontWeight: 400 }}>
              The Wedding Of
            </h2>
            <img src={coverImg} alt="bg"
              style={{ width: '13rem', height: '13rem', objectFit: 'cover', borderRadius: '50%', border: '3px solid rgba(255,255,255,0.6)', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', marginBottom: 16 }} />
            <h2 style={{ fontFamily: "'Sacramento', cursive", fontSize: '2.25rem', marginBottom: 16, fontWeight: 400 }}>
              {nameStr}
            </h2>
            {guestName && (
              <p style={{ fontSize: '0.9rem', color: c.textMuted, marginBottom: 8 }}>
                Kepada Yth. {guestName}
              </p>
            )}
            <button onClick={() => setOpened(true)}
              style={{ marginTop: 12, background: c.bgWB === '#ffffff' ? '#f8f9fa' : '#f8f9fa', color: '#212529', border: 'none', borderRadius: 8, padding: '8px 24px', fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'Josefin Sans', sans-serif" }}>
              ✉ Open Invitation
            </button>
          </div>
        </div>
      )}

      {/* ── Main layout ───────────────────────────────────────────────────── */}
      {opened && (
        <div style={{ display: 'flex', fontFamily: "'Josefin Sans', sans-serif", color: c.text, transition: 'background-color 350ms ease' }}>

          {/* ── Left panel (desktop only) ─────────────────────────── */}
          <div style={{ display: 'none' }} className="sm:block" id="u4-left-panel">
            <style>{`
              @media (min-width: 576px) {
                #u4-left-panel {
                  display: block !important;
                  position: sticky;
                  top: 0;
                  height: 100vh;
                  width: 42%;
                  flex-shrink: 0;
                  overflow: hidden;
                  background-color: ${c.bgWB};
                  transition: background-color 350ms ease;
                }
              }
            `}</style>
            <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: c.bgWB }}>
              {/* Slideshow */}
              {galeri.map((img, i) => (
                <img key={i} src={img} alt="bg"
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', maskImage: 'linear-gradient(0.5turn, transparent, black 40%, black 60%, transparent)', opacity: i === slideIdx ? 0.3 : 0, transition: 'opacity 1s ease' }} />
              ))}
              {/* Center card */}
              <div style={{ position: 'relative', textAlign: 'center', padding: 16, background: c.overlayBg, backdropFilter: 'blur(4px)', borderRadius: 20, zIndex: 1 }}>
                <h2 style={{ fontFamily: "'Sacramento', cursive", fontSize: '2rem', marginBottom: 16, fontWeight: 400, color: c.text }}>{nameStr}</h2>
                <p style={{ margin: 0, fontSize: '1rem', color: c.textMuted }}>{firstDate ? formatTanggal(firstDate) : ''}</p>
              </div>
            </div>
          </div>

          {/* ── Right column (scrollable) ─────────────────────────── */}
          <div style={{ flex: 1, minWidth: 0, minHeight: '100vh' }} id="u4-right">
            <style>{`
              @media (min-width: 576px) {
                #u4-left-panel { width: 42% !important; }
              }
              @media (min-width: 768px) {
                #u4-left-panel { width: 50% !important; }
              }
              @media (min-width: 992px) {
                #u4-left-panel { width: 58% !important; }
              }
              @media (min-width: 1200px) {
                #u4-left-panel { width: 67% !important; }
              }
            `}</style>

            {/* ── Section: Home ──────────────────────────────────── */}
            <section id="home" ref={setRef('home')} style={{ background: c.bgLD, position: 'relative', overflow: 'hidden', padding: 0, margin: 0, transition: 'background-color 350ms ease' }}>
              <img src={BG_FALLBACK} alt="bg"
                style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '100%', height: '100%', objectFit: 'cover', opacity: 0.25 }} />
              <div style={{ position: 'relative', textAlign: 'center' }}>
                <h1 style={{ fontFamily: "'Sacramento', cursive", paddingTop: '2.5rem', paddingBottom: '1rem', fontSize: '2.25rem', margin: 0, fontWeight: 400, color: c.text }}>
                  Undangan Pernikahan
                </h1>
                <img src={coverImg} alt="bg"
                  style={{ width: '13rem', height: '13rem', objectFit: 'cover', borderRadius: '50%', border: '3px solid rgba(255,255,255,0.6)', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', margin: '16px auto', display: 'block', cursor: 'pointer' }} />
                <h2 style={{ fontFamily: "'Sacramento', cursive", fontSize: '2.25rem', margin: '16px 0', fontWeight: 400, color: c.text }}>
                  {nameStr}
                </h2>
                {firstDate && <p style={{ margin: '8px 0', fontSize: '1.25rem', color: c.text }}>{formatTanggal(firstDate)}</p>}
                <div style={{ marginTop: 16 }}>
                  {data.acara[0] && (
                    <a href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(nameStr)}&dates=${firstDate.replace(/-/g,'')}&details=${encodeURIComponent('Akad Nikah')}`}
                      target="_blank" rel="noopener noreferrer" style={btnOutlineStyle}>
                      <IconCalendar /> Save Google Calendar
                    </a>
                  )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 16, marginBottom: 8 }}>
                  <div style={{ border: '2px solid rgba(108,117,125,0.5)', borderRadius: 20, padding: '4px 8px', height: '2rem', display: 'flex', alignItems: 'center' }}>
                    <div className="u4-scroll-dot" style={{ width: '0.25rem', height: '0.625rem', borderRadius: 4, background: 'rgba(108,117,125,0.6)' }} />
                  </div>
                </div>
                <p style={{ paddingBottom: '1.5rem', margin: 0, color: c.textMuted, fontSize: '0.825rem' }}>Scroll Down</p>
              </div>
            </section>

            {/* Wave 1: bgLD → bgWB */}
            <Wave path={W1} waveBg={c.bgLD} waveFill={c.bgWB} />

            {/* ── Section: Bride ─────────────────────────────────── */}
            <section id="bride" ref={setRef('bride')} style={{ background: c.bgWB, textAlign: 'center', transition: 'background-color 350ms ease' }}>
              <h2 style={{ fontFamily: "'Noto Naskh Arabic', serif", padding: '1rem 0', margin: 0, fontSize: '2rem', color: c.text }}>
                بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
              </h2>
              <h2 style={{ fontFamily: "'Sacramento', cursive", padding: '1rem 0', margin: 0, fontSize: '2rem', fontWeight: 400, color: c.text }}>
                Assalamualaikum Warahmatullahi Wabarakatuh
              </h2>
              <p style={{ padding: '0 8px 1rem', margin: 0, fontSize: '0.95rem', color: c.textMuted }}>
                Tanpa mengurangi rasa hormat, kami mengundang Anda untuk berkenan menghadiri acara pernikahan kami:
              </p>

              <div style={{ overflowX: 'hidden', paddingBottom: 16 }}>
                {/* Person 1 */}
                <div style={{ position: 'relative' }}>
                  <Heart style={{ top: '0%', right: '5%' }} />
                  <FadeIn from="left">
                    <div style={{ paddingBottom: 4 }}>
                      <img src={m1.foto || BG_FALLBACK} alt={m1.namaPanggilan}
                        style={{ width: '13rem', height: '13rem', objectFit: 'cover', borderRadius: '50%', border: '3px solid rgba(255,255,255,0.6)', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', margin: '16px auto', display: 'block', cursor: 'pointer' }} />
                      <h2 style={{ fontFamily: "'Sacramento', cursive", margin: 0, fontSize: '2.125rem', fontWeight: 400, color: c.text }}>{m1.namaLengkap}</h2>
                      {m1.anakKe && <p style={{ marginTop: 12, marginBottom: 4, fontSize: '1.25rem', color: c.text }}>Putra/Putri ke-{m1.anakKe}</p>}
                      {m1.ayah && <p style={{ marginBottom: 0, fontSize: '0.95rem', color: c.textMuted }}>{m1.ayah}</p>}
                      {(m1.ayah && m1.ibu) && <p style={{ marginBottom: 0, fontSize: '0.95rem', color: c.textMuted }}>dan</p>}
                      {m1.ibu && <p style={{ marginBottom: 0, fontSize: '0.95rem', color: c.textMuted }}>{m1.ibu}</p>}
                    </div>
                  </FadeIn>
                  <Heart style={{ top: '90%', left: '5%' }} />
                </div>

                <h2 style={{ fontFamily: "'Sacramento', cursive", marginTop: 16, fontSize: '4.5rem', fontWeight: 400, color: c.text }}>&amp;</h2>

                {/* Person 2 */}
                <div style={{ position: 'relative' }}>
                  <Heart style={{ top: '0%', right: '5%' }} />
                  <FadeIn from="right">
                    <div style={{ paddingBottom: 4 }}>
                      <img src={m2.foto || BG_FALLBACK} alt={m2.namaPanggilan}
                        style={{ width: '13rem', height: '13rem', objectFit: 'cover', borderRadius: '50%', border: '3px solid rgba(255,255,255,0.6)', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', margin: '16px auto', display: 'block', cursor: 'pointer' }} />
                      <h2 style={{ fontFamily: "'Sacramento', cursive", margin: 0, fontSize: '2.125rem', fontWeight: 400, color: c.text }}>{m2.namaLengkap}</h2>
                      {m2.anakKe && <p style={{ marginTop: 12, marginBottom: 4, fontSize: '1.25rem', color: c.text }}>Putra/Putri ke-{m2.anakKe}</p>}
                      {m2.ayah && <p style={{ marginBottom: 0, fontSize: '0.95rem', color: c.textMuted }}>{m2.ayah}</p>}
                      {(m2.ayah && m2.ibu) && <p style={{ marginBottom: 0, fontSize: '0.95rem', color: c.textMuted }}>dan</p>}
                      {m2.ibu && <p style={{ marginBottom: 0, fontSize: '0.95rem', color: c.textMuted }}>{m2.ibu}</p>}
                    </div>
                  </FadeIn>
                  <Heart style={{ top: '90%', left: '5%' }} />
                </div>
              </div>
            </section>

            {/* Wave 2: bgWB → bgLD */}
            <Wave path={W2} waveBg={c.bgWB} waveFill={c.bgLD} />

            {/* ── Section: Quote ─────────────────────────────────── */}
            <section style={{ background: c.bgLD, paddingTop: 8, paddingBottom: 16, transition: 'background-color 350ms ease' }}>
              <div style={{ maxWidth: 500, margin: '0 auto', padding: '0 16px', textAlign: 'center' }}>
                <h2 style={{ fontFamily: "'Sacramento', cursive", paddingTop: 8, paddingBottom: 4, margin: 0, fontSize: '2rem', fontWeight: 400, color: c.text }}>
                  Allah Subhanahu Wa Ta&#39;ala berfirman
                </h2>
                {data.quote.teks ? (
                  <FadeIn delay={100}>
                    <div style={{ background: c.bgCard, marginTop: 16, padding: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: 16 }}>
                      <p style={{ padding: 4, marginBottom: 8, fontSize: '0.95rem', color: c.text }}>{data.quote.teks}</p>
                      <p style={{ margin: 0, padding: 0, fontSize: '0.95rem', color: c.textMuted }}>{data.quote.sumber}</p>
                    </div>
                  </FadeIn>
                ) : null}
                <FadeIn delay={200}>
                  <div style={{ background: c.bgCard, marginTop: 16, padding: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: 16 }}>
                    <p style={{ padding: 4, marginBottom: 8, fontSize: '0.95rem', color: c.text }}>
                      Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu merasa tenteram kepadanya.
                    </p>
                    <p style={{ margin: 0, padding: 0, fontSize: '0.95rem', color: c.textMuted }}>QS. Ar-Rum: 21</p>
                  </div>
                </FadeIn>
              </div>
            </section>

            {/* ── Section: Love Story ────────────────────────────── */}
            <section style={{ background: c.bgLD, paddingTop: 8, paddingBottom: 16, transition: 'background-color 350ms ease' }}>
              <div style={{ maxWidth: 500, margin: '0 auto', padding: '0 16px' }}>
                <div style={{ background: c.bgCard, borderRadius: 20, boxShadow: '0 2px 10px rgba(0,0,0,0.1)', padding: 12 }}>
                  <h2 style={{ fontFamily: "'Sacramento', cursive", textAlign: 'center', padding: '8px 0', marginBottom: 8, fontSize: '2.125rem', fontWeight: 400, color: c.text }}>
                    Kisah Cinta
                  </h2>
                  {data.loveStory.length > 0 ? (
                    <div style={{ position: 'relative' }}>
                      {!storyExpanded && (
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: c.overlayBg, backdropFilter: 'blur(4px)', borderRadius: 12, zIndex: 3 }}>
                          <button onClick={() => setStoryExpanded(true)}
                            style={{ ...btnOutlineStyle, display: 'flex', alignItems: 'center', gap: 6 }}>
                            ❤ Lihat Story
                          </button>
                        </div>
                      )}
                      <div style={{ maxHeight: storyExpanded ? 'none' : '15rem', overflowY: storyExpanded ? 'visible' : 'hidden', padding: 8 }}>
                        {data.loveStory.map((item, i) => (
                          <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                            <div style={{ flexShrink: 0, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', border: `2px solid ${c.border}`, background: c.bgCard, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', color: c.text, position: 'relative', zIndex: 1 }}>
                                {i + 1}
                              </div>
                              {i < data.loveStory.length - 1 && (
                                <div style={{ position: 'absolute', top: '2rem', left: '50%', transform: 'translateX(-50%)', width: 2, height: 'calc(100% + 12px)', background: c.border }} />
                              )}
                            </div>
                            <div style={{ flex: 1, paddingTop: 4 }}>
                              <p style={{ fontWeight: 700, marginBottom: 8, color: c.text, fontSize: '0.9rem' }}>{item.tahun} — {item.judul}</p>
                              <p style={{ fontSize: '0.85rem', margin: 0, color: c.textMuted }}>{item.cerita}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p style={{ textAlign: 'center', color: c.textMuted, padding: 16, fontSize: '0.9rem' }}>Perjalanan cinta kami yang indah...</p>
                  )}
                </div>
              </div>
            </section>

            {/* Wave 3: bgLD → bgWB */}
            <Wave path={W3} waveBg={c.bgLD} waveFill={c.bgWB} />

            {/* ── Section: Wedding Date ──────────────────────────── */}
            <section id="wedding-date" ref={setRef('wedding-date')} style={{ background: c.bgWB, paddingBottom: 8, transition: 'background-color 350ms ease' }}>
              <div style={{ maxWidth: 500, margin: '0 auto', padding: '0 16px', textAlign: 'center' }}>
                <h2 style={{ fontFamily: "'Sacramento', cursive", padding: '1rem 0', margin: 0, fontSize: '2.25rem', fontWeight: 400, color: c.text }}>
                  Moment Bahagia
                </h2>
                {countdownDate && <Countdown target={countdownDate} c={c} />}
                <p style={{ padding: '8px 0', margin: 0, fontSize: '0.95rem', color: c.textMuted }}>
                  Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta&#39;ala, insyaAllah kami akan menyelenggarakan acara:
                </p>

                <div style={{ position: 'relative' }}>
                  <Heart style={{ top: '0%', right: '5%' }} />
                </div>

                <div style={{ overflowX: 'hidden' }}>
                  {data.acara.map((acara, i) => (
                    <div key={i}>
                      <FadeIn from={i % 2 === 0 ? 'right' : 'left'} delay={i * 150}>
                        <div style={{ padding: '8px 0' }}>
                          <h2 style={{ fontFamily: "'Sacramento', cursive", margin: 0, padding: '8px 0', fontSize: '2rem', fontWeight: 400, color: c.text }}>{acara.nama}</h2>
                          <p style={{ fontSize: '0.95rem', color: c.textMuted }}>{formatTanggal(acara.tanggal)} · {acara.waktuMulai} – {acara.waktuSelesai} WIB</p>
                        </div>
                      </FadeIn>
                    </div>
                  ))}
                </div>

                <div style={{ position: 'relative' }}>
                  <Heart style={{ top: '0%', left: '5%' }} />
                </div>

                {data.acara[0] && (
                  <FadeIn delay={200}>
                    <div style={{ padding: '8px 0' }}>
                      {data.acara[0].mapsUrl && (
                        <a href={data.acara[0].mapsUrl} target="_blank" rel="noopener noreferrer"
                          style={{ ...btnOutlineStyle, display: 'inline-flex', marginBottom: 8 }}>
                          <IconMap /> Lihat Google Maps
                        </a>
                      )}
                      <small style={{ display: 'block', margin: '4px 0', color: c.textMuted }}>{data.acara[0].lokasi}</small>
                      <small style={{ display: 'block', color: c.textMuted }}>{data.acara[0].alamat}</small>
                      {data.acara[0].lokasi && (
                        <GoogleMapsEmbed lokasi={data.acara[0].lokasi} alamat={data.acara[0].alamat} />
                      )}
                    </div>
                  </FadeIn>
                )}
              </div>
            </section>

            {/* ── Section: Gallery ───────────────────────────────── */}
            <section id="gallery" ref={setRef('gallery')} style={{ background: c.bgWB, paddingBottom: 40, paddingTop: 12, transition: 'background-color 350ms ease' }}>
              <div style={{ maxWidth: 500, margin: '0 auto', padding: '0 16px' }}>
                <div style={{ border: `1px solid ${c.border}`, borderRadius: 20, boxShadow: '0 2px 10px rgba(0,0,0,0.1)', padding: 12 }}>
                  <h2 style={{ fontFamily: "'Sacramento', cursive", textAlign: 'center', padding: '8px 0', margin: 0, fontSize: '2.25rem', fontWeight: 400, color: c.text }}>
                    Galeri
                  </h2>
                  <FadeIn>
                    <Carousel images={galeri.slice(0, 3)} id="carousel-1" c={c} />
                  </FadeIn>
                  {galeri.length > 3 && (
                    <FadeIn delay={150}>
                      <Carousel images={galeri.slice(3, 6)} id="carousel-2" c={c} />
                    </FadeIn>
                  )}
                </div>
              </div>
            </section>

            {/* Wave 4: bgWB → bgLD */}
            <Wave path={W4} waveBg={c.bgWB} waveFill={c.bgLD} />

            {/* ── Section: Love Gift ─────────────────────────────── */}
            <section style={{ background: c.bgLD, paddingBottom: 12, transition: 'background-color 350ms ease' }}>
              <div style={{ maxWidth: 500, margin: '0 auto', padding: '0 16px', textAlign: 'center' }}>
                <h2 style={{ fontFamily: "'Sacramento', cursive", paddingTop: 12, marginBottom: 16, fontSize: '2.25rem', fontWeight: 400, color: c.text }}>
                  Love Gift
                </h2>
                <p style={{ marginBottom: 4, fontSize: '0.95rem', color: c.textMuted }}>
                  Dengan hormat, bagi Anda yang ingin memberikan tanda kasih kepada kami, dapat melalui:
                </p>
                {data.amplopDigital.aktif ? (
                  <>
                    {data.amplopDigital.rekening.map((rek, i) => (
                      <CollapseCard key={`rek-${i}`} icon={<IconMoney />} title="Transfer" name={rek.atasNama} c={c}>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: c.text }}>🏦 {rek.bank}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                          <p style={{ margin: 0, fontSize: '0.85rem', color: c.text }}>💳 {rek.nomor}</p>
                          <button onClick={() => navigator.clipboard.writeText(rek.nomor)}
                            style={{ fontSize: '0.75rem', padding: '2px 10px', borderRadius: 8, border: `1px solid ${c.btnBorder}`, background: 'transparent', color: c.btnText, cursor: 'pointer' }}>
                            Salin
                          </button>
                        </div>
                      </CollapseCard>
                    ))}
                    {data.amplopDigital.eWallet.map((ew, i) => (
                      <CollapseCard key={`ew-${i}`} icon={<IconQR />} title={ew.jenis} name={ew.jenis} c={c}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <p style={{ margin: 0, fontSize: '0.85rem', color: c.text }}>📱 {ew.nomor}</p>
                          <button onClick={() => navigator.clipboard.writeText(ew.nomor)}
                            style={{ fontSize: '0.75rem', padding: '2px 10px', borderRadius: 8, border: `1px solid ${c.btnBorder}`, background: 'transparent', color: c.btnText, cursor: 'pointer' }}>
                            Salin
                          </button>
                        </div>
                        {ew.qrUrl && <img src={ew.qrUrl} alt="QR" style={{ maxWidth: '70%', margin: '8px auto', display: 'block', borderRadius: 8, background: '#fff' }} />}
                      </CollapseCard>
                    ))}
                    {data.amplopDigital.alamatKado && (
                      <CollapseCard icon={<IconGift />} title="Gift" name={nameStr} c={c}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <p style={{ margin: 0, fontSize: '0.85rem', color: c.text, flex: 1, marginRight: 8, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            📍 {data.amplopDigital.alamatKado}
                          </p>
                          <button onClick={() => navigator.clipboard.writeText(data.amplopDigital.alamatKado!)}
                            style={{ fontSize: '0.75rem', padding: '2px 10px', borderRadius: 8, border: `1px solid ${c.btnBorder}`, background: 'transparent', color: c.btnText, cursor: 'pointer', flexShrink: 0 }}>
                            Salin
                          </button>
                        </div>
                      </CollapseCard>
                    )}
                  </>
                ) : (
                  <p style={{ color: c.textMuted, fontSize: '0.9rem', padding: 16 }}>Kehadiran dan doa restu Anda adalah hadiah terbaik bagi kami.</p>
                )}
              </div>
            </section>

            {/* ── Section: Comment (RSVP + Guestbook) ──────────── */}
            <section id="comment" ref={setRef('comment')} style={{ background: c.bgLD, margin: 0, paddingBottom: 0, paddingTop: 12, transition: 'background-color 350ms ease' }}>
              <div style={{ maxWidth: 500, margin: '0 auto', padding: '0 16px' }}>
                {/* RSVP */}
                {data.rsvpAktif && (
                  <div style={{ border: `1px solid ${c.border}`, borderRadius: 20, boxShadow: '0 2px 10px rgba(0,0,0,0.1)', padding: 12, marginBottom: 8, background: c.bgCard }}>
                    <h2 style={{ fontFamily: "'Sacramento', cursive", textAlign: 'center', marginTop: 8, marginBottom: 16, fontSize: '2.25rem', fontWeight: 400, color: c.text }}>
                      Konfirmasi Kehadiran
                    </h2>
                    <RsvpForm slug={slug} rsvps={rsvps} onSubmit={onRsvpSubmit} primaryColor="#212529" guestName={guestName} />
                    {rsvps.length > 0 && (
                      <div style={{ marginTop: 12 }}>
                        {rsvps.slice(0, 5).map(r => (
                          <div key={r.id} style={{ padding: '6px 0', borderTop: `1px solid ${c.border}`, fontSize: '0.85rem', color: c.textMuted }}>
                            <span style={{ fontWeight: 600, color: c.text }}>{r.name}</span>
                            {' · '}{r.attendance === 'HADIR' ? '✅ Hadir' : r.attendance === 'TIDAK_HADIR' ? '❌ Berhalangan' : '🤔 Ragu'}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Guestbook */}
                {data.guestbookAktif && (
                  <div style={{ border: `1px solid ${c.border}`, borderRadius: 20, boxShadow: '0 2px 10px rgba(0,0,0,0.1)', padding: 12, marginBottom: 8, background: c.bgCard }}>
                    <h2 style={{ fontFamily: "'Sacramento', cursive", textAlign: 'center', marginTop: 8, marginBottom: 16, fontSize: '2.25rem', fontWeight: 400, color: c.text }}>
                      Ucapan &amp; Doa
                    </h2>
                    <GuestbookForm guestbook={guestbook} onSubmit={onGuestbookSubmit} primaryColor="#212529" guestName={guestName} />
                  </div>
                )}
              </div>
            </section>

            {/* Wave 5: bgLD → bgWB */}
            <Wave path={W5} waveBg={c.bgLD} waveFill={c.bgWB} />

            {/* ── Section: End ───────────────────────────────────── */}
            <section style={{ background: c.bgWB, paddingBottom: 8, transition: 'background-color 350ms ease' }}>
              <div style={{ maxWidth: 500, margin: '0 auto', padding: '0 16px', textAlign: 'center' }}>
                <p style={{ paddingBottom: 8, paddingTop: 16, fontSize: '0.95rem', color: c.textMuted }}>
                  Terima kasih atas perhatian dan doa restu Anda, yang menjadi kebahagiaan serta kehormatan besar bagi kami.
                </p>
                <h2 style={{ fontFamily: "'Sacramento', cursive", fontSize: '2rem', fontWeight: 400, color: c.text }}>
                  Wassalamualaikum Warahmatullahi Wabarakatuh
                </h2>
                <h2 style={{ fontFamily: "'Noto Naskh Arabic', serif", paddingTop: 16, fontSize: '2rem', color: c.text }}>
                  اَلْحَمْدُ لِلّٰهِ رَبِّ الْعٰلَمِيْنَۙ
                </h2>
                <hr style={{ margin: '12px 0', borderColor: c.border }} />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, paddingBottom: 12 }}>
                  <ShareButton slug={slug} primaryColor="#212529" />
                </div>
              </div>
            </section>

            {/* ── Bottom Navbar ──────────────────────────────────── */}
            <nav style={{
              position: 'sticky', bottom: 0, background: c.navBg, backdropFilter: 'blur(8px)',
              borderTop: `1px solid ${c.border}`, borderRadius: '16px 16px 0 0',
              display: 'flex', alignItems: 'center', zIndex: 50, padding: '0',
              transition: 'background-color 350ms ease',
            }}>
              {[
                { id: 'home', icon: <IconHouse />, label: 'Home' },
                { id: 'bride', icon: <IconPeople />, label: 'Mempelai' },
                { id: 'wedding-date', icon: <IconCalendar />, label: 'Tanggal' },
                { id: 'gallery', icon: <IconImages />, label: 'Galeri' },
                { id: 'comment', icon: <IconComments />, label: 'Ucapan' },
              ].map(item => (
                <button key={item.id} onClick={() => scrollTo(item.id)}
                  style={{
                    flex: 1, border: 'none', background: 'transparent', cursor: 'pointer',
                    padding: '8px 4px 6px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                    color: activeNav === item.id ? c.navLinkActive : c.navLink,
                    transition: 'color 200ms ease',
                  }}>
                  {item.icon}
                  <span style={{ display: 'block', fontSize: '0.7rem', fontFamily: "'Josefin Sans', sans-serif" }}>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* ── Floating buttons (after opened) ─────────────────────────────── */}
      {opened && (
        <div style={{ position: 'fixed', bottom: '10vh', right: '2vh', zIndex: 1030, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Theme toggle */}
          <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
            style={{ width: 36, height: 36, borderRadius: '50%', border: `1px solid ${c.border}`, background: c.btnBg, backdropFilter: 'blur(4px)', cursor: 'pointer', color: c.text, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
            <IconCircleHalf />
          </button>
          {/* Music player */}
          {data.musik.url && (
            <MusicPlayer url={data.musik.url} autoplay={data.musik.autoplay} />
          )}
        </div>
      )}
    </>
  );
}
