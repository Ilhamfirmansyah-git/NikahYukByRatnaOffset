'use client';

interface Props {
  lokasi: string;
  alamat?: string;
  className?: string;
}

export default function GoogleMapsEmbed({ lokasi, alamat, className }: Props) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY;
  if (!apiKey || !lokasi) return null;

  const q = encodeURIComponent([lokasi, alamat].filter(Boolean).join(', '));

  return (
    <div className={`w-full rounded-xl overflow-hidden mt-3 ${className ?? ''}`}>
      <iframe
        src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${q}`}
        width="100%"
        height="200"
        style={{ border: 0, display: 'block' }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}
