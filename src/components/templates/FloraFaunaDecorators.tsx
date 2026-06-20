'use client';

// ── FloraFauna-specific decorator components ──────────────────────────────────
// These are used as "decorators" in the FloraFaunaTheme config. Each component
// is self-contained: it includes its own keyframe CSS via <style> tags.

const GOLD    = '#C9A84C';
const GOLD_L  = '#E8C547';
const GOLD_D  = '#8B6914';
const TEAL    = '#1B7A8C';
const TEAL_L  = '#2ea8bf';
const DARK    = '#120D08';

// ── Petal data ────────────────────────────────────────────────────────────────
const PETAL_COLORS = ['#ff9f7f', '#ffbfcc', '#7fc4d4', '#f9df8a', '#c8a8e9', '#a8dab5', '#f4a0c0', '#80c8e0'];
const PETALS_DATA = Array.from({ length: 28 }, (_, i) => ({
  left:  (i * 17 + 5) % 100,
  delay: (i * 0.53) % 9,
  dur:   5.5 + (i % 6) * 0.9,
  size:  7 + (i % 5) * 3,
  color: PETAL_COLORS[i % PETAL_COLORS.length],
  sway:  ((i % 3) - 1) * 45,
  shape: i % 3,
}));

// ── Single petal shape ────────────────────────────────────────────────────────
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

