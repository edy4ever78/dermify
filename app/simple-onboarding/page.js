'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SimpleOnboarding() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSkip = async () => {
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Get token from localStorage
      const authToken = localStorage.getItem('authToken');
      
      if (!authToken) {
        setError('No authentication token found. Please login first.');
        setIsSubmitting(false);
        return;
      }

      // Skip data
      const skipData = {
        skinType: 'normal',
        skinConcerns: ['general'],
        ageRange: '25-35',
        skincareExperience: 'intermediate',
        allergies: '',
        currentRoutine: '',
        goals: ''
      };

      console.log('Sending onboarding data with token:', authToken.substring(0, 20) + '...');

      const response = await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authToken
        },
        body: JSON.stringify(skipData)
      });

      const data = await response.json();
      console.log('Onboarding response:', data);

      if (!response.ok) {
        throw new Error(data.message || `Server error: ${response.status}`);
      }

      setSuccess('✅ Onboarding completed successfully!');
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);

    } catch (error) {
      console.error('Onboarding error:', error);
      setError(`❌ Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async () => {
    try {
      // First try to create the user in case it doesn't exist
      const signupResponse = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: 'Test',
          lastName: 'User',
          email: 'test@test.com',
          password: 'password123'
        })
      });
      
      // Don't worry if signup fails (user might already exist)
      
      // Now try to login
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@test.com',
          password: 'password123'
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setSuccess('✅ Logged in successfully! You can now skip onboarding.');
      } else {
        setError(`❌ Login failed: ${data.message}`);
      }
    } catch (error) {
      setError(`❌ Login error: ${error.message}`);
    }
  };

  const checkAuthStatus = () => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      setSuccess(`✅ You are logged in. Token: ${token.substring(0, 20)}...`);
    } else {
      setError('❌ Not logged in. Please login first.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-center mb-6">
            Simple Onboarding Test
          </h1>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}
          
          <div className="space-y-4">
            <button
              onClick={checkAuthStatus}
              className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
            >
              Check Auth Status
            </button>
            
            <button
              onClick={handleLogin}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Login as Test User
            </button>
            
            <button
              onClick={handleSkip}
              disabled={isSubmitting}
              className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Skip Onboarding'}
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600"
            >
              Go to Home
            </button>
          </div>
          
          <div className="mt-6 text-sm text-gray-600">
            <p><strong>Instructions:</strong></p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Click "Check Auth Status" to see if you're logged in</li>
              <li>If not logged in, click "Login as Test User"</li>
              <li>Then click "Skip Onboarding" to test the functionality</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
