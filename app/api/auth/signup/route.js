import { saveUser, getUserByEmail } from '@/lib/redis';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    const userData = await req.json();
    const { firstName, lastName, email, password } = userData;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Save user to Redis
    const newUser = await saveUser({
      firstName,
      lastName,
      email,
      password,
      skinType: 'Normal', // Default skin type
      skinConcerns: [] // Default empty skin concerns
    });

    // Set session cookie
    const cookie = cookies();
    cookie.set('session', JSON.stringify({ email: newUser.email }), { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    // Return user data (without password)
    return NextResponse.json({ user: newUser });
  } catch (error) {
    console.error('Signup error:', error);
    
    return NextResponse.json(
      { message: error.message || 'Failed to create account' },
      { status: 500 }
    );
  }
}
