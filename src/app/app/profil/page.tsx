'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface UserProfile {
  name: string | null;
  email: string;
}

export default function ProfilPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Name form
  const [name, setName] = useState('');
  const [savingName, setSavingName] = useState(false);

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    fetch('/api/user/profile')
      .then(res => res.json())
      .then((data: UserProfile) => {
        setProfile(data);
        setName(data.name ?? '');
      })
      .catch(() => toast.error('Gagal memuat profil'))
      .finally(() => setLoading(false));
  }, []);

  async function handleSaveName(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { toast.error('Nama tidak boleh kosong'); return; }
    setSavingName(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Gagal menyimpan');
      setProfile(prev => prev ? { ...prev, name: data.name } : prev);
      toast.success('Nama berhasil diperbarui!');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Gagal menyimpan nama');
    } finally {
      setSavingName(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Semua field harus diisi');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('Password baru minimal 8 karakter');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Konfirmasi password tidak cocok');
      return;
    }
    setSavingPassword(true);
    try {
      const res = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Gagal mengubah password');
      toast.success('Password berhasil diubah!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Gagal mengubah password');
    } finally {
      setSavingPassword(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-semibold text-gray-900">Profil Saya</h1>
        <p className="text-gray-500 mt-1">Kelola informasi akun Anda.</p>
      </div>

      <div className="max-w-xl space-y-6">
        {/* Account info card */}
        <div className="bg-white rounded-xl border border-cream-200 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-primary text-xl font-bold">
                {(profile?.name ?? profile?.email ?? 'U')[0].toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">{profile?.name ?? 'Pengguna'}</p>
              <p className="text-sm text-gray-500">{profile?.email}</p>
            </div>
          </div>

          <form onSubmit={handleSaveName} className="space-y-4">
            <h2 className="font-semibold text-gray-900">Perbarui Nama</h2>
            <Input
              label="Nama Lengkap"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Nama Anda"
            />
            <Input
              label="Email"
              value={profile?.email ?? ''}
              disabled
              helperText="Email tidak dapat diubah"
            />
            <Button type="submit" loading={savingName}>
              Simpan Nama
            </Button>
          </form>
        </div>

        {/* Change password card */}
        <div className="bg-white rounded-xl border border-cream-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Ubah Password</h2>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <Input
              label="Password Lama"
              type="password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              placeholder="Masukkan password lama"
              autoComplete="current-password"
            />
            <Input
              label="Password Baru"
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="Minimal 8 karakter"
              autoComplete="new-password"
              helperText="Minimal 8 karakter"
            />
            <Input
              label="Konfirmasi Password Baru"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Ulangi password baru"
              autoComplete="new-password"
            />
            <Button type="submit" loading={savingPassword}>
              Ubah Password
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
