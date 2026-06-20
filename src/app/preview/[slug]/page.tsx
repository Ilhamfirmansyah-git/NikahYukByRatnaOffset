import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { defaultInvitationData } from '@/types/invitation';
import PreviewClient from './PreviewClient';
import Link from 'next/link';

interface Props {
  params: { slug: string };
  searchParams: { packageId?: string };
}

export async function generateMetadata({ params }: Props) {
  const template = await prisma.template.findUnique({ where: { slug: params.slug } });
  return {
    title: template ? `Preview: ${template.name}` : 'Preview Template',
    robots: { index: false, follow: false },
  };
}

export default async function PreviewPage({ params, searchParams }: Props) {
  const packageId = searchParams.packageId ?? '';
  const template = await prisma.template.findUnique({
    where: { slug: params.slug },
  });

  if (!template || !template.isActive) notFound();

  const config = await prisma.previewConfig.findUnique({ where: { id: 'singleton' } });
  const data = config ? (config.data as unknown as ReturnType<typeof defaultInvitationData>) : defaultInvitationData();

  return (
    <div className="relative">
      {/* Preview banner */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gray-900/90 backdrop-blur text-white text-sm flex items-center justify-between px-4 py-2 gap-4">
        <div className="flex items-center gap-3">
          <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded">PREVIEW</span>
          <span className="font-medium">{template.name}</span>
          <span className="text-gray-400 hidden sm:inline">— Data di bawah adalah contoh</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/app/beli?templateId=${template.id}${packageId ? `&packageId=${packageId}` : ''}`}
            className="bg-primary text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-primary-600 transition-colors whitespace-nowrap"
          >
            Pilih Template Ini
          </Link>
          <Link
            href={packageId ? `/app/beli?packageId=${packageId}` : '/app/beli'}
            className="text-gray-400 hover:text-white text-xs transition-colors"
          >
            ← Kembali
          </Link>
        </div>
      </div>

      {/* Spacer for the fixed banner */}
      <div className="h-10" />

      <PreviewClient
        componentKey={template.componentKey}
        templateName={template.name}
        data={data}
      />
    </div>
  );
}
