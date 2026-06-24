'use client';

import { useState } from 'react';
import { TemplateProps } from './TemplateProps';
import CountdownTimer from '@/components/invitation/CountdownTimer';
import MusicPlayer from '@/components/invitation/MusicPlayer';
import RsvpForm from '@/components/invitation/RsvpForm';
import GuestbookForm from '@/components/invitation/GuestbookForm';
import AmplopDigitalComponent from '@/components/invitation/AmplopDigital';
import ShareButton from '@/components/invitation/ShareButton';
import GoogleMapsEmbed from '@/components/invitation/GoogleMapsEmbed';

const GOLD = '#C9A057';
const SOGA = '#5C2E0E';
const CREAM = '#FAF6ED';
const TEXT = '#2C1810';

// Deterministic petal data — fixed values prevent hydration mismatch
const PETALS = [
  { left:'4%',  dur:'9.1s', delay:'0s',   size:10, opacity:0.35, color:'#C9A057' },
  { left:'12%', dur:'7.4s', delay:'1.2s', size:8,  opacity:0.25, color:'#D4956A' },
  { left:'21%', dur:'11s',  delay:'0.4s', size:12, opacity:0.30, color:'#8B1A1A' },
  { left:'29%', dur:'8.2s', delay:'3.1s', size:9,  opacity:0.20, color:'#E8C4A0' },
  { left:'37%', dur:'10s',  delay:'0.8s', size:7,  opacity:0.35, color:'#C9A057' },
  { left:'46%', dur:'7.8s', delay:'2.5s', size:11, opacity:0.28, color:'#D4956A' },
  { left:'54%', dur:'12s',  delay:'1.7s', size:8,  opacity:0.22, color:'#C9A057' },
  { left:'63%', dur:'9.5s', delay:'4.0s', size:13, opacity:0.30, color:'#8B1A1A' },
  { left:'71%', dur:'8.6s', delay:'0.2s', size:9,  opacity:0.35, color:'#E8C4A0' },
  { left:'79%', dur:'10.5s',delay:'2.9s', size:7,  opacity:0.25, color:'#C9A057' },
  { left:'86%', dur:'7.2s', delay:'1.5s', size:10, opacity:0.30, color:'#D4956A' },
  { left:'93%', dur:'11.5s',delay:'3.8s', size:8,  opacity:0.20, color:'#C9A057' },
  { left:'16%', dur:'9.8s', delay:'5.0s', size:11, opacity:0.28, color:'#8B1A1A' },
  { left:'58%', dur:'8.4s', delay:'1.9s', size:9,  opacity:0.32, color:'#E8C4A0' },
  { left:'42%', dur:'10.2s',delay:'6.5s', size:7,  opacity:0.22, color:'#C9A057' },
];

function FallingPetals() {
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none', zIndex:1 }}>
      {PETALS.map((p, i) => (
        <div
          key={i}
          className={`petal-${i % 3}`}
          style={{
            position: 'absolute',
            top: '-20px',
            left: p.left,
            width: `${p.size}px`,
            height: `${Math.round(p.size * 1.6)}px`,
            backgroundColor: p.color,
            borderRadius: '50% 0 50% 0',
            opacity: p.opacity,
            animationName: `petalFall${i % 3}`,
            animationDuration: p.dur,
            animationDelay: p.delay,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'linear',
          }}
        />
      ))}
    </div>
  );
}

