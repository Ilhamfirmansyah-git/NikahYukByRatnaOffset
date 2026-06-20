'use client';

import { useState, useEffect, useRef, ReactNode, ComponentType, useMemo } from 'react';
import { TemplateProps } from '../TemplateProps';
import { CanvaTemplateTheme } from './types';
import MusicPlayer from '@/components/invitation/MusicPlayer';
import RsvpForm from '@/components/invitation/RsvpForm';
import GuestbookForm from '@/components/invitation/GuestbookForm';
import AmplopDigitalComponent from '@/components/invitation/AmplopDigital';
import ShareButton from '@/components/invitation/ShareButton';

// ── Shared utilities ───────────────────────────────────────────────────────────

const fmt = (t: string) =>
  t ? new Date(t).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '';

const fmtTime = (t: string) =>
  t ? new Date(`1970-01-01T${t}`).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '';

// ── FadeIn scroll reveal ───────────────────────────────────────────────────────
export function FadeIn({ children, delay = 0, from = 'bottom' }: {
  children: ReactNode; delay?: number; from?: 'bottom' | 'left' | 'right' | 'none';
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

// ── Countdown timer ────────────────────────────────────────────────────────────
function BaseCountdown({ targetDate, theme }: { targetDate: string; theme: CanvaTemplateTheme }) {
  const calc = () => {
    const diff = new Date(targetDate).getTime() - Date.now();
    if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 };
    return { d: Math.floor(diff / 86400000), h: Math.floor(diff / 3600000 % 24), m: Math.floor(diff / 60000 % 60), s: Math.floor(diff / 1000 % 60) };
  };
  const [t, setT] = useState(calc);
  useEffect(() => { const id = setInterval(() => setT(calc()), 1000); return () => clearInterval(id); }, [targetDate]);
  const pad = (n: number) => String(n).padStart(2, '0');
  const units = [{ v: t.d, l: 'Hari' }, { v: t.h, l: 'Jam' }, { v: t.m, l: 'Menit' }, { v: t.s, l: 'Detik' }];
  const c = theme.colors;
  const f = theme.fonts;
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
      {units.map(u => (
        <div key={u.l} style={{ textAlign: 'center', minWidth: 64 }}>
          <div style={{
            background: c.bgDark, border: `1.5px solid ${c.primaryDark}`, borderRadius: 10,
            padding: '10px 6px', marginBottom: 6,
            boxShadow: `0 2px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)`,
          }}>
            <span style={{ fontFamily: f.subheading, fontSize: 36, fontWeight: 600, color: c.primaryLight, display: 'block', lineHeight: 1 }}>
              {pad(u.v)}
            </span>
          </div>
          <span style={{ fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase' as const, color: c.primaryDark, fontFamily: f.body }}>
            {u.l}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Default section divider ────────────────────────────────────────────────────
function DefaultDivider({ theme }: { theme: CanvaTemplateTheme }) {
  const c = theme.colors;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '22px 0' }}>
      <div style={{ flex: 1, height: 1, maxWidth: 80, background: `linear-gradient(to right, transparent, ${c.primaryDark})` }} />
      <svg width="12" height="12" viewBox="0 0 12 12">
        <polygon points="6,0 12,6 6,12 0,6" fill={c.primaryDark} opacity="0.6" />
      </svg>
      <div style={{ flex: 1, height: 1, maxWidth: 80, background: `linear-gradient(to left, transparent, ${c.primaryDark})` }} />
    </div>
  );
}

// ── Default frame for mempelai cards ──────────────────────────────────────────
function DefaultFrame({ children }: { children: ReactNode }) {
  return <div style={{ padding: '24px 20px' }}>{children}</div>;
}

function ImageFrame({ children, src }: { children: ReactNode; src: string }) {
  return (
    <div style={{ position: 'relative', display: 'inline-block', maxWidth: 380, width: '100%' }}>
      <img src={src} alt="" aria-hidden style={{
        position: 'absolute', inset: '-14% -10%', width: '120%', height: '120%',
        objectFit: 'contain', mixBlendMode: 'multiply' as const, pointerEvents: 'none', opacity: 0.85,
      }} />
      <div style={{ position: 'relative', zIndex: 1, padding: '48px 36px 44px' }}>{children}</div>
    </div>
  );
}

// ── Module-level helpers that accept theme ────────────────────────────────────

function SectionTitle({ children, sub, theme, Divider }: {
  children: ReactNode; sub?: string; theme: CanvaTemplateTheme; Divider: ComponentType;
}) {
  const c = theme.colors;
  const f = theme.fonts;
  return (
    <div style={{ textAlign: 'center', marginBottom: 36 }}>
      <Divider />
      <h2 style={{ fontFamily: f.body, fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase' as const, color: c.primaryDark, margin: '10px 0 4px' }}>
        {children}
      </h2>
      {sub && <p style={{ fontFamily: f.subheading, fontSize: 14, color: c.textMuted, fontStyle: 'italic', margin: '0 0 8px' }}>{sub}</p>}
      <Divider />
    </div>
  );
}

function GoldLine({ theme }: { theme: CanvaTemplateTheme }) {
  const c = theme.colors;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '16px 0' }}>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${c.primaryDark})` }} />
      <svg width="10" height="10" viewBox="0 0 10 10">
        <polygon points="5,0 10,5 5,10 0,5" fill={c.primaryDark} opacity="0.6" />
      </svg>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, ${c.primaryDark})` }} />
    </div>
  );
}