// ── Peacock SVG (single bird) ─────────────────────────────────────────────────
function PeacockSVG({ size = 180 }: { size?: number }) {
  return (
    <svg
      width={size} height={size * 1.1}
      viewBox="0 0 180 198"
      style={{ display: 'block', animation: 'peacockSway 4s ease-in-out infinite', transformOrigin: 'bottom center' }}
    >
      {/* Tail fan */}
      <g style={{ animation: 'featherSpread 5s ease-in-out infinite', transformOrigin: '90px 140px' }}>
        {[-60, -45, -30, -15, 0, 15, 30, 45, 60].map((angle, i) => (
          <g key={i} transform={`rotate(${angle} 90 145)`}>
            <line x1="90" y1="145" x2="90" y2="30" stroke="#1a6e7e" strokeWidth="1.2" opacity="0.6" />
            <ellipse cx="90" cy="28" rx="9" ry="12" fill="#1a8fa8" opacity="0.3"
              style={{ animation: `eyeGlow ${2.5 + i * 0.3}s ease-in-out infinite` }} />
            <ellipse cx="90" cy="28" rx="5.5" ry="7.5" fill="#0d5c70" opacity="0.5"
              style={{ animation: `eyeGlow ${2 + i * 0.3}s ease-in-out infinite` }} />
            <ellipse cx="90" cy="28" rx="3" ry="4" fill={GOLD} opacity="0.75" />
            <circle cx="90" cy="28" r="1.5" fill="#08303a" />
            {[-12, -7, 7, 12].map((bx, j) => (
              <line key={j} x1="90" y1={50 + j * 18} x2={90 + bx * (1 + j * 0.1)} y2={44 + j * 18}
                stroke="#2da8c0" strokeWidth="0.7" opacity="0.4" />
            ))}
          </g>
        ))}
      </g>
      {/* Body */}
      <ellipse cx="90" cy="148" rx="20" ry="28" fill="#1a6e7e" opacity="0.9" />
      <ellipse cx="83" cy="152" rx="14" ry="20" fill="#0d4d5a" opacity="0.5" transform="rotate(-8 83 152)" />
      <ellipse cx="90" cy="140" rx="14" ry="18" fill="#29b8d4" opacity="0.7" />
      {/* Neck + Head */}
      <path d="M 83 126 Q 78 110 82 96 Q 86 84 90 80 Q 94 84 98 96 Q 102 110 97 126 Z" fill="#1a6e7e" />
      <circle cx="90" cy="76" r="13" fill="#1a7a8c" />
      <circle cx="90" cy="76" r="11" fill="#29b8d4" opacity="0.7" />
      <circle cx="94" cy="73" r="3.5" fill="white" />
      <circle cx="94.5" cy="73" r="2.5" fill="#08202a" />
      <circle cx="95.2" cy="72.2" r="0.9" fill="white" />
      <path d="M 90 84 L 84 90 L 90 88 Z" fill={GOLD} opacity="0.9" />
      {/* Crown */}
      {[-1, 0, 1].map((ox, ci) => (
        <g key={ci}>
          <line x1={90 + ox * 6} y1="64" x2={90 + ox * 9} y2="48" stroke="#2da8c0" strokeWidth="1.2" />
          <circle cx={90 + ox * 9} cy="47" r="2.5" fill={GOLD} opacity="0.85" />
        </g>
      ))}
      <ellipse cx="90" cy="138" rx="6" ry="8" fill={GOLD} opacity="0.3" />
      {/* Legs */}
      <line x1="84" y1="174" x2="80" y2="192" stroke="#0d4d5a" strokeWidth="2.5" />
      <line x1="96" y1="174" x2="100" y2="192" stroke="#0d4d5a" strokeWidth="2.5" />
      <path d="M80,192 L74,196 M80,192 L78,198 M80,192 L84,197" stroke="#0d4d5a" strokeWidth="1.5" />
      <path d="M100,192 L94,196 M100,192 L98,198 M100,192 L104,197" stroke="#0d4d5a" strokeWidth="1.5" />
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Exported decorators
// ═══════════════════════════════════════════════════════════════════════════════

// CoverTopOverlay ─────────────────────────────────────────────────────────────
export function GoldArch() {
  return (
    <>
      <style>{`@keyframes archGlow { 0%,100% { opacity: 0.75; } 50% { opacity: 1; } }`}</style>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'archGlow 3s ease-in-out infinite',
      }}>
        <svg width="90%" height="85%" viewBox="0 0 340 520" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="ffArchGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={GOLD_D} />
              <stop offset="40%" stopColor={GOLD_L} />
              <stop offset="60%" stopColor={GOLD} />
              <stop offset="100%" stopColor={GOLD_D} />
            </linearGradient>
          </defs>
          {/* Outer arch */}
          <path
            d="M 7 442 L 7 170 A 163 163 0 0 1 333 170 L 333 442"
            fill="none" stroke="url(#ffArchGold)" strokeWidth="1.8" opacity="0.75"
          />
          {/* Inner arch */}
          <path
            d="M 30 442 L 30 188 A 140 140 0 0 1 310 188 L 310 442"
            fill="none" stroke="url(#ffArchGold)" strokeWidth="0.8" opacity="0.4"
          />
          {/* Top ornament */}
          <g transform="translate(170, 10)">
            <polygon points="0,-8 6,0 0,8 -6,0" fill={GOLD} opacity="0.9" />
            <polygon points="0,-8 6,0 0,8 -6,0" fill="none" stroke={GOLD_L} strokeWidth="0.5" opacity="0.6" />
            <circle cx="-12" cy="0" r="2.5" fill={GOLD} opacity="0.5" />
            <circle cx="12" cy="0" r="2.5" fill={GOLD} opacity="0.5" />
          </g>
          {/* Base line */}
          <line x1="7" y1="442" x2="333" y2="442" stroke="url(#ffArchGold)" strokeWidth="1" opacity="0.5" />
        </svg>
      </div>
    </>
  );
}

// CoverAnimation ──────────────────────────────────────────────────────────────
export function FallingPetals() {
  return (
    <>
      <style>{`
        @keyframes petalFall {
          0%   { transform: translateY(-60px) rotate(0deg) translateX(0px); opacity: 0; }
          8%   { opacity: 0.85; }
          92%  { opacity: 0.6; }
          100% { transform: translateY(110vh) rotate(480deg) translateX(var(--sway,30px)); opacity: 0; }
        }
      `}</style>
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
    </>
  );
}

// CoverBottomDecor ────────────────────────────────────────────────────────────
export function PeacockSVGPair() {
  return (
    <>
      <style>{`
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
      `}</style>
      <div style={{
        position: 'absolute', bottom: 0, left: '5%',
        pointerEvents: 'none',
        filter: 'drop-shadow(0 4px 16px rgba(29,122,140,0.5))',
      }}>
        <PeacockSVG size={160} />
      </div>
      <div style={{
        position: 'absolute', bottom: 0, right: '5%',
        pointerEvents: 'none',
        transform: 'scaleX(-1)',
        filter: 'drop-shadow(0 4px 16px rgba(29,122,140,0.5))',
      }}>
        <PeacockSVG size={140} />
      </div>
    </>
  );
}

