import { InvitationData } from '@/types/invitation';

export interface TemplateProps {
  data: InvitationData;
  guestName?: string;
  slug: string;
  onRsvpSubmit: (data: {
    name: string;
    attendance: 'HADIR' | 'TIDAK_HADIR' | 'RAGU';
    guestCount: number;
  }) => Promise<void>;
  onGuestbookSubmit: (data: { name: string; message: string }) => Promise<void>;
  rsvps: Array<{
    id: string;
    name: string;
    attendance: string;
    guestCount: number;
    createdAt: string;
  }>;
  guestbook: Array<{
    id: string;
    name: string;
    message: string;
    createdAt: string;
  }>;
}
