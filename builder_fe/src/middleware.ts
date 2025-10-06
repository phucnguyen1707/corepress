import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';

import { Locale } from './interfaces/common';
import { localePrefix, locales } from './navigation';

export async function middleware(request: NextRequest) {
  const nextintlRouting = createMiddleware({
    locales,
    localePrefix,
    defaultLocale: Locale.EN,
  });
  const response = nextintlRouting(request);

  // your middleware stuff here
  response.headers.set('x-url', request.nextUrl.pathname);
  return response;
}

export const config = {
  // Skip all paths that should not be internationalized.
  // This skips the folders "api", "_next" and all files
  // with an extension (e.g. favicon.ico)
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
