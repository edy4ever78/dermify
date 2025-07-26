import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({
        error: 'Email is required'
      }, { status: 400 });
    }

    // Test token generation like in signup/login
    const timestamp = Date.now();
    const tokenData = `${email}-${timestamp}`;
    const token = Buffer.from(tokenData, 'utf8').toString('base64');
    
    // Test token decoding
    const decodedToken = Buffer.from(token, 'base64').toString('utf8');
    const extractedEmail = decodedToken.split('-')[0];
    
    return NextResponse.json({
      originalEmail: email,
      tokenData: tokenData,
      encodedToken: token,
      decodedToken: decodedToken,
      extractedEmail: extractedEmail,
      matches: extractedEmail === email
    });
  } catch (error) {
    console.error('Token test error:', error);
    return NextResponse.json({
      error: 'Token test failed',
      details: error.message
    }, { status: 500 });
  }
}
