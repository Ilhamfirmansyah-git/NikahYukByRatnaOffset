import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const songs = await prisma.song.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' },
      select: { id: true, title: true, artist: true, category: true, url: true },
    });
    return NextResponse.json(songs);
  } catch (error) {
    console.error('GET /api/songs error:', error);
    return NextResponse.json([], { status: 200 });
  }
}
