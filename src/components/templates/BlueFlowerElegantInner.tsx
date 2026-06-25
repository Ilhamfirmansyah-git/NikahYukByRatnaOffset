'use client';

import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { TemplateProps } from './TemplateProps';
import { FadeIn } from './base/CanvaBaseTemplate';
import RsvpForm from '@/components/invitation/RsvpForm';
import GuestbookForm from '@/components/invitation/GuestbookForm';
import AmplopDigitalComponent from '@/components/invitation/AmplopDigital';
import GoogleMapsEmbed from '@/components/invitation/GoogleMapsEmbed';

const BASE   = '/assets/templates/blue-flower-elegant';
const BOUQUET = `${BASE}/bouquet.png`;
const FRAME   = `${BASE}/flower-frame.jpg`;

const C = {
  primary:      '#c9a84c',
  primaryLight: '#e8d5a3',
  primaryDark:  '#9a7a2e',
  text:         '#1a2a4a',
  textMuted:    '#4a7ab5',
} as const;

const F = {
  heading:    "'Great Vibes', cursive",
  subheading: "'Cormorant Garamond', serif",
  body:       "'Inter', sans-serif",
} as const;

type SetRefFn = (id: string) => (el: HTMLElement | null) => void;

export interface BFEInnerProps extends TemplateProps {
  setRef: SetRefFn;
  lightboxImg: string | null;
  setLightboxImg: (img: string | null) => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmt = (t: string) =>
  t ? new Date(t).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '';

const fmtDay = (t: string) =>
  t ? new Date(t).toLocaleDateString('id-ID', { weekday: 'long' }).toUpperCase() : '';

const fmtDateUpper = (t: string) =>
  t ? new Date(t).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase() : '';

const fmtTime = (t: string) =>
  t ? new Date(`1970-01-01T${t}`).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '';

// ── Sub-components ────────────────────────────────────────────────────────────

function GoldDiv() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '14px 0' }}>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${C.primaryDark})` }} />
      <svg width="10" height="10" viewBox="0 0 10 10">
        <polygon points="5,0 10,5 5,10 0,5" fill={C.primaryDark} opacity="0.65" />
      </svg>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, ${C.primaryDark})` }} />
    </div>
  );
}

function ScriptLabel({ children }: { children: ReactNode }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 28 }}>
      <h2 style={{ fontFamily: F.heading, fontSize: 46, color: C.primary, margin: '0 0 4px', lineHeight: 1.15 }}>
        {children}
      </h2>
      <GoldDiv />
    </div>
  );
}

function FrostedCard({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.74)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      borderRadius: 18,
      border: `1px solid rgba(201,168,76,0.25)`,
      boxShadow: '0 6px 32px rgba(26,42,74,0.09)',
      padding: '32px 28px',
      ...style,
    }}>
      {children}
    </div>
  );
}

