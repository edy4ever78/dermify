import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  // Clear session cookie
  const cookie = cookies();
  cookie.delete('session');

  return NextResponse.json({ success: true });
}
