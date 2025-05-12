import redis from '@/lib/redis';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

// Simple endpoint to test Redis connection
export async function GET() {
  try {
    // Attempt to connect explicitly
    await redis.connect();
    
    // Test Redis with a simple ping command
    const result = await redis.ping();
    
    // Test password hashing
    const testPassword = "password123";
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    const passwordValid = await bcrypt.compare(testPassword, hashedPassword);
    
    return NextResponse.json({
      status: 'success',
      message: 'Redis connection and password hashing successful',
      ping: result,
      passwordTest: {
        sample: testPassword,
        hashed: hashedPassword.substring(0, 10) + '...', // Only show part for security
        valid: passwordValid
      },
      info: {
        host: redis.options.host,
        port: redis.options.port
      }
    });
  } catch (error) {
    console.error('Redis test failed:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Redis connection failed',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
