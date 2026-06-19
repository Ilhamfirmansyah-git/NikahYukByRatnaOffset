import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

function getCloudinaryConfig() {
  // Format 1: CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
  const cloudinaryUrl = process.env.CLOUDINARY_URL;
  if (cloudinaryUrl) {
    const match = cloudinaryUrl.match(/cloudinary:\/\/([^:]+):([^@]+)@(.+)/);
    if (match) {
      return { apiKey: match[1], apiSecret: match[2], cloudName: match[3] };
    }
  }

  // Format 2: separate env vars
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (cloudName && apiKey && apiSecret) {
    return { apiKey, apiSecret, cloudName };
  }

  return null;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Tidak terautentikasi' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'File tidak ditemukan' }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'Ukuran file maksimal 10MB' }, { status: 400 });
    }

    const config = getCloudinaryConfig();

    if (!config) {
      console.error('[upload] CLOUDINARY_URL atau env vars Cloudinary tidak diset');
      return NextResponse.json({ error: 'Layanan upload belum dikonfigurasi' }, { status: 503 });
    }

    const { apiKey, apiSecret, cloudName } = config;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const dataUri = `data:${file.type};base64,${base64}`;

    const timestamp = Math.round(Date.now() / 1000);
    const folder = 'nikahyuk';

    const crypto = await import('crypto');
    // Signature covers all non-file params sorted alphabetically
    const signatureStr = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(signatureStr).digest('hex');

    const uploadFormData = new FormData();
    uploadFormData.append('file', dataUri);
    uploadFormData.append('api_key', apiKey);
    uploadFormData.append('timestamp', String(timestamp));
    uploadFormData.append('signature', signature);
    uploadFormData.append('folder', folder);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: 'POST', body: uploadFormData }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error('[upload] Cloudinary error:', JSON.stringify(result));
      return NextResponse.json(
        { error: result?.error?.message ?? 'Upload ke Cloudinary gagal' },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: result.secure_url });
  } catch (error) {
    console.error('[upload] Unexpected error:', error);
    return NextResponse.json({ error: 'Gagal mengupload file' }, { status: 500 });
  }
}

// Debug endpoint — returns config status (no secrets exposed)
export async function GET() {
  const config = getCloudinaryConfig();
  return NextResponse.json({
    configured: !!config,
    cloudName: config?.cloudName ?? null,
    hasApiKey: !!config?.apiKey,
    hasApiSecret: !!config?.apiSecret,
  });
}
