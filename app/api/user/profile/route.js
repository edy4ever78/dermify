import { getUserByEmail } from '@/lib/redis';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Get the email from query parameters
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }
    
    // Get user data from Redis
    const user = await getUserByEmail(email);
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Return user data
    return NextResponse.json(user);
  } catch (error) {
    console.error('Profile fetch error:', error);
    
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
