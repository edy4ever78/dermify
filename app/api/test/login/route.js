import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({
        error: 'Email and password required'
      }, { status: 400 });
    }

    // Test login API call
    const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const loginData = await loginResponse.json();

    return NextResponse.json({
      status: loginResponse.status,
      loginData: loginData,
      hasToken: !!loginData.token,
      hasUser: !!loginData.user,
      tokenPreview: loginData.token ? `${loginData.token.substring(0, 20)}...` : 'no token'
    });
  } catch (error) {
    console.error('Login test error:', error);
    return NextResponse.json({
      error: 'Login test failed',
      details: error.message
    }, { status: 500 });
  }
}
