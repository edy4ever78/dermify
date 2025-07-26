import { NextResponse } from 'next/server';
import redis from '@/lib/redis';

export async function POST() {
  try {
    if (!redis) {
      return NextResponse.json({
        error: 'Redis client not available'
      }, { status: 500 });
    }

    // Get all users
    const users = await redis.smembers('users');
    const results = [];
    
    for (const email of users) {
      const userKey = `user:${email}`;
      const user = await redis.hgetall(userKey);
      
      // Check if user has onboardingCompleted field
      if (!user.onboardingCompleted) {
        // Set onboardingCompleted to false for existing users
        await redis.hset(userKey, 'onboardingCompleted', 'false');
        results.push({
          email: email,
          action: 'added onboardingCompleted field'
        });
      } else {
        results.push({
          email: email,
          action: 'already has onboardingCompleted field',
          value: user.onboardingCompleted
        });
      }
    }

    return NextResponse.json({
      message: 'Migration completed',
      usersProcessed: users.length,
      results: results
    });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json({
      error: 'Migration failed',
      details: error.message
    }, { status: 500 });
  }
}
