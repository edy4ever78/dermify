import { NextResponse } from 'next/server';
import redis from '@/lib/redis';

export async function GET() {
  try {
    if (!redis) {
      return NextResponse.json({
        error: 'Redis client not available'
      }, { status: 500 });
    }

    // Test Redis connection
    await redis.ping();
    
    // Try to get all users
    const users = await redis.smembers('users');
    
    // Get details for first user if any
    let sampleUser = null;
    if (users.length > 0) {
      sampleUser = await redis.hgetall(`user:${users[0]}`);
    }

    return NextResponse.json({
      status: 'Redis connected',
      userCount: users.length,
      users: users,
      sampleUser: sampleUser ? {
        email: sampleUser.email,
        firstName: sampleUser.firstName,
        onboardingCompleted: sampleUser.onboardingCompleted
      } : null
    });
  } catch (error) {
    console.error('Redis test error:', error);
    return NextResponse.json({
      error: 'Redis connection failed',
      details: error.message
    }, { status: 500 });
  }
}
