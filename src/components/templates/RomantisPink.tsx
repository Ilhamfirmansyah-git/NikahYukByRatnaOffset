'use client';

import { useState, useEffect, useRef } from 'react';
import { TemplateProps } from './TemplateProps';
import MusicPlayer from '@/components/invitation/MusicPlayer';
import RsvpForm from '@/components/invitation/RsvpForm';
import GuestbookForm from '@/components/invitation/GuestbookForm';
import AmplopDigitalComponent from '@/components/invitation/AmplopDigital';
import ShareButton from '@/components/invitation/ShareButton';

// ── Palette ────────────────────────────────────────────────────────────────────
const ROSE      = '#c96b8a';
const ROSE_L    = '#e8a4be';
const ROSE_P    = '#fae3ed';
const BG        = '#fffbfd';
const BG2       = '#fff2f7';
const BG3       = '#fdeaf3';
const DEEP      = '#3d1520';
const MUTED     = 'rgba(61,21,32,0.52)';

// ── Scroll reveal ──────────────────────────────────────────────────────────────
function FadeIn({ children, delay = 0, from = 'bottom' }: {
  children: React.ReactNode; delay?: number; from?: 'bottom' | 'left' | 'right' | 'none';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.08 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const tx = from === 'left' ? 'translateX(-30px)' : from === 'right' ? 'translateX(30px)' : from === 'none' ? 'none' : 'translateY(30px)';
  return (
    <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? 'none' : tx, transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

// ── Pink countdown ─────────────────────────────────────────────────────────────
function PinkCountdown({ targetDate }: { targetDate: string }) {
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
        <div key={u.l} style={{ textAlign: 'center', minWidth: 60 }}>
          <div style={{
            background: 'rgba(255,255,255,0.85)', border: `1.5px solid ${ROSE_P}`, borderRadius: 12,
            padding: '10px 6px', marginBottom: 6, boxShadow: `0 2px 12px ${ROSE_P}`,
          }}>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 34, fontWeight: 600, color: ROSE, display: 'block', lineHeight: 1 }}>
              {pad(u.v)}
            </span>
          </div>
          <span style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: ROSE_L, fontFamily: "'Raleway', sans-serif" }}>{u.l}</span>
        </div>
      ))}
    </div>
  );
}

// ── Petal SVG shapes ───────────────────────────────────────────────────────────
function Petal({ color, w, h, rot }: { color: string; w: number; h: number; rot: number }) {
  return (
    <svg width={w} height={h} viewBox="0 0 20 32" style={{ display: 'block', transform: `rotate(${rot}deg)` }}>
      <path d="M10,0 C10,0 20,8 20,18 C20,26 15,30 10,32 C5,30 0,26 0,18 C0,8 10,0 10,0Z" fill={color} />
    </svg>
  );
}

// ── Flower SVG (decorative) ───────────────────────────────────────────────────
function FlowerSVG({ size, color, opacity = 1 }: { size: number; color: string; opacity?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{ display: 'block', opacity }}>
      {[0, 60, 120, 180, 240, 300].map(angle => (
        <ellipse key={angle} cx="20" cy="20" rx="6" ry="10"
          fill={color} transform={`rotate(${angle}, 20, 20) translate(0, -7)`} opacity="0.85"
        />
      ))}
      <circle cx="20" cy="20" r="6" fill="white" />
      <circle cx="20" cy="20" r="4" fill={color} opacity="0.5" />
    </svg>
  );
}

// ── Floral divider ─────────────────────────────────────────────────────────────
function FlowerDivider({ color = ROSE }: { color?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, margin: '18px 0' }}>
      <div style={{ height: 1, width: 50, background: `linear-gradient(to right, transparent, ${color})` }} />
      <div style={{ animation: 'spinSlow 12s linear infinite' }}>
        <FlowerSVG size={20} color={color} />
      </div>
      <div style={{ height: 1, width: 50, background: `linear-gradient(to left, transparent, ${color})` }} />
    </div>
  );
}