function KawungBorder({ flip = false, height = 52 }: { flip?: boolean; height?: number }) {
  const uid = flip ? 'kb-flip' : 'kb-top';
  return (
    <div style={{ transform: flip ? 'scaleY(-1)' : undefined, lineHeight: 0, overflow: 'hidden' }}>
      <svg viewBox={`0 0 400 ${height}`} width="100%" height={height} preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id={uid} patternUnits="userSpaceOnUse" width="44" height="44">
            <ellipse cx="22" cy="10" rx="9" ry="11" fill="none" stroke={GOLD} strokeWidth="0.65" opacity="0.55"/>
            <ellipse cx="22" cy="34" rx="9" ry="11" fill="none" stroke={GOLD} strokeWidth="0.65" opacity="0.55"/>
            <ellipse cx="10" cy="22" rx="11" ry="9" fill="none" stroke={GOLD} strokeWidth="0.65" opacity="0.55"/>
            <ellipse cx="34" cy="22" rx="11" ry="9" fill="none" stroke={GOLD} strokeWidth="0.65" opacity="0.55"/>
            <circle cx="22" cy="22" r="5" fill="none" stroke={GOLD} strokeWidth="0.7" opacity="0.65"/>
            <circle cx="22" cy="22" r="1.5" fill={GOLD} opacity="0.5"/>
            <circle cx="0"  cy="0"  r="1.8" fill={GOLD} opacity="0.35"/>
            <circle cx="44" cy="0"  r="1.8" fill={GOLD} opacity="0.35"/>
            <circle cx="0"  cy="44" r="1.8" fill={GOLD} opacity="0.35"/>
            <circle cx="44" cy="44" r="1.8" fill={GOLD} opacity="0.35"/>
          </pattern>
        </defs>
        <rect width="400" height={height} fill={`url(#${uid})`}/>
        <line x1="0" y1="1.5" x2="400" y2="1.5" stroke={GOLD} strokeWidth="1.2" opacity="0.75"/>
        <line x1="0" y1="4"   x2="400" y2="4"   stroke={GOLD} strokeWidth="0.4" opacity="0.4"/>
        <line x1="0" y1={height - 1.5} x2="400" y2={height - 1.5} stroke={GOLD} strokeWidth="1.2" opacity="0.75"/>
        <line x1="0" y1={height - 4}   x2="400" y2={height - 4}   stroke={GOLD} strokeWidth="0.4" opacity="0.4"/>
      </svg>
    </div>
  );
}

type CP = 'tl' | 'tr' | 'bl' | 'br';
function CornerOrnament({ pos, size = 72 }: { pos: CP; size?: number }) {
  const sx = pos.endsWith('r') ? -1 : 1;
  const sy = pos.startsWith('b') ? -1 : 1;
  return (
    <div style={{
      position: 'absolute',
      top:    pos.startsWith('t') ? 0 : undefined,
      bottom: pos.startsWith('b') ? 0 : undefined,
      left:   pos.endsWith('l')   ? 0 : undefined,
      right:  pos.endsWith('r')   ? 0 : undefined,
      transform: `scale(${sx}, ${sy})`,
      pointerEvents: 'none',
      lineHeight: 0,
    }}>
      <svg viewBox="0 0 72 72" width={size} height={size}>
        {/* Main diagonal stem */}
        <path d="M 4 68 Q 36 36 68 4" fill="none" stroke={GOLD} strokeWidth="1.1" opacity="0.65"/>
        {/* Large leaf shapes */}
        <path d="M 4 68 C 14 54 28 40 36 36 C 22 46 10 60 4 68 Z" fill={GOLD} opacity="0.14"/>
        <path d="M 68 4 C 54 14 40 28 36 36 C 46 22 60 10 68 4 Z" fill={GOLD} opacity="0.14"/>
        {/* Center flower */}
        <circle cx="36" cy="36" r="4.5" fill={GOLD} opacity="0.75"/>
        <circle cx="36" cy="36" r="7.5" fill="none" stroke={GOLD} strokeWidth="0.9" opacity="0.5"/>
        {/* Petal-like shapes around center */}
        <ellipse cx="36" cy="29" rx="2" ry="3.5" fill={GOLD} opacity="0.4" transform="rotate(-45 36 36)"/>
        <ellipse cx="36" cy="29" rx="2" ry="3.5" fill={GOLD} opacity="0.4" transform="rotate(45 36 36)"/>
        {/* Mid-stem flowers */}
        <circle cx="18" cy="54" r="3"   fill="none" stroke={GOLD} strokeWidth="0.8" opacity="0.55"/>
        <circle cx="18" cy="54" r="1.2" fill={GOLD} opacity="0.55"/>
        <circle cx="54" cy="18" r="3"   fill="none" stroke={GOLD} strokeWidth="0.8" opacity="0.55"/>
        <circle cx="54" cy="18" r="1.2" fill={GOLD} opacity="0.55"/>
        {/* Small dots */}
        <circle cx="8"  cy="62" r="1.4" fill={GOLD} opacity="0.45"/>
        <circle cx="62" cy="8"  r="1.4" fill={GOLD} opacity="0.45"/>
        <circle cx="11" cy="58" r="0.8" fill={GOLD} opacity="0.35"/>
        <circle cx="58" cy="11" r="0.8" fill={GOLD} opacity="0.35"/>
        {/* Corner bracket lines */}
        <path d="M 4 4 L 22 4" fill="none" stroke={GOLD} strokeWidth="0.7" opacity="0.45"/>
        <path d="M 4 4 L 4 22" fill="none" stroke={GOLD} strokeWidth="0.7" opacity="0.45"/>
      </svg>
    </div>
  );
}

