import { NextResponse } from 'next/server';

// Protected routes that require authentication
const protectedRoutes = [
  '/account',
  '/account/profile',
  '/skin-analysis',
];

// Auth routes that should redirect to home if already logged in
const authRoutes = [
  '/signin',
  '/signup',
  '/login',
];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('session');
  
  // Function to validate session cookie
  const isValidSession = (cookie) => {
    if (!cookie) return false;
    try {
      const session = JSON.parse(cookie.value);
      return !!session.id && !!session.email;
    } catch (e) {
      return false;
    }
  };

  const isAuthenticated = isValidSession(sessionCookie);
  
  // Case 1: Authenticated user trying to access auth pages
  if (isAuthenticated && authRoutes.some(route => pathname === route)) {
    // Check if there's a redirect parameter
    const redirectParam = request.nextUrl.searchParams.get('redirect');
    
    if (redirectParam) {
      // Only redirect to known protected routes to prevent open redirects
      if (protectedRoutes.some(route => redirectParam.startsWith(route))) {
        return NextResponse.redirect(new URL(redirectParam, request.url));
      }
    }
    
    // Default redirect to home page
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Case 2: Unauthenticated user trying to access protected routes
  if (!isAuthenticated && protectedRoutes.some(route => pathname.startsWith(route))) {
    const redirectUrl = new URL('/signin', request.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // All other cases, just continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (except auth-related ones)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api/(?!auth)).*)',
    '/api/auth/:path*',
  ],
};
