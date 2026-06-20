'use client';

import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  className?: string;
  label?: string;
}

export default function ImageUpload({ value, onChange, className, label }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 10MB');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      // Get cloudName + uploadPreset from server
      const configRes = await fetch('/api/upload');
      if (!configRes.ok) {
        const d = await configRes.json();
        throw new Error(d.error ?? 'Gagal mendapatkan konfigurasi upload');
      }
      const { cloudName, uploadPreset } = await configRes.json();

      if (!uploadPreset) {
        throw new Error('Upload preset belum dikonfigurasi. Tambahkan CLOUDINARY_UPLOAD_PRESET di Vercel.');
      }

      // Upload file directly from browser to Cloudinary (unsigned)
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);
      formData.append('folder', 'nikahyuk');

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: 'POST', body: formData }
      );

      const result = await uploadRes.json();

      if (!uploadRes.ok) {
        throw new Error(result?.error?.message ?? 'Upload ke Cloudinary gagal');
      }

      onChange(result.secure_url);
      setError(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Upload gagal, coba lagi';
      setError(msg);
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div className={cn('w-full min-h-[120px] flex flex-col', className)}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}
      <div className="flex-1" onDrop={handleDrop} onDragOver={e => e.preventDefault()}>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
        {value ? (
          <div className="relative group h-full min-h-[120px]">
            <img
              src={value}
              alt="Uploaded"
              className="w-full h-full min-h-[120px] object-cover rounded-xl border border-cream-200"
              onError={e => { (e.target as HTMLImageElement).src = '/placeholder-image.jpg'; }}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="bg-white text-gray-800 text-xs px-3 py-1.5 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Ganti Foto
              </button>
              <button
                type="button"
                onClick={() => onChange('')}
                className="bg-red-500 text-white text-xs px-3 py-1.5 rounded-lg font-medium hover:bg-red-600 transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className={cn(
              'w-full h-full min-h-[120px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-1.5 transition-colors disabled:opacity-60 disabled:cursor-not-allowed',
              error
                ? 'border-red-300 bg-red-50 hover:border-red-400'
                : 'border-cream-300 hover:border-primary hover:bg-cream-50'
            )}
          >
            {uploading ? (
              <>
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-gray-500">Mengupload...</span>
              </>
            ) : error ? (
              <>
                <svg className="w-7 h-7 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs text-red-600 font-medium px-2 text-center leading-tight">{error}</span>
                <span className="text-xs text-red-400">Coba lagi</span>
              </>
            ) : (
              <>
                <svg className="w-7 h-7 text-primary/40 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs text-gray-500 text-center px-2 leading-tight">Klik atau seret foto ke sini</span>
                <span className="text-xs text-gray-400">PNG, JPG, WebP · maks. 10MB</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
