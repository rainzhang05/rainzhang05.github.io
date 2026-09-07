import { NextResponse, type NextRequest } from 'next/server';
import { localeCookie } from './lib/site';

/** The English routes that have a Japanese twin, and what that twin is. */
const JAPANESE: Record<string, string> = { '/': '/ja', '/resume': '/ja/resume' };

/**
 * Visitors in Japan land on the Japanese page once, unless they have already
 * chosen a language (the switch in the header writes the cookie). Everyone
 * else gets English. Same behaviour as the previous site, now for the resume
 * as well as the home page — a deep link into one should not lose the
 * language the other would have given.
 */
export function middleware(request: NextRequest) {
  if (request.cookies.get(localeCookie)?.value) return NextResponse.next();
  if (request.headers.get('x-vercel-ip-country') !== 'JP') return NextResponse.next();

  const target = JAPANESE[request.nextUrl.pathname];
  if (!target) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = target;
  return NextResponse.redirect(url, 307);
}

/**
 * An explicit list, never a pattern: a catch-all would match /ja itself and
 * redirect it to a page it is already on.
 */
export const config = { matcher: ['/', '/resume'] };