// ── Bottom nav items ───────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'beranda', label: 'Beranda', d: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z' },
  { id: 'mempelai', label: 'Mempelai', d: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' },
  { id: 'acara', label: 'Acara', d: 'M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z' },
  { id: 'galeri', label: 'Galeri', d: 'M22 16V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zm-11-4l2.03 2.71L16 11l4 5H8l3-4zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z' },
  { id: 'ucapan', label: 'Ucapan', d: 'M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z' },
];

// ══════════════════════════════════════════════════════════════════════════════
// CanvaBaseTemplate
// ══════════════════════════════════════════════════════════════════════════════

export interface CanvaBaseTemplateProps extends TemplateProps {
  theme: CanvaTemplateTheme;
}

export function CanvaBaseTemplate({
  theme, data, guestName, slug, onRsvpSubmit, onGuestbookSubmit, rsvps, guestbook,
}: CanvaBaseTemplateProps) {
  const [opened, setOpened] = useState(false);
  const [activeNav, setActiveNav] = useState('beranda');
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const c = theme.colors;
  const f = theme.fonts;
  const dec = theme.decorators ?? {};

  const pria   = data.mempelai.pria;
  const wanita = data.mempelai.wanita;
  const primaFirst = data.mempelai.urutanTampil !== 'wanita-dulu';
  const m1 = primaFirst ? pria : wanita;
  const m2 = primaFirst ? wanita : pria;
  const firstAcara = data.acara[0];
  const countdownTarget = data.countdown.tanggal || firstAcara?.tanggal || '';

  const coverBg   = theme.assets.coverBg;
  const heroBg    = theme.assets.heroBg    ?? coverBg;
  const footerBg  = theme.assets.footerBg  ?? coverBg;
  const coverPos  = theme.cover.bgPosition ?? 'center center';
  const bgLight2  = c.bgLight2 ?? c.bgLight;
  const titleCol  = theme.cover.titleColor;
  const subCol    = theme.cover.subtitleColor;
  const dateCol   = theme.cover.dateColor ?? subCol;

  // Derived components (stable via useMemo — theme is constant per template)
  const Divider: ComponentType = useMemo(
    () => dec.SectionDivider ?? function ThemeDivider() { return <DefaultDivider theme={theme} />; },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const FrameWrapper: ComponentType<{ children: ReactNode }> = useMemo(() => {
    if (dec.MempelaiFrame) return dec.MempelaiFrame;
    if (theme.assets.sectionFrame) {
      const src = theme.assets.sectionFrame;
      return function SectionImageFrame({ children }: { children: ReactNode }) {
        return <ImageFrame src={src}>{children}</ImageFrame>;
      };
    }
    return DefaultFrame;
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <div style={{ background: c.bgLight, color: c.text, minHeight: '100vh', fontFamily: f.subheading }}>

      {/* Base keyframes */}
      <style>{`
        @keyframes canvaFadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
      `}</style>

      {/* Music */}
      {data.musik.url && (
        <MusicPlayer
          url={data.musik.url}
          autoplay={data.musik.autoplay && opened}
          color={c.primary}
          bgColor={c.bgDark}
          borderColor={c.primaryDark}
          positionClassName="fixed bottom-20 right-4 z-50"
        />
      )}

      <ShareButton
        slug={slug}
        pria={pria.namaPanggilan || pria.namaLengkap}
        wanita={wanita.namaPanggilan || wanita.namaLengkap}
        primaryColor={c.primary}
      />

      {/* ════════════════════════ COVER ════════════════════════ */}
      {!opened && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 40,
          backgroundImage: `url('${coverBg}')`,
          backgroundSize: 'cover', backgroundPosition: coverPos,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', overflow: 'hidden',
        }}>
          {/* Dark overlay */}
          <div style={{ position: 'absolute', inset: 0, background: c.coverOverlay }} />

          {/* Cover animation (falling petals etc.) */}
          {dec.CoverAnimation && (
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
              <dec.CoverAnimation />
            </div>
          )}

          {/* Top overlay decorator (arch, bismillah etc.) */}
          {dec.CoverTopOverlay && (
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
              <dec.CoverTopOverlay />
            </div>
          )}

          {/* Canva top asset (PNG with transparent bg) */}
          {theme.assets.topDecoration && (
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, pointerEvents: 'none' }}>
              <img src={theme.assets.topDecoration} alt="" style={{ width: '100%', objectFit: 'contain' }} />
            </div>
          )}

          {/* Canva bottom asset (PNG with transparent bg) */}
          {theme.assets.bottomDecoration && (
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, pointerEvents: 'none' }}>
              <img src={theme.assets.bottomDecoration} alt="" style={{ width: '100%', objectFit: 'contain' }} />
            </div>
          )}

          {/* Bottom decor (peacock SVGs etc.) — zIndex 3: renders on top of content */}
          {dec.CoverBottomDecor && (
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3 }}>
              <dec.CoverBottomDecor />
            </div>
          )}

          {/* Cover text content */}
          <div style={{ position: 'relative', zIndex: 2, padding: '32px 28px', animation: 'canvaFadeIn 1.2s ease forwards' }}>
            <p style={{ fontFamily: f.subheading, fontSize: 12, letterSpacing: '0.3em', color: subCol, fontStyle: 'italic', marginBottom: 16, opacity: 0.9 }}>
              The Wedding of
            </p>

            {guestName && (
              <div style={{
                marginBottom: 20, padding: '10px 22px',
                border: `1px solid ${c.primaryDark}`, borderRadius: 3,
                background: 'rgba(0,0,0,0.35)',
              }}>
                <p style={{ fontFamily: f.body, fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: c.primaryDark, marginBottom: 4 }}>
                  Kepada Yth.
                </p>
                <p style={{ fontFamily: f.heading, fontSize: 28, color: titleCol, margin: 0 }}>
                  {guestName}
                </p>
              </div>
            )}

            <h1 style={{ fontFamily: f.heading, fontSize: 58, color: titleCol, lineHeight: 1.1, margin: '0 0 4px' }}>
              {m1.namaPanggilan || m1.namaLengkap || '—'}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, margin: '6px 0' }}>
              <div style={{ height: 1, width: 36, background: c.primaryDark, opacity: 0.7 }} />
              <span style={{ fontFamily: f.subheading, fontSize: 28, color: c.primary, fontStyle: 'italic' }}>&amp;</span>
              <div style={{ height: 1, width: 36, background: c.primaryDark, opacity: 0.7 }} />
            </div>

            <h1 style={{ fontFamily: f.heading, fontSize: 58, color: titleCol, lineHeight: 1.1, margin: '4px 0 18px' }}>
              {m2.namaPanggilan || m2.namaLengkap || '—'}
            </h1>

            {firstAcara && (
              <p style={{ fontFamily: f.body, fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', color: dateCol, marginBottom: 28, opacity: 0.9 }}>
                {new Date(firstAcara.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            )}

            <button
              onClick={() => setOpened(true)}
              style={{
                padding: '13px 44px', background: 'transparent',
                border: `1.5px solid ${c.primary}`, color: c.primary,
                fontSize: 9, letterSpacing: '0.45em', textTransform: 'uppercase',
                cursor: 'pointer', fontFamily: f.body, borderRadius: 2,
                transition: 'background 0.3s, color 0.3s',
              }}
              onMouseEnter={e => {
                const btn = e.target as HTMLButtonElement;
                btn.style.background = c.primary;
                btn.style.color = c.bgDark;
              }}
              onMouseLeave={e => {
                const btn = e.target as HTMLButtonElement;
                btn.style.background = 'transparent';
                btn.style.color = c.primary;
              }}
            >
              Buka Undangan
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════ MAIN CONTENT ════════════════════════ */}
      {opened && (
        <div>

          {/* ── Hero banner ── */}
          <section
            ref={setRef('beranda')}
            style={{
              position: 'relative', height: 280, overflow: 'hidden',
              backgroundImage: `url('${heroBg}')`,
              backgroundSize: 'cover', backgroundPosition: 'top center',
            }}
          >
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.65) 100%)' }} />
            <div style={{
              position: 'relative', zIndex: 1, height: '100%',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              textAlign: 'center', padding: '0 24px',
            }}>
              <p style={{ fontFamily: f.subheading, fontSize: 11, letterSpacing: '0.3em', color: c.primaryDark, fontStyle: 'italic', marginBottom: 8 }}>
                The Wedding of
              </p>
              <h2 style={{ fontFamily: f.heading, fontSize: 48, color: titleCol, margin: 0 }}>
                {m1.namaPanggilan || m1.namaLengkap} &amp; {m2.namaPanggilan || m2.namaLengkap}
              </h2>
              {firstAcara && (
                <p style={{ fontFamily: f.body, fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: c.primaryDark, marginTop: 12 }}>
                  {fmt(firstAcara.tanggal)}
                </p>
              )}
            </div>
          </section>

          {/* ── Quote / Bismillah ── */}
          <section style={{ background: c.bgLight, padding: '56px 28px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            {dec.SectionBgDecor && (
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                <dec.SectionBgDecor />
              </div>
            )}
            <FadeIn>
              {data.quote.teks ? (
                <div style={{ maxWidth: 520, margin: '0 auto' }}>
                  <p style={{ fontFamily: f.subheading, fontSize: 18, fontStyle: 'italic', color: c.text, lineHeight: 1.8, marginBottom: 12 }}>
                    &ldquo;{data.quote.teks}&rdquo;
                  </p>
                  {data.quote.sumber && (
                    <p style={{ fontFamily: f.body, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: c.primaryDark, opacity: 0.7 }}>
                      — {data.quote.sumber}
                    </p>
                  )}
                </div>
              ) : (
                <div style={{ maxWidth: 480, margin: '0 auto' }}>
                  <p style={{ fontFamily: f.subheading, fontSize: 18, fontStyle: 'italic', color: c.textMuted, lineHeight: 1.9 }}>
                    &ldquo;Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu istri-istri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya.&rdquo;
                  </p>
                  <p style={{ fontFamily: f.body, fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', color: c.primaryDark, marginTop: 10, opacity: 0.7 }}>
                    — Q.S. Ar-Rum: 21
                  </p>
                </div>
              )}
            </FadeIn>
            <Divider />
          </section>

          {/* ── Mempelai ── */}
          <section
            ref={setRef('mempelai')}
            style={{ background: bgLight2, padding: '48px 20px 56px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}
          >
            {dec.MempelaiSectionDecor && (
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                <dec.MempelaiSectionDecor />
              </div>
            )}
            <FadeIn>
              <SectionTitle theme={theme} Divider={Divider} sub="Dengan penuh rasa syukur, kami mengundang Anda">
                Mempelai
              </SectionTitle>
            </FadeIn>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 40, alignItems: 'center', maxWidth: 480, margin: '0 auto' }}>
              {[m1, m2].map((m, i) => (
                <FadeIn key={i} delay={i * 150}>
                  <FrameWrapper>
                    {m.foto && (
                      <div style={{ marginBottom: 16 }}>
                        <img src={m.foto} alt={m.namaLengkap} style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${c.primaryDark}`, boxShadow: `0 4px 20px rgba(0,0,0,0.15)` }} />
                      </div>
                    )}
                    <h3 style={{ fontFamily: f.heading, fontSize: 40, color: c.text, margin: '0 0 4px', lineHeight: 1.1 }}>
                      {m.namaPanggilan || m.namaLengkap}
                    </h3>
                    {m.namaPanggilan && (
                      <p style={{ fontFamily: f.subheading, fontSize: 13, color: c.textMuted, fontStyle: 'italic', margin: '0 0 10px' }}>
                        {m.namaLengkap}
                      </p>
                    )}
                    {m.anakKe && (
                      <p style={{ fontFamily: f.body, fontSize: 10, color: c.primaryDark, letterSpacing: '0.15em', marginBottom: 6 }}>
                        Putra/i ke-{m.anakKe}
                      </p>
                    )}
                    {(m.ayah || m.ibu) && (
                      <p style={{ fontFamily: f.subheading, fontSize: 13, color: c.textMuted, lineHeight: 1.7, margin: 0 }}>
                        {m.ayah && <span>{m.ayah}</span>}
                        {m.ayah && m.ibu && <span style={{ color: c.primaryDark }}> &amp; </span>}
                        {m.ibu && <span>{m.ibu}</span>}
                      </p>
                    )}
                    {m.instagram && (
                      <p style={{ fontFamily: f.body, fontSize: 11, color: c.primary, marginTop: 8 }}>
                        @{m.instagram}
                      </p>
                    )}
                  </FrameWrapper>
                </FadeIn>
              ))}
            </div>
          </section>

          {/* ── Acara ── */}
          <section ref={setRef('acara')} style={{ background: c.bgDark, padding: '56px 24px' }}>
            <FadeIn>
              <div style={{ textAlign: 'center', marginBottom: 36 }}>
                <Divider />
                <h2 style={{ fontFamily: f.body, fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: c.primaryDark, margin: '10px 0 4px' }}>
                  Acara Pernikahan
                </h2>
                <Divider />
              </div>
            </FadeIn>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 480, margin: '0 auto' }}>
              {data.acara.map((acara, i) => (
                <FadeIn key={i} delay={i * 150}>
                  <div style={{
                    background: 'rgba(255,255,255,0.04)', border: `1px solid ${c.primaryDark}`,
                    borderRadius: 12, padding: '28px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden',
                  }}>
                    {dec.AcaraCardDecor && (
                      <>
                        <dec.AcaraCardDecor pos="tl" />
                        <dec.AcaraCardDecor pos="tr" />
                      </>
                    )}
                    <h3 style={{ fontFamily: f.subheading, fontSize: 22, fontStyle: 'italic', color: c.primaryLight, marginBottom: 16 }}>
                      {acara.nama}
                    </h3>
                    <GoldLine theme={theme} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, justifyContent: 'center' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill={c.primaryDark} style={{ flexShrink: 0, marginTop: 2 }}>
                          <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />
                        </svg>
                        <div>
                          <p style={{ fontFamily: f.subheading, fontSize: 15, color: 'rgba(255,255,255,0.85)', margin: 0, fontStyle: 'italic' }}>
                            {fmt(acara.tanggal)}
                          </p>
                          {(acara.waktuMulai || acara.waktuSelesai) && (
                            <p style={{ fontFamily: f.body, fontSize: 11, color: c.primaryDark, margin: '2px 0 0', letterSpacing: '0.1em' }}>
                              {fmtTime(acara.waktuMulai)}{acara.waktuSelesai ? ` – ${fmtTime(acara.waktuSelesai)}` : ''} WIB
                            </p>
                          )}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, justifyContent: 'center' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill={c.primaryDark} style={{ flexShrink: 0, marginTop: 2 }}>
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                        <div>
                          <p style={{ fontFamily: f.subheading, fontSize: 15, color: 'rgba(255,255,255,0.85)', margin: 0 }}>{acara.lokasi}</p>
                          {acara.alamat && (
                            <p style={{ fontFamily: f.body, fontSize: 11, color: c.primaryDark, margin: '2px 0 0', lineHeight: 1.5 }}>{acara.alamat}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    {acara.mapsUrl && (
                      <a
                        href={acara.mapsUrl} target="_blank" rel="noopener noreferrer"
                        style={{
                          display: 'inline-block', marginTop: 20, padding: '9px 28px',
                          border: `1px solid ${c.primaryDark}`, color: c.primary, borderRadius: 4,
                          fontFamily: f.body, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase',
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

          {/* ── Countdown ── */}
          {countdownTarget && (
            <section style={{ background: c.bgDark, padding: '52px 24px', textAlign: 'center', borderTop: `1px solid ${c.primaryDark}22` }}>
              <FadeIn>
                <p style={{ fontFamily: f.subheading, fontSize: 14, fontStyle: 'italic', color: c.primaryDark, marginBottom: 6 }}>
                  Menghitung hari menuju hari bahagia
                </p>
                <h3 style={{ fontFamily: f.heading, fontSize: 36, color: c.primaryLight, marginBottom: 28 }}>
                  {m1.namaPanggilan || m1.namaLengkap} &amp; {m2.namaPanggilan || m2.namaLengkap}
                </h3>
                <BaseCountdown targetDate={countdownTarget} theme={theme} />
              </FadeIn>
            </section>
          )}

          {/* ── Galeri ── */}
          {data.galeri.length > 0 && (
            <section ref={setRef('galeri')} style={{ background: c.bgLight, padding: '56px 20px' }}>
              <FadeIn>
                <SectionTitle theme={theme} Divider={Divider}>Galeri</SectionTitle>
              </FadeIn>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, maxWidth: 500, margin: '0 auto' }}>
                {data.galeri.map((src, i) => (
                  <FadeIn key={i} delay={i * 80}>
                    <div
                      onClick={() => setLightboxImg(src)}
                      style={{
                        cursor: 'zoom-in', borderRadius: 8, overflow: 'hidden',
                        border: `1.5px solid ${c.primaryDark}`, aspectRatio: '1/1',
                        transition: 'transform 0.3s, box-shadow 0.3s',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.03)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)'; }}
                    >
                      <img src={src} alt={`Foto ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                  </FadeIn>
                ))}
              </div>
              {lightboxImg && (
                <div
                  onClick={() => setLightboxImg(null)}
                  style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,0.94)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out' }}
                >
                  <img src={lightboxImg} alt="Foto besar" style={{ maxWidth: '92vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: 8 }} />
                </div>
              )}
            </section>
          )}

          {/* ── Love Story ── */}
          {data.loveStory.length > 0 && (
            <section style={{ background: bgLight2, padding: '56px 24px' }}>
              <FadeIn>
                <SectionTitle theme={theme} Divider={Divider} sub="Perjalanan cinta kami">Love Story</SectionTitle>
              </FadeIn>
              <div style={{ maxWidth: 480, margin: '0 auto', position: 'relative' }}>
                <div style={{ position: 'absolute', left: 20, top: 0, bottom: 0, width: 1, background: `linear-gradient(to bottom, transparent, ${c.primaryDark}, transparent)` }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 32, paddingLeft: 48 }}>
                  {data.loveStory.map((item, i) => (
                    <FadeIn key={i} delay={i * 120} from="left">
                      <div style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', left: -42, top: 4, width: 16, height: 16 }}>
                          <svg width="16" height="16" viewBox="0 0 16 16">
                            <circle cx="8" cy="8" r="7" fill="none" stroke={c.primaryDark} strokeWidth="1" />
                            <circle cx="8" cy="8" r="3.5" fill={c.primary} opacity="0.7" />
                          </svg>
                        </div>
                        <span style={{ fontFamily: f.body, fontSize: 10, letterSpacing: '0.2em', color: c.primaryDark, textTransform: 'uppercase' }}>
                          {item.tahun}
                        </span>
                        <h4 style={{ fontFamily: f.subheading, fontSize: 18, fontStyle: 'italic', color: c.text, margin: '4px 0 6px' }}>
                          {item.judul}
                        </h4>
                        <p style={{ fontFamily: f.subheading, fontSize: 14, color: c.textMuted, lineHeight: 1.7, margin: 0 }}>
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
            <section ref={setRef('ucapan')} style={{ background: c.bgDark, padding: '56px 24px' }}>
              <FadeIn>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                  <Divider />
                  <h2 style={{ fontFamily: f.body, fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: c.primaryDark, margin: '10px 0 4px' }}>
                    Konfirmasi Kehadiran
                  </h2>
                  <Divider />
                </div>
              </FadeIn>
              <div style={{ maxWidth: 480, margin: '0 auto' }}>
                <RsvpForm slug={slug} onSubmit={onRsvpSubmit} rsvps={rsvps} primaryColor={c.primary} />
              </div>
            </section>
          )}

          {/* ── Buku Tamu ── */}
          {data.guestbookAktif && (
            <section style={{ background: c.bgLight, padding: '56px 24px' }}>
              <FadeIn>
                <SectionTitle theme={theme} Divider={Divider} sub="Sampaikan doa dan ucapan terbaik Anda">Buku Tamu</SectionTitle>
              </FadeIn>
              <div style={{ maxWidth: 480, margin: '0 auto' }}>
                <GuestbookForm onSubmit={onGuestbookSubmit} guestbook={guestbook} primaryColor={c.primary} />
              </div>
            </section>
          )}

          {/* ── Amplop Digital ── */}
          {data.amplopDigital.aktif && (
            <section style={{ background: bgLight2, padding: '56px 24px' }}>
              <FadeIn>
                <SectionTitle theme={theme} Divider={Divider} sub="Hadiah terbaik adalah doa restu Anda">Amplop Digital</SectionTitle>
              </FadeIn>
              <div style={{ maxWidth: 480, margin: '0 auto' }}>
                <AmplopDigitalComponent amplop={data.amplopDigital} primaryColor={c.primary} />
              </div>
            </section>
          )}

          {/* ── Livestream ── */}
          {data.livestream.aktif && data.livestream.url && (
            <section style={{ background: c.bgDark, padding: '56px 24px', textAlign: 'center' }}>
              <FadeIn>
                <Divider />
                <h2 style={{ fontFamily: f.body, fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: c.primaryDark, margin: '10px 0 12px' }}>
                  Live Streaming
                </h2>
                <p style={{ fontFamily: f.subheading, fontSize: 15, color: c.primaryDark, fontStyle: 'italic', marginBottom: 24 }}>
                  Saksikan momen bahagia kami secara online
                </p>
                <a
                  href={data.livestream.url} target="_blank" rel="noopener noreferrer"
                  style={{
                    display: 'inline-block', padding: '13px 44px',
                    background: c.primaryDark, color: c.bgDark, borderRadius: 4,
                    fontFamily: f.body, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase',
                    textDecoration: 'none', fontWeight: 600,
                  }}
                >
                  Tonton Live →
                </a>
                <Divider />
              </FadeIn>
            </section>
          )}

          {/* ── Footer ── */}
          <section style={{
            backgroundImage: `url('${footerBg}')`,
            backgroundSize: 'cover', backgroundPosition: 'top center',
            padding: '64px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.82)' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <FadeIn>
                <p style={{ fontFamily: f.subheading, fontSize: 12, letterSpacing: '0.3em', color: c.primaryDark, fontStyle: 'italic', marginBottom: 8 }}>
                  Kami yang berbahagia
                </p>
                <h2 style={{ fontFamily: f.heading, fontSize: 52, color: titleCol, margin: '0 0 4px' }}>
                  {m1.namaPanggilan || m1.namaLengkap}
                </h2>
                <div style={{ fontFamily: f.subheading, fontSize: 24, color: c.primary, fontStyle: 'italic', margin: '6px 0' }}>&amp;</div>
                <h2 style={{ fontFamily: f.heading, fontSize: 52, color: titleCol, margin: '0 0 28px' }}>
                  {m2.namaPanggilan || m2.namaLengkap}
                </h2>
                <GoldLine theme={theme} />
                <p style={{ fontFamily: f.subheading, fontSize: 13, color: c.primaryDark, fontStyle: 'italic', margin: '20px 0 28px', opacity: 0.8 }}>
                  Terima kasih atas doa dan kehadiran Anda. Merupakan kehormatan bagi kami.
                </p>
                <p style={{ fontFamily: f.body, fontSize: 8, letterSpacing: '0.35em', textTransform: 'uppercase', color: c.primaryDark, opacity: 0.4, marginTop: 32 }}>
                  Nikah Yuk · By Ratna Offset
                </p>
              </FadeIn>
            </div>
          </section>

          {/* ── Bottom nav ── */}
          <nav style={{
            position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
            background: c.bgDark, borderTop: `1px solid ${c.primaryDark}`,
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
                    color: active ? c.primaryLight : c.primaryDark, transition: 'color 0.2s',
                    padding: '2px 8px',
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d={item.d} />
                  </svg>
                  <span style={{ fontFamily: f.body, fontSize: 9, letterSpacing: '0.08em' }}>{item.label}</span>
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
