import { NextRequest, NextResponse } from 'next/server';

const APP_DOMAINS = [
  'localhost',
  'vercel.app',
];

function isAppDomain(host: string): boolean {
  const bare = host.split(':')[0];
  return APP_DOMAINS.some((d) => bare === d || bare.endsWith(`.${d}`));
}

export async function middleware(req: NextRequest) {
  const host = req.headers.get('host') ?? '';

  if (!host || isAppDomain(host)) {
    return NextResponse.next();
  }

  const appUrl = process.env.NEXTAUTH_URL ?? '';
  if (!appUrl) return NextResponse.next();

  const appHost = appUrl.replace(/^https?:\/\//, '').split('/')[0];
  if (host === appHost) return NextResponse.next();

  try {
    const lookupUrl = `${appUrl}/api/_internal/resolve-domain?domain=${encodeURIComponent(host)}`;
    const res = await fetch(lookupUrl, {
      headers: { 'x-internal-secret': process.env.NEXTAUTH_SECRET ?? '' },
      next: { revalidate: 300 },
    });

    if (res.ok) {
      const { slug } = (await res.json()) as { slug: string | null };
      if (slug) {
        const url = req.nextUrl.clone();
        const tamu = req.nextUrl.searchParams.get('tamu');
        url.pathname = `/u/${slug}`;
        if (tamu) url.searchParams.set('tamu', tamu);
        return NextResponse.rewrite(url);
      }
    }
  } catch {
    // domain not found or error — fall through to normal routing
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|favicon\\.ico).*)'],
};
