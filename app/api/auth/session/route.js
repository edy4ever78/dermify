import { getUserByEmail } from '@/lib/redis';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    // Get session cookie
    const cookie = cookies();
    const session = cookie.get('session');
    
    if (!session || !session.value) {
      return NextResponse.json({ user: null });
    }
    
    try {
      const { email } = JSON.parse(session.value);
      
      if (!email) {
        return NextResponse.json({ user: null });
      }
      
      // Get user from Redis
      const user = await getUserByEmail(email);
      
      if (!user) {
        // Clear invalid session
        cookie.delete('session');
        return NextResponse.json({ user: null });
      }
      
      // Return user data
      return NextResponse.json({ user });
    } catch (error) {
      // Invalid session format
      console.error('Invalid session format:', error);
      cookie.delete('session');
      return NextResponse.json({ user: null });
    }
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json({ user: null });
  }
}
