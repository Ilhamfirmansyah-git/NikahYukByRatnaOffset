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

const GOLD = '#C9A84C';
const DARK = '#1A1209';
const CREAM = '#F5E6D3';

function GoldDivider() {
  return (
    <div className="flex items-center gap-3 my-6">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#C9A84C]" />
      <span className="text-[#C9A84C] text-lg">✦</span>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#C9A84C]" />
    </div>
  );
}

function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`py-16 px-6 max-w-lg mx-auto w-full ${className}`}>
      {children}
    </section>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-center mb-8">
      <GoldDivider />
      <h2 className="font-serif text-2xl text-[#C9A84C] tracking-wide uppercase">{children}</h2>
      <GoldDivider />
    </div>
  );
}

export default function EleganGold({ data, guestName, slug, onRsvpSubmit, onGuestbookSubmit, rsvps, guestbook }: TemplateProps) {
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
    <div className="relative min-h-screen" style={{ background: '#0D0A06', color: CREAM, fontFamily: 'serif' }}>
      {data.musik.url && (
        <MusicPlayer
          url={data.musik.url}
          autoplay={data.musik.autoplay && opened}
          color="#C9A84C"
          bgColor="rgba(13,10,6,0.88)"
          borderColor="rgba(201,168,76,0.45)"
          positionClassName="fixed bottom-6 right-4 z-50"
        />
      )}

      {/* WhatsApp Share */}
      <ShareButton
        slug={slug}
        pria={pria.namaPanggilan || pria.namaLengkap}
        wanita={wanita.namaPanggilan || wanita.namaLengkap}
        primaryColor={GOLD}
      />

      {/* COVER */}
      {!opened && (
        <div
          className="fixed inset-0 z-40 flex flex-col items-center justify-center text-center px-8"
          style={{ background: 'linear-gradient(180deg, #0D0A06 0%, #1A1209 50%, #0D0A06 100%)' }}
        >
          {/* Ornamen atas */}
          <div className="text-[#C9A84C] text-4xl mb-4 opacity-70">✦ ✦ ✦</div>

          {guestName && (
            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[#C9A84C] opacity-70 mb-1">Kepada Yth.</p>
              <p className="font-serif text-xl text-[#F5E6D3]">{guestName}</p>
            </div>
          )}

          <p className="text-xs uppercase tracking-[0.4em] text-[#C9A84C] mb-4">Undangan Pernikahan</p>
          <h1 className="font-serif text-4xl md:text-5xl text-[#F5E6D3] leading-tight mb-2">
            {primaFirst
              ? <>{mempelai1.namaPanggilan || mempelai1.namaLengkap || 'Nama Pria'}</>
              : <>{mempelai1.namaPanggilan || mempelai1.namaLengkap || 'Nama Wanita'}</>
            }
          </h1>
          <p className="text-[#C9A84C] text-2xl my-2 font-serif">&amp;</p>
          <h1 className="font-serif text-4xl md:text-5xl text-[#F5E6D3] leading-tight mb-6">
            {mempelai2.namaPanggilan || mempelai2.namaLengkap || (primaFirst ? 'Nama Wanita' : 'Nama Pria')}
          </h1>

          {firstAcara && (
            <p className="text-sm text-[#C9A84C] tracking-widest mb-8">
              {formatTanggal(firstAcara.tanggal)}
            </p>
          )}

          <button
            onClick={() => setOpened(true)}
            className="px-8 py-3 border border-[#C9A84C] text-[#C9A84C] text-sm uppercase tracking-[0.3em] hover:bg-[#C9A84C] hover:text-[#0D0A06] transition-all font-semibold"
          >
            Buka Undangan
          </button>

          <div className="text-[#C9A84C] text-4xl mt-6 opacity-70">✦ ✦ ✦</div>
        </div>
      )}

      {/* CONTENT */}
      {opened && (
        <div className="animate-fade-in">
          {/* Info Mempelai */}
          <Section>
            <SectionTitle>Mempelai</SectionTitle>
            <div className="space-y-10">
              {[mempelai1, mempelai2].map((m, i) => (
                <div key={i} className="text-center">
                  <div className="relative inline-block mb-4">
                    <div className="w-32 h-32 rounded-full border-2 border-[#C9A84C] overflow-hidden mx-auto">
                      {m.foto ? (
                        <img src={m.foto} alt={m.namaLengkap || ''} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ background: '#1A1209' }}>
                          <span className="text-[#C9A84C] text-4xl">♡</span>
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-px bg-[#C9A84C]" />
                  </div>
                  <h3 className="font-serif text-2xl text-[#C9A84C] mt-4">{m.namaLengkap || '—'}</h3>
                  {m.anakKe && (
                    <p className="text-sm opacity-70 mt-1">Putra/Putri ke-{m.anakKe}</p>
                  )}
                  {(m.ayah || m.ibu) && (
                    <p className="text-sm opacity-70 mt-1">
                      Putra/Putri dari {[m.ayah, m.ibu].filter(Boolean).join(' & ')}
                    </p>
                  )}
                  {m.instagram && (
                    <a
                      href={`https://instagram.com/${m.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-[#C9A84C] mt-2 hover:underline"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                      </svg>
                      {m.instagram}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </Section>

          {/* Countdown */}
          {countdownTarget && (
            <Section>
              <SectionTitle>Hitung Mundur</SectionTitle>
              <CountdownTimer
                targetDate={countdownTarget}
                numberStyle="text-5xl font-serif text-[#C9A84C]"
                labelStyle="text-xs uppercase tracking-widest text-[#F5E6D3] opacity-60 mt-1"
                containerStyle="flex justify-center gap-6"
              />
            </Section>
          )}

          {/* Detail Acara */}
          {data.acara.length > 0 && (
            <Section>
              <SectionTitle>Detail Acara</SectionTitle>
              <div className="space-y-6">
                {data.acara.map((acara, i) => (
                  <div key={i} className="border border-[#C9A84C]/30 p-6 rounded-sm">
                    <h3 className="font-serif text-xl text-[#C9A84C] mb-3 text-center">{acara.nama}</h3>
                    <div className="space-y-2 text-sm text-center">
                      <p className="opacity-80">{formatTanggal(acara.tanggal)}</p>
                      <p className="opacity-80">{acara.waktuMulai} – {acara.waktuSelesai} WIB</p>
                      <p className="font-semibold mt-2">{acara.lokasi}</p>
                      <p className="opacity-70">{acara.alamat}</p>
                      <GoogleMapsEmbed lokasi={acara.lokasi} alamat={acara.alamat} />
                      {acara.mapsUrl && (
                        <a
                          href={acara.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 mt-3 px-5 py-2 border border-[#C9A84C] text-[#C9A84C] text-xs uppercase tracking-widest hover:bg-[#C9A84C] hover:text-[#0D0A06] transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <Section>
              <SectionTitle>Galeri Foto</SectionTitle>
              <div className="grid grid-cols-2 gap-2">
                {data.galeri.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setLightboxImg(src)}
                    className="aspect-square overflow-hidden border border-[#C9A84C]/20 hover:border-[#C9A84C]/60 transition-colors"
                  >
                    <img src={src} alt={`Galeri ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </button>
                ))}
              </div>
            </Section>
          )}

          {/* Love Story */}
          {data.loveStory.length > 0 && (
            <Section>
              <SectionTitle>Love Story</SectionTitle>
              <div className="relative pl-8">
                <div className="absolute left-3 top-0 bottom-0 w-px bg-[#C9A84C]/30" />
                {data.loveStory.map((item, i) => (
                  <div key={i} className="relative mb-8">
                    <div className="absolute -left-5 top-1 w-3 h-3 rounded-full border-2 border-[#C9A84C] bg-[#0D0A06]" />
                    <p className="text-[#C9A84C] text-xs uppercase tracking-widest mb-1">{item.tahun}</p>
                    <h4 className="font-serif text-lg mb-2">{item.judul}</h4>
                    <p className="text-sm opacity-70 leading-relaxed">{item.cerita}</p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Quote */}
          {data.quote.teks && (
            <Section>
              <div className="border-l-2 border-[#C9A84C] pl-6 py-2">
                <p className="font-serif text-lg italic opacity-90 leading-relaxed">&ldquo;{data.quote.teks}&rdquo;</p>
                {data.quote.sumber && (
                  <p className="text-sm text-[#C9A84C] mt-3">— {data.quote.sumber}</p>
                )}
              </div>
            </Section>
          )}

          {/* Livestream */}
          {data.livestream.aktif && data.livestream.url && (
            <Section>
              <SectionTitle>Livestream</SectionTitle>
              <div className="text-center">
                <p className="opacity-70 text-sm mb-4">Saksikan momen spesial kami secara virtual</p>
                {data.livestream.platform && (
                  <p className="text-[#C9A84C] font-semibold mb-3">{data.livestream.platform}</p>
                )}
                <a
                  href={data.livestream.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#C9A84C] text-[#0D0A06] font-semibold text-sm uppercase tracking-widest hover:opacity-90 transition-opacity"
                >
                  Tonton Livestream
                </a>
              </div>
            </Section>
          )}

          {/* RSVP */}
          {data.rsvpAktif && (
            <Section>
              <SectionTitle>Konfirmasi Kehadiran</SectionTitle>
              <RsvpForm
                slug={slug}
                rsvps={rsvps}
                onSubmit={onRsvpSubmit}
                primaryColor={GOLD}
                className="text-[#F5E6D3]"
              />
            </Section>
          )}

          {/* Buku Tamu */}
          {data.guestbookAktif && (
            <Section>
              <SectionTitle>Buku Tamu</SectionTitle>
              <GuestbookForm
                guestbook={guestbook}
                onSubmit={onGuestbookSubmit}
                primaryColor={GOLD}
                guestName={guestName}
                className="text-[#F5E6D3]"
              />
            </Section>
          )}

          {/* Amplop Digital */}
          {data.amplopDigital.aktif && (
            <Section>
              <SectionTitle>Amplop Digital</SectionTitle>
              <p className="text-center text-sm opacity-70 mb-6">Doa dan hadiah tulus Anda sangat berarti bagi kami</p>
              <AmplopDigitalComponent amplop={data.amplopDigital} primaryColor={GOLD} />
            </Section>
          )}

          {/* Protokol Kesehatan */}
          {data.protokolKesehatan.aktif && (
            <Section>
              <SectionTitle>Protokol Kesehatan</SectionTitle>
              <div className="border border-[#C9A84C]/30 p-6 rounded-sm text-center">
                <p className="text-sm opacity-80 leading-relaxed">
                  {data.protokolKesehatan.catatan || 'Harap memperhatikan protokol kesehatan yang berlaku selama acara berlangsung.'}
                </p>
              </div>
            </Section>
          )}

          {/* Footer */}
          <footer className="py-12 px-6 text-center border-t border-[#C9A84C]/20">
            <p className="font-serif text-[#C9A84C] text-lg mb-2">
              {pria.namaPanggilan || pria.namaLengkap || 'Pria'} &amp; {wanita.namaPanggilan || wanita.namaLengkap || 'Wanita'}
            </p>
            <p className="text-xs opacity-40 tracking-widest uppercase">Terima kasih atas kehadiran Anda</p>
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
          <button
            className="absolute top-4 right-4 text-white text-3xl hover:opacity-70"
            onClick={() => setLightboxImg(null)}
          >
            ✕
          </button>
        </div>
      )}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
      `}</style>
    </div>
  );
}
