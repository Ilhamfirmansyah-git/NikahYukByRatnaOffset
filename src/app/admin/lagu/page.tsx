'use client';

import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { supabaseBrowser } from '@/lib/supabase-client';

interface Song {
  id: string;
  title: string;
  artist: string;
  category: string;
  url: string;
  filename: string;
  isActive: boolean;
  createdAt: string;
}

const CATEGORIES = ['Romantis', 'Klasik', 'Melankolis', 'Ceria', 'Islami', 'Pernikahan', 'Tradisional'];

const CATEGORY_COLOR: Record<string, string> = {
  Romantis: 'bg-pink-100 text-pink-700',
  Klasik: 'bg-purple-100 text-purple-700',
  Melankolis: 'bg-blue-100 text-blue-700',
  Ceria: 'bg-yellow-100 text-yellow-700',
  Islami: 'bg-green-100 text-green-700',
  Pernikahan: 'bg-orange-100 text-orange-700',
  Tradisional: 'bg-red-100 text-red-700',
};

export default function AdminLaguPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [category, setCategory] = useState('Romantis');
  const [file, setFile] = useState<File | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function loadSongs() {
    try {
      const res = await fetch('/api/admin/songs');
      const data = await res.json();
      setSongs(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Gagal memuat lagu');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadSongs(); }, []);

  async function handleUpload() {
    if (!title.trim() || !artist.trim() || !file) {
      toast.error('Judul, artis, dan file wajib diisi');
      return;
    }

    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Ukuran file maksimal 50MB');
      return;
    }

    const allowedExts = /\.(mp3|ogg|wav|aac|m4a)$/i;
    if (!allowedExts.test(file.name)) {
      toast.error('Format file tidak didukung. Gunakan MP3, OGG, WAV, atau M4A.');
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split('.').pop() ?? 'mp3';
      const filename = `${Date.now()}-${title.trim().toLowerCase().replace(/\s+/g, '-')}.${ext}`;

      // Step 1: Get signed upload URL from server
      const presignRes = await fetch('/api/admin/songs/presign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename, contentType: file.type || 'audio/mpeg' }),
      });
      const presignData = await presignRes.json();
      if (!presignRes.ok) throw new Error(presignData.error ?? 'Gagal membuat signed URL');

      const { signedUrl, token, path } = presignData;

      // Step 2: Upload directly to Supabase (bypasses Vercel body limit)
      const { error: uploadError } = await supabaseBrowser.storage
        .from('music')
        .uploadToSignedUrl(path, token, file, { contentType: file.type || 'audio/mpeg' });
      if (uploadError) throw new Error('Gagal mengunggah: ' + uploadError.message);

      // Step 3: Get public URL and register in DB
      const { data: urlData } = supabaseBrowser.storage.from('music').getPublicUrl(path);
      const publicUrl = urlData.publicUrl;

      const res = await fetch('/api/admin/songs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), artist: artist.trim(), category, url: publicUrl, filename: path }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error ?? 'Gagal menyimpan data lagu');

      toast.success('Lagu berhasil ditambahkan!');
      setSongs(prev => [result, ...prev]);
      setTitle('');
      setArtist('');
      setCategory('Romantis');
      setFile(null);
      if (fileRef.current) fileRef.current.value = '';
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Gagal upload lagu');
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(song: Song) {
    if (!confirm(`Hapus lagu "${song.title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/songs/${song.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal menghapus');
      setSongs(prev => prev.filter(s => s.id !== song.id));
      toast.success('Lagu dihapus');
    } catch {
      toast.error('Gagal menghapus lagu');
    }
  }

  async function handleToggle(song: Song) {
    try {
      const res = await fetch(`/api/admin/songs/${song.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !song.isActive }),
      });
      const updated = await res.json();
      setSongs(prev => prev.map(s => s.id === song.id ? updated : s));
    } catch {
      toast.error('Gagal mengubah status');
    }
  }

  function togglePlay(song: Song) {
    if (playingId === song.id) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }
    audioRef.current?.pause();
    const audio = new Audio(song.url);
    audioRef.current = audio;
    audio.play().catch(() => toast.error('Gagal memutar lagu'));
    setPlayingId(song.id);
    audio.addEventListener('ended', () => setPlayingId(null));
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Manajemen Lagu</h1>
        <p className="text-gray-500 mt-1">Upload dan kelola lagu untuk undangan digital.</p>
      </div>

      {/* Upload form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Upload Lagu Baru</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Judul Lagu</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Canon in D"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Artis / Komposer</label>
            <input
              type="text"
              value={artist}
              onChange={e => setArtist(e.target.value)}
              placeholder="Pachelbel"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Kategori</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm bg-white"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">File Audio</label>
            <input
              ref={fileRef}
              type="file"
              accept="audio/mpeg,audio/mp3,audio/ogg,audio/wav,audio/aac,audio/m4a,.mp3,.ogg,.wav,.aac,.m4a"
              onChange={e => setFile(e.target.files?.[0] ?? null)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm"
            />
            {file && <p className="text-xs text-gray-400 mt-1">{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</p>}
          </div>
        </div>
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="flex items-center gap-2 bg-gray-900 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {uploading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Mengunggah...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Upload Lagu
            </>
          )}
        </button>
        <p className="text-xs text-gray-400 mt-2">Format: MP3, OGG, WAV, M4A. Maks 20MB.</p>
      </div>

      {/* Song list */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Daftar Lagu <span className="text-gray-400 font-normal">({songs.length})</span></h2>
        </div>

        {loading ? (
          <div className="p-16 text-center">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto" />
          </div>
        ) : songs.length === 0 ? (
          <div className="p-16 text-center text-gray-400 text-sm">Belum ada lagu. Upload lagu pertama di atas.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {songs.map(song => (
              <div key={song.id} className="flex items-center gap-4 p-4">
                {/* Play button */}
                <button
                  onClick={() => togglePlay(song)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                    playingId === song.id ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {playingId === song.id ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm">{song.title}</p>
                  <p className="text-xs text-gray-400">{song.artist}</p>
                </div>

                {/* Category badge */}
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${CATEGORY_COLOR[song.category] ?? 'bg-gray-100 text-gray-600'}`}>
                  {song.category}
                </span>

                {/* Active toggle */}
                <label className="flex items-center gap-2 cursor-pointer flex-shrink-0">
                  <div className="relative">
                    <input type="checkbox" className="sr-only" checked={song.isActive} onChange={() => handleToggle(song)} />
                    <div className={`w-9 h-5 rounded-full transition-colors ${song.isActive ? 'bg-green-500' : 'bg-gray-200'}`} />
                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${song.isActive ? 'translate-x-4' : 'translate-x-0'}`} />
                  </div>
                  <span className="text-xs text-gray-500">{song.isActive ? 'Aktif' : 'Nonaktif'}</span>
                </label>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(song)}
                  className="text-xs text-red-400 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors flex-shrink-0"
                >
                  Hapus
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
