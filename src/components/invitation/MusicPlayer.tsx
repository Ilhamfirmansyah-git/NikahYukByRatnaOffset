'use client';

import { useState, useEffect, useRef } from 'react';

interface MusicPlayerProps {
  url: string;
  autoplay?: boolean;
  buttonClassName?: string;
}

export default function MusicPlayer({ url, autoplay = false, buttonClassName }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (autoplay && !started) {
      audio.play().then(() => {
        setIsPlaying(true);
        setStarted(true);
      }).catch(() => {
        // Autoplay blocked by browser
      });
    }
  }, [autoplay, started]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
        setStarted(true);
      }).catch(() => {});
    }
  };

  if (!url) return null;

  return (
    <>
      <audio ref={audioRef} src={url} loop preload="none" />
      <button
        onClick={toggle}
        aria-label={isPlaying ? 'Jeda musik' : 'Putar musik'}
        className={
          buttonClassName ||
          'fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-gray-700 hover:scale-110 transition-transform border border-gray-200'
        }
      >
        {isPlaying ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
    </>
  );
}
