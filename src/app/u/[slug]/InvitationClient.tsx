'use client';

import { useState, useCallback } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { TEMPLATE_REGISTRY } from '@/components/templates/registry';
import { InvitationData } from '@/types/invitation';

interface RsvpEntry {
  id: string;
  name: string;
  attendance: string;
  guestCount: number;
  createdAt: string;
}

interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  createdAt: string;
}

interface InvitationClientProps {
  invitation: {
    id: string;
    slug: string;
    data: unknown;
    template: { componentKey: string; name: string };
    rsvps: RsvpEntry[];
    guestbook: GuestbookEntry[];
  };
  guestName: string;
}

export default function InvitationClient({ invitation, guestName }: InvitationClientProps) {
  const [rsvps, setRsvps] = useState<RsvpEntry[]>(invitation.rsvps);
  const [guestbook, setGuestbook] = useState<GuestbookEntry[]>(invitation.guestbook);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const TemplateComponent = TEMPLATE_REGISTRY[invitation.template.componentKey];

  const handleRsvpSubmit = useCallback(async (formData: {
    name: string;
    attendance: 'HADIR' | 'TIDAK_HADIR' | 'RAGU';
    guestCount: number;
  }) => {
    const recaptchaToken = await executeRecaptcha?.('rsvp_submit');
    const res = await fetch(`/api/u/${invitation.slug}/rsvp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, recaptchaToken }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Gagal mengirim RSVP');
    }
    const saved = await res.json();
    const newEntry: RsvpEntry = {
      id: saved.id,
      name: formData.name,
      attendance: formData.attendance,
      guestCount: formData.guestCount,
      createdAt: new Date().toISOString(),
    };
    setRsvps(prev => [newEntry, ...prev]);
  }, [invitation.slug, executeRecaptcha]);

  const handleGuestbookSubmit = useCallback(async (formData: { name: string; message: string }) => {
    const recaptchaToken = await executeRecaptcha?.('guestbook_submit');
    const res = await fetch(`/api/u/${invitation.slug}/guestbook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, recaptchaToken }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Gagal mengirim pesan');
    }
    const saved = await res.json();
    const newEntry: GuestbookEntry = {
      id: saved.id,
      name: formData.name,
      message: formData.message,
      createdAt: new Date().toISOString(),
    };
    setGuestbook(prev => [newEntry, ...prev]);
  }, [invitation.slug, executeRecaptcha]);

  if (!TemplateComponent) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-6">
        <div>
          <p className="text-gray-500 text-lg mb-2">Template tidak ditemukan</p>
          <p className="text-gray-400 text-sm">componentKey: {invitation.template.componentKey}</p>
        </div>
      </div>
    );
  }

  const invitationData = invitation.data as InvitationData;

  return (
    <TemplateComponent
      data={invitationData}
      guestName={guestName}
      slug={invitation.slug}
      onRsvpSubmit={handleRsvpSubmit}
      onGuestbookSubmit={handleGuestbookSubmit}
      rsvps={rsvps}
      guestbook={guestbook}
    />
  );
}
