import { NextResponse } from 'next/server';
import Redis from 'ioredis';

// Create Redis client
const redis = new Redis({
  host: 'localhost',
  port: 6379,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
});

export async function GET() {
  try {
    // Test Redis connection
    const pong = await redis.ping();
    
    if (pong === 'PONG') {
      // Test set and get operations
      const testKey = 'dermify:test';
      const testValue = `Redis test - ${new Date().toISOString()}`;
      
      await redis.set(testKey, testValue, 'EX', 60); // Expire in 60 seconds
      const retrievedValue = await redis.get(testKey);
      
      return NextResponse.json({
        status: 'healthy',
        redis: 'connected',
        ping: pong,
        test: {
          stored: testValue,
          retrieved: retrievedValue,
          match: testValue === retrievedValue
        },
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json({
        status: 'unhealthy',
        redis: 'ping failed',
        ping: pong
      }, { status: 503 });
    }
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      redis: 'unreachable',
      error: error.message,
      suggestion: 'Ensure Redis container is running: npm run redis:start'
    }, { status: 503 });
  }
}

export async function POST(request) {
  try {
    const { key, value, expiry = 3600 } = await request.json();
    
    if (!key || !value) {
      return NextResponse.json(
        { error: 'Key and value are required' },
        { status: 400 }
      );
    }
    
    // Store value in Redis with expiry
    await redis.set(key, JSON.stringify(value), 'EX', expiry);
    
    return NextResponse.json({
      success: true,
      message: 'Value stored in Redis',
      key: key,
      expiry: expiry,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
