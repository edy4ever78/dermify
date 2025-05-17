import { validateCredentials } from '@/lib/redis';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate credentials against Redis
    const user = await validateCredentials(email, password);
    
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate a simple token (in a real app, use JWT or other secure token method)
    const authToken = Buffer.from(`${user.email}-${Date.now()}`).toString('base64');

    // Return user data along with the token
    return NextResponse.json({ 
      user,
      token: authToken
    });
  } catch (error) {
    console.error('Login error:', error);
    
    return NextResponse.json(
      { message: 'Authentication failed', error: error.message },
      { status: 500 }
    );
  }
}
