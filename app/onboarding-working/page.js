'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSkipOnboarding = async () => {
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Get token from localStorage
      const authToken = localStorage.getItem('authToken');
      
      if (!authToken) {
        setError('Please login first to complete onboarding.');
        setIsSubmitting(false);
        return;
      }

      // Skip data - minimal onboarding completion
      const skipData = {
        skinType: 'normal',
        skinConcerns: ['general'],
        ageRange: '25-35',
        skincareExperience: 'intermediate',
        allergies: '',
        currentRoutine: '',
        goals: ''
      };

      console.log('Submitting onboarding skip with token:', authToken.substring(0, 20) + '...');

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
        throw new Error(data.message || `Error: ${response.status}`);
      }

      setSuccess('✅ Onboarding completed successfully!');
      
      // Redirect to dashboard after success
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);

    } catch (error) {
      console.error('Onboarding error:', error);
      setError(`❌ ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteSetup = async () => {
    // For now, just do the same as skip - you can enhance this later
    await handleSkipOnboarding();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to Dermify! 🌟
            </h1>
            <p className="text-lg text-gray-600">
              Let's personalize your skincare journey
            </p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700">
              {success}
              <p className="mt-2 text-sm">Redirecting to dashboard...</p>
            </div>
          )}

          {/* Content */}
          <div className="text-center space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
              <p className="text-gray-600 mb-4">
                We'd love to learn about your skin type and concerns to provide personalized recommendations.
              </p>
              <p className="text-sm text-gray-500">
                You can complete this setup now or skip for later.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleCompleteSetup}
                disabled={isSubmitting}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isSubmitting ? 'Processing...' : 'Complete Setup'}
              </button>
              
              <button
                onClick={handleSkipOnboarding}
                disabled={isSubmitting}
                className="px-8 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isSubmitting ? 'Processing...' : 'Skip for Now'}
              </button>
            </div>

            <div className="pt-4">
              <button
                onClick={() => router.push('/')}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                ← Back to Home
              </button>
            </div>
          </div>

          {/* Debug Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <details className="text-sm text-gray-500">
              <summary className="cursor-pointer hover:text-gray-700">Debug Info</summary>
              <div className="mt-2 p-3 bg-gray-50 rounded">
                <p><strong>Auth Token:</strong> {localStorage.getItem('authToken') ? 'Present' : 'Missing'}</p>
                <p><strong>User Data:</strong> {localStorage.getItem('user') ? 'Present' : 'Missing'}</p>
                <p><strong>Page:</strong> /onboarding</p>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
