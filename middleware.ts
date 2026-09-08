import { NextResponse, type NextRequest } from 'next/server';
import { isLocale, localeCookie, type Locale } from './lib/site';

/** The English routes that have a Japanese twin, and what that twin is. */
const JAPANESE: Record<string, string> = { '/': '/ja', '/resume': '/ja/resume' };

/**
 * Which language this arrival should be served in.
 *
 * The cookie first: a reader who has been here before is sent back to the
 * language they were last reading, whatever country they are in today. Only
 * a browser that has never been here is decided by where it is — Japan gets
 * Japanese, everyone else English. `x-vercel-ip-country` is set by Vercel's
 * edge from the request IP; `next dev` has no such header, so local runs are
 * always English unless the header is sent by hand.
 */
function wanted(request: NextRequest): Locale {
  const remembered = request.cookies.get(localeCookie)?.value;
  if (isLocale(remembered)) return remembered;
  return request.headers.get('x-vercel-ip-country') === 'JP' ? 'ja' : 'en';
}

/**
 * Whether this is a reader arriving at a page, rather than the App Router
 * fetching one behind the scenes.
 *
 * It has to be the Accept header. Next strips the RSC and prefetch headers —
 * and the `_rsc` query it appends — before middleware ever sees the request,
 * so the only thing left that separates the two is what they ask for: a
 * browser navigating asks for text/html, and the router's own fetch asks for
 * anything. Redirecting one of those would be worse than useless: next/link
 * prefetches the other language, and a prefetch of "/" answered with a
 * redirect back to /ja is cached as the answer for "/" — the switch would
 * then write the cookie, navigate, and land back where it started.
 */
function isArrival(request: NextRequest) {
  return (request.headers.get('accept') ?? '').includes('text/html');
}

/**
 * Steers an arrival to the reader's language. Only English routes are
 * matched, so this is always a redirect *into* Japanese and never out of it —
 * a reader who followed a link to /ja stays on /ja.
 */
export function middleware(request: NextRequest) {
  if (!isArrival(request)) return NextResponse.next();

  if (wanted(request) !== 'ja') return NextResponse.next();

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
