'use client';

import { useRef, useState, useEffect } from 'react';
import type { Musik } from '@/types/invitation';

const DEFAULT_SONGS = [
  {
    id: 'romantic',
    title: 'Romantic',
    artist: 'Bensound',
    category: 'Romantis',
    categoryColor: 'bg-pink-100 text-pink-700',
    url: 'https://www.bensound.com/bensound-music/bensound-romantic.mp3',
  },
  {
    id: 'tenderness',
    title: 'Tenderness',
    artist: 'Bensound',
    category: 'Klasik',
    categoryColor: 'bg-purple-100 text-purple-700',
    url: 'https://www.bensound.com/bensound-music/bensound-tenderness.mp3',
  },
  {
    id: 'love',
    title: 'Love',
    artist: 'Bensound',
    category: 'Romantis',
    categoryColor: 'bg-pink-100 text-pink-700',
    url: 'https://www.bensound.com/bensound-music/bensound-love.mp3',
  },
  {
    id: 'slowmotion',
    title: 'Slow Motion',
    artist: 'Bensound',
    category: 'Romantis',
    categoryColor: 'bg-pink-100 text-pink-700',
    url: 'https://www.bensound.com/bensound-music/bensound-slowmotion.mp3',
  },
  {
    id: 'memories',
    title: 'Memories',
    artist: 'Bensound',
    category: 'Melankolis',
    categoryColor: 'bg-blue-100 text-blue-700',
    url: 'https://www.bensound.com/bensound-music/bensound-memories.mp3',
  },
  {
    id: 'dreams',
    title: 'Dreams',
    artist: 'Bensound',
    category: 'Romantis',
    categoryColor: 'bg-pink-100 text-pink-700',
    url: 'https://www.bensound.com/bensound-music/bensound-dreams.mp3',
  },
  {
    id: 'ukulele',
    title: 'Ukulele',
    artist: 'Bensound',
    category: 'Ceria',
    categoryColor: 'bg-yellow-100 text-yellow-700',
    url: 'https://www.bensound.com/bensound-music/bensound-ukulele.mp3',
  },
  {
    id: 'sunny',
    title: 'Sunny',
    artist: 'Bensound',
    category: 'Ceria',
    categoryColor: 'bg-yellow-100 text-yellow-700',
    url: 'https://www.bensound.com/bensound-music/bensound-sunny.mp3',
  },
];

interface MusicPickerProps {
  value: Musik;
  onChange: (v: Musik) => void;
}

export default function MusicPicker({ value, onChange }: MusicPickerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const matchingPreset = DEFAULT_SONGS.find(s => s.url === value.url);
  const isCustom = !!value.url && !matchingPreset;
  const selectedPresetId = matchingPreset?.id ?? null;

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  function stopPreview() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setPlayingId(null);
  }

  function togglePreview(e: React.MouseEvent, song: (typeof DEFAULT_SONGS)[0]) {
    e.stopPropagation();
    if (playingId === song.id) {
      stopPreview();
      return;
    }
    stopPreview();
    const audio = new Audio(song.url);
    audioRef.current = audio;
    setPlayingId(song.id);
    audio.play().catch(() => {});
    audio.addEventListener('ended', () => setPlayingId(null));
  }

  function selectSong(song: (typeof DEFAULT_SONGS)[0]) {
    stopPreview();
    onChange({ ...value, url: song.url, judul: `${song.title} — ${song.artist}` });
  }

  function selectCustom() {
    stopPreview();
    if (!isCustom) {
      onChange({ ...value, url: '', judul: '' });
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {DEFAULT_SONGS.map(song => {
          const isSelected = selectedPresetId === song.id;
          const isPlaying = playingId === song.id;
          return (
            <button
              key={song.id}
              type="button"
              onClick={() => selectSong(song)}
              className={`relative text-left p-3 rounded-xl border-2 transition-all ${
                isSelected
                  ? 'border-primary bg-primary-50'
                  : 'border-cream-200 bg-white hover:border-primary/40 hover:bg-cream-50'
              }`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
              <div className="w-8 h-8 bg-cream-100 rounded-lg flex items-center justify-center mb-2">
                <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
              </div>
              <p className="font-semibold text-gray-900 text-xs leading-tight truncate pr-4">{song.title}</p>
              <p className="text-xs text-gray-400 mt-0.5 truncate">{song.artist}</p>
              <div className="flex items-center justify-between mt-2">
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${song.categoryColor}`}>
                  {song.category}
                </span>
                <button
                  type="button"
                  onClick={e => togglePreview(e, song)}
                  title={isPlaying ? 'Stop preview' : 'Preview lagu'}
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors flex-shrink-0 ${
                    isPlaying ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {isPlaying ? (
                    <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                  ) : (
                    <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </button>
          );
        })}

        {/* Custom URL option */}
        <button
          type="button"
          onClick={selectCustom}
          className={`relative text-left p-3 rounded-xl border-2 transition-all ${
            isCustom
              ? 'border-primary bg-primary-50'
              : 'border-dashed border-cream-300 bg-white hover:border-primary/40 hover:bg-cream-50'
          }`}
        >
          {isCustom && (
            <div className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
              <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
          <div className="w-8 h-8 bg-cream-100 rounded-lg flex items-center justify-center mb-2">
            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <p className="font-semibold text-gray-900 text-xs leading-tight">URL Sendiri</p>
          <p className="text-xs text-gray-400 mt-0.5">Link MP3 custom</p>
          <div className="mt-2">
            <span className="text-xs px-1.5 py-0.5 rounded-full font-medium bg-gray-100 text-gray-600">Custom</span>
          </div>
        </button>
      </div>

      {/* Custom URL inputs */}
      {isCustom && (
        <div className="space-y-3 p-4 bg-cream-50 rounded-xl border border-cream-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">URL Musik (MP3)</label>
            <input
              type="url"
              value={value.url ?? ''}
              onChange={e => onChange({ ...value, url: e.target.value })}
              placeholder="https://example.com/lagu.mp3"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Judul Lagu</label>
            <input
              type="text"
              value={value.judul ?? ''}
              onChange={e => onChange({ ...value, judul: e.target.value })}
              placeholder="Nama Lagu — Penyanyi"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm"
            />
          </div>
        </div>
      )}

      {/* Preset selected: show judul */}
      {selectedPresetId && !isCustom && (
        <div className="flex items-center gap-2 px-3 py-2 bg-cream-50 rounded-lg border border-cream-200">
          <svg className="w-3.5 h-3.5 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
          </svg>
          <span className="text-sm text-gray-700 truncate">{value.judul}</span>
        </div>
      )}

      {/* Autoplay toggle */}
      <label className="flex items-center gap-3 cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            className="sr-only"
            checked={value.autoplay}
            onChange={e => onChange({ ...value, autoplay: e.target.checked })}
          />
          <div className={`w-11 h-6 rounded-full transition-colors ${value.autoplay ? 'bg-primary' : 'bg-gray-200'}`} />
          <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${value.autoplay ? 'translate-x-5' : 'translate-x-0'}`} />
        </div>
        <span className="text-sm text-gray-700">Putar otomatis saat undangan dibuka</span>
      </label>

      <p className="text-xs text-gray-400">
        Lagu default dari{' '}
        <a href="https://www.bensound.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">
          Bensound.com
        </a>{' '}
        — bebas digunakan dengan atribusi.
      </p>
    </div>
  );
}
