import { NextResponse, type NextRequest } from 'next/server';
import { localeCookie } from './lib/site';

/**
 * Visitors in Japan land on /ja once, unless they have already chosen a
 * language (the switch in the header writes the cookie). Everyone else gets
 * the English page at "/". Same behaviour as the previous site.
 */
export function middleware(request: NextRequest) {
  if (request.cookies.get(localeCookie)?.value) return NextResponse.next();

  if (request.headers.get('x-vercel-ip-country') === 'JP') {
    const url = request.nextUrl.clone();
    url.pathname = '/ja';
    return NextResponse.redirect(url, 307);
  }

  return NextResponse.next();
}

/** Only the bare root is ever redirected. */
export const config = { matcher: '/' };
