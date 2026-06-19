import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const host = req.headers.get('host') ?? '';
  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN ?? '';

  if (!appDomain) return NextResponse.next();

  // Only activate for subdomains of the app domain (e.g. ilhamica.ratnaoffset.com)
  if (!host.endsWith(`.${appDomain}`)) return NextResponse.next();

  const prefix = host.slice(0, -(appDomain.length + 1));
  if (!prefix) return NextResponse.next();

  // Avoid rewriting already-internal paths
  const { pathname } = req.nextUrl;
  if (pathname.startsWith('/sub/') || pathname.startsWith('/u/')) {
    return NextResponse.next();
  }

  // Rewrite to /sub/[prefix] — the Server Component there handles DB lookup
  const url = req.nextUrl.clone();
  url.pathname = `/sub/${prefix}${pathname === '/' ? '' : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/((?!_next|api|favicon\\.ico).*)'],
};