// SectionDivider ──────────────────────────────────────────────────────────────
export function PeacockDivider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, margin: '22px 0' }}>
      <div style={{ height: 1, flex: 1, maxWidth: 80, background: `linear-gradient(to right, transparent, ${GOLD_D})` }} />
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

// MempelaiFrame ───────────────────────────────────────────────────────────────
export function FloralWreathFrame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: 'relative', display: 'inline-block', maxWidth: 380, width: '100%' }}>
      <img
        src="/assets/templates/flora-fauna/floral-wreath.jpg"
        alt=""
        aria-hidden
        style={{
          position: 'absolute', inset: '-14% -10%',
          width: '120%', height: '120%',
          objectFit: 'contain',
          mixBlendMode: 'multiply',
          pointerEvents: 'none',
          opacity: 0.85,
        }}
      />
      <div style={{ position: 'relative', zIndex: 1, padding: '48px 36px 44px' }}>
        {children}
      </div>
    </div>
  );
}

// SectionBgDecor ──────────────────────────────────────────────────────────────
const FLOAT_EYES = Array.from({ length: 10 }, (_, i) => ({
  left:  (i * 23 + 8) % 90,
  delay: (i * 0.8) % 7,
  dur:   8 + (i % 5) * 1.5,
  size:  14 + (i % 4) * 6,
}));

export function FloatingEyes() {
  return (
    <>
      <style>{`
        @keyframes floatUp {
          0%   { transform: translateY(0) scale(1) rotate(0deg); opacity: 0; }
          10%  { opacity: 0.35; }
          90%  { opacity: 0.2; }
          100% { transform: translateY(-110vh) scale(0.7) rotate(180deg); opacity: 0; }
        }
      `}</style>
      {FLOAT_EYES.map((fe, i) => (
        <div key={i} style={{
          position: 'absolute', left: `${fe.left}%`, bottom: '-20px',
          animation: `floatUp ${fe.dur}s ${fe.delay}s linear infinite`,
        }}>
          <svg width={fe.size} height={fe.size} viewBox="0 0 32 32"
            style={{ animation: `eyeGlow ${2 + i * 0.4}s ease-in-out infinite` }}>
            <ellipse cx="16" cy="16" rx="14" ry="14" fill="none" stroke={GOLD_D} strokeWidth="0.7" opacity="0.3" />
            <ellipse cx="16" cy="16" rx="9" ry="9" fill={TEAL} opacity="0.15" />
            <ellipse cx="16" cy="16" rx="5" ry="5" fill={GOLD} opacity="0.35" />
            <circle cx="16" cy="16" r="2.5" fill={DARK} opacity="0.4" />
          </svg>
        </div>
      ))}
    </>
  );
}

// MempelaiSectionDecor ────────────────────────────────────────────────────────
export function MempelaiPetals() {
  return (
    <>
      <style>{`
        @keyframes petalFall {
          0%   { transform: translateY(-60px) rotate(0deg) translateX(0px); opacity: 0; }
          8%   { opacity: 0.85; }
          92%  { opacity: 0.6; }
          100% { transform: translateY(110vh) rotate(480deg) translateX(var(--sway,30px)); opacity: 0; }
        }
      `}</style>
      {PETALS_DATA.filter((_, i) => i % 3 === 0).map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            top: -30,
            // @ts-ignore
            '--sway': `${p.sway * 0.5}px`,
            animation: `petalFall ${p.dur * 1.4}s ${p.delay * 0.8}s linear infinite`,
            opacity: 0.5,
          }}
        >
          <FloralPetal size={p.size - 2} color={p.color} shape={p.shape} />
        </div>
      ))}
    </>
  );
}

// AcaraCardDecor ──────────────────────────────────────────────────────────────
export function FeatherCorner({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
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
        <path d="M 5 75 Q 30 50 60 10" stroke={TEAL} strokeWidth="1.5" fill="none" strokeLinecap="round" />
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
        <ellipse cx="61" cy="9" rx="7" ry="7" fill="none" stroke={GOLD} strokeWidth="0.8" />
        <ellipse cx="61" cy="9" rx="4" ry="4" fill={TEAL} opacity="0.4" />
        <circle cx="61" cy="9" r="2" fill={GOLD} opacity="0.7" />
      </svg>
    </div>
  );
}
