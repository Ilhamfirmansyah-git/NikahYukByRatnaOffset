'use client';

import { useState, useEffect, useRef } from 'react';
import { TemplateProps } from './TemplateProps';
import MusicPlayer from '@/components/invitation/MusicPlayer';
import RsvpForm from '@/components/invitation/RsvpForm';
import GuestbookForm from '@/components/invitation/GuestbookForm';
import AmplopDigitalComponent from '@/components/invitation/AmplopDigital';

const GOLD = '#c9a84c';
const GOLD_DIM = '#8a6d2e';
const BG = '#0f0f0f';
const BG2 = '#171717';
const WHITE = '#f2ece0';
const MUTED = 'rgba(242,236,224,0.45)';

// ── Fade-in on scroll ──────────────────────────────────────────────────────────
function FadeIn({ children, delay = 0, from = 'bottom' }: {
  children: React.ReactNode; delay?: number; from?: 'bottom' | 'left' | 'right';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const tx = from === 'left' ? 'translateX(-28px)' : from === 'right' ? 'translateX(28px)' : 'translateY(28px)';
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : tx,
      transition: `opacity 0.75s ease ${delay}ms, transform 0.75s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

// ── Inline countdown (needs dark styling not possible via className) ────────────
function DarkCountdown({ targetDate }: { targetDate: string }) {
  function calc() {
    const diff = new Date(targetDate).getTime() - Date.now();
    if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 };
    return {
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff / 3600000) % 24),
      m: Math.floor((diff / 60000) % 60),
      s: Math.floor((diff / 1000) % 60),
    };
  }
  const [t, setT] = useState(calc);
  useEffect(() => { const id = setInterval(() => setT(calc()), 1000); return () => clearInterval(id); }, [targetDate]);
  const pad = (n: number) => String(n).padStart(2, '0');
  const units = [{ v: t.d, l: 'Hari' }, { v: t.h, l: 'Jam' }, { v: t.m, l: 'Menit' }, { v: t.s, l: 'Detik' }];
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 24 }}>
      {units.map(u => (
        <div key={u.l} style={{ textAlign: 'center', minWidth: 56 }}>
          <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 36, fontWeight: 300, color: GOLD, display: 'block', lineHeight: 1 }}>{pad(u.v)}</span>
          <span style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: MUTED, display: 'block', marginTop: 6 }}>{u.l}</span>
        </div>
      ))}
    </div>
  );
}

// ── Decorative gold divider ────────────────────────────────────────────────────
function GoldDivider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, margin: '14px 0' }}>
      <div style={{ height: 1, width: 44, background: `linear-gradient(to right, transparent, ${GOLD})` }} />
      <div style={{ width: 5, height: 5, background: GOLD, transform: 'rotate(45deg)' }} />
      <div style={{ width: 5, height: 5, background: GOLD, transform: 'rotate(45deg)', opacity: 0.45 }} />
      <div style={{ width: 5, height: 5, background: GOLD, transform: 'rotate(45deg)' }} />
      <div style={{ height: 1, width: 44, background: `linear-gradient(to left, transparent, ${GOLD})` }} />
    </div>
  );
}

// ── Section title ──────────────────────────────────────────────────────────────
function STitle({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 32 }}>
      <GoldDivider />
      <h2 style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, letterSpacing: '0.3em', textTransform: 'uppercase', color: GOLD, margin: '10px 0 4px' }}>
        {children}
      </h2>
      {sub && <p style={{ fontSize: 12, color: MUTED, margin: '0 0 10px' }}>{sub}</p>}
      <GoldDivider />
    </div>
  );
}

// ── Wave SVG separators ────────────────────────────────────────────────────────
function WaveDown({ fill }: { fill: string }) {
  return (
    <svg viewBox="0 0 1200 56" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 56, marginBottom: -2 }}>
      <path d="M0,56 C300,0 900,56 1200,16 L1200,56 Z" fill={fill} />
    </svg>
  );
}
function WaveUp({ fill }: { fill: string }) {
  return (
    <svg viewBox="0 0 1200 56" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 56, marginTop: -2 }}>
      <path d="M0,0 C300,56 900,0 1200,40 L1200,0 Z" fill={fill} />
    </svg>
  );
}

// ── Bottom nav definition ──────────────────────────────────────────────────────
const NAV = [
  { id: 'beranda', label: 'Beranda', icon: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z' },
  { id: 'mempelai', label: 'Mempelai', icon: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' },
  { id: 'acara', label: 'Acara', icon: 'M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z' },
  { id: 'galeri', label: 'Galeri', icon: 'M22 16V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zm-11-4l2.03 2.71L16 11l4 5H8l3-4zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z' },
  { id: 'ucapan', label: 'Ucapan', icon: 'M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z' },
];

// ── Main template ──────────────────────────────────────────────────────────────
export default function GelapRomantis({
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

  const fmt = (t: string) => t
    ? new Date(t).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  // Scroll spy
  useEffect(() => {
    if (!opened) return;
    const onScroll = () => {
      const y = window.scrollY + 160;
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
    <div style={{ background: BG, color: WHITE, minHeight: '100vh', fontFamily: "'Josefin Sans', sans-serif" }}>

      {/* Music */}
      {data.musik.url && (
        <MusicPlayer
          url={data.musik.url}
          autoplay={data.musik.autoplay}
          buttonClassName={`fixed bottom-20 right-4 z-50 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 bg-[#1a1208] border border-[#c9a84c] text-[#c9a84c]`}
        />
      )}

      {/* ━━━━━━━━━━━━━━━━━━ COVER ━━━━━━━━━━━━━━━━━━ */}
      {!opened && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 40,
          background: 'linear-gradient(160deg, #0a0a0a 0%, #1a1208 50%, #0a0a0a 100%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', textAlign: 'center', padding: '32px 28px',
          overflow: 'hidden',
        }}>
          {/* Twinkling stars */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {Array.from({ length: 40 }).map((_, i) => (
              <span key={i} style={{
                position: 'absolute',
                width: (i % 3 === 0 ? 2 : 1) + 'px',
                height: (i % 3 === 0 ? 2 : 1) + 'px',
                borderRadius: '50%',
                background: GOLD,
                opacity: 0.15 + (i % 5) * 0.07,
                top: (i * 17 % 97) + '%',
                left: (i * 23 % 99) + '%',
                animation: `twinkle ${2 + (i % 4)}s ${(i % 3) * 0.5}s infinite alternate`,
              }} />
            ))}
          </div>

          {/* Bismillah */}
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontFamily: "'Noto Naskh Arabic', serif", fontSize: 26, color: GOLD, lineHeight: 1.7 }}>
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
            </p>
          </div>

          <GoldDivider />

          {guestName && (
            <div style={{ margin: '18px 0', padding: '14px 28px', border: `1px solid ${GOLD}35` }}>
              <p style={{ fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', color: MUTED, marginBottom: 6 }}>Kepada Yth.</p>
              <p style={{ fontFamily: "'Sacramento', cursive", fontSize: 28, color: GOLD, margin: 0 }}>{guestName}</p>
            </div>
          )}

          <p style={{ fontSize: 10, letterSpacing: '0.45em', textTransform: 'uppercase', color: MUTED, margin: '16px 0 10px' }}>
            Undangan Pernikahan
          </p>
          <h1 style={{ fontFamily: "'Sacramento', cursive", fontSize: 54, color: WHITE, lineHeight: 1.15, margin: 0 }}>
            {m1.namaPanggilan || m1.namaLengkap || '—'}
          </h1>
          <p style={{ fontFamily: "'Sacramento', cursive", fontSize: 28, color: GOLD, margin: '2px 0' }}>&amp;</p>
          <h1 style={{ fontFamily: "'Sacramento', cursive", fontSize: 54, color: WHITE, lineHeight: 1.15, margin: '0 0 18px' }}>
            {m2.namaPanggilan || m2.namaLengkap || '—'}
          </h1>

          {firstAcara && (
            <p style={{ fontSize: 11, color: MUTED, letterSpacing: '0.15em', marginBottom: 28 }}>
              {fmt(firstAcara.tanggal)}
            </p>
          )}

          <button
            onClick={() => setOpened(true)}
            style={{
              padding: '12px 44px', background: 'transparent',
              border: `1px solid ${GOLD}`, color: GOLD,
              fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase',
              cursor: 'pointer', fontFamily: "'Josefin Sans', sans-serif",
            }}
          >
            Buka Undangan
          </button>

          <GoldDivider />
        </div>
      )}

      {/* ━━━━━━━━━━━━━━━━━━ MAIN CONTENT ━━━━━━━━━━━━━━━━━━ */}
      {opened && (
        <div style={{ paddingBottom: 72 }}>

          {/* ─── BERANDA ─── */}
          <section
            ref={setRef('beranda') as unknown as React.RefCallback<HTMLElement>}
            id="beranda"
            style={{
              minHeight: '100vh', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', textAlign: 'center',
              padding: '60px 24px 48px', position: 'relative', overflow: 'hidden',
              background: 'radial-gradient(ellipse at 50% 40%, #1a1208 0%, #0a0a0a 70%)',
            }}
          >
            <FadeIn>
              <p style={{ fontFamily: "'Noto Naskh Arabic', serif", fontSize: 22, color: GOLD, lineHeight: 1.7 }}>
                بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
              </p>
              <p style={{ fontSize: 10, color: MUTED, letterSpacing: '0.2em', marginBottom: 24 }}>Bismillahirrahmanirrahim</p>
            </FadeIn>

            {(m1.foto || m2.foto) && (
              <FadeIn delay={150}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 28 }}>
                  {[m1, m2].map((m, i) => m.foto ? (
                    <div key={i} style={{ width: 110, height: 110, borderRadius: '50%', overflow: 'hidden', border: `2px solid ${GOLD}55`, flexShrink: 0 }}>
                      <img src={m.foto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ) : null)}
                </div>
              </FadeIn>
            )}

            <FadeIn delay={250}>
              <p style={{ fontSize: 10, letterSpacing: '0.45em', textTransform: 'uppercase', color: MUTED, marginBottom: 6 }}>Undangan Pernikahan</p>
              <h1 style={{ fontFamily: "'Sacramento', cursive", fontSize: 58, color: WHITE, lineHeight: 1.1, margin: 0 }}>
                {m1.namaPanggilan || m1.namaLengkap || '—'}
              </h1>
              <p style={{ fontFamily: "'Sacramento', cursive", fontSize: 30, color: GOLD, margin: '2px 0' }}>&amp;</p>
              <h1 style={{ fontFamily: "'Sacramento', cursive", fontSize: 58, color: WHITE, lineHeight: 1.1, margin: '0 0 16px' }}>
                {m2.namaPanggilan || m2.namaLengkap || '—'}
              </h1>
              {firstAcara && (
                <p style={{ fontSize: 11, color: MUTED, letterSpacing: '0.18em' }}>{fmt(firstAcara.tanggal)}</p>
              )}
            </FadeIn>

            {countdownTarget && (
              <FadeIn delay={400}>
                <div style={{ marginTop: 36 }}>
                  <DarkCountdown targetDate={countdownTarget} />
                </div>
              </FadeIn>
            )}

            {/* scroll line */}
            <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)' }}>
              <div style={{ width: 1, height: 44, background: `linear-gradient(to bottom, ${GOLD}, transparent)`, margin: '0 auto' }} />
            </div>
          </section>

          <WaveDown fill={BG2} />

          {/* ─── MEMPELAI ─── */}
          <section ref={setRef('mempelai') as unknown as React.RefCallback<HTMLElement>} id="mempelai" style={{ background: BG2, padding: '48px 24px' }}>
            <div style={{ maxWidth: 480, margin: '0 auto' }}>
              <FadeIn><STitle sub="Yang Insya Allah akan melangsungkan walimatul ursy">Mempelai</STitle></FadeIn>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {[m1, m2].map((m, i) => (
                  <FadeIn key={i} delay={i * 120} from={i === 0 ? 'left' : 'right'}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: 20, border: `1px solid ${GOLD}18`, background: BG }}>
                      <div style={{ flexShrink: 0, width: 76, height: 76, borderRadius: '50%', overflow: 'hidden', border: `2px solid ${GOLD}45` }}>
                        {m.foto
                          ? <img src={m.foto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: GOLD_DIM, fontSize: 28 }}>♡</div>
                        }
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontFamily: "'Sacramento', cursive", fontSize: 26, color: WHITE, margin: '0 0 4px', lineHeight: 1.2 }}>{m.namaLengkap || '—'}</p>
                        {m.anakKe && <p style={{ fontSize: 12, color: MUTED, margin: '0 0 2px' }}>Putra/Putri ke-{m.anakKe}</p>}
                        {(m.ayah || m.ibu) && (
                          <p style={{ fontSize: 12, color: MUTED, margin: 0 }}>
                            Bapak {m.ayah || '—'} &amp; Ibu {m.ibu || '—'}
                          </p>
                        )}
                        {m.instagram && (
                          <a href={`https://instagram.com/${m.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
                            style={{ fontSize: 12, color: GOLD, display: 'inline-block', marginTop: 4 }}>
                            @{m.instagram.replace('@', '')}
                          </a>
                        )}
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>

              {/* Quranic verse */}
              <FadeIn delay={300}>
                <div style={{ marginTop: 36, padding: 24, textAlign: 'center', borderTop: `1px solid ${GOLD}20`, borderBottom: `1px solid ${GOLD}20` }}>
                  <p style={{ fontFamily: "'Noto Naskh Arabic', serif", fontSize: 18, color: GOLD, lineHeight: 2.2, marginBottom: 14 }}>
                    وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً
                  </p>
                  <p style={{ fontSize: 12, color: MUTED, fontStyle: 'italic', lineHeight: 1.7 }}>
                    "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang."
                  </p>
                  <p style={{ fontSize: 11, color: GOLD, marginTop: 10, letterSpacing: '0.2em' }}>QS. Ar-Rum: 21</p>
                </div>
              </FadeIn>
            </div>
          </section>

          <WaveUp fill={BG2} />

          {/* ─── ACARA ─── */}
          <section ref={setRef('acara') as unknown as React.RefCallback<HTMLElement>} id="acara" style={{ background: BG, padding: '48px 24px' }}>
            <div style={{ maxWidth: 480, margin: '0 auto' }}>
              <FadeIn><STitle sub="Dengan memohon rahmat dan ridho Allah SWT">Detail Acara</STitle></FadeIn>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {data.acara.map((a, i) => (
                  <FadeIn key={i} delay={i * 130}>
                    <div style={{ padding: 22, border: `1px solid ${GOLD}20`, background: BG2 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                        <div style={{ width: 7, height: 7, background: GOLD, transform: 'rotate(45deg)', flexShrink: 0 }} />
                        <h3 style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, letterSpacing: '0.25em', textTransform: 'uppercase', color: GOLD, margin: 0 }}>
                          {a.nama}
                        </h3>
                      </div>
                      <div style={{ paddingLeft: 17, borderLeft: `1px solid ${GOLD}25`, display: 'flex', flexDirection: 'column', gap: 5 }}>
                        <p style={{ fontSize: 13, color: WHITE, margin: 0 }}>{fmt(a.tanggal)}</p>
                        <p style={{ fontSize: 12, color: MUTED, margin: 0 }}>{a.waktuMulai} – {a.waktuSelesai} WIB</p>
                        <p style={{ fontSize: 13, fontWeight: 500, color: WHITE, margin: '4px 0 0' }}>{a.lokasi}</p>
                        <p style={{ fontSize: 12, color: MUTED, margin: 0 }}>{a.alamat}</p>
                        {a.mapsUrl && (
                          <a href={a.mapsUrl} target="_blank" rel="noopener noreferrer"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: GOLD, marginTop: 6, textDecoration: 'none' }}>
                            <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <section ref={setRef('galeri') as unknown as React.RefCallback<HTMLElement>} id="galeri" style={{ background: BG2, padding: '48px 24px' }}>
              <div style={{ maxWidth: 480, margin: '0 auto' }}>
                <FadeIn><STitle>Galeri Foto</STitle></FadeIn>
                <FadeIn delay={150}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3 }}>
                    {data.galeri.map((src, i) => (
                      <button key={i} onClick={() => setLightboxImg(src)}
                        style={{ aspectRatio: '1', overflow: 'hidden', cursor: 'pointer', border: `1px solid ${GOLD}12`, padding: 0, background: 'none', display: 'block' }}>
                        <img src={src} alt={`Foto ${i + 1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s' }}
                          onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = 'scale(1.06)'; }}
                          onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = 'scale(1)'; }}
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
            <section style={{ background: BG, padding: '48px 24px' }}>
              <div style={{ maxWidth: 480, margin: '0 auto' }}>
                <FadeIn><STitle>Kisah Cinta</STitle></FadeIn>
                <div style={{ position: 'relative', paddingLeft: 28 }}>
                  <div style={{ position: 'absolute', left: 6, top: 4, bottom: 4, width: 1, background: `linear-gradient(to bottom, ${GOLD}, ${GOLD}10)` }} />
                  {data.loveStory.map((item, i) => (
                    <FadeIn key={i} delay={i * 100}>
                      <div style={{ position: 'relative', marginBottom: 30 }}>
                        <div style={{ position: 'absolute', left: -23, top: 5, width: 8, height: 8, borderRadius: '50%', background: GOLD }} />
                        <p style={{ fontSize: 10, color: GOLD, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 4 }}>{item.tahun}</p>
                        <h4 style={{ fontFamily: "'Sacramento', cursive", fontSize: 22, color: WHITE, margin: '0 0 8px' }}>{item.judul}</h4>
                        <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.75, margin: 0 }}>{item.cerita}</p>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ─── QUOTE ─── */}
          {data.quote.teks && (
            <div style={{ padding: '44px 24px', textAlign: 'center', background: 'linear-gradient(135deg, #1a1208, #0a0a0a)', borderTop: `1px solid ${GOLD}18`, borderBottom: `1px solid ${GOLD}18` }}>
              <FadeIn>
                <p style={{ fontFamily: "'Sacramento', cursive", fontSize: 24, color: WHITE, lineHeight: 1.6, fontStyle: 'italic', maxWidth: 380, margin: '0 auto 14px' }}>
                  &ldquo;{data.quote.teks}&rdquo;
                </p>
                {data.quote.sumber && (
                  <p style={{ fontSize: 11, color: GOLD, letterSpacing: '0.2em' }}>— {data.quote.sumber}</p>
                )}
              </FadeIn>
            </div>
          )}

          {/* ─── AMPLOP DIGITAL ─── */}
          {data.amplopDigital.aktif && (
            <section style={{ background: BG, padding: '48px 24px' }}>
              <div style={{ maxWidth: 480, margin: '0 auto' }}>
                <FadeIn><STitle sub="Doa dan kehadiran Anda adalah hadiah terbaik bagi kami">Amplop Digital</STitle></FadeIn>
                <FadeIn delay={200}>
                  <AmplopDigitalComponent amplop={data.amplopDigital} primaryColor={GOLD} />
                </FadeIn>
              </div>
            </section>
          )}

          {/* ─── LIVESTREAM ─── */}
          {data.livestream.aktif && data.livestream.url && (
            <section style={{ background: BG2, padding: '44px 24px', textAlign: 'center' }}>
              <div style={{ maxWidth: 480, margin: '0 auto' }}>
                <FadeIn>
                  <STitle>Livestream</STitle>
                  <p style={{ fontSize: 13, color: MUTED, marginBottom: 18 }}>Saksikan momen bahagia kami secara virtual</p>
                  {data.livestream.platform && <p style={{ color: WHITE, marginBottom: 14 }}>{data.livestream.platform}</p>}
                  <a href={data.livestream.url} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'inline-block', padding: '11px 32px', border: `1px solid ${GOLD}`, color: GOLD, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', textDecoration: 'none' }}>
                    Tonton Livestream
                  </a>
                </FadeIn>
              </div>
            </section>
          )}

          {/* ─── UCAPAN ─── */}
          <section ref={setRef('ucapan') as unknown as React.RefCallback<HTMLElement>} id="ucapan" style={{ background: BG, padding: '48px 24px' }}>
            <div style={{ maxWidth: 480, margin: '0 auto' }}>
              <FadeIn><STitle sub="Doa dan ucapan terbaik kalian sangat berarti bagi kami">Ucapan &amp; Doa</STitle></FadeIn>
              {data.guestbookAktif && (
                <FadeIn delay={150}>
                  <GuestbookForm guestbook={guestbook} onSubmit={onGuestbookSubmit} primaryColor={GOLD} />
                </FadeIn>
              )}
            </div>
          </section>

          {/* ─── RSVP ─── */}
          {data.rsvpAktif && (
            <section style={{ background: BG2, padding: '48px 24px' }}>
              <div style={{ maxWidth: 480, margin: '0 auto' }}>
                <FadeIn><STitle sub="Mohon konfirmasi kehadiran Anda">Konfirmasi Hadir</STitle></FadeIn>
                <FadeIn delay={150}>
                  <RsvpForm slug={slug} rsvps={rsvps} onSubmit={onRsvpSubmit} primaryColor={GOLD} />
                </FadeIn>
              </div>
            </section>
          )}

          {/* ─── PROTOKOL KESEHATAN ─── */}
          {data.protokolKesehatan.aktif && (
            <section style={{ background: BG, padding: '32px 24px' }}>
              <div style={{ maxWidth: 480, margin: '0 auto' }}>
                <FadeIn>
                  <div style={{ padding: '18px 20px', borderLeft: `3px solid ${GOLD}`, background: BG2 }}>
                    <p style={{ fontSize: 10, color: GOLD, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 8 }}>Protokol Kesehatan</p>
                    <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.75, margin: 0 }}>
                      {data.protokolKesehatan.catatan || 'Demi kenyamanan bersama, mohon memperhatikan protokol kesehatan yang berlaku selama acara berlangsung.'}
                    </p>
                  </div>
                </FadeIn>
              </div>
            </section>
          )}

          {/* ─── FOOTER ─── */}
          <footer style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1208 100%)', padding: '48px 24px 36px', textAlign: 'center', borderTop: `1px solid ${GOLD}18` }}>
            <FadeIn>
              <p style={{ fontFamily: "'Noto Naskh Arabic', serif", fontSize: 18, color: GOLD, marginBottom: 10 }}>
                وَعَلَيْكُمُ السَّلَامُ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ
              </p>
              <GoldDivider />
              <p style={{ fontFamily: "'Sacramento', cursive", fontSize: 38, color: WHITE, margin: '14px 0 4px' }}>
                {pria.namaPanggilan || pria.namaLengkap || 'Pria'}
                <span style={{ color: GOLD }}> &amp; </span>
                {wanita.namaPanggilan || wanita.namaLengkap || 'Wanita'}
              </p>
              <p style={{ fontSize: 10, color: MUTED, letterSpacing: '0.35em', textTransform: 'uppercase', marginTop: 8 }}>Jazakumullahu Khairan</p>
            </FadeIn>
          </footer>
        </div>
      )}

      {/* ━━━━━━━━━━━━━━━━━━ BOTTOM NAV ━━━━━━━━━━━━━━━━━━ */}
      {opened && (
        <nav style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 30, height: 64,
          background: 'rgba(12,12,12,0.96)', backdropFilter: 'blur(14px)',
          borderTop: `1px solid ${GOLD}18`, display: 'flex',
        }}>
          {NAV.map(item => {
            const active = activeNav === item.id;
            return (
              <button key={item.id} onClick={() => scrollTo(item.id)} style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', gap: 3, background: 'none', border: 'none',
                cursor: 'pointer', color: active ? GOLD : 'rgba(242,236,224,0.3)',
                transition: 'color 0.25s', padding: '6px 2px', position: 'relative',
              }}>
                {active && (
                  <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 28, height: 2, background: GOLD, borderRadius: '0 0 2px 2px' }} />
                )}
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d={item.icon} />
                </svg>
                <span style={{ fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: "'Josefin Sans', sans-serif" }}>{item.label}</span>
              </button>
            );
          })}
        </nav>
      )}

      {/* ━━━━━━━━━━━━━━━━━━ LIGHTBOX ━━━━━━━━━━━━━━━━━━ */}
      {lightboxImg && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,0.96)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
          onClick={() => setLightboxImg(null)}>
          <img src={lightboxImg} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
          <button onClick={() => setLightboxImg(null)}
            style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: GOLD, fontSize: 30, cursor: 'pointer', lineHeight: 1 }}>
            ✕
          </button>
        </div>
      )}

      {/* ━━━━━━━━━━━━━━━━━━ FONTS & ANIMATIONS ━━━━━━━━━━━━━━━━━━ */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@300;400;600&family=Sacramento&family=Noto+Naskh+Arabic:wght@400;500&display=swap');
        @keyframes twinkle { 0% { opacity: 0.05; } 100% { opacity: 0.45; } }
      `}</style>
    </div>
  );
}
