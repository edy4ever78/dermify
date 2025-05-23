import { NextResponse } from 'next/server';
import { validateCredentials } from '@/lib/redis';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    if (!email || !password) {
      return NextResponse.json({ 
        success: false, 
        message: 'Email and password are required' 
      }, { status: 400 });
    }
    
    const user = await validateCredentials(email, password);
    
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid credentials' 
      }, { status: 401 });
    }
    
    // Create session object
    const session = {
      id: user.id,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      timestamp: Date.now()
    };
    
    // Set cookie and return success
    const response = NextResponse.json({ 
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
    
    // Set the session cookie
    response.cookies.set({
      name: 'session',
      value: JSON.stringify(session),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'An error occurred during login'
    }, { status: 500 });
  }
}
