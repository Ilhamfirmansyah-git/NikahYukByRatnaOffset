'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { TemplateProps } from './TemplateProps';
import MusicPlayer from '@/components/invitation/MusicPlayer';
import RsvpForm from '@/components/invitation/RsvpForm';
import GuestbookForm from '@/components/invitation/GuestbookForm';
import AmplopDigitalComponent from '@/components/invitation/AmplopDigital';

const BASE = '/assets/templates/romantis-maroon';
const MAROON = '#6B0000';
const MAROON_DARK = '#4A0000';
const CREAM = '#FDF8F2';

const FONTS = `
  @font-face {
    font-family: 'Tempting';
    src: url('${BASE}/fonts/tempting.otf') format('opentype');
    font-display: swap;
  }
  @font-face {
    font-family: 'Scaver';
    src: url('${BASE}/fonts/scaver-regular.ttf') format('truetype');
    font-weight: 400;
    font-display: swap;
  }
  @font-face {
    font-family: 'Scaver';
    src: url('${BASE}/fonts/scaver-medium.ttf') format('truetype');
    font-weight: 500;
    font-display: swap;
  }
`;

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.08 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? 'none' : 'translateY(28px)',
      transition: `opacity 0.75s ease ${delay}ms, transform 0.75s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

function useCountdown(target: string) {
  const calc = useCallback(() => {
    const diff = new Date(target).getTime() - Date.now();
    if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 };
    return {
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff / 3600000) % 24),
      m: Math.floor((diff / 60000) % 60),
      s: Math.floor((diff / 1000) % 60),
    };
  }, [target]);
  const [t, setT] = useState(calc);
  useEffect(() => { const id = setInterval(() => setT(calc()), 1000); return () => clearInterval(id); }, [calc]);
  return t;
}

function formatTanggal(d: string) {
  const dt = new Date(d);
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  return `${days[dt.getDay()]}, ${dt.getDate()} ${months[dt.getMonth()]} ${dt.getFullYear()}`;
}

function formatDateShort(d: string) {
  const dt = new Date(d);
  return `${String(dt.getDate()).padStart(2, '0')}.${String(dt.getMonth() + 1).padStart(2, '0')}.${dt.getFullYear().toString().slice(-2)}`;
}

export default function RomantisMaroon({ data, guestName, slug, onRsvpSubmit, onGuestbookSubmit, rsvps, guestbook }: TemplateProps) {
  const [opened, setOpened] = useState(false);

  const pria  = data.mempelai.urutanTampil === 'pria-dulu' ? data.mempelai.pria  : data.mempelai.wanita;
  const wanita = data.mempelai.urutanTampil === 'pria-dulu' ? data.mempelai.wanita : data.mempelai.pria;
  const acara0 = data.acara[0];
  const countdown = useCountdown(acara0?.tanggal ?? '2099-01-01');

  return (
    <>
      <style>{FONTS}</style>

      {data.musik?.url && (
        <MusicPlayer url={data.musik.url} autoplay={data.musik.autoplay} color={CREAM} bgColor="rgba(74,0,0,0.85)" borderColor="rgba(253,248,242,0.2)" />
      )}

      {/* ════ COVER ════ */}
      {!opened && (
        <div style={{
          minHeight: '100svh',
          backgroundImage: `url('${BASE}/bg-texture.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Scaver', serif",
          color: MAROON_DARK,
          padding: '32px 24px',
        }}>
          <div style={{ width: '100%', maxWidth: 360, textAlign: 'center' }}>
            <img src={`${BASE}/cover.png`} alt="" style={{ width: '80%', maxWidth: 280, display: 'block', margin: '0 auto 8px' }} />

            <p style={{ fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', color: MAROON, opacity: 0.7, margin: '0 0 4px' }}>
              The Wedding Of
            </p>
            <h1 style={{ fontFamily: "'Tempting', cursive", fontSize: 52, lineHeight: 1.05, margin: '0', color: MAROON_DARK }}>
              {pria.namaPanggilan}
            </h1>
            <p style={{ fontSize: 16, letterSpacing: 4, color: MAROON, opacity: 0.6, margin: '2px 0' }}>&</p>
            <h1 style={{ fontFamily: "'Tempting', cursive", fontSize: 52, lineHeight: 1.05, margin: '0 0 12px', color: MAROON_DARK }}>
              {wanita.namaPanggilan}
            </h1>

            {acara0 && (
              <p style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: MAROON, opacity: 0.65, margin: '0 0 24px' }}>
                {formatDateShort(acara0.tanggal)}
              </p>
            )}

            {guestName && (
              <p style={{ fontSize: 12, color: MAROON, opacity: 0.75, margin: '0 0 20px', fontFamily: "'Scaver', serif" }}>
                Kepada Yth. <strong>{guestName}</strong>
              </p>
            )}

            <button
              onClick={() => setOpened(true)}
              style={{
                backgroundColor: MAROON,
                color: CREAM,
                border: 'none',
                borderRadius: 2,
                padding: '13px 40px',
                fontFamily: "'Scaver', serif",
                fontSize: 11,
                letterSpacing: 3,
                textTransform: 'uppercase',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(107,0,0,0.35)',
                transition: 'opacity 0.2s',
              }}
            >
              Open the Invitacion
            </button>

            <img src={`${BASE}/dot.png`} alt="" style={{ width: 20, marginTop: 28, opacity: 0.45, display: 'block', margin: '28px auto 0' }} />
          </div>
        </div>
      )}

      {/* ════ MAIN CONTENT ════ */}
      {opened && (
        <div style={{ fontFamily: "'Scaver', serif" }}>

          {/* 1 ── HERO */}
          <section style={{
            minHeight: '100svh',
            backgroundImage: `url('${BASE}/bg-dark.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            color: CREAM,
            overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(50,0,0,0.60)' }} />
            <div style={{ position: 'relative', zIndex: 1, padding: '56px 28px' }}>
              <p style={{ fontSize: 10, letterSpacing: 5, textTransform: 'uppercase', opacity: 0.55, marginBottom: 20 }}>The Wedding Of</p>
              <h2 style={{ fontFamily: "'Tempting', cursive", fontSize: 68, lineHeight: 1.0, margin: '0', color: CREAM }}>
                {pria.namaPanggilan}
              </h2>
              <p style={{ fontSize: 18, letterSpacing: 4, opacity: 0.5, margin: '10px 0' }}>&</p>
              <h2 style={{ fontFamily: "'Tempting', cursive", fontSize: 68, lineHeight: 1.0, margin: '0 0 28px', color: CREAM }}>
                {wanita.namaPanggilan}
              </h2>
              <div style={{ width: 48, height: 1, backgroundColor: 'rgba(253,248,242,0.35)', margin: '0 auto 20px' }} />
              {acara0 && (
                <p style={{ fontSize: 12, letterSpacing: 4, textTransform: 'uppercase', opacity: 0.7 }}>
                  {formatTanggal(acara0.tanggal)}
                </p>
              )}
              <img src={`${BASE}/couple-hands.png`} alt="" style={{ width: 110, marginTop: 36, opacity: 0.8 }} />
            </div>
          </section>

          {/* 2 ── SALAM + QUOTE */}
          <section style={{
            backgroundColor: MAROON_DARK,
            padding: '72px 28px',
            textAlign: 'center',
            color: CREAM,
          }}>
            <FadeIn>
              <img src={`${BASE}/salam.png`} alt="Assalamu'alaikum" style={{ width: 200, marginBottom: 28, opacity: 0.88 }} />
            </FadeIn>
            <FadeIn delay={100}>
              <img src={`${BASE}/divider-flower.png`} alt="" style={{ width: 72, marginBottom: 28, opacity: 0.55 }} />
            </FadeIn>
            <FadeIn delay={180}>
              <blockquote style={{ maxWidth: 440, margin: '0 auto 20px', fontSize: 14, lineHeight: 1.85, fontStyle: 'italic', opacity: 0.82 }}>
                {data.quote?.teks
                  ? <>&ldquo;{data.quote.teks}&rdquo;</>
                  : <>&ldquo;Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu istri-istri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya.&rdquo;</>
                }
                <br />
                <span style={{ fontSize: 12, opacity: 0.65, fontStyle: 'normal' }}>
                  — {data.quote?.sumber || 'QS. Ar-Rum: 21'}
                </span>
              </blockquote>
            </FadeIn>
            <FadeIn delay={260}>
              <p style={{ fontSize: 11, letterSpacing: 2, opacity: 0.45, textTransform: 'uppercase', maxWidth: 320, margin: '0 auto' }}>
                Dengan memohon ridho Allah SWT, kami mengundang kehadiran Bapak / Ibu / Saudara/i
              </p>
            </FadeIn>
          </section>

          {/* 3 ── MEMPELAI */}
          <section style={{
            backgroundColor: MAROON,
            padding: '72px 28px',
            textAlign: 'center',
            color: CREAM,
          }}>
            <FadeIn>
              <p style={{ fontSize: 10, letterSpacing: 5, textTransform: 'uppercase', opacity: 0.5, marginBottom: 48 }}>Mempelai</p>
            </FadeIn>

            {[pria, wanita].map((m, i) => (
              <FadeIn key={i} delay={i * 160}>
                <div style={{ marginBottom: 52 }}>
                  {m.foto ? (
                    <div style={{ position: 'relative', display: 'inline-block', marginBottom: 20 }}>
                      <img
                        src={m.foto}
                        alt={m.namaLengkap}
                        style={{ width: 140, height: 175, objectFit: 'cover', borderRadius: '50% / 45%', display: 'block' }}
                      />
                      <img
                        src={`${BASE}/frame-maroon.png`}
                        alt=""
                        style={{ position: 'absolute', inset: -14, width: 'calc(100% + 28px)', height: 'calc(100% + 28px)', zIndex: 2, pointerEvents: 'none' }}
                      />
                    </div>
                  ) : (
                    <div style={{
                      width: 140, height: 175,
                      border: `2px solid rgba(253,248,242,0.25)`,
                      borderRadius: '50% / 45%',
                      margin: '0 auto 20px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      opacity: 0.35, fontSize: 52,
                    }}>
                      {i === 0 ? '♂' : '♀'}
                    </div>
                  )}

                  <h3 style={{ fontFamily: "'Tempting', cursive", fontSize: 42, color: CREAM, margin: '0 0 6px', lineHeight: 1.1 }}>
                    {m.namaPanggilan}
                  </h3>
                  <p style={{ fontSize: 13, opacity: 0.78, margin: '0 0 6px' }}>{m.namaLengkap}</p>
                  {m.anakKe && (
                    <p style={{ fontSize: 11, opacity: 0.55, margin: '0 0 4px' }}>Putra/i ke-{m.anakKe}</p>
                  )}
                  {(m.ayah || m.ibu) && (
                    <p style={{ fontSize: 12, opacity: 0.6 }}>
                      {m.ayah && `Bapak ${m.ayah}`}{m.ayah && m.ibu && ' & '}{m.ibu && `Ibu ${m.ibu}`}
                    </p>
                  )}
                  {m.instagram && (
                    <p style={{ fontSize: 11, opacity: 0.45, marginTop: 4 }}>@{m.instagram}</p>
                  )}
                </div>

                {i === 0 && (
                  <div style={{ fontFamily: "'Tempting', cursive", fontSize: 40, opacity: 0.45, marginBottom: 48 }}>&</div>
                )}
              </FadeIn>
            ))}
          </section>

          {/* 4 ── THE DETAILS */}
          <section style={{
            backgroundImage: `url('${BASE}/bg-texture.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: '72px 28px',
            textAlign: 'center',
            color: MAROON_DARK,
          }}>
            <FadeIn>
              <img src={`${BASE}/arch.png`} alt="" style={{ width: '90%', maxWidth: 320, opacity: 0.88, marginBottom: -8 }} />
            </FadeIn>
            <FadeIn delay={80}>
              <p style={{ fontSize: 10, letterSpacing: 5, textTransform: 'uppercase', color: MAROON, marginBottom: 36 }}>The Details</p>
            </FadeIn>

            {data.acara.map((acara, i) => (
              <FadeIn key={i} delay={i * 140 + 120}>
                <div style={{
                  border: `1px solid rgba(107,0,0,0.18)`,
                  borderRadius: 4,
                  padding: '24px 20px',
                  margin: '0 auto 16px',
                  maxWidth: 400,
                  backgroundColor: 'rgba(107,0,0,0.04)',
                }}>
                  <p style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: MAROON, marginBottom: 8 }}>{acara.nama}</p>
                  <p style={{ fontFamily: "'Tempting', cursive", fontSize: 26, color: MAROON_DARK, margin: '0 0 6px' }}>
                    {formatTanggal(acara.tanggal)}
                  </p>
                  <p style={{ fontSize: 13, color: MAROON, margin: '0 0 4px' }}>
                    {acara.waktuMulai}{acara.waktuSelesai ? ` – ${acara.waktuSelesai}` : ''} WIB
                  </p>
                  <p style={{ fontSize: 12, opacity: 0.65, margin: '0 0 12px' }}>{acara.lokasi}</p>
                  {acara.mapsUrl && (
                    <a href={acara.mapsUrl} target="_blank" rel="noopener noreferrer" style={{
                      fontSize: 10, letterSpacing: 2, textTransform: 'uppercase',
                      color: MAROON, textDecoration: 'underline', opacity: 0.75,
                    }}>
                      Lihat Lokasi
                    </a>
                  )}
                </div>
              </FadeIn>
            ))}

            {/* Countdown */}
            {acara0 && (
              <FadeIn delay={320}>
                <div style={{ marginTop: 44 }}>
                  <img src={`${BASE}/divider-flower.png`} alt="" style={{ width: 64, opacity: 0.5, marginBottom: 20, display: 'block', margin: '0 auto 20px' }} />
                  <p style={{ fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', color: MAROON, opacity: 0.7, marginBottom: 20 }}>
                    Menuju Hari Istimewa
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
                    {[
                      { v: countdown.d, l: 'Hari' },
                      { v: countdown.h, l: 'Jam' },
                      { v: countdown.m, l: 'Menit' },
                      { v: countdown.s, l: 'Detik' },
                    ].map(item => (
                      <div key={item.l} style={{
                        width: 68, height: 68,
                        border: `1px solid rgba(107,0,0,0.22)`,
                        borderRadius: 4,
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        backgroundColor: 'rgba(107,0,0,0.05)',
                      }}>
                        <span style={{ fontSize: 22, fontWeight: 600, color: MAROON_DARK, lineHeight: 1 }}>
                          {String(item.v).padStart(2, '0')}
                        </span>
                        <span style={{ fontSize: 9, letterSpacing: 1, textTransform: 'uppercase', color: MAROON, opacity: 0.65, marginTop: 2 }}>
                          {item.l}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            )}

            <FadeIn delay={400}>
              <img src={`${BASE}/heart-roses.png`} alt="" style={{ width: 120, marginTop: 44, opacity: 0.78, display: 'block', margin: '44px auto 0' }} />
            </FadeIn>
          </section>

          {/* 5 ── LOCATION */}
          {data.acara.some(a => a.alamat) && (
            <section style={{
              backgroundColor: MAROON,
              padding: '72px 28px',
              textAlign: 'center',
              color: CREAM,
            }}>
              <FadeIn>
                <p style={{ fontSize: 10, letterSpacing: 5, textTransform: 'uppercase', opacity: 0.5, marginBottom: 36 }}>Location</p>
              </FadeIn>
              {data.acara.filter(a => a.alamat).map((acara, i) => (
                <FadeIn key={i} delay={i * 150 + 80}>
                  <div style={{ marginBottom: 36 }}>
                    <p style={{ fontFamily: "'Tempting', cursive", fontSize: 32, margin: '0 0 10px' }}>{acara.lokasi}</p>
                    <p style={{ fontSize: 13, opacity: 0.7, lineHeight: 1.75, maxWidth: 340, margin: '0 auto 20px' }}>{acara.alamat}</p>
                    {acara.mapsUrl && (
                      <a
                        href={acara.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-block',
                          border: `1px solid rgba(253,248,242,0.45)`,
                          borderRadius: 2,
                          padding: '11px 30px',
                          fontSize: 10, letterSpacing: 3, textTransform: 'uppercase',
                          color: CREAM, textDecoration: 'none',
                        }}
                      >
                        Click Location
                      </a>
                    )}
                  </div>
                </FadeIn>
              ))}
            </section>
          )}

          {/* 6 ── GALLERY */}
          {data.galeri && data.galeri.length > 0 && (
            <section style={{
              backgroundImage: `url('${BASE}/bg-dark.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
              padding: '72px 28px',
              textAlign: 'center',
              color: CREAM,
            }}>
              <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(50,0,0,0.62)' }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <FadeIn>
                  <p style={{ fontSize: 10, letterSpacing: 5, textTransform: 'uppercase', opacity: 0.5, marginBottom: 36 }}>Gallery</p>
                </FadeIn>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16, maxWidth: 480, margin: '0 auto' }}>
                  {data.galeri.slice(0, 6).map((foto, i) => (
                    <FadeIn key={i} delay={i * 70}>
                      <div style={{ position: 'relative', width: 120 }}>
                        <img
                          src={foto}
                          alt={`Foto ${i + 1}`}
                          style={{ width: '100%', height: 100, objectFit: 'cover', display: 'block' }}
                        />
                        <img
                          src={`${BASE}/polaroid.png`}
                          alt=""
                          style={{
                            position: 'absolute', top: -8, left: -8,
                            width: 'calc(100% + 16px)', height: 'calc(100% + 24px)',
                            zIndex: 2, pointerEvents: 'none',
                          }}
                        />
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* 7 ── AMPLOP DIGITAL */}
          {data.amplopDigital?.aktif && (
            <section style={{
              backgroundImage: `url('${BASE}/bg-texture.png')`,
              backgroundSize: 'cover',
              padding: '72px 28px',
              color: MAROON_DARK,
            }}>
              <FadeIn>
                <div style={{ maxWidth: 440, margin: '0 auto', textAlign: 'center' }}>
                  <p style={{ fontSize: 10, letterSpacing: 5, textTransform: 'uppercase', color: MAROON, marginBottom: 12 }}>Hadiah Digital</p>
                  <img src={`${BASE}/divider-flower.png`} alt="" style={{ width: 60, opacity: 0.5, marginBottom: 28, display: 'block', margin: '0 auto 28px' }} />
                  <AmplopDigitalComponent amplop={data.amplopDigital} primaryColor={MAROON} />
                </div>
              </FadeIn>
            </section>
          )}

          {/* 8 ── RSVP */}
          {data.rsvpAktif !== false && (
            <section style={{
              backgroundImage: `url('${BASE}/bg-texture.png')`,
              backgroundSize: 'cover',
              padding: '72px 28px',
              color: MAROON_DARK,
            }}>
              <FadeIn>
                <div style={{ maxWidth: 480, margin: '0 auto' }}>
                  <p style={{ fontSize: 10, letterSpacing: 5, textTransform: 'uppercase', color: MAROON, textAlign: 'center', marginBottom: 12 }}>RSVP</p>
                  <img src={`${BASE}/divider-flower.png`} alt="" style={{ width: 60, opacity: 0.5, display: 'block', margin: '0 auto 28px' }} />
                  <RsvpForm slug={slug} rsvps={rsvps} onSubmit={onRsvpSubmit} primaryColor={MAROON} guestName={guestName} />
                </div>
              </FadeIn>
            </section>
          )}

          {/* 9 ── GUESTBOOK */}
          {data.guestbookAktif !== false && (
            <section style={{
              backgroundImage: `url('${BASE}/bg-texture.png')`,
              backgroundSize: 'cover',
              padding: '72px 28px',
              color: MAROON_DARK,
            }}>
              <FadeIn>
                <div style={{ maxWidth: 480, margin: '0 auto' }}>
                  <p style={{ fontSize: 10, letterSpacing: 5, textTransform: 'uppercase', color: MAROON, textAlign: 'center', marginBottom: 12 }}>Buku Tamu</p>
                  <img src={`${BASE}/divider-flower.png`} alt="" style={{ width: 60, opacity: 0.5, display: 'block', margin: '0 auto 28px' }} />
                  <GuestbookForm guestbook={guestbook} onSubmit={onGuestbookSubmit} primaryColor={MAROON} guestName={guestName} />
                </div>
              </FadeIn>
            </section>
          )}

          {/* 10 ── FOOTER */}
          <section style={{
            backgroundColor: MAROON_DARK,
            padding: '56px 28px',
            textAlign: 'center',
            color: CREAM,
          }}>
            <img src={`${BASE}/divider-flower.png`} alt="" style={{ width: 56, opacity: 0.45, display: 'block', margin: '0 auto 20px' }} />
            <p style={{ fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', opacity: 0.45, marginBottom: 14 }}>With Love</p>
            <h3 style={{ fontFamily: "'Tempting', cursive", fontSize: 46, color: CREAM, lineHeight: 1.05, margin: '0 0 6px' }}>
              {pria.namaPanggilan} & {wanita.namaPanggilan}
            </h3>
            <p style={{ fontSize: 11, opacity: 0.35, marginTop: 28 }}>
              © {new Date().getFullYear()} NikahYuk by Ratna Offset
            </p>
          </section>

        </div>
      )}
    </>
  );
}
