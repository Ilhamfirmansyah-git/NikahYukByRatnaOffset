import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

function getCloudinaryConfig() {
  const cloudName =
    process.env.CLOUDINARY_CLOUD_NAME ??
    process.env.CLOUDINARY_URL?.match(/cloudinary:\/\/[^:]+:[^@]+@(.+)/)?.[1];

  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

  return cloudName ? { cloudName, uploadPreset: uploadPreset ?? null } : null;
}

// GET — return config for client-side unsigned upload
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Tidak terautentikasi' }, { status: 401 });
  }

  const config = getCloudinaryConfig();
  if (!config) {
    return NextResponse.json({ error: 'Layanan upload belum dikonfigurasi' }, { status: 503 });
  }

  return NextResponse.json({
    cloudName: config.cloudName,
    uploadPreset: config.uploadPreset,
  });
}
