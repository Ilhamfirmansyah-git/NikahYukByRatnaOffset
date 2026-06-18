import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'File tidak ditemukan' }, { status: 400 });
    }

    const cloudinaryUrl = process.env.CLOUDINARY_URL;

    if (cloudinaryUrl) {
      // Parse CLOUDINARY_URL: cloudinary://api_key:api_secret@cloud_name
      const match = cloudinaryUrl.match(/cloudinary:\/\/(\d+):([^@]+)@(.+)/);
      if (match) {
        const [, apiKey, apiSecret, cloudName] = match;

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = buffer.toString('base64');
        const dataUri = `data:${file.type};base64,${base64}`;

        const timestamp = Math.round(Date.now() / 1000);
        const crypto = await import('crypto');
        const signature = crypto
          .createHash('sha1')
          .update(`timestamp=${timestamp}${apiSecret}`)
          .digest('hex');

        const uploadFormData = new FormData();
        uploadFormData.append('file', dataUri);
        uploadFormData.append('api_key', apiKey);
        uploadFormData.append('timestamp', String(timestamp));
        uploadFormData.append('signature', signature);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          { method: 'POST', body: uploadFormData }
        );

        if (response.ok) {
          const data = await response.json();
          return NextResponse.json({ url: data.secure_url });
        }
      }
    }

    // Fallback: return placeholder
    return NextResponse.json({ url: '/placeholder-image.jpg' });
  } catch (error) {
    console.error('POST /api/upload error:', error);
    return NextResponse.json({ error: 'Gagal mengupload file' }, { status: 500 });
  }
}
