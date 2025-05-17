import { saveUser, getUserByEmail } from '@/lib/redis';
import { NextResponse } from 'next/server';

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

    // Generate a token for the new user
    const authToken = Buffer.from(`${newUser.email}-${Date.now()}`).toString('base64');

    // Return user data (without password)
    return NextResponse.json({ 
      user: newUser,
      token: authToken
    });
  } catch (error) {
    console.error('Signup error:', error);
    
    return NextResponse.json(
      { message: error.message || 'Failed to create account' },
      { status: 500 }
    );
  }
}
