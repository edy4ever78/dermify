import { NextResponse } from 'next/server';

export async function POST() {
  // In a token-based auth system, the client is responsible for removing the token
  // The server doesn't need to do anything for logout
  
  return NextResponse.json({ success: true });
}
