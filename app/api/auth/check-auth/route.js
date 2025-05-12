import { getUserByEmail } from '@/lib/redis';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    // Get session cookie
    const cookie = cookies();
    const session = cookie.get('session');
    
    if (!session || !session.value) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    
    try {
      const { email } = JSON.parse(session.value);
      
      if (!email) {
        return NextResponse.json({ authenticated: false }, { status: 401 });
      }
      
      // Get user from Redis
      const user = await getUserByEmail(email);
      
      if (!user) {
        // Clear invalid session
        cookie.delete('session');
        return NextResponse.json({ authenticated: false }, { status: 401 });
      }
      
      // Return authenticated status
      return NextResponse.json({ 
        authenticated: true, 
        user: {
          email: user.email,
          name: user.name || `${user.firstName} ${user.lastName}`
        }
      });
    } catch (error) {
      // Invalid session format
      console.error('Invalid session format:', error);
      cookie.delete('session');
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
