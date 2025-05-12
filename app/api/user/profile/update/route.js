import { updateUserProfile } from '@/lib/redis';
import { NextResponse } from 'next/server';

export async function PUT(request) {
  try {
    const data = await request.json();
    const { email, ...profileData } = data;
    
    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }
    
    // Update user profile in Redis
    const updatedUser = await updateUserProfile(email, profileData);
    
    if (!updatedUser) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Return updated user data
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Profile update error:', error);
    
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