function BFECountdown({ targetDate }: { targetDate: string }) {
  const calc = () => {
    const diff = new Date(targetDate).getTime() - Date.now();
    if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 };
    return {
      d: Math.floor(diff / 86400000),
      h: Math.floor(diff / 3600000 % 24),
      m: Math.floor(diff / 60000 % 60),
      s: Math.floor(diff / 1000 % 60),
    };
  };
  const [t, setT] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  const pad = (n: number) => String(n).padStart(2, '0');
  const units = [{ v: t.d, l: 'Hari' }, { v: t.h, l: 'Jam' }, { v: t.m, l: 'Menit' }, { v: t.s, l: 'Detik' }];
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
      {units.map(u => (
        <div key={u.l} style={{ textAlign: 'center', minWidth: 64 }}>
          <div style={{
            background: 'rgba(255,255,255,0.85)',
            border: `1.5px solid ${C.primary}`,
            borderRadius: 10,
            padding: '12px 6px', marginBottom: 6,
            boxShadow: `0 2px 14px rgba(201,168,76,0.2), inset 0 1px 0 rgba(255,255,255,0.9)`,
          }}>
            <span style={{ fontFamily: F.subheading, fontSize: 38, fontWeight: 600, color: C.text, display: 'block', lineHeight: 1 }}>
              {pad(u.v)}
            </span>
          </div>
          <span style={{ fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase' as const, color: C.primaryDark, fontFamily: F.body }}>
            {u.l}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export function BlueFlowerElegantInner({
  data, guestName, slug,
  onRsvpSubmit, onGuestbookSubmit, rsvps, guestbook,
  setRef, lightboxImg, setLightboxImg,
}: BFEInnerProps) {
  const pria    = data.mempelai.pria;
  const wanita  = data.mempelai.wanita;
  const primaFirst = data.mempelai.urutanTampil !== 'wanita-dulu';
  const m1 = primaFirst ? pria : wanita;
  const m2 = primaFirst ? wanita : pria;
  const firstAcara      = data.acara[0];
  const countdownTarget = data.countdown.tanggal || firstAcara?.tanggal || '';

  const SEC: React.CSSProperties = { padding: '52px 20px', textAlign: 'center' };

  return (
    <div style={{ fontFamily: F.subheading }}>

      {/* ── Hero (beranda) ── */}
      <section ref={setRef('beranda')} style={{ ...SEC, paddingTop: 68 }}>
        <FadeIn>
          <FrostedCard style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
            <p style={{ fontFamily: F.subheading, fontSize: 11, letterSpacing: '0.32em', color: C.primaryDark, fontStyle: 'italic', marginBottom: 10 }}>
              The Wedding of
            </p>
            <h2 style={{ fontFamily: F.heading, fontSize: 52, color: C.text, margin: '0 0 4px', lineHeight: 1.1 }}>
              {m1.namaPanggilan || m1.namaLengkap} &amp; {m2.namaPanggilan || m2.namaLengkap}
            </h2>
            {firstAcara && (
              <p style={{ fontFamily: F.body, fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.primaryDark, marginTop: 10 }}>
                {fmtDateUpper(firstAcara.tanggal)}
              </p>
            )}
            {guestName && (
              <div style={{ marginTop: 18 }}>
                <GoldDiv />
                <p style={{ fontFamily: F.body, fontSize: 9, letterSpacing: '0.32em', textTransform: 'uppercase', color: C.textMuted, margin: '4px 0 2px', fontStyle: 'italic', opacity: 0.8 }}>
                  Kepada Yth.
                </p>
                <p style={{ fontFamily: F.heading, fontSize: 28, color: C.text, margin: 0, lineHeight: 1.2 }}>
                  {guestName}
                </p>
              </div>
            )}
          </FrostedCard>
        </FadeIn>
      </section>

      {/* ── Quote / Bismillah ── */}
      {data.quote?.teks && (
        <section style={{ ...SEC }}>
          <FadeIn>
            <FrostedCard style={{ maxWidth: 500, margin: '0 auto' }}>
              <h2 style={{ fontFamily: F.heading, fontSize: 40, color: C.primary, margin: '0 0 14px', lineHeight: 1.2 }}>
                We are Getting Married!
              </h2>
              <GoldDiv />
              <p style={{ fontFamily: F.subheading, fontSize: 16, fontStyle: 'italic', color: C.text, lineHeight: 1.9, margin: '16px 0 10px' }}>
                &ldquo;{data.quote.teks}&rdquo;
              </p>
              {data.quote.sumber && (
                <p style={{ fontFamily: F.body, fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', color: C.primaryDark, opacity: 0.7, margin: 0 }}>
                  — {data.quote.sumber}
                </p>
              )}
            </FrostedCard>
          </FadeIn>
        </section>
      )}

      {/* ── Mempelai ── */}
      <section ref={setRef('mempelai')} style={{ ...SEC }}>
        <FadeIn>
          <div style={{ fontFamily: F.body, fontSize: 10, letterSpacing: '0.42em', textTransform: 'uppercase', color: C.primaryDark, marginBottom: 36 }}>
            Mempelai Bahagia
          </div>
        </FadeIn>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 52, alignItems: 'center', maxWidth: 380, margin: '0 auto' }}>
          {[m1, m2].map((m, i) => (
            <FadeIn key={i} delay={i * 160}>
              <div style={{ textAlign: 'center' }}>

                {/* Oval photo */}
                {m.foto ? (
                  <div style={{
                    width: 160, height: 200, margin: '0 auto 20px',
                    borderRadius: '50% / 52% 52% 48% 48%',
                    overflow: 'hidden',
                    border: `3px solid ${C.primary}`,
                    boxShadow: `0 0 0 7px rgba(201,168,76,0.18), 0 0 0 11px ${C.primaryDark}30, 0 12px 36px rgba(26,42,74,0.14)`,
                  }}>
                    <img src={m.foto} alt={m.namaLengkap} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </div>
                ) : (
                  <div style={{
                    width: 160, height: 200, margin: '0 auto 20px',
                    borderRadius: '50% / 52% 52% 48% 48%',
                    background: 'rgba(201,168,76,0.10)',
                    border: `3px solid ${C.primary}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill={C.primary} opacity="0.45">
                      <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z" />
                    </svg>
                  </div>
                )}

                <h3 style={{ fontFamily: F.heading, fontSize: 46, color: C.text, margin: '0 0 4px', lineHeight: 1.1 }}>
                  {m.namaPanggilan || m.namaLengkap}
                </h3>
                {m.namaPanggilan && (
                  <p style={{ fontFamily: F.subheading, fontSize: 13, color: C.textMuted, fontStyle: 'italic', margin: '0 0 8px' }}>
                    {m.namaLengkap}
                  </p>
                )}
                {m.anakKe && (
                  <p style={{ fontFamily: F.body, fontSize: 10, color: C.primaryDark, letterSpacing: '0.14em', marginBottom: 5 }}>
                    Putra/i ke-{m.anakKe}
                  </p>
                )}
                {(m.ayah || m.ibu) && (
                  <p style={{ fontFamily: F.subheading, fontSize: 13, color: C.textMuted, lineHeight: 1.75, margin: '4px 0 0' }}>
                    {m.ayah && <span>{m.ayah}</span>}
                    {m.ayah && m.ibu && <span style={{ color: C.primary }}> &amp; </span>}
                    {m.ibu && <span>{m.ibu}</span>}
                  </p>
                )}
                {m.instagram && (
                  <p style={{ fontFamily: F.body, fontSize: 11, color: C.primary, marginTop: 6 }}>
                    @{m.instagram}
                  </p>
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── Countdown ── */}
      {countdownTarget && (
        <section style={{ ...SEC }}>
          <FadeIn>
            <img src={BOUQUET} alt="" style={{ width: 110, height: 110, objectFit: 'contain', opacity: 0.88, display: 'block', margin: '0 auto 14px' }} />
            <p style={{ fontFamily: F.heading, fontSize: 40, color: C.primary, margin: '0 0 24px', lineHeight: 1.2 }}>
              Save the Date
            </p>
            <BFECountdown targetDate={countdownTarget} />
            {firstAcara && (
              <p style={{ fontFamily: F.subheading, fontSize: 14, fontStyle: 'italic', color: C.primaryDark, marginTop: 22, opacity: 0.82 }}>
                {fmt(firstAcara.tanggal)}
              </p>
            )}
          </FadeIn>
        </section>
      )}

      {/* ── Acara ── */}
      <section ref={setRef('acara')} style={{ ...SEC }}>
        <FadeIn>
          <ScriptLabel>Acara Pernikahan</ScriptLabel>
        </FadeIn>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 28, maxWidth: 460, margin: '0 auto' }}>
          {data.acara.map((acara, i) => (
            <FadeIn key={i} delay={i * 160}>
              <div style={{
                backgroundImage: `url('${FRAME}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                borderRadius: 18,
                padding: '68px 52px 56px',
                textAlign: 'center',
                position: 'relative',
                boxShadow: '0 4px 24px rgba(26,42,74,0.10)',
              }}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <h3 style={{ fontFamily: F.heading, fontSize: 40, color: C.text, margin: '0 0 10px', lineHeight: 1.1 }}>
                    {acara.nama}
                  </h3>
                  <GoldDiv />
                  <p style={{ fontFamily: F.body, fontSize: 11, letterSpacing: '0.32em', color: C.primaryDark, textTransform: 'uppercase', margin: '16px 0 3px', fontWeight: 600 }}>
                    {fmtDay(acara.tanggal)}
                  </p>
                  <p style={{ fontFamily: F.subheading, fontSize: 20, fontWeight: 700, color: C.text, margin: '2px 0 8px', letterSpacing: '0.04em' }}>
                    {fmtDateUpper(acara.tanggal)}
                  </p>
                  {(acara.waktuMulai || acara.waktuSelesai) && (
                    <p style={{ fontFamily: F.body, fontSize: 12, color: C.primaryDark, margin: '0 0 16px', letterSpacing: '0.1em' }}>
                      {fmtTime(acara.waktuMulai)}{acara.waktuSelesai ? ` – ${fmtTime(acara.waktuSelesai)}` : ''} WIB
                    </p>
                  )}
                  <GoldDiv />
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, justifyContent: 'center', marginTop: 16 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={C.primaryDark} style={{ flexShrink: 0, marginTop: 3 }}>
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                    <div style={{ textAlign: 'left' }}>
                      <p style={{ fontFamily: F.body, fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.text, margin: 0 }}>
                        {acara.lokasi}
                      </p>
                      {acara.alamat && (
                        <p style={{ fontFamily: F.subheading, fontSize: 13, color: C.textMuted, margin: '3px 0 0', lineHeight: 1.55, fontStyle: 'italic' }}>
                          {acara.alamat}
                        </p>
                      )}
                    </div>
                  </div>
                  <GoogleMapsEmbed lokasi={acara.lokasi} alamat={acara.alamat} />
                  {acara.mapsUrl && (
                    <a href={acara.mapsUrl} target="_blank" rel="noopener noreferrer" style={{
                      display: 'inline-block', marginTop: 20, padding: '9px 28px',
                      border: `1px solid ${C.primaryDark}`, color: C.primary, borderRadius: 4,
                      fontFamily: F.body, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase',
                      textDecoration: 'none',
                    }}>
                      Lihat Peta
                    </a>
                  )}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── Galeri ── */}
      {data.galeri.length > 0 && (
        <section ref={setRef('galeri')} style={{ ...SEC }}>
          <FadeIn>
            <ScriptLabel>Galeri</ScriptLabel>
          </FadeIn>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, maxWidth: 480, margin: '0 auto' }}>
            {data.galeri.map((src, i) => (
              <FadeIn key={i} delay={i * 70}>
                <div
                  onClick={() => setLightboxImg(src)}
                  style={{
                    cursor: 'zoom-in', borderRadius: 10, overflow: 'hidden',
                    border: `1.5px solid ${C.primaryDark}`, aspectRatio: '1/1',
                    position: 'relative', width: '100%',
                    background: 'rgba(255,255,255,0.55)',
                    boxShadow: '0 2px 14px rgba(26,42,74,0.10)',
                  }}
                >
                  <img src={src} alt={`Foto ${i + 1}`} loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
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
        <section style={{ ...SEC }}>
          <FadeIn>
            <img src={BOUQUET} alt="" style={{ width: 80, height: 80, objectFit: 'contain', opacity: 0.85, display: 'block', margin: '0 auto 16px' }} />
            <ScriptLabel>Love Story</ScriptLabel>
          </FadeIn>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 480, margin: '0 auto' }}>
            {data.loveStory.map((item, i) => (
              <FadeIn key={i} delay={i * 100} from="left">
                <FrostedCard style={{ textAlign: 'left', padding: '22px 24px' }}>
                  <p style={{ fontFamily: F.body, fontSize: 9, letterSpacing: '0.28em', color: C.primaryDark, textTransform: 'uppercase', margin: '0 0 5px' }}>
                    {item.tahun}
                  </p>
                  <h4 style={{ fontFamily: F.subheading, fontSize: 20, fontWeight: 700, color: C.text, margin: '0 0 10px', lineHeight: 1.25 }}>
                    {item.judul}
                  </h4>
                  <p style={{ fontFamily: F.subheading, fontSize: 14, color: C.textMuted, lineHeight: 1.8, margin: 0, fontStyle: 'italic' }}>
                    {item.cerita}
                  </p>
                </FrostedCard>
              </FadeIn>
            ))}
          </div>
        </section>
      )}

      {/* ── RSVP ── */}
      {data.rsvpAktif && (
        <section ref={setRef('ucapan')} style={{ ...SEC }}>
          <FadeIn>
            <ScriptLabel>Konfirmasi Kehadiran</ScriptLabel>
          </FadeIn>
          <div style={{ maxWidth: 480, margin: '0 auto' }}>
            <RsvpForm slug={slug} onSubmit={onRsvpSubmit} rsvps={rsvps} primaryColor={C.primary} guestName={guestName} />
          </div>
        </section>
      )}

      {/* ── Buku Tamu ── */}
      {data.guestbookAktif && (
        <section style={{ ...SEC }}>
          <FadeIn>
            <ScriptLabel>Buku Tamu</ScriptLabel>
          </FadeIn>
          <div style={{ maxWidth: 480, margin: '0 auto' }}>
            <GuestbookForm onSubmit={onGuestbookSubmit} guestbook={guestbook} primaryColor={C.primary} />
          </div>
        </section>
      )}

      {/* ── Amplop Digital ── */}
      {data.amplopDigital.aktif && (
        <section style={{ ...SEC }}>
          <FadeIn>
            <ScriptLabel>Amplop Digital</ScriptLabel>
          </FadeIn>
          <div style={{ maxWidth: 480, margin: '0 auto' }}>
            <AmplopDigitalComponent amplop={data.amplopDigital} primaryColor={C.primary} />
          </div>
        </section>
      )}

      {/* ── Livestream ── */}
      {data.livestream.aktif && data.livestream.url && (
        <section style={{ ...SEC }}>
          <FadeIn>
            <FrostedCard style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
              <h2 style={{ fontFamily: F.heading, fontSize: 40, color: C.primary, margin: '0 0 12px', lineHeight: 1.2 }}>
                Live Streaming
              </h2>
              <GoldDiv />
              <p style={{ fontFamily: F.subheading, fontSize: 15, color: C.textMuted, fontStyle: 'italic', margin: '16px 0 24px', lineHeight: 1.75 }}>
                Saksikan momen bahagia kami secara online, di manapun Anda berada
              </p>
              <a href={data.livestream.url} target="_blank" rel="noopener noreferrer" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '12px 36px',
                background: C.primaryDark, color: '#fff', borderRadius: 6,
                fontFamily: F.body, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase',
                textDecoration: 'none', fontWeight: 600,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                </svg>
                Tonton Live
              </a>
            </FrostedCard>
          </FadeIn>
        </section>
      )}

      {/* ── Footer ── */}
      <section style={{
        padding: '64px 24px 80px',
        textAlign: 'center',
        background: 'linear-gradient(to bottom, transparent 0%, rgba(26,42,74,0.88) 10%, rgba(26,42,74,0.97) 100%)',
      }}>
        <FadeIn>
          <p style={{ fontFamily: F.subheading, fontSize: 12, letterSpacing: '0.3em', color: C.primaryLight, fontStyle: 'italic', marginBottom: 10, opacity: 0.8 }}>
            Kami yang berbahagia
          </p>
          <h2 style={{ fontFamily: F.heading, fontSize: 52, color: C.primaryLight, margin: '0 0 4px' }}>
            {m1.namaPanggilan || m1.namaLengkap}
          </h2>
          <div style={{ fontFamily: F.subheading, fontSize: 26, color: C.primary, fontStyle: 'italic', margin: '6px 0' }}>&amp;</div>
          <h2 style={{ fontFamily: F.heading, fontSize: 52, color: C.primaryLight, margin: '0 0 28px' }}>
            {m2.namaPanggilan || m2.namaLengkap}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '0 auto 20px', maxWidth: 200 }}>
            <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${C.primaryDark})` }} />
            <svg width="10" height="10" viewBox="0 0 10 10">
              <polygon points="5,0 10,5 5,10 0,5" fill={C.primaryDark} opacity="0.65" />
            </svg>
            <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, ${C.primaryDark})` }} />
          </div>
          <p style={{ fontFamily: F.subheading, fontSize: 13, color: C.primaryLight, fontStyle: 'italic', margin: '0 0 8px', opacity: 0.7, lineHeight: 1.75 }}>
            Terima kasih atas doa dan kehadiran Anda.<br />Merupakan kehormatan bagi kami.
          </p>
          <p style={{ fontFamily: F.body, fontSize: 8, letterSpacing: '0.35em', textTransform: 'uppercase', color: C.primaryLight, opacity: 0.3, marginTop: 28 }}>
            Nikah Yuk · By Ratna Offset
          </p>
        </FadeIn>
      </section>

    </div>
  );
}
