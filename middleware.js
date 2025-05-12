import { NextResponse } from 'next/server';

const protectedRoutes = [
  '/account',
  '/account/profile',
  '/skin-analysis',
];

export function middleware(request) {
  const currentPath = request.nextUrl.pathname;
  
  // Check if it's a protected route
  if (protectedRoutes.some(route => currentPath.startsWith(route))) {
    // Get the session cookie
    const sessionCookie = request.cookies.get('session');
    
    // If no session cookie, redirect to login
    if (!sessionCookie) {
      const redirectUrl = new URL('/signin', request.url);
      redirectUrl.searchParams.set('redirect', currentPath);
      return NextResponse.redirect(redirectUrl);
    }
    
    // If session cookie exists, let the request continue
    try {
      // Parse session cookie to validate format
      JSON.parse(sessionCookie.value);
      // If it parses successfully, allow the request
      return NextResponse.next();
    } catch (error) {
      // If session cookie is invalid, redirect to login
      const redirectUrl = new URL('/signin', request.url);
      redirectUrl.searchParams.set('redirect', currentPath);
      return NextResponse.redirect(redirectUrl);
    }
  }
  
  return NextResponse.next();
}
