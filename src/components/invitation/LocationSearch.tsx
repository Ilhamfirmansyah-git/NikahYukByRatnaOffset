'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google: any;
    _gmapsLoading?: boolean;
    _gmapsLoaded?: boolean;
  }
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSelect: (data: { lokasi: string; alamat: string; mapsUrl: string }) => void;
  placeholder?: string;
  label?: string;
}

function loadGoogleMapsScript(apiKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window._gmapsLoaded) { resolve(); return; }
    if (window._gmapsLoading) {
      const poll = setInterval(() => {
        if (window._gmapsLoaded) { clearInterval(poll); resolve(); }
      }, 100);
      return;
    }
    window._gmapsLoading = true;
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.onload = () => { window._gmapsLoaded = true; resolve(); };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export default function LocationSearch({ value, onChange, onSelect, placeholder, label }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<unknown>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY;
    if (!apiKey) return;

    loadGoogleMapsScript(apiKey)
      .then(() => setReady(true))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!ready || !inputRef.current || autocompleteRef.current) return;

    const ac = new window.google.maps.places.Autocomplete(inputRef.current, {
      fields: ['name', 'formatted_address', 'url'],
      types: ['establishment', 'geocode'],
    });

    ac.addListener('place_changed', () => {
      const place = ac.getPlace();
      if (!place) return;
      onSelect({
        lokasi: place.name ?? '',
        alamat: place.formatted_address ?? '',
        mapsUrl: place.url ?? '',
      });
    });

    autocompleteRef.current = ac;
  }, [ready, onSelect]);

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder ?? 'Cari nama gedung atau masjid...'}
          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
        />
      </div>
    </div>
  );
}
