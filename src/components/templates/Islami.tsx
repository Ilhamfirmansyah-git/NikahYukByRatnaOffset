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

const GREEN = '#1a4731';
const GOLD = '#c9a84c';
const LIGHT_GREEN = '#f0f7f4';

function GeometricPattern() {
  return (
    <div className="flex justify-center my-4 opacity-30">
      <svg width="120" height="24" viewBox="0 0 120 24" fill="none">
        <path d="M0 12 L12 0 L24 12 L12 24 Z" fill={GOLD} />
        <path d="M48 12 L60 0 L72 12 L60 24 Z" fill={GOLD} />
        <path d="M96 12 L108 0 L120 12 L108 24 Z" fill={GOLD} />
        <line x1="24" y1="12" x2="48" y2="12" stroke={GOLD} strokeWidth="1" />
        <line x1="72" y1="12" x2="96" y2="12" stroke={GOLD} strokeWidth="1" />
      </svg>
    </div>
  );
}

function Section({ children, className = '', bg = 'white' }: { children: React.ReactNode; className?: string; bg?: string }) {
  return (
    <section
      className={`py-16 px-6 max-w-lg mx-auto w-full ${className}`}
      style={bg !== 'white' ? { backgroundColor: bg } : {}}
    >
      {children}
    </section>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-center mb-10">
      <GeometricPattern />
      <h2 className="font-serif text-xl uppercase tracking-[0.2em]" style={{ color: GREEN }}>{children}</h2>
      <div className="mt-2 flex items-center gap-2 justify-center">
        <div className="h-px w-12" style={{ background: GOLD }} />
        <div className="w-1.5 h-1.5 rotate-45" style={{ background: GOLD }} />
        <div className="h-px w-12" style={{ background: GOLD }} />
      </div>
    </div>
  );
}

