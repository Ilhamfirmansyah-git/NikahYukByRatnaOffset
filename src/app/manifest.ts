import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Nikah Yuk by Ratna Offset',
    short_name: 'Nikah Yuk',
    description: 'Undangan pernikahan online, simpel dan elegan',
    start_url: '/',
    display: 'standalone',
    background_color: '#FAF6ED',
    theme_color: '#7C5C3E',
    icons: [
      { src: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
      { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
