import { NextResponse } from 'next/server';
import { getUserByEmail } from '@/lib/redis';

export async function POST(request) {
  try {
    const { email, token } = await request.json();
    
    console.log('Debug: Testing token for email:', email);
    console.log('Debug: Token provided:', token ? 'yes' : 'no');
    
    if (!token) {
      return NextResponse.json({
        error: 'No token provided'
      }, { status: 400 });
    }

    // Test token decoding
    const decodedToken = Buffer.from(token, 'base64').toString();
    const extractedEmail = decodedToken.split('-')[0];
    
    console.log('Debug: Decoded token:', decodedToken);
    console.log('Debug: Extracted email:', extractedEmail);
    
    // Get user from database
    const user = await getUserByEmail(extractedEmail);
    
    return NextResponse.json({
      providedEmail: email,
      extractedEmail: extractedEmail,
      tokenValid: extractedEmail === email,
      userFound: !!user,
      user: user ? {
        email: user.email,
        firstName: user.firstName,
        onboardingCompleted: user.onboardingCompleted
      } : null
    });
  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json({
      error: 'Debug failed',
      details: error.message
    }, { status: 500 });
  }
}