export default function Islami({ data, guestName, slug, onRsvpSubmit, onGuestbookSubmit, rsvps, guestbook }: TemplateProps) {
  const [opened, setOpened] = useState(false);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const pria = data.mempelai.pria;
  const wanita = data.mempelai.wanita;
  const firstAcara = data.acara[0];
  const countdownTarget = data.countdown.tanggal || firstAcara?.tanggal || '';

  const formatTanggal = (tanggal: string) => {
    if (!tanggal) return '';
    return new Date(tanggal).toLocaleDateString('id-ID', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  const primaFirst = data.mempelai.urutanTampil === 'pria-dulu';
  const mempelai1 = primaFirst ? pria : wanita;
  const mempelai2 = primaFirst ? wanita : pria;

  return (
    <div className="relative min-h-screen" style={{ background: '#FAFDF8', color: '#1a1a1a', fontFamily: 'serif' }}>
      {data.musik.url && (
        <MusicPlayer
          url={data.musik.url}
          autoplay={data.musik.autoplay && opened}
          color="#c9a84c"
          bgColor="rgba(26,71,49,0.92)"
          borderColor="rgba(201,168,76,0.35)"
          positionClassName="fixed bottom-6 right-4 z-50"
        />
      )}

      <ShareButton
        slug={slug}
        pria={pria.namaPanggilan || pria.namaLengkap}
        wanita={wanita.namaPanggilan || wanita.namaLengkap}
        primaryColor={GREEN}
      />

      {/* COVER */}
      {!opened && (
        <div
          className="fixed inset-0 z-40 flex flex-col items-center justify-center text-center px-8"
          style={{ background: `linear-gradient(180deg, ${GREEN} 0%, #0d2a1c 100%)` }}
        >
          {/* Bismillah */}
          <div className="mb-6">
            <p className="text-3xl" style={{ color: GOLD, fontFamily: 'serif' }}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</p>
            <p className="text-xs mt-1 opacity-60 text-white">Bismillahirrahmanirrahim</p>
          </div>

          <GeometricPattern />

          {guestName && (
            <div className="my-4 py-4 border-t border-b border-white/10">
              <p className="text-xs uppercase tracking-[0.3em] opacity-60 text-white mb-1">Kepada Yth.</p>
              <p className="font-serif text-lg" style={{ color: GOLD }}>{guestName}</p>
            </div>
          )}

          <p className="text-xs uppercase tracking-[0.4em] opacity-60 text-white mt-4 mb-4">Undangan Walimatul Ursy</p>

          <h1 className="font-serif text-4xl leading-tight mb-2" style={{ color: GOLD }}>
            {mempelai1.namaPanggilan || mempelai1.namaLengkap || (primaFirst ? 'Nama Pria' : 'Nama Wanita')}
          </h1>
          <p className="text-white text-xl my-2 opacity-70 font-serif">&amp;</p>
          <h1 className="font-serif text-4xl leading-tight mb-6" style={{ color: GOLD }}>
            {mempelai2.namaPanggilan || mempelai2.namaLengkap || (primaFirst ? 'Nama Wanita' : 'Nama Pria')}
          </h1>

          {firstAcara && (
            <p className="text-sm opacity-70 text-white mb-8">
              {formatTanggal(firstAcara.tanggal)}
            </p>
          )}

          <button
            onClick={() => setOpened(true)}
            className="px-8 py-3 text-sm uppercase tracking-[0.3em] font-semibold transition-all hover:opacity-90"
            style={{ background: GOLD, color: GREEN }}
          >
            Buka Undangan
          </button>

          <GeometricPattern />
        </div>
      )}

      {/* CONTENT */}
      {opened && (
        <div className="animate-fade-in">
          {/* Header Bismillah */}
          <div className="text-center py-10 px-6" style={{ background: GREEN }}>
            <p className="text-3xl mb-2" style={{ color: GOLD }}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</p>
            <p className="text-xs text-white opacity-60">Bismillahirrahmanirrahim</p>
          </div>

          {/* Mempelai */}
          <Section>
            <SectionTitle>Mempelai</SectionTitle>
            <div className="space-y-10">
              {[mempelai1, mempelai2].map((m, i) => (
                <div key={i} className="text-center">
                  <div className="relative inline-block mb-4">
                    <div
                      className="w-32 h-32 rounded-full overflow-hidden mx-auto"
                      style={{ border: `3px solid ${GOLD}` }}
                    >
                      {m.foto ? (
                        <img src={m.foto} alt={m.namaLengkap || ''} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ background: LIGHT_GREEN }}>
                          <span className="text-3xl" style={{ color: GREEN }}>☽</span>
                        </div>
                      )}
                    </div>
                    {/* Decorative corners */}
                    <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2" style={{ borderColor: GOLD }} />
                    <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2" style={{ borderColor: GOLD }} />
                    <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2" style={{ borderColor: GOLD }} />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2" style={{ borderColor: GOLD }} />
                  </div>
                  <h3 className="font-serif text-2xl mt-4" style={{ color: GREEN }}>{m.namaLengkap || '—'}</h3>
                  {m.anakKe && (
                    <p className="text-sm opacity-60 mt-1">Putra/Putri ke-{m.anakKe}</p>
                  )}
                  {(m.ayah || m.ibu) && (
                    <p className="text-sm opacity-60 mt-1">Dari Bapak/Ibu {[m.ayah, m.ibu].filter(Boolean).join(' & ')}</p>
                  )}
                  {m.instagram && (
                    <a
                      href={`https://instagram.com/${m.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-sm mt-2 hover:underline"
                      style={{ color: GOLD }}
                    >
                      {m.instagram}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </Section>

          {/* Countdown */}
          {countdownTarget && (
            <div style={{ background: LIGHT_GREEN }} className="py-16 px-6">
              <div className="max-w-lg mx-auto">
                <SectionTitle>Hitung Mundur</SectionTitle>
                <CountdownTimer
                  targetDate={countdownTarget}
                  numberStyle="text-4xl font-serif"
                  labelStyle="text-xs uppercase tracking-widest opacity-60 mt-1"
                  containerStyle="flex justify-center gap-6"
                  unitLabels={{ hari: 'Hari', jam: 'Jam', menit: 'Menit', detik: 'Detik' }}
                />
              </div>
            </div>
          )}

          {/* Acara */}
          {data.acara.length > 0 && (
            <Section>
              <SectionTitle>Detail Acara</SectionTitle>
              <div className="space-y-6">
                {data.acara.map((acara, i) => (
                  <div
                    key={i}
                    className="p-6 rounded-sm"
                    style={{ border: `1px solid ${GOLD}30`, background: LIGHT_GREEN }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rotate-45" style={{ background: GOLD }} />
                      <h3 className="font-serif text-lg" style={{ color: GREEN }}>{acara.nama}</h3>
                    </div>
                    <div className="space-y-1 text-sm pl-4 border-l-2" style={{ borderColor: `${GOLD}50` }}>
                      <p className="opacity-70">{formatTanggal(acara.tanggal)}</p>
                      <p className="opacity-70">{acara.waktuMulai} – {acara.waktuSelesai} WIB</p>
                      <p className="font-semibold mt-2" style={{ color: GREEN }}>{acara.lokasi}</p>
                      <p className="opacity-60 text-xs">{acara.alamat}</p>
                      <GoogleMapsEmbed lokasi={acara.lokasi} alamat={acara.alamat} />
                      {acara.mapsUrl && (
                        <a
                          href={acara.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-2 text-xs font-medium hover:underline"
                          style={{ color: GOLD }}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Buka di Google Maps
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Galeri */}
          {data.galeri.length > 0 && (
            <div style={{ background: LIGHT_GREEN }} className="py-16 px-6">
              <div className="max-w-lg mx-auto">
                <SectionTitle>Galeri Foto</SectionTitle>
                <div className="grid grid-cols-2 gap-2">
                  {data.galeri.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setLightboxImg(src)}
                      className="aspect-square overflow-hidden hover:opacity-90 transition-opacity"
                      style={{ border: `1px solid ${GOLD}30` }}
                    >
                      <img src={src} alt={`Galeri ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Love Story */}
          {data.loveStory.length > 0 && (
            <Section>
              <SectionTitle>Kisah Cinta</SectionTitle>
              <div className="relative pl-8">
                <div className="absolute left-3 top-0 bottom-0 w-px" style={{ background: `${GOLD}40` }} />
                {data.loveStory.map((item, i) => (
                  <div key={i} className="relative mb-8">
                    <div
                      className="absolute -left-5 top-1 w-3 h-3 rotate-45"
                      style={{ background: GOLD }}
                    />
                    <p className="text-xs uppercase tracking-widest mb-1" style={{ color: GOLD }}>{item.tahun}</p>
                    <h4 className="font-serif text-base mb-2" style={{ color: GREEN }}>{item.judul}</h4>
                    <p className="text-sm opacity-70 leading-relaxed">{item.cerita}</p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Quote */}
          {data.quote.teks && (
            <div className="py-12 px-6 text-center" style={{ background: GREEN }}>
              <p className="font-serif text-xl italic leading-relaxed" style={{ color: GOLD }}>
                &ldquo;{data.quote.teks}&rdquo;
              </p>
              {data.quote.sumber && (
                <p className="text-sm text-white opacity-60 mt-4">— {data.quote.sumber}</p>
              )}
            </div>
          )}

          {/* Livestream */}
          {data.livestream.aktif && data.livestream.url && (
            <Section>
              <SectionTitle>Livestream</SectionTitle>
              <div className="text-center">
                <p className="text-sm opacity-70 mb-4">Saksikan akad nikah dan resepsi kami secara virtual</p>
                {data.livestream.platform && (
                  <p className="font-semibold mb-3" style={{ color: GREEN }}>{data.livestream.platform}</p>
                )}
                <a
                  href={data.livestream.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-sm text-white"
                  style={{ background: GREEN }}
                >
                  Tonton Livestream
                </a>
              </div>
            </Section>
          )}

          {/* RSVP */}
          {data.rsvpAktif && (
            <div style={{ background: LIGHT_GREEN }} className="py-16 px-6">
              <div className="max-w-lg mx-auto">
                <SectionTitle>Konfirmasi Kehadiran</SectionTitle>
                <RsvpForm
                  slug={slug}
                  rsvps={rsvps}
                  onSubmit={onRsvpSubmit}
                  primaryColor={GREEN}
                />
              </div>
            </div>
          )}

          {/* Buku Tamu */}
          {data.guestbookAktif && (
            <Section>
              <SectionTitle>Ucapan & Doa</SectionTitle>
              <GuestbookForm
                guestbook={guestbook}
                onSubmit={onGuestbookSubmit}
                primaryColor={GREEN}
                guestName={guestName}
              />
            </Section>
          )}

          {/* Amplop Digital */}
          {data.amplopDigital.aktif && (
            <div style={{ background: LIGHT_GREEN }} className="py-16 px-6">
              <div className="max-w-lg mx-auto">
                <SectionTitle>Amplop Digital</SectionTitle>
                <p className="text-center text-sm opacity-70 mb-6">Hadiah tulus Anda adalah doa dan berkah bagi kami</p>
                <AmplopDigitalComponent amplop={data.amplopDigital} primaryColor={GREEN} />
              </div>
            </div>
          )}

          {/* Protokol Kesehatan */}
          {data.protokolKesehatan.aktif && (
            <Section>
              <SectionTitle>Protokol Kesehatan</SectionTitle>
              <div className="p-5 rounded-sm text-sm leading-relaxed" style={{ background: LIGHT_GREEN, borderLeft: `3px solid ${GOLD}` }}>
                <p>
                  {data.protokolKesehatan.catatan || 'Demi kenyamanan bersama, mohon memperhatikan protokol kesehatan yang berlaku selama acara berlangsung.'}
                </p>
              </div>
            </Section>
          )}

          {/* Footer */}
          <footer className="py-12 px-6 text-center" style={{ background: GREEN }}>
            <p className="text-2xl mb-2" style={{ color: GOLD }}>☽★☾</p>
            <p className="font-serif text-lg mb-1" style={{ color: GOLD }}>
              {pria.namaPanggilan || pria.namaLengkap || 'Pria'} &amp; {wanita.namaPanggilan || wanita.namaLengkap || 'Wanita'}
            </p>
            <p className="text-xs text-white opacity-40 tracking-widest uppercase">Jazakumullahu khairan</p>
          </footer>
        </div>
      )}

      {/* Lightbox */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxImg(null)}
        >
          <img src={lightboxImg} alt="Lightbox" className="max-w-full max-h-full object-contain rounded" />
          <button className="absolute top-4 right-4 text-white text-3xl" onClick={() => setLightboxImg(null)}>✕</button>
        </div>
      )}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
      `}</style>
    </div>
  );
}
