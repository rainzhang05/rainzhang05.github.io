import { NextResponse, type NextRequest } from "next/server";
import { LOCALE_COOKIE, LOCALE_PATH } from "@/lib/i18n/config";
import { shouldRedirectToJa } from "@/lib/i18n/geo";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value ?? null;
  const country = request.headers.get("x-vercel-ip-country");

  if (!shouldRedirectToJa({ pathname, cookie, country })) {
    return NextResponse.next();
  }

  const destination = request.nextUrl.clone();
  destination.pathname = LOCALE_PATH.ja;
  destination.search = search;
  return NextResponse.redirect(destination, 307);
}

export const config = {
  matcher: "/",
};