function GoldDivider({ compact = false }: { compact?: boolean }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', margin: compact ? '1rem 0' : '1.75rem 0', padding:'0 0.5rem' }}>
      <svg viewBox="0 0 340 22" width="100%" height="22" style={{ maxWidth: 340 }}>
        <defs>
          <linearGradient id="gl1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor={GOLD} stopOpacity="0"/>
            <stop offset="40%"  stopColor={GOLD} stopOpacity="0.8"/>
            <stop offset="100%" stopColor={GOLD} stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="gl2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor={GOLD} stopOpacity="0"/>
            <stop offset="60%"  stopColor={GOLD} stopOpacity="0.8"/>
            <stop offset="100%" stopColor={GOLD} stopOpacity="0"/>
          </linearGradient>
        </defs>
        {/* Left lines */}
        <line x1="0"   y1="11" x2="145" y2="11" stroke="url(#gl1)" strokeWidth="0.8"/>
        <line x1="80"  y1="11" x2="148" y2="11" stroke={GOLD} strokeWidth="1.4" opacity="0.5"/>
        {/* Right lines */}
        <line x1="195" y1="11" x2="340" y2="11" stroke="url(#gl2)" strokeWidth="0.8"/>
        <line x1="192" y1="11" x2="260" y2="11" stroke={GOLD} strokeWidth="1.4" opacity="0.5"/>
        {/* Center diamond cluster */}
        <polygon points="170,4 178,11 170,18 162,11" fill={GOLD} opacity="0.85"/>
        <polygon points="170,7 175,11 170,15 165,11" fill={CREAM} opacity="0.9"/>
        {/* Side diamonds */}
        <polygon points="153,8 158,11 153,14 148,11" fill={GOLD} opacity="0.6"/>
        <polygon points="187,8 192,11 187,14 182,11" fill={GOLD} opacity="0.6"/>
        {/* Tiny accent dots */}
        <circle cx="143" cy="11" r="1.5" fill={GOLD} opacity="0.5"/>
        <circle cx="197" cy="11" r="1.5" fill={GOLD} opacity="0.5"/>
      </svg>
    </div>
  );
}

function SectionFrame({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        border: `1px solid rgba(201,160,87,0.32)`,
        boxShadow: 'inset 0 0 0 6px rgba(201,160,87,0.07), 0 2px 16px rgba(92,46,14,0.06)',
        padding: '3rem 2rem',
        margin: '0 0.75rem',
      }}
    >
      <CornerOrnament pos="tl" size={58} />
      <CornerOrnament pos="tr" size={58} />
      <CornerOrnament pos="bl" size={58} />
      <CornerOrnament pos="br" size={58} />
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ textAlign:'center', marginBottom:'2rem' }}>
      <GoldDivider />
      <h2 style={{
        fontFamily: "'Cormorant Garamond', 'Playfair Display', serif",
        fontSize: '1.45rem',
        fontWeight: 600,
        color: SOGA,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        margin: '0.5rem 0',
      }}>
        {children}
      </h2>
      <GoldDivider />
    </div>
  );
}

function Sec({ children }: { children: React.ReactNode }) {
  return (
    <section style={{ padding: '3rem 1rem', maxWidth: 520, margin: '0 auto', width: '100%' }}>
      {children}
    </section>
  );
}

const formatTgl = (d: string) =>
  d ? new Date(d).toLocaleDateString('id-ID', { weekday:'long', year:'numeric', month:'long', day:'numeric' }) : '';

