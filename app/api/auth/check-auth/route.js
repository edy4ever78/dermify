import { getUserByEmail } from '@/lib/redis';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Get auth token from request header
    const authToken = request.headers.get('authorization');
    
    if (!authToken) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    
    try {
      // In a real app, you would verify the token properly
      // This is a simplified implementation
      
      // Extract email from the token (assuming token format is base64 of "email-timestamp")
      const decodedToken = Buffer.from(authToken, 'base64').toString();
      const email = decodedToken.split('-')[0];
      
      if (!email) {
        return NextResponse.json({ authenticated: false }, { status: 401 });
      }
      
      // Get user from Redis
      const user = await getUserByEmail(email);
      
      if (!user) {
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
      // Invalid token format
      console.error('Invalid token format:', error);
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
