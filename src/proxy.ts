import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const hasAuthCookie = request.cookies.has('nexdesk-auth');
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname.startsWith('/login');

  // If the user is not authenticated and trying to access a protected dashboard route, redirect to /login
  if (!hasAuthCookie && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If the user is authenticated and trying to access the login page, redirect them to the home dashboard
  if (hasAuthCookie && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Secure all dashboard and app routes while keeping public bundles, static files, and APIs unblocked
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