export default function JavaneseHeritage({
  data, guestName, slug, onRsvpSubmit, onGuestbookSubmit, rsvps, guestbook,
}: TemplateProps) {
  const [opened, setOpened] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const pria = data.mempelai.pria;
  const wanita = data.mempelai.wanita;
  const primaFirst = data.mempelai.urutanTampil !== 'wanita-dulu';
  const m1 = primaFirst ? pria : wanita;
  const m2 = primaFirst ? wanita : pria;
  const firstAcara = data.acara[0];
  const countdownTarget = data.countdown.tanggal || firstAcara?.tanggal || '';

  return (
    <div style={{ background: CREAM, color: TEXT, minHeight: '100vh', fontFamily: "'Lora', 'Georgia', serif" }}>

      {/* Music */}
      {data.musik.url && (
        <MusicPlayer
          url={data.musik.url}
          autoplay={data.musik.autoplay && opened}
          color={GOLD}
          bgColor="rgba(250,246,237,0.92)"
          borderColor="rgba(201,160,87,0.4)"
          positionClassName="fixed bottom-6 right-4 z-50"
        />
      )}

      {/* Share */}
      <ShareButton
        slug={slug}
        pria={pria.namaPanggilan || pria.namaLengkap}
        wanita={wanita.namaPanggilan || wanita.namaLengkap}
        primaryColor={SOGA}
      />

      {/* ── COVER ── */}
      {!opened && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 40,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: `linear-gradient(160deg, #3B1A08 0%, ${SOGA} 45%, #2C1004 100%)`,
            color: CREAM, textAlign: 'center', overflow: 'hidden',
          }}
        >
          <FallingPetals />

          {/* Kawung top */}
          <div style={{ position:'absolute', top:0, left:0, right:0, zIndex:2, opacity:0.8 }}>
            <KawungBorder />
          </div>

          {/* Corner ornaments */}
          <div style={{ position:'absolute', inset:0, zIndex:2, pointerEvents:'none' }}>
            <CornerOrnament pos="tl" size={90} />
            <CornerOrnament pos="tr" size={90} />
            <CornerOrnament pos="bl" size={90} />
            <CornerOrnament pos="br" size={90} />
          </div>

          {/* Content */}
          <div style={{ position:'relative', zIndex:3, padding:'0 2rem', maxWidth:380, width:'100%' }}>
            {/* Kepada Yth */}
            {guestName && (
              <div style={{ marginBottom:'1.5rem' }}>
                <p style={{ fontSize:'0.65rem', letterSpacing:'0.35em', textTransform:'uppercase', color:GOLD, opacity:0.8, marginBottom:'0.3rem' }}>
                  Kepada Yth.
                </p>
                <p style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:'1.2rem', color:CREAM }}>
                  {guestName}
                </p>
              </div>
            )}

            {/* Label */}
            <p style={{ fontSize:'0.6rem', letterSpacing:'0.4em', textTransform:'uppercase', color:GOLD, marginBottom:'1.25rem', opacity:0.85 }}>
              ✦ &nbsp; Undangan Pernikahan &nbsp; ✦
            </p>

            {/* Names */}
            <h1 style={{
              fontFamily: "'Cormorant Garamond', 'Playfair Display', serif",
              fontSize: 'clamp(2.2rem, 8vw, 3.2rem)',
              fontWeight: 500,
              color: CREAM,
              lineHeight: 1.1,
              marginBottom: '0.25rem',
            }}>
              {m1.namaPanggilan || m1.namaLengkap || 'Nama'}
            </h1>

            <p style={{
              fontFamily: "'Great Vibes', cursive",
              fontSize: 'clamp(2rem, 7vw, 2.8rem)',
              color: GOLD,
              margin: '0.2rem 0',
              lineHeight: 1.2,
            }}>
              dan
            </p>

            <h1 style={{
              fontFamily: "'Cormorant Garamond', 'Playfair Display', serif",
              fontSize: 'clamp(2.2rem, 8vw, 3.2rem)',
              fontWeight: 500,
              color: CREAM,
              lineHeight: 1.1,
              marginBottom: '1.2rem',
            }}>
              {m2.namaPanggilan || m2.namaLengkap || 'Nama'}
            </h1>

            {/* Gold divider */}
            <GoldDivider compact />

            {/* Date */}
            {firstAcara && (
              <p style={{ fontSize:'0.75rem', letterSpacing:'0.2em', color:GOLD, margin:'0.75rem 0 1.5rem', opacity:0.9 }}>
                {formatTgl(firstAcara.tanggal)}
              </p>
            )}

            {/* Button */}
            <button
              onClick={() => setOpened(true)}
              style={{
                padding: '0.75rem 2.5rem',
                border: `1.5px solid ${GOLD}`,
                background: 'transparent',
                color: GOLD,
                fontFamily: "'Lora', serif",
                fontSize: '0.75rem',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => {
                (e.target as HTMLButtonElement).style.background = GOLD;
                (e.target as HTMLButtonElement).style.color = SOGA;
              }}
              onMouseLeave={e => {
                (e.target as HTMLButtonElement).style.background = 'transparent';
                (e.target as HTMLButtonElement).style.color = GOLD;
              }}
            >
              Buka Undangan
            </button>
          </div>

          {/* Kawung bottom */}
          <div style={{ position:'absolute', bottom:0, left:0, right:0, zIndex:2, opacity:0.8 }}>
            <KawungBorder flip />
          </div>
        </div>
      )}

      {/* ── CONTENT ── */}
      {opened && (
        <div style={{ animation: 'fadeInJH 0.8s ease-in-out' }}>

          {/* Kawung header ornament */}
          <div style={{ opacity:0.7 }}>
            <KawungBorder height={48} />
          </div>

          {/* ── Mempelai ── */}
          <Sec>
            <SectionFrame>
              <SectionTitle>Mempelai</SectionTitle>
              <div style={{ display:'flex', flexDirection:'column', gap:'2.5rem' }}>
                {[m1, m2].map((m, i) => (
                  <div key={i} style={{ textAlign:'center' }}>
                    {/* Photo */}
                    <div style={{ position:'relative', display:'inline-block', marginBottom:'1rem' }}>
                      {/* Ornamental ring */}
                      <div style={{
                        width:128, height:128, borderRadius:'50%',
                        border:`2px solid ${GOLD}`,
                        padding:4,
                        background:`linear-gradient(135deg, rgba(201,160,87,0.15), rgba(92,46,14,0.1))`,
                        margin:'0 auto',
                        position:'relative',
                      }}>
                        <div style={{ width:'100%', height:'100%', borderRadius:'50%', overflow:'hidden', border:`1px solid rgba(201,160,87,0.3)` }}>
                          {m.foto ? (
                            <img src={m.foto} alt={m.namaLengkap || ''} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                          ) : (
                            <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', background:`rgba(92,46,14,0.08)` }}>
                              <span style={{ color:GOLD, fontSize:'2.5rem' }}>✿</span>
                            </div>
                          )}
                        </div>
                        {/* Small diamond ornaments around photo */}
                        {[0,90,180,270].map(deg => (
                          <div key={deg} style={{
                            position:'absolute', top:'50%', left:'50%',
                            transform:`rotate(${deg}deg) translateY(-67px) translateX(-4px)`,
                            width:8, height:8,
                            background:GOLD, clipPath:'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                            opacity:0.75,
                          }}/>
                        ))}
                      </div>
                    </div>

                    <h3 style={{
                      fontFamily:"'Cormorant Garamond', serif",
                      fontSize:'1.5rem',
                      fontWeight:600,
                      color:SOGA,
                      margin:'0.5rem 0 0.25rem',
                    }}>
                      {m.namaLengkap || '—'}
                    </h3>

                    {m.anakKe && (
                      <p style={{ fontSize:'0.8rem', color:TEXT, opacity:0.65, margin:'0.15rem 0' }}>
                        Putra/Putri ke-{m.anakKe}
                      </p>
                    )}

                    {(m.ayah || m.ibu) && (
                      <p style={{ fontSize:'0.8rem', color:TEXT, opacity:0.65 }}>
                        dari {[m.ayah, m.ibu].filter(Boolean).join(' & ')}
                      </p>
                    )}

                    {m.instagram && (
                      <a
                        href={`https://instagram.com/${m.instagram.replace('@','')}`}
                        target="_blank" rel="noopener noreferrer"
                        style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:'0.78rem', color:GOLD, marginTop:'0.4rem', textDecoration:'none' }}
                      >
                        <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                        </svg>
                        {m.instagram}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </SectionFrame>
          </Sec>

          {/* ── Countdown ── */}
          {countdownTarget && (
            <Sec>
              <SectionFrame>
                <SectionTitle>Hitung Mundur</SectionTitle>
                <CountdownTimer
                  targetDate={countdownTarget}
                  numberStyle="text-4xl font-bold text-[#5C2E0E]"
                  labelStyle="text-xs uppercase tracking-widest mt-1 opacity-60 text-[#2C1810]"
                  containerStyle="flex justify-center gap-6"
                />
                {firstAcara?.tanggal && (
                  <p style={{ textAlign:'center', fontSize:'0.75rem', color:TEXT, opacity:0.6, marginTop:'1rem', letterSpacing:'0.1em' }}>
                    {formatTgl(firstAcara.tanggal)}
                  </p>
                )}
              </SectionFrame>
            </Sec>
          )}

          {/* ── Acara ── */}
          {data.acara.length > 0 && (
            <Sec>
              <SectionFrame>
                <SectionTitle>Detail Acara</SectionTitle>
                <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
                  {data.acara.map((acara, i) => (
                    <div key={i} style={{
                      border:`1px solid rgba(201,160,87,0.3)`,
                      padding:'1.5rem',
                      textAlign:'center',
                      background:`linear-gradient(135deg, rgba(201,160,87,0.04), transparent)`,
                      position:'relative',
                    }}>
                      {/* Corner mini ornaments */}
                      <div style={{ position:'absolute', top:-1, left:-1, width:16, height:16, borderTop:`2px solid ${GOLD}`, borderLeft:`2px solid ${GOLD}`, opacity:0.6 }}/>
                      <div style={{ position:'absolute', top:-1, right:-1, width:16, height:16, borderTop:`2px solid ${GOLD}`, borderRight:`2px solid ${GOLD}`, opacity:0.6 }}/>
                      <div style={{ position:'absolute', bottom:-1, left:-1, width:16, height:16, borderBottom:`2px solid ${GOLD}`, borderLeft:`2px solid ${GOLD}`, opacity:0.6 }}/>
                      <div style={{ position:'absolute', bottom:-1, right:-1, width:16, height:16, borderBottom:`2px solid ${GOLD}`, borderRight:`2px solid ${GOLD}`, opacity:0.6 }}/>

                      <h3 style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:'1.2rem', fontWeight:600, color:SOGA, marginBottom:'0.75rem' }}>
                        {acara.nama}
                      </h3>
                      <p style={{ fontSize:'0.82rem', color:TEXT, opacity:0.75, marginBottom:'0.3rem' }}>
                        {formatTgl(acara.tanggal)}
                      </p>
                      <p style={{ fontSize:'0.82rem', color:TEXT, opacity:0.75, marginBottom:'0.5rem' }}>
                        {acara.waktuMulai} – {acara.waktuSelesai} WIB
                      </p>
                      <p style={{ fontWeight:600, color:SOGA, fontSize:'0.9rem' }}>{acara.lokasi}</p>
                      <p style={{ fontSize:'0.78rem', color:TEXT, opacity:0.65, margin:'0.25rem 0 0.75rem' }}>{acara.alamat}</p>
                      <GoogleMapsEmbed lokasi={acara.lokasi} alamat={acara.alamat} />
                      {acara.mapsUrl && (
                        <a
                          href={acara.mapsUrl} target="_blank" rel="noopener noreferrer"
                          style={{
                            display:'inline-flex', alignItems:'center', gap:6,
                            padding:'0.5rem 1.5rem',
                            border:`1.5px solid ${SOGA}`,
                            color:SOGA,
                            fontSize:'0.7rem', letterSpacing:'0.2em', textTransform:'uppercase',
                            textDecoration:'none',
                          }}
                        >
                          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                          </svg>
                          Google Maps
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </SectionFrame>
            </Sec>
          )}

          {/* ── Galeri ── */}
          {data.galeri.length > 0 && (
            <Sec>
              <SectionFrame>
                <SectionTitle>Galeri Foto</SectionTitle>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem' }}>
                  {data.galeri.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setLightbox(src)}
                      style={{
                        aspectRatio:'1', overflow:'hidden',
                        border:`1px solid rgba(201,160,87,0.3)`,
                        cursor:'pointer', padding:0, background:'none',
                      }}
                    >
                      <img src={src} alt={`Galeri ${i + 1}`} style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.3s' }}
                        onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = 'scale(1.05)'; }}
                        onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = 'scale(1)'; }}
                      />
                    </button>
                  ))}
                </div>
              </SectionFrame>
            </Sec>
          )}

          {/* ── Love Story ── */}
          {data.loveStory.length > 0 && (
            <Sec>
              <SectionFrame>
                <SectionTitle>Perjalanan Cinta</SectionTitle>
                <div style={{ position:'relative', paddingLeft:'2rem' }}>
                  <div style={{ position:'absolute', left:'0.75rem', top:0, bottom:0, width:1, background:`linear-gradient(to bottom, transparent, ${GOLD}, transparent)` }}/>
                  {data.loveStory.map((item, i) => (
                    <div key={i} style={{ position:'relative', marginBottom:'2rem' }}>
                      {/* Timeline dot */}
                      <div style={{
                        position:'absolute', left:'-1.45rem', top:'0.15rem',
                        width:14, height:14,
                        background:CREAM, border:`1.5px solid ${GOLD}`,
                        clipPath:'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                      }}/>
                      <p style={{ fontSize:'0.65rem', letterSpacing:'0.25em', textTransform:'uppercase', color:GOLD, marginBottom:'0.25rem' }}>
                        {item.tahun}
                      </p>
                      <h4 style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:'1.1rem', fontWeight:600, color:SOGA, marginBottom:'0.35rem' }}>
                        {item.judul}
                      </h4>
                      <p style={{ fontSize:'0.82rem', color:TEXT, opacity:0.7, lineHeight:1.7 }}>
                        {item.cerita}
                      </p>
                    </div>
                  ))}
                </div>
              </SectionFrame>
            </Sec>
          )}

          {/* ── Quote ── */}
          {data.quote.teks && (
            <Sec>
              <div style={{ textAlign:'center', padding:'1rem 0' }}>
                <GoldDivider />
                <p style={{
                  fontFamily:"'Great Vibes', cursive",
                  fontSize:'clamp(1.4rem, 5vw, 2rem)',
                  color:SOGA,
                  lineHeight:1.5,
                  margin:'1rem 0 0.5rem',
                }}>
                  &ldquo;{data.quote.teks}&rdquo;
                </p>
                {data.quote.sumber && (
                  <p style={{ fontSize:'0.75rem', color:TEXT, opacity:0.6, letterSpacing:'0.15em' }}>
                    — {data.quote.sumber}
                  </p>
                )}
                <GoldDivider />
              </div>
            </Sec>
          )}

          {/* ── Livestream ── */}
          {data.livestream.aktif && data.livestream.url && (
            <Sec>
              <SectionFrame>
                <SectionTitle>Livestream</SectionTitle>
                <div style={{ textAlign:'center' }}>
                  <p style={{ fontSize:'0.83rem', color:TEXT, opacity:0.7, marginBottom:'1rem' }}>
                    Saksikan momen istimewa kami secara virtual
                  </p>
                  {data.livestream.platform && (
                    <p style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:'1rem', color:SOGA, fontWeight:600, marginBottom:'0.75rem' }}>
                      {data.livestream.platform}
                    </p>
                  )}
                  <a
                    href={data.livestream.url} target="_blank" rel="noopener noreferrer"
                    style={{
                      display:'inline-block',
                      padding:'0.65rem 2rem',
                      background:SOGA, color:CREAM,
                      fontSize:'0.72rem', letterSpacing:'0.25em', textTransform:'uppercase',
                      textDecoration:'none',
                    }}
                  >
                    Tonton Livestream
                  </a>
                </div>
              </SectionFrame>
            </Sec>
          )}

          {/* ── RSVP ── */}
          {data.rsvpAktif && (
            <Sec>
              <SectionFrame>
                <SectionTitle>Konfirmasi Kehadiran</SectionTitle>
                <RsvpForm
                  slug={slug}
                  rsvps={rsvps}
                  onSubmit={onRsvpSubmit}
                  primaryColor={SOGA}
                />
              </SectionFrame>
            </Sec>
          )}

          {/* ── Buku Tamu ── */}
          {data.guestbookAktif && (
            <Sec>
              <SectionFrame>
                <SectionTitle>Buku Tamu</SectionTitle>
                <GuestbookForm
                  guestbook={guestbook}
                  onSubmit={onGuestbookSubmit}
                  primaryColor={SOGA}
                  guestName={guestName}
                />
              </SectionFrame>
            </Sec>
          )}

          {/* ── Amplop Digital ── */}
          {data.amplopDigital.aktif && (
            <Sec>
              <SectionFrame>
                <SectionTitle>Amplop Digital</SectionTitle>
                <p style={{ textAlign:'center', fontSize:'0.82rem', color:TEXT, opacity:0.65, marginBottom:'1.5rem' }}>
                  Doa dan perhatian tulus Anda adalah hadiah terindah bagi kami
                </p>
                <AmplopDigitalComponent amplop={data.amplopDigital} primaryColor={SOGA} />
              </SectionFrame>
            </Sec>
          )}

          {/* ── Protokol Kesehatan ── */}
          {data.protokolKesehatan.aktif && (
            <Sec>
              <SectionFrame>
                <SectionTitle>Protokol Kesehatan</SectionTitle>
                <div style={{
                  border:`1px solid rgba(201,160,87,0.25)`,
                  padding:'1.25rem',
                  textAlign:'center',
                  fontSize:'0.82rem', color:TEXT, opacity:0.75, lineHeight:1.8,
                }}>
                  {data.protokolKesehatan.catatan || 'Harap memperhatikan protokol kesehatan yang berlaku selama acara berlangsung.'}
                </div>
              </SectionFrame>
            </Sec>
          )}

          {/* ── Footer ── */}
          <div style={{ opacity:0.7, marginTop:'1rem' }}>
            <KawungBorder flip height={48} />
          </div>
          <footer style={{
            padding:'2.5rem 1.5rem 3rem',
            textAlign:'center',
            borderTop:`1px solid rgba(201,160,87,0.2)`,
          }}>
            <p style={{ fontFamily:"'Great Vibes', cursive", fontSize:'2rem', color:SOGA, marginBottom:'0.5rem' }}>
              {(pria.namaPanggilan || pria.namaLengkap || 'Nama Pria')} & {(wanita.namaPanggilan || wanita.namaLengkap || 'Nama Wanita')}
            </p>
            <GoldDivider compact />
            <p style={{ fontSize:'0.65rem', letterSpacing:'0.3em', textTransform:'uppercase', color:TEXT, opacity:0.45, marginTop:'0.75rem' }}>
              Terima kasih atas kehadiran dan doa restu Anda
            </p>
          </footer>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{ position:'fixed', inset:0, zIndex:50, background:'rgba(0,0,0,0.92)', display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}
        >
          <img src={lightbox} alt="Galeri" style={{ maxWidth:'100%', maxHeight:'100%', objectFit:'contain', borderRadius:2 }}/>
          <button
            onClick={() => setLightbox(null)}
            style={{ position:'absolute', top:'1rem', right:'1rem', background:'none', border:'none', color:'#fff', fontSize:'2rem', cursor:'pointer', opacity:0.8 }}
          >✕</button>
        </div>
      )}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Great+Vibes&family=Lora:wght@400;500&display=swap');

        @keyframes petalFall0 {
          0%   { transform: translateY(-20px)  rotate(0deg)   scaleX(1); }
          25%  { transform: translateY(25vh)   rotate(90deg)  scaleX(-1); }
          50%  { transform: translateY(50vh)   rotate(180deg) scaleX(1); }
          75%  { transform: translateY(75vh)   rotate(270deg) scaleX(-1); }
          100% { transform: translateY(105vh)  rotate(360deg) scaleX(1); }
        }
        @keyframes petalFall1 {
          0%   { transform: translateY(-20px)  rotate(30deg)  translateX(0px); }
          33%  { transform: translateY(33vh)   rotate(160deg) translateX(18px); }
          66%  { transform: translateY(66vh)   rotate(290deg) translateX(-12px); }
          100% { transform: translateY(105vh)  rotate(420deg) translateX(6px); }
        }
        @keyframes petalFall2 {
          0%   { transform: translateY(-20px)  rotate(-20deg) skewX(0deg); }
          40%  { transform: translateY(40vh)   rotate(140deg) skewX(15deg); }
          70%  { transform: translateY(70vh)   rotate(260deg) skewX(-10deg); }
          100% { transform: translateY(105vh)  rotate(340deg) skewX(0deg); }
        }
        @keyframes fadeInJH {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
