import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get session cookie
    const cookie = cookies();
    const session = cookie.get('session');
    
    if (!session || !session.value) {
      return NextResponse.json(
        { message: 'No session found' },
        { status: 401 }
      );
    }
    
    try {
      const { email } = JSON.parse(session.value);
      
      if (!email) {
        return NextResponse.json(
          { message: 'No email in session' },
          { status: 401 }
        );
      }
      
      // Return the email
      return NextResponse.json({ userEmail: email });
    } catch (error) {
      console.error('Invalid session format:', error);
      return NextResponse.json(
        { message: 'Invalid session format' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error getting email from Redis:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
