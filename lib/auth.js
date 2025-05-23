import Cookies from 'js-cookie';
import { validateCredentials } from './redis';

// Cookie settings
const SESSION_COOKIE_NAME = 'session';
const COOKIE_OPTIONS = {
  path: '/',
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  expires: 7, // 7 days
};

/**
 * Create a session for a user and set the cookie
 */
export function createSession(user) {
  if (!user) return null;
  
  // Create a session object with needed user data
  const session = {
    id: user.id,
    email: user.email,
    name: user.name || `${user.firstName} ${user.lastName}`,
    timestamp: Date.now(),
  };
  
  // Store in cookie
  Cookies.set(SESSION_COOKIE_NAME, JSON.stringify(session), COOKIE_OPTIONS);
  return session;
}

/**
 * Get the current session from cookies
 */
export function getSession() {
  const sessionCookie = Cookies.get(SESSION_COOKIE_NAME);
  if (!sessionCookie) return null;
  
  try {
    return JSON.parse(sessionCookie);
  } catch (error) {
    console.error('Invalid session cookie', error);
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
  return getSession() !== null;
}

/**
 * Log in a user
 */
export async function login(email, password) {
  try {
    const user = await validateCredentials(email, password);
    if (!user) return { success: false, message: 'Invalid credentials' };
    
    const session = createSession(user);
    return { success: true, user, session };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'An error occurred during login' };
  }
}

/**
 * Log out a user by removing the session cookie
 */
export function logout() {
  Cookies.remove(SESSION_COOKIE_NAME, { path: '/' });
  return true;
}
