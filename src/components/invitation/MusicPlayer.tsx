'use client';

import { useState, useEffect, useRef } from 'react';

interface MusicPlayerProps {
  url: string;
  autoplay?: boolean;
  /** Primary icon/text color */
  color?: string;
  /** Button background color */
  bgColor?: string;
  /** Optional border color */
  borderColor?: string;
  /** Tailwind position classes — default 'fixed bottom-6 right-4 z-50' */
  positionClassName?: string;
}

function EqualizerBars({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill={color}>
      <rect x="2" y="4" width="3.5" height="12" rx="1.75">
        <animate attributeName="height" values="12;5;9;4;12" dur="1.1s" repeatCount="indefinite" />
        <animate attributeName="y" values="4;9.5;5.5;10;4" dur="1.1s" repeatCount="indefinite" />
      </rect>
      <rect x="8.25" y="2" width="3.5" height="16" rx="1.75">
        <animate attributeName="height" values="16;6;13;7;16" dur="0.85s" repeatCount="indefinite" />
        <animate attributeName="y" values="2;7;3.5;6.5;2" dur="0.85s" repeatCount="indefinite" />
      </rect>
      <rect x="14.5" y="5" width="3.5" height="10" rx="1.75">
        <animate attributeName="height" values="10;14;5;11;10" dur="1.0s" repeatCount="indefinite" />
        <animate attributeName="y" values="5;3;7.5;4.5;5" dur="1.0s" repeatCount="indefinite" />
      </rect>
    </svg>
  );
}

function MusicNoteIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={color}>
      <path d="M12 3v10.55A3.97 3.97 0 0 0 10 13c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
    </svg>
  );
}

export default function MusicPlayer({
  url,
  autoplay = false,
  color = '#ffffff',
  bgColor = 'rgba(30,30,30,0.85)',
  borderColor = 'rgba(255,255,255,0.15)',
  positionClassName = 'fixed bottom-6 right-4 z-50',
}: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !autoplay || started) return;
    audio.play()
      .then(() => { setIsPlaying(true); setStarted(true); })
      .catch(() => {});
  }, [autoplay, started]);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play()
        .then(() => { setIsPlaying(true); setStarted(true); })
        .catch(() => {});
    }
  }

  if (!url) return null;

  return (
    <>
      <audio ref={audioRef} src={url} loop preload="none" />

      <div className={`${positionClassName} flex flex-col items-center gap-1`} style={{ userSelect: 'none' }}>
        {/* Pulsing ring — visible only while playing */}
        <div className="relative">
          {isPlaying && (
            <>
              <span style={{
                position: 'absolute', inset: -4, borderRadius: '50%',
                border: `2px solid ${color}`,
                opacity: 0,
                animation: 'musicRing 1.6s ease-out infinite',
              }} />
              <span style={{
                position: 'absolute', inset: -4, borderRadius: '50%',
                border: `2px solid ${color}`,
                opacity: 0,
                animation: 'musicRing 1.6s ease-out infinite 0.8s',
              }} />
            </>
          )}

          <button
            onClick={toggle}
            aria-label={isPlaying ? 'Jeda musik' : 'Putar musik'}
            style={{
              position: 'relative',
              width: 40, height: 40,
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: bgColor,
              border: `1.5px solid ${borderColor}`,
              backdropFilter: 'blur(12px)',
              boxShadow: `0 4px 16px rgba(0,0,0,0.3), 0 0 0 ${isPlaying ? '2px' : '0px'} ${color}40`,
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.3s',
              outline: 'none',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.12)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
          >
            {isPlaying
              ? <EqualizerBars color={color} />
              : <MusicNoteIcon color={color} />
            }
          </button>
        </div>

      </div>

      <style>{`
        @keyframes musicRing {
          0%   { transform: scale(1); opacity: 0.55; }
          100% { transform: scale(2.2); opacity: 0; }
        }
      `}</style>
    </>
  );
}
