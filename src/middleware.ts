import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const host = req.headers.get('host') ?? '';
  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN ?? '';

  if (!appDomain) return NextResponse.next();

  // Only activate for subdomains of the app domain (e.g. ilham-ica.nikahyuk.com)
  if (!host.endsWith(`.${appDomain}`)) return NextResponse.next();

  const prefix = host.slice(0, -(appDomain.length + 1));
  if (!prefix) return NextResponse.next();

  const appUrl = process.env.NEXTAUTH_URL ?? '';
  if (!appUrl) return NextResponse.next();

  try {
    const lookupUrl = `${appUrl}/api/_internal/resolve-domain?prefix=${encodeURIComponent(prefix)}`;
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
    // domain lookup failed — serve normally
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|favicon\\.ico).*)'],
};
