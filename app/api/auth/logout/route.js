import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  
  // Clear the session cookie
  response.cookies.set({
    name: 'session',
    value: '',
    httpOnly: true,
    expires: new Date(0), // Expire immediately
    path: '/'
  });
  
  return response;
}
