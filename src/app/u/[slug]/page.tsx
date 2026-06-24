import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
import InvitationClient from './InvitationClient';
import { InvitationData } from '@/types/invitation';
import { RecaptchaProvider } from '@/components/RecaptchaProvider';

interface PageProps {
  params: { slug: string };
  searchParams?: { to?: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const invitation = await prisma.invitation.findUnique({
    where: { slug: params.slug },
    include: { template: { select: { name: true } } },
  });

  if (!invitation || !invitation.isPublished) {
    return { title: 'Undangan tidak ditemukan' };
  }

  const data = invitation.data as unknown as InvitationData;
  const pria = data.mempelai?.pria?.namaPanggilan || data.mempelai?.pria?.namaLengkap || 'Pria';
  const wanita = data.mempelai?.wanita?.namaPanggilan || data.mempelai?.wanita?.namaLengkap || 'Wanita';

  const ogImage =
    data.mempelai?.wanita?.foto ||
    data.mempelai?.pria?.foto ||
    (data.galeri && data.galeri.length > 0 ? data.galeri[0] : undefined);

  return {
    title: `Undangan Pernikahan ${pria} & ${wanita}`,
    description: `Kami mengundang Anda untuk hadir dan memberikan doa restu pada pernikahan ${pria} & ${wanita}.`,
    openGraph: {
      title: `Undangan Pernikahan ${pria} & ${wanita}`,
      description: `Kami mengundang Anda untuk hadir dan memberikan doa restu pada pernikahan ${pria} & ${wanita}.`,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
      type: 'website',
    },
  };
}

export default async function InvitationPage({ params, searchParams }: PageProps) {
  const { slug } = params;
  const guestName = searchParams?.to || '';

  const invitation = await prisma.invitation.findUnique({
    where: { slug },
    include: {
      template: {
        select: { componentKey: true, name: true },
      },
      rsvps: { orderBy: { createdAt: 'desc' } },
      guestbook: { orderBy: { createdAt: 'desc' } },
    },
  });

  if (!invitation || !invitation.isPublished) {
    notFound();
  }

  if (invitation.expiresAt && invitation.expiresAt < new Date()) {
    notFound();
  }

  // Record visit — awaited so serverless function doesn't terminate before the write completes
  await prisma.visit.create({ data: { invitationId: invitation.id } });

  // Serialize dates to strings for client component
  const serialized = {
    ...invitation,
    createdAt: invitation.createdAt.toISOString(),
    expiresAt: invitation.expiresAt?.toISOString() ?? null,
    rsvps: invitation.rsvps.map(r => ({
      id: r.id,
      name: r.name,
      attendance: r.attendance,
      guestCount: r.guestCount,
      createdAt: r.createdAt.toISOString(),
    })),
    guestbook: invitation.guestbook.map(g => ({
      id: g.id,
      name: g.name,
      message: g.message,
      createdAt: g.createdAt.toISOString(),
    })),
  };

  const data = invitation.data as unknown as InvitationData;
  const pria = data.mempelai?.pria?.namaPanggilan || data.mempelai?.pria?.namaLengkap || 'Pria';
  const wanita = data.mempelai?.wanita?.namaPanggilan || data.mempelai?.wanita?.namaLengkap || 'Wanita';
  const acaraUtama = data.acara?.find(a => a.nama?.toLowerCase().includes('akad') || a.nama?.toLowerCase().includes('resepsi')) ?? data.acara?.[0];
  const baseUrl = process.env.NEXTAUTH_URL ?? 'https://ratnaoffset.com';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: `Pernikahan ${pria} & ${wanita}`,
    description: `Undangan pernikahan digital ${pria} & ${wanita}`,
    url: `${baseUrl}/u/${slug}`,
    ...(acaraUtama ? {
      startDate: acaraUtama.tanggal,
      location: {
        '@type': 'Place',
        name: acaraUtama.lokasi,
        address: acaraUtama.alamat,
      },
    } : {}),
    organizer: {
      '@type': 'Person',
      name: `${pria} & ${wanita}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <RecaptchaProvider>
        <InvitationClient invitation={serialized} guestName={guestName} />
      </RecaptchaProvider>
    </>
  );
}
