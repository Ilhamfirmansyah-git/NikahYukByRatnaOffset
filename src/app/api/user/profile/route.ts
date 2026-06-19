import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Tidak terautentikasi' }, { status: 401 });
    }

    const userId = (session.user as { id?: string })?.id;
    if (!userId) {
      return NextResponse.json({ error: 'Tidak terautentikasi' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ name: user.name, email: user.email });
  } catch (error) {
    console.error('GET /api/user/profile error:', error);
    return NextResponse.json({ error: 'Gagal mengambil data profil' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Tidak terautentikasi' }, { status: 401 });
    }

    const userId = (session.user as { id?: string })?.id;
    if (!userId) {
      return NextResponse.json({ error: 'Tidak terautentikasi' }, { status: 401 });
    }

    const body = await req.json();
    const { name } = body as { name: string };

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Nama tidak boleh kosong' }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { name: name.trim() },
      select: { name: true, email: true },
    });

    return NextResponse.json({ name: updated.name, email: updated.email });
  } catch (error) {
    console.error('PUT /api/user/profile error:', error);
    return NextResponse.json({ error: 'Gagal memperbarui profil' }, { status: 500 });
  }
}
