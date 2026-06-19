'use client';

import { useState } from 'react';
import { TemplateProps } from './TemplateProps';
import CountdownTimer from '@/components/invitation/CountdownTimer';
import MusicPlayer from '@/components/invitation/MusicPlayer';
import RsvpForm from '@/components/invitation/RsvpForm';
import GuestbookForm from '@/components/invitation/GuestbookForm';
import AmplopDigitalComponent from '@/components/invitation/AmplopDigital';
import ShareButton from '@/components/invitation/ShareButton';

const PRIMARY = '#374151'; // gray-700
const ACCENT = '#6B7280'; // gray-500

function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`py-16 px-6 max-w-lg mx-auto w-full ${className}`}>
      {children}
    </section>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <div className="w-8 h-0.5 bg-gray-300 mb-4" />
      <h2 className="text-xs uppercase tracking-[0.3em] text-gray-400 font-medium">{children}</h2>
    </div>
  );
}

export default function MinimalisPutih({ data, guestName, slug, onRsvpSubmit, onGuestbookSubmit, rsvps, guestbook }: TemplateProps) {
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
    <div className="relative min-h-screen bg-white text-gray-800" style={{ fontFamily: 'Inter, sans-serif' }}>
      {data.musik.url && (
        <MusicPlayer
          url={data.musik.url}
          autoplay={data.musik.autoplay}
          color="#8B5E3C"
          bgColor="rgba(255,255,255,0.92)"
          borderColor="rgba(139,94,60,0.25)"
          positionClassName="fixed bottom-6 right-4 z-50"
        />
      )}

      <ShareButton
        slug={slug}
        pria={pria.namaPanggilan || pria.namaLengkap}
        wanita={wanita.namaPanggilan || wanita.namaLengkap}
        primaryColor="#374151"
      />

      {/* COVER */}
      {!opened && (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center text-center px-8 bg-white">
          <div className="max-w-sm w-full">
            {guestName && (
              <div className="mb-8 pb-8 border-b border-gray-100">
                <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-2">Kepada Yth.</p>
                <p className="text-gray-700 font-medium text-lg">{guestName}</p>
              </div>
            )}

            <p className="text-xs uppercase tracking-[0.4em] text-gray-400 mb-6">Undangan Pernikahan</p>

            <h1 className="text-5xl font-light text-gray-800 mb-3 leading-tight">
              {mempelai1.namaPanggilan || mempelai1.namaLengkap || (primaFirst ? 'Nama Pria' : 'Nama Wanita')}
            </h1>
            <p className="text-2xl text-gray-400 my-3 font-extralight">&amp;</p>
            <h1 className="text-5xl font-light text-gray-800 mb-8 leading-tight">
              {mempelai2.namaPanggilan || mempelai2.namaLengkap || (primaFirst ? 'Nama Wanita' : 'Nama Pria')}
            </h1>

            {firstAcara && (
              <p className="text-sm text-gray-400 mb-10 tracking-wide">
                {formatTanggal(firstAcara.tanggal)}
              </p>
            )}

            <button
              onClick={() => setOpened(true)}
              className="px-8 py-3 bg-gray-800 text-white text-xs uppercase tracking-[0.3em] hover:bg-gray-700 transition-colors"
            >
              Buka Undangan
            </button>
          </div>
        </div>
      )}

      {/* CONTENT */}
      {opened && (
        <div className="animate-fade-in">
          {/* Mempelai */}
          <Section>
            <SectionTitle>Mempelai</SectionTitle>
            <div className="space-y-12">
              {[mempelai1, mempelai2].map((m, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
                    {m.foto ? (
                      <img src={m.foto} alt={m.namaLengkap || ''} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <span className="text-gray-400 text-3xl">♡</span>
                      </div>
                    )}
                  </div>
                  <div className="pt-1">
                    <h3 className="text-xl font-medium text-gray-800 mb-1">{m.namaLengkap || '—'}</h3>
                    {m.anakKe && (
                      <p className="text-sm text-gray-500 mb-0.5">Anak ke-{m.anakKe}</p>
                    )}
                    {(m.ayah || m.ibu) && (
                      <p className="text-sm text-gray-500 mb-1">
                        Dari {[m.ayah, m.ibu].filter(Boolean).join(' & ')}
                      </p>
                    )}
                    {m.instagram && (
                      <a
                        href={`https://instagram.com/${m.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {m.instagram}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <div className="h-px bg-gray-100 mx-6" />

          {/* Countdown */}
          {countdownTarget && (
            <Section>
              <SectionTitle>Hitung Mundur</SectionTitle>
              <CountdownTimer
                targetDate={countdownTarget}
                numberStyle="text-4xl font-extralight text-gray-800"
                labelStyle="text-xs uppercase tracking-widest text-gray-400 mt-1"
                containerStyle="flex justify-start gap-8"
              />
            </Section>
          )}

          <div className="h-px bg-gray-100 mx-6" />

          {/* Acara */}
          {data.acara.length > 0 && (
            <Section>
              <SectionTitle>Detail Acara</SectionTitle>
              <div className="space-y-8">
                {data.acara.map((acara, i) => (
                  <div key={i}>
                    <h3 className="text-lg font-medium text-gray-800 mb-3">{acara.nama}</h3>
                    <div className="space-y-1 text-sm text-gray-500">
                      <p>{formatTanggal(acara.tanggal)}</p>
                      <p>{acara.waktuMulai} – {acara.waktuSelesai} WIB</p>
                      <p className="text-gray-700 font-medium mt-2">{acara.lokasi}</p>
                      <p>{acara.alamat}</p>
                    </div>
                    {acara.mapsUrl && (
                      <a
                        href={acara.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-3 text-sm text-gray-600 underline underline-offset-2 hover:text-gray-800"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Buka di Google Maps
                      </a>
                    )}
                    {i < data.acara.length - 1 && <div className="mt-6 h-px bg-gray-100" />}
                  </div>
                ))}
              </div>
            </Section>
          )}

          <div className="h-px bg-gray-100 mx-6" />

          {/* Galeri */}
          {data.galeri.length > 0 && (
            <Section>
              <SectionTitle>Galeri</SectionTitle>
              <div className="grid grid-cols-3 gap-1">
                {data.galeri.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setLightboxImg(src)}
                    className="aspect-square overflow-hidden bg-gray-100 hover:opacity-90 transition-opacity"
                  >
                    <img src={src} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </Section>
          )}

          <div className="h-px bg-gray-100 mx-6" />

          {/* Love Story */}
          {data.loveStory.length > 0 && (
            <Section>
              <SectionTitle>Our Story</SectionTitle>
              <div className="space-y-8">
                {data.loveStory.map((item, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="flex-shrink-0">
                      <p className="text-xs text-gray-400 w-12">{item.tahun}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-1">{item.judul}</h4>
                      <p className="text-sm text-gray-500 leading-relaxed">{item.cerita}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Quote */}
          {data.quote.teks && (
            <Section className="text-center">
              <p className="text-xl font-light text-gray-600 italic leading-relaxed">&ldquo;{data.quote.teks}&rdquo;</p>
              {data.quote.sumber && (
                <p className="text-sm text-gray-400 mt-4">— {data.quote.sumber}</p>
              )}
            </Section>
          )}

          <div className="h-px bg-gray-100 mx-6" />

          {/* Livestream */}
          {data.livestream.aktif && data.livestream.url && (
            <Section>
              <SectionTitle>Livestream</SectionTitle>
              <p className="text-sm text-gray-500 mb-4">Saksikan momen bahagia kami secara online</p>
              {data.livestream.platform && (
                <p className="text-sm font-medium text-gray-700 mb-3">{data.livestream.platform}</p>
              )}
              <a
                href={data.livestream.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 text-white text-sm hover:bg-gray-700 transition-colors"
              >
                Tonton Livestream
              </a>
            </Section>
          )}

          {/* RSVP */}
          {data.rsvpAktif && (
            <Section className="bg-gray-50">
              <SectionTitle>Konfirmasi Kehadiran</SectionTitle>
              <RsvpForm
                slug={slug}
                rsvps={rsvps}
                onSubmit={onRsvpSubmit}
                primaryColor={PRIMARY}
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
                primaryColor={PRIMARY}
                guestName={guestName}
              />
            </Section>
          )}

          <div className="h-px bg-gray-100 mx-6" />

          {/* Amplop Digital */}
          {data.amplopDigital.aktif && (
            <Section>
              <SectionTitle>Amplop Digital</SectionTitle>
              <p className="text-sm text-gray-500 mb-6">Hadiah dan doa Anda adalah kebahagiaan kami</p>
              <AmplopDigitalComponent amplop={data.amplopDigital} primaryColor={PRIMARY} />
            </Section>
          )}

          {/* Protokol Kesehatan */}
          {data.protokolKesehatan.aktif && (
            <Section className="bg-gray-50">
              <SectionTitle>Protokol Kesehatan</SectionTitle>
              <p className="text-sm text-gray-600 leading-relaxed">
                {data.protokolKesehatan.catatan || 'Demi kenyamanan bersama, mohon memperhatikan protokol kesehatan yang berlaku.'}
              </p>
            </Section>
          )}

          <footer className="py-12 px-6 text-center border-t border-gray-100">
            <p className="text-gray-800 text-lg font-light mb-2">
              {pria.namaPanggilan || pria.namaLengkap || 'Pria'} &amp; {wanita.namaPanggilan || wanita.namaLengkap || 'Wanita'}
            </p>
            <p className="text-xs text-gray-400 tracking-widest uppercase">Terima kasih</p>
          </footer>
        </div>
      )}

      {/* Lightbox */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightboxImg(null)}
        >
          <img src={lightboxImg} alt="Lightbox" className="max-w-full max-h-full object-contain" />
          <button className="absolute top-4 right-4 text-white text-2xl" onClick={() => setLightboxImg(null)}>✕</button>
        </div>
      )}
    </div>
  );
}
