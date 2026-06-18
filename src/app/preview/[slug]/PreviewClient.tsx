'use client';

import { TEMPLATE_REGISTRY } from '@/components/templates/registry';
import { InvitationData } from '@/types/invitation';

interface Props {
  componentKey: string;
  templateName: string;
  data: InvitationData;
}

export default function PreviewClient({ componentKey, templateName, data }: Props) {
  const TemplateComponent = TEMPLATE_REGISTRY[componentKey];

  if (!TemplateComponent) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-6">
        <p className="text-gray-500">Template &quot;{templateName}&quot; tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <TemplateComponent
      data={data}
      guestName="Tamu Undangan"
      slug="preview"
      onRsvpSubmit={async () => {}}
      onGuestbookSubmit={async () => {}}
      rsvps={[]}
      guestbook={[]}
    />
  );
}