// ── Section title ──────────────────────────────────────────────────────────────
function STitle({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 36 }}>
      <FlowerDivider />
      <h2 style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, letterSpacing: '0.38em', textTransform: 'uppercase', color: ROSE, margin: '12px 0 4px' }}>
        {children}
      </h2>
      {sub && <p style={{ fontSize: 12, color: MUTED, fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', margin: '0 0 12px' }}>{sub}</p>}
      <FlowerDivider />
    </div>
  );
}

// ── Wave separators ────────────────────────────────────────────────────────────
function WaveDown({ fill }: { fill: string }) {
  return (
    <svg viewBox="0 0 1200 60" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 60, marginBottom: -2 }}>
      <path d="M0,60 C200,10 400,50 600,20 C800,-10 1000,40 1200,10 L1200,60 Z" fill={fill} />
    </svg>
  );
}
function WaveUp({ fill }: { fill: string }) {
  return (
    <svg viewBox="0 0 1200 60" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 60, marginTop: -2 }}>
      <path d="M0,0 C200,50 400,10 600,40 C800,70 1000,20 1200,50 L1200,0 Z" fill={fill} />
    </svg>
  );
}

// ── Corner floral ornament ─────────────────────────────────────────────────────
function CornerFloral({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const flip = { tl: 'scale(1,1)', tr: 'scale(-1,1)', bl: 'scale(1,-1)', br: 'scale(-1,-1)' }[position];
  const pos: Record<string, number | string> = position === 'tl' ? { top: 0, left: 0 } : position === 'tr' ? { top: 0, right: 0 } : position === 'bl' ? { bottom: 0, left: 0 } : { bottom: 0, right: 0 };
  return (
    <div style={{ position: 'absolute', width: 90, height: 90, pointerEvents: 'none', ...pos }}>
      <svg width="90" height="90" viewBox="0 0 90 90" style={{ transform: flip }} opacity="0.18">
        <path d="M5,85 Q15,60 35,50 Q55,40 75,15 Q80,10 85,5" stroke={ROSE} strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M5,85 Q20,72 35,65 Q50,58 65,40 Q72,32 80,20" stroke={ROSE_L} strokeWidth="1" fill="none" strokeLinecap="round" />
        {[{ cx:18, cy:72, r:6 }, { cx:38, cy:52, r:5 }, { cx:60, cy:28, r:7 }, { cx:78, cy:12, r:5 }].map((c,i) => (
          <g key={i}>
            {[0,72,144,216,288].map(a => (
              <ellipse key={a} cx={c.cx} cy={c.cy} rx={c.r * 0.5} ry={c.r}
                fill={ROSE} transform={`rotate(${a}, ${c.cx}, ${c.cy}) translate(0, ${-c.r * 0.6})`} />
            ))}
            <circle cx={c.cx} cy={c.cy} r={c.r * 0.4} fill="white" opacity="0.8" />
          </g>
        ))}
        {[{ cx:26, cy:66, rx:8, ry:4, rot:-45 }, { cx:50, cy:44, rx:9, ry:3.5, rot:-55 }, { cx:70, cy:22, rx:8, ry:3.5, rot:-65 }].map((l, i) => (
          <ellipse key={i} cx={l.cx} cy={l.cy} rx={l.rx} ry={l.ry} fill={ROSE_L} transform={`rotate(${l.rot}, ${l.cx}, ${l.cy})`} opacity="0.7" />
        ))}
      </svg>
    </div>
  );
}

// ── Falling petals (cover) ─────────────────────────────────────────────────────
const PETALS = Array.from({ length: 24 }, (_, i) => ({
  left: (i * 19 + 4) % 100,
  delay: (i * 0.47) % 8,
  dur: 5 + (i % 5) * 1.2,
  size: 8 + (i % 4) * 4,
  rot: (i * 37) % 360,
  color: [ROSE_P, ROSE_L, '#f9d5e5', ROSE_P, '#fce8f0'][(i % 5)],
  sway: (i % 2 === 0 ? 1 : -1) * (15 + (i % 3) * 10),
}));

// ── Floating flowers background ───────────────────────────────────────────────
const FLOATERS = Array.from({ length: 8 }, (_, i) => ({
  left: (i * 30 + 8) % 90,
  top: (i * 19 + 10) % 80,
  size: 20 + (i % 3) * 12,
  delay: i * 0.9,
  dur: 4 + (i % 4),
}));

// ── Bottom nav ─────────────────────────────────────────────────────────────────
const NAV = [
  { id: 'beranda', label: 'Beranda', d: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z' },
  { id: 'mempelai', label: 'Mempelai', d: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' },
  { id: 'acara', label: 'Acara', d: 'M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z' },
  { id: 'galeri', label: 'Galeri', d: 'M22 16V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zm-11-4l2.03 2.71L16 11l4 5H8l3-4zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z' },
  { id: 'ucapan', label: 'Ucapan', d: 'M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z' },
];

// ── Format date ────────────────────────────────────────────────────────────────
const fmt = (t: string) => t ? new Date(t).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '';

// ══════════════════════════════════════════════════════════════════════════════
export default function RomantisPink({
  data, guestName, slug, onRsvpSubmit, onGuestbookSubmit, rsvps, guestbook,
}: TemplateProps) {
  const [opened, setOpened] = useState(false);
  const [activeNav, setActiveNav] = useState('beranda');
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const pria = data.mempelai.pria;
  const wanita = data.mempelai.wanita;
  const primaFirst = data.mempelai.urutanTampil !== 'wanita-dulu';
  const m1 = primaFirst ? pria : wanita;
  const m2 = primaFirst ? wanita : pria;
  const firstAcara = data.acara[0];
  const countdownTarget = data.countdown.tanggal || firstAcara?.tanggal || '';

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
    <div style={{ background: BG, color: DEEP, minHeight: '100vh', fontFamily: "'Raleway', sans-serif" }}>

      {/* Music */}
      {data.musik.url && (
        <MusicPlayer url={data.musik.url} autoplay={data.musik.autoplay && opened}
          color={ROSE} bgColor="rgba(255,250,253,0.95)" borderColor={`${ROSE_P}`}
          positionClassName="fixed bottom-20 right-4 z-50"
        />
      )}

      <ShareButton slug={slug} pria={pria.namaPanggilan || pria.namaLengkap} wanita={wanita.namaPanggilan || wanita.namaLengkap} primaryColor={ROSE} />

      {/* ━━━ COVER ━━━ */}
      {!opened && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 40,
          background: `linear-gradient(160deg, ${BG} 0%, ${BG3} 40%, ${BG2} 70%, ${BG} 100%)`,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', textAlign: 'center', padding: '32px 28px',
          overflow: 'hidden',
        }}>
          {/* Corner florals */}
          {(['tl', 'tr', 'bl', 'br'] as const).map(pos => <CornerFloral key={pos} position={pos} />)}

          {/* Falling petals */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
            {PETALS.map((p, i) => (
              <div key={i} style={{
                position: 'absolute',
                left: `${p.left}%`,
                top: 0,
                animation: `petalDrop ${p.dur}s ${p.delay}s linear infinite`,
              }}>
                <Petal color={p.color} w={p.size} h={p.size * 1.6} rot={p.rot} />
              </div>
            ))}
          </div>

          {/* Top ornament */}
          <div style={{ marginBottom: 20, opacity: 0.8 }}>
            <FlowerSVG size={36} color={ROSE_L} />
          </div>

          {guestName && (
            <div style={{ margin: '0 0 20px', padding: '12px 24px', border: `1px solid ${ROSE_P}`, borderRadius: 4, background: 'rgba(255,255,255,0.7)' }}>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: '0.38em', textTransform: 'uppercase', color: ROSE_L, marginBottom: 5 }}>Kepada Yth.</p>
              <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: 30, color: ROSE, margin: 0 }}>{guestName}</p>
            </div>
          )}

          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: '0.42em', textTransform: 'uppercase', color: ROSE_L, margin: '0 0 10px' }}>
            Undangan Pernikahan
          </p>

          <h1 style={{ fontFamily: "'Great Vibes', cursive", fontSize: 62, color: ROSE, lineHeight: 1.1, margin: 0, textShadow: `0 2px 16px ${ROSE_P}` }}>
            {m1.namaPanggilan || m1.namaLengkap || '—'}
          </h1>
          <div style={{ margin: '4px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ height: 1, width: 32, background: ROSE_L }} />
            <span style={{ fontFamily: "'Great Vibes', cursive", fontSize: 30, color: ROSE_L, animation: 'heartPulse 2.5s ease-in-out infinite' }}>&amp;</span>
            <div style={{ height: 1, width: 32, background: ROSE_L }} />
          </div>
          <h1 style={{ fontFamily: "'Great Vibes', cursive", fontSize: 62, color: ROSE, lineHeight: 1.1, margin: '0 0 16px', textShadow: `0 2px 16px ${ROSE_P}` }}>
            {m2.namaPanggilan || m2.namaLengkap || '—'}
          </h1>

          {firstAcara && (
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, color: MUTED, marginBottom: 28, fontStyle: 'italic' }}>
              {fmt(firstAcara.tanggal)}
            </p>
          )}

          <button onClick={() => setOpened(true)} style={{
            padding: '13px 48px', background: 'transparent', border: `1.5px solid ${ROSE}`,
            color: ROSE, fontSize: 9, letterSpacing: '0.42em', textTransform: 'uppercase',
            cursor: 'pointer', fontFamily: "'Raleway', sans-serif", borderRadius: 2,
            animation: 'pulseButton 2.8s ease-in-out infinite',
            transition: 'background 0.3s, color 0.3s',
          }}
            onMouseEnter={e => { (e.target as HTMLButtonElement).style.background = ROSE; (e.target as HTMLButtonElement).style.color = 'white'; }}
            onMouseLeave={e => { (e.target as HTMLButtonElement).style.background = 'transparent'; (e.target as HTMLButtonElement).style.color = ROSE; }}
          >
            Buka Undangan
          </button>

          <div style={{ marginTop: 24, opacity: 0.6 }}>
            <FlowerDivider />
          </div>
        </div>
      )}

      {/* ━━━ MAIN CONTENT ━━━ */}
      {opened && (
        <div style={{ paddingBottom: 72 }}>

          {/* ─── BERANDA ─── */}
          <section
            ref={setRef('beranda') as unknown as React.RefCallback<HTMLElement>}
            id="beranda"
            style={{
              minHeight: '100vh', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', textAlign: 'center',
              padding: '80px 24px 60px', position: 'relative', overflow: 'hidden',
              background: `radial-gradient(ellipse at 50% 30%, ${BG3} 0%, ${BG} 70%)`,
            }}
          >
            {/* Corner florals */}
            {(['tl', 'tr', 'bl', 'br'] as const).map(pos => <CornerFloral key={pos} position={pos} />)}

            {/* Floating background blossoms */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
              {FLOATERS.map((f, i) => (
                <div key={i} style={{
                  position: 'absolute', left: `${f.left}%`, top: `${f.top}%`,
                  animation: `floatBlossom ${f.dur}s ${f.delay}s ease-in-out infinite`,
                }}>
                  <FlowerSVG size={f.size} color={ROSE_P} opacity={0.4} />
                </div>
              ))}
            </div>

            {/* Couple photos */}
            {(m1.foto || m2.foto) && (
              <FadeIn delay={100}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 28 }}>
                  {[m1, m2].map((m, i) => m.foto ? (
                    <div key={i} style={{
                      width: 100, height: 100, borderRadius: '50%', overflow: 'hidden',
                      border: `3px solid white`, outline: `2px solid ${ROSE_L}`,
                      boxShadow: `0 6px 24px ${ROSE_P}, 0 2px 8px rgba(0,0,0,0.08)`,
                      flexShrink: 0, animation: `floatBlossom ${4 + i}s ${i * 1.2}s ease-in-out infinite`,
                    }}>
                      <img src={m.foto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ) : null)}
                </div>
              </FadeIn>
            )}

            <FadeIn delay={200}>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: '0.42em', textTransform: 'uppercase', color: ROSE_L, marginBottom: 8 }}>Undangan Pernikahan</p>
              <h1 style={{ fontFamily: "'Great Vibes', cursive", fontSize: 68, color: ROSE, lineHeight: 1.1, margin: 0, textShadow: `0 4px 20px ${ROSE_P}` }}>
                {m1.namaPanggilan || m1.namaLengkap || '—'}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, margin: '2px 0' }}>
                <div style={{ height: 1, width: 40, background: ROSE_L }} />
                <div style={{ animation: 'spinSlow 8s linear infinite' }}>
                  <FlowerSVG size={22} color={ROSE_L} />
                </div>
                <div style={{ height: 1, width: 40, background: ROSE_L }} />
              </div>
              <h1 style={{ fontFamily: "'Great Vibes', cursive", fontSize: 68, color: ROSE, lineHeight: 1.1, margin: '0 0 16px', textShadow: `0 4px 20px ${ROSE_P}` }}>
                {m2.namaPanggilan || m2.namaLengkap || '—'}
              </h1>
              {firstAcara && (
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, color: MUTED, fontStyle: 'italic' }}>
                  {fmt(firstAcara.tanggal)}
                </p>
              )}
            </FadeIn>

            {countdownTarget && (
              <FadeIn delay={380}>
                <div style={{ marginTop: 40 }}>
                  <PinkCountdown targetDate={countdownTarget} />
                </div>
              </FadeIn>
            )}

            {/* Scroll arrow */}
            <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', animation: 'bounceDown 2s ease-in-out infinite' }}>
              <svg width="20" height="20" fill="none" stroke={ROSE_L} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </section>

          <WaveDown fill={BG2} />

          {/* ─── MEMPELAI ─── */}
          <section ref={setRef('mempelai') as unknown as React.RefCallback<HTMLElement>} id="mempelai"
            style={{ background: BG2, padding: '56px 24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', opacity: 0.06 }}>
              {FLOATERS.slice(0, 4).map((f, i) => (
                <div key={i} style={{ position: 'absolute', left: `${f.left}%`, top: `${f.top}%` }}>
                  <FlowerSVG size={f.size * 2} color={ROSE} />
                </div>
              ))}
            </div>
            <div style={{ maxWidth: 480, margin: '0 auto', position: 'relative' }}>
              <FadeIn>
                <STitle sub="Yang Insya Allah akan melangsungkan walimatul ursy">Mempelai</STitle>
              </FadeIn>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {[m1, m2].map((m, i) => (
                  <FadeIn key={i} delay={i * 130} from={i === 0 ? 'left' : 'right'}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 16, padding: 20,
                      background: 'rgba(255,255,255,0.85)', borderRadius: 16,
                      border: `1.5px solid ${ROSE_P}`,
                      boxShadow: `0 4px 20px ${ROSE_P}50`,
                    }}>
                      <div style={{
                        flexShrink: 0, width: 80, height: 80, borderRadius: '50%', overflow: 'hidden',
                        border: `3px solid white`, outline: `2px solid ${ROSE_L}`,
                        boxShadow: `0 4px 16px ${ROSE_P}`,
                      }}>
                        {m.foto
                          ? <img src={m.foto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <div style={{ width: '100%', height: '100%', background: BG3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <FlowerSVG size={32} color={ROSE_L} />
                            </div>
                        }
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: 28, color: ROSE, margin: '0 0 4px', lineHeight: 1.2 }}>
                          {m.namaLengkap || '—'}
                        </p>
                        {m.anakKe && <p style={{ fontSize: 12, color: MUTED, margin: '0 0 2px' }}>Putra/Putri ke-{m.anakKe}</p>}
                        {(m.ayah || m.ibu) && (
                          <p style={{ fontSize: 12, color: MUTED, margin: 0 }}>
                            {m.ayah ? `Bapak ${m.ayah}` : ''}{m.ayah && m.ibu ? ' & ' : ''}{m.ibu ? `Ibu ${m.ibu}` : ''}
                          </p>
                        )}
                        {m.instagram && (
                          <a href={`https://instagram.com/${m.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
                            style={{ fontSize: 12, color: ROSE_L, display: 'inline-block', marginTop: 4, textDecoration: 'none' }}>
                            @{m.instagram.replace('@', '')}
                          </a>
                        )}
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>

              {/* Quranic verse — from database */}
              {data.quote?.teks && (
                <FadeIn delay={280}>
                  <div style={{ marginTop: 36, padding: '22px 24px', textAlign: 'center', background: 'rgba(255,255,255,0.7)', borderRadius: 12, border: `1px solid ${ROSE_P}` }}>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: ROSE, lineHeight: 1.9, marginBottom: 12, fontStyle: 'italic' }}>
                      &ldquo;{data.quote.teks}&rdquo;
                    </p>
                    {data.quote.sumber && (
                      <p style={{ fontSize: 11, color: ROSE_L, letterSpacing: '0.2em', fontFamily: "'Raleway', sans-serif" }}>{data.quote.sumber}</p>
                    )}
                  </div>
                </FadeIn>
              )}
            </div>
          </section>

          <WaveUp fill={BG2} />

          {/* ─── ACARA ─── */}
          <section ref={setRef('acara') as unknown as React.RefCallback<HTMLElement>} id="acara"
            style={{ background: BG, padding: '56px 24px' }}>
            <div style={{ maxWidth: 480, margin: '0 auto' }}>
              <FadeIn><STitle sub="Dengan memohon rahmat dan ridho Allah SWT">Detail Acara</STitle></FadeIn>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {data.acara.map((a, i) => (
                  <FadeIn key={i} delay={i * 130}>
                    <div style={{
                      padding: 22, borderRadius: 16, background: 'white',
                      borderLeft: `4px solid ${ROSE}`,
                      boxShadow: `0 2px 16px ${ROSE_P}40`,
                      border: `1px solid ${ROSE_P}`,
                      borderLeftWidth: 4, borderLeftColor: ROSE,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                        <div style={{ animation: 'spinSlow 10s linear infinite', flexShrink: 0 }}>
                          <FlowerSVG size={16} color={ROSE} />
                        </div>
                        <h3 style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase', color: ROSE, margin: 0, fontWeight: 700 }}>
                          {a.nama}
                        </h3>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: DEEP, margin: 0, fontWeight: 600 }}>{fmt(a.tanggal)}</p>
                        <p style={{ fontSize: 13, color: MUTED, margin: 0 }}>{a.waktuMulai} – {a.waktuSelesai} WIB</p>
                        <p style={{ fontSize: 14, fontWeight: 600, color: DEEP, margin: '4px 0 0' }}>{a.lokasi}</p>
                        <p style={{ fontSize: 12, color: MUTED, margin: 0 }}>{a.alamat}</p>
                        {a.mapsUrl && (
                          <a href={a.mapsUrl} target="_blank" rel="noopener noreferrer"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: ROSE, marginTop: 8, textDecoration: 'none', fontWeight: 600 }}>
                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Buka di Google Maps
                          </a>
                        )}
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </section>

          <WaveDown fill={BG2} />

          {/* ─── GALERI ─── */}
          {data.galeri.length > 0 && (
            <section ref={setRef('galeri') as unknown as React.RefCallback<HTMLElement>} id="galeri"
              style={{ background: BG2, padding: '56px 24px' }}>
              <div style={{ maxWidth: 480, margin: '0 auto' }}>
                <FadeIn><STitle>Galeri Foto</STitle></FadeIn>
                <FadeIn delay={150}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                    {data.galeri.map((src, i) => (
                      <button key={i} onClick={() => setLightboxImg(src)} style={{
                        aspectRatio: '1', overflow: 'hidden', borderRadius: 12,
                        border: `2px solid ${ROSE_P}`, cursor: 'pointer',
                        padding: 0, background: '#f8e0e8', display: 'block',
                        position: 'relative', width: '100%',
                      }}>
                        <img src={src} alt={`Foto ${i + 1}`} loading="lazy" style={{
                          position: 'absolute', inset: 0,
                          width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                          transition: 'transform 0.4s, filter 0.4s',
                        }}
                          onMouseEnter={e => {
                            const img = e.target as HTMLImageElement;
                            img.style.transform = 'scale(1.08)';
                            img.style.filter = `brightness(1.05) saturate(1.1)`;
                          }}
                          onMouseLeave={e => {
                            const img = e.target as HTMLImageElement;
                            img.style.transform = 'scale(1)';
                            img.style.filter = '';
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </FadeIn>
              </div>
            </section>
          )}

          <WaveUp fill={BG2} />

          {/* ─── LOVE STORY ─── */}
          {data.loveStory.length > 0 && (
            <section style={{ background: BG, padding: '56px 24px' }}>
              <div style={{ maxWidth: 480, margin: '0 auto' }}>
                <FadeIn><STitle>Kisah Cinta Kami</STitle></FadeIn>
                <div style={{ position: 'relative', paddingLeft: 30 }}>
                  {/* Timeline line */}
                  <div style={{ position: 'absolute', left: 8, top: 4, bottom: 4, width: 1.5, background: `linear-gradient(to bottom, ${ROSE_P}, ${ROSE_P}20)` }} />
                  {data.loveStory.map((item, i) => (
                    <FadeIn key={i} delay={i * 100}>
                      <div style={{ position: 'relative', marginBottom: 32 }}>
                        {/* Timeline dot with flower */}
                        <div style={{ position: 'absolute', left: -26, top: 4, animation: 'heartPulse 3s ease-in-out infinite' }}>
                          <FlowerSVG size={16} color={ROSE} />
                        </div>
                        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, color: ROSE, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 4, fontWeight: 700 }}>
                          {item.tahun}
                        </p>
                        <h4 style={{ fontFamily: "'Great Vibes', cursive", fontSize: 26, color: DEEP, margin: '0 0 8px' }}>{item.judul}</h4>
                        <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.8, margin: 0 }}>{item.cerita}</p>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ─── QUOTE ─── */}
          {data.quote.teks && (
            <div style={{ padding: '48px 24px', textAlign: 'center', background: `linear-gradient(135deg, ${BG3}, ${BG2}, ${BG3})`, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.07 }}>
                {FLOATERS.slice(0, 4).map((f, i) => (
                  <div key={i} style={{ position: 'absolute', left: `${f.left}%`, top: `${f.top}%` }}>
                    <FlowerSVG size={f.size * 2.5} color={ROSE} />
                  </div>
                ))}
              </div>
              <FadeIn>
                <div style={{ maxWidth: 360, margin: '0 auto', position: 'relative' }}>
                  <div style={{ marginBottom: 16 }}>
                    <FlowerSVG size={28} color={ROSE_L} />
                  </div>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: DEEP, lineHeight: 1.7, fontStyle: 'italic', margin: '0 0 14px' }}>
                    &ldquo;{data.quote.teks}&rdquo;
                  </p>
                  {data.quote.sumber && (
                    <p style={{ fontSize: 11, color: ROSE_L, letterSpacing: '0.2em', fontFamily: "'Raleway', sans-serif" }}>
                      — {data.quote.sumber}
                    </p>
                  )}
                </div>
              </FadeIn>
            </div>
          )}

          {/* ─── AMPLOP DIGITAL ─── */}
          {data.amplopDigital.aktif && (
            <section style={{ background: BG, padding: '56px 24px' }}>
              <div style={{ maxWidth: 480, margin: '0 auto' }}>
                <FadeIn><STitle sub="Doa dan kehadiran Anda adalah hadiah terbaik untuk kami">Amplop Digital</STitle></FadeIn>
                <FadeIn delay={180}>
                  <AmplopDigitalComponent amplop={data.amplopDigital} primaryColor={ROSE} />
                </FadeIn>
              </div>
            </section>
          )}

          {/* ─── LIVESTREAM ─── */}
          {data.livestream.aktif && data.livestream.url && (
            <section style={{ background: BG2, padding: '48px 24px', textAlign: 'center' }}>
              <div style={{ maxWidth: 480, margin: '0 auto' }}>
                <FadeIn>
                  <STitle>Livestream</STitle>
                  <p style={{ fontSize: 13, color: MUTED, marginBottom: 18 }}>Saksikan momen bahagia kami secara virtual</p>
                  {data.livestream.platform && <p style={{ color: DEEP, marginBottom: 14, fontWeight: 600 }}>{data.livestream.platform}</p>}
                  <a href={data.livestream.url} target="_blank" rel="noopener noreferrer"
                    style={{
                      display: 'inline-block', padding: '12px 36px', background: ROSE, color: 'white',
                      fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase',
                      textDecoration: 'none', borderRadius: 4, boxShadow: `0 4px 16px ${ROSE}40`,
                    }}>
                    Tonton Livestream
                  </a>
                </FadeIn>
              </div>
            </section>
          )}

          {/* ─── UCAPAN ─── */}
          <section ref={setRef('ucapan') as unknown as React.RefCallback<HTMLElement>} id="ucapan"
            style={{ background: BG, padding: '56px 24px' }}>
            <div style={{ maxWidth: 480, margin: '0 auto' }}>
              <FadeIn><STitle sub="Doa terbaik kalian sangat berarti bagi kami">Ucapan &amp; Doa</STitle></FadeIn>
              {data.guestbookAktif && (
                <FadeIn delay={150}>
                  <GuestbookForm guestbook={guestbook} onSubmit={onGuestbookSubmit} primaryColor={ROSE} guestName={guestName} />
                </FadeIn>
              )}
            </div>
          </section>

          {/* ─── RSVP ─── */}
          {data.rsvpAktif && (
            <section style={{ background: BG2, padding: '56px 24px' }}>
              <div style={{ maxWidth: 480, margin: '0 auto' }}>
                <FadeIn><STitle sub="Mohon konfirmasi kehadiran Anda">Konfirmasi Hadir</STitle></FadeIn>
                <FadeIn delay={150}>
                  <RsvpForm slug={slug} rsvps={rsvps} onSubmit={onRsvpSubmit} primaryColor={ROSE} guestName={guestName} />
                </FadeIn>
              </div>
            </section>
          )}

          {/* ─── PROTOKOL KESEHATAN ─── */}
          {data.protokolKesehatan.aktif && (
            <section style={{ background: BG, padding: '32px 24px' }}>
              <div style={{ maxWidth: 480, margin: '0 auto' }}>
                <FadeIn>
                  <div style={{ padding: '18px 22px', borderRadius: 12, background: BG3, borderLeft: `4px solid ${ROSE_L}`, border: `1px solid ${ROSE_P}`, borderLeftWidth: 4, borderLeftColor: ROSE_L }}>
                    <p style={{ fontSize: 10, color: ROSE, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 8, fontWeight: 700 }}>Protokol Kesehatan</p>
                    <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.8, margin: 0 }}>
                      {data.protokolKesehatan.catatan || 'Demi kenyamanan bersama, mohon memperhatikan protokol kesehatan yang berlaku selama acara berlangsung.'}
                    </p>
                  </div>
                </FadeIn>
              </div>
            </section>
          )}

          {/* ─── FOOTER ─── */}
          <footer style={{
            padding: '60px 24px 36px', textAlign: 'center',
            background: `linear-gradient(160deg, ${BG3} 0%, ${ROSE_P} 50%, ${BG3} 100%)`,
            borderTop: `1px solid ${ROSE_P}`, position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.1 }}>
              {(['tl', 'tr', 'bl', 'br'] as const).map(pos => <CornerFloral key={pos} position={pos} />)}
            </div>
            <FadeIn>
              <div style={{ position: 'relative' }}>
                <div style={{ marginBottom: 16 }}>
                  <FlowerDivider />
                </div>
                <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: 48, color: ROSE, margin: '12px 0 6px', textShadow: `0 2px 12px ${ROSE_P}` }}>
                  {pria.namaPanggilan || pria.namaLengkap || 'Pria'}
                  <span style={{ color: ROSE_L, fontSize: 36 }}> &amp; </span>
                  {wanita.namaPanggilan || wanita.namaLengkap || 'Wanita'}
                </p>
                <FlowerDivider />
                <p style={{ fontSize: 10, color: ROSE_L, letterSpacing: '0.38em', textTransform: 'uppercase', marginTop: 12, fontFamily: "'Raleway', sans-serif" }}>
                  Terima Kasih atas Doa &amp; Kehadirannya
                </p>
              </div>
            </FadeIn>
          </footer>

        </div>
      )}

      {/* ━━━ BOTTOM NAV ━━━ */}
      {opened && (
        <nav style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 30, height: 64,
          background: 'rgba(255,251,253,0.97)', backdropFilter: 'blur(14px)',
          borderTop: `1px solid ${ROSE_P}`, display: 'flex',
          boxShadow: `0 -2px 16px ${ROSE_P}60`,
        }}>
          {NAV.map(item => {
            const active = activeNav === item.id;
            return (
              <button key={item.id} onClick={() => scrollTo(item.id)} style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', gap: 3, background: 'none', border: 'none',
                cursor: 'pointer', color: active ? ROSE : `${DEEP}40`,
                transition: 'color 0.25s', padding: '6px 2px', position: 'relative',
              }}>
                {active && (
                  <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 28, height: 2.5, background: ROSE, borderRadius: '0 0 4px 4px' }} />
                )}
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d={item.d} />
                </svg>
                <span style={{ fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: "'Raleway', sans-serif", fontWeight: active ? 700 : 400 }}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      )}

      {/* ━━━ LIGHTBOX ━━━ */}
      {lightboxImg && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(61,21,32,0.92)',
          backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', padding: 16,
        }} onClick={() => setLightboxImg(null)}>
          <img src={lightboxImg} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 8 }} />
          <button onClick={() => setLightboxImg(null)} style={{
            position: 'absolute', top: 16, right: 16, background: `${ROSE}20`, border: `1px solid ${ROSE_L}`,
            color: 'white', width: 36, height: 36, borderRadius: '50%', cursor: 'pointer', fontSize: 18, lineHeight: 1,
          }}>×</button>
        </div>
      )}

      {/* ━━━ GLOBAL STYLES ━━━ */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Raleway:wght@300;400;600;700&display=swap');

        @keyframes petalDrop {
          0%   { transform: translateY(-60px) rotate(0deg); opacity: 0; }
          6%   { opacity: 0.9; }
          85%  { opacity: 0.7; }
          100% { transform: translateY(108vh) rotate(540deg) translateX(40px); opacity: 0; }
        }

        @keyframes floatBlossom {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          33%      { transform: translateY(-14px) rotate(6deg); }
          66%      { transform: translateY(-6px) rotate(-4deg); }
        }

        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        @keyframes heartPulse {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.15); }
        }

        @keyframes pulseButton {
          0%, 100% { box-shadow: 0 0 0 0 rgba(201,107,138,0.35); }
          60%      { box-shadow: 0 0 0 10px rgba(201,107,138,0); }
        }

        @keyframes bounceDown {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50%      { transform: translateX(-50%) translateY(6px); }
        }
      `}</style>
    </div>
  );
}
