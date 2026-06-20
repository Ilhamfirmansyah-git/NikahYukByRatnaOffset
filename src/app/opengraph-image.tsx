import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Nikah Yuk by Ratna Offset — Undangan Pernikahan Online';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #FAF6ED 0%, #F5EDD8 50%, #EFE3C8 100%)',
          position: 'relative',
        }}
      >
        {/* Corner ornaments */}
        <div style={{ position: 'absolute', top: 24, left: 24, width: 60, height: 60, display: 'flex' }}>
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
            <path d="M0 0 Q30 0 30 30 Q30 0 60 0" stroke="#C9A057" strokeWidth="1.5" fill="none" opacity="0.6" />
            <circle cx="0" cy="0" r="4" fill="#C9A057" opacity="0.5" />
          </svg>
        </div>
        <div style={{ position: 'absolute', top: 24, right: 24, width: 60, height: 60, display: 'flex', transform: 'scaleX(-1)' }}>
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
            <path d="M0 0 Q30 0 30 30 Q30 0 60 0" stroke="#C9A057" strokeWidth="1.5" fill="none" opacity="0.6" />
            <circle cx="0" cy="0" r="4" fill="#C9A057" opacity="0.5" />
          </svg>
        </div>
        <div style={{ position: 'absolute', bottom: 24, left: 24, width: 60, height: 60, display: 'flex', transform: 'scaleY(-1)' }}>
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
            <path d="M0 0 Q30 0 30 30 Q30 0 60 0" stroke="#C9A057" strokeWidth="1.5" fill="none" opacity="0.6" />
            <circle cx="0" cy="0" r="4" fill="#C9A057" opacity="0.5" />
          </svg>
        </div>
        <div style={{ position: 'absolute', bottom: 24, right: 24, width: 60, height: 60, display: 'flex', transform: 'scale(-1, -1)' }}>
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
            <path d="M0 0 Q30 0 30 30 Q30 0 60 0" stroke="#C9A057" strokeWidth="1.5" fill="none" opacity="0.6" />
            <circle cx="0" cy="0" r="4" fill="#C9A057" opacity="0.5" />
          </svg>
        </div>

        {/* Border frame */}
        <div
          style={{
            position: 'absolute',
            inset: 40,
            border: '1px solid rgba(201,160,87,0.35)',
            borderRadius: 16,
          }}
        />

        {/* Gold divider top */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <div style={{ width: 80, height: 1, background: 'linear-gradient(90deg, transparent, #C9A057)' }} />
          <div style={{ width: 8, height: 8, background: '#C9A057', transform: 'rotate(45deg)' }} />
          <div style={{ width: 80, height: 1, background: 'linear-gradient(90deg, #C9A057, transparent)' }} />
        </div>

        {/* Brand name */}
        <div
          style={{
            fontSize: 20,
            color: '#C9A057',
            letterSpacing: 6,
            textTransform: 'uppercase',
            fontWeight: 400,
            marginBottom: 20,
          }}
        >
          NIKAH YUK
        </div>

        {/* Main headline */}
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: '#3D2B1F',
            textAlign: 'center',
            lineHeight: 1.2,
            maxWidth: 800,
            marginBottom: 16,
          }}
        >
          Undangan Pernikahan Digital
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 24,
            color: '#7C6355',
            textAlign: 'center',
            maxWidth: 680,
            lineHeight: 1.5,
            marginBottom: 32,
          }}
        >
          Simpel, elegan, dan mudah dibagikan kepada semua tamu
        </div>

        {/* Gold divider bottom */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
          <div style={{ width: 80, height: 1, background: 'linear-gradient(90deg, transparent, #C9A057)' }} />
          <div style={{ width: 8, height: 8, background: '#C9A057', transform: 'rotate(45deg)' }} />
          <div style={{ width: 80, height: 1, background: 'linear-gradient(90deg, #C9A057, transparent)' }} />
        </div>

        {/* URL badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(124,92,62,0.08)',
            border: '1px solid rgba(124,92,62,0.2)',
            borderRadius: 40,
            padding: '10px 24px',
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#7C5C3E' }} />
          <span style={{ fontSize: 18, color: '#7C5C3E', fontWeight: 500 }}>ratnaoffset.com</span>
        </div>

        {/* Ratna Offset credit */}
        <div style={{ position: 'absolute', bottom: 56, fontSize: 13, color: '#B09A88', letterSpacing: 3, textTransform: 'uppercase' }}>
          by Ratna Offset
        </div>
      </div>
    ),
    { ...size }
  );
}
