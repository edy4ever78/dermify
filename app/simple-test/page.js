'use client';

import { useState } from 'react';

export default function SimpleTest() {
  const [message, setMessage] = useState('Simple test page loaded successfully!');

  const testOnboardingAPI = async () => {
    try {
      // Get token from localStorage
      const authToken = localStorage.getItem('authToken');
      
      if (!authToken) {
        setMessage('No token found in localStorage. Please login first.');
        return;
      }

      const skipData = {
        skinType: 'normal',
        skinConcerns: ['general'],
        ageRange: '25-35',
        skincareExperience: 'intermediate',
        allergies: '',
        currentRoutine: '',
        goals: ''
      };

      const response = await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authToken
        },
        body: JSON.stringify(skipData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage(`✅ Onboarding API Success: ${JSON.stringify(data)}`);
      } else {
        setMessage(`❌ Onboarding API Error: ${response.status} - ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      setMessage(`❌ Network Error: ${error.message}`);
    }
  };

  const loginAndSetToken = async () => {
    try {
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
        localStorage.setItem('userEmail', data.user.email);
        setMessage(`✅ Login Success! Token stored: "${data.token.substring(0, 20)}..."`);
      } else {
        setMessage(`❌ Login Failed: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      setMessage(`❌ Login Error: ${error.message}`);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Simple Onboarding Test</h1>
      
      <div className="mb-4">
        <p className="text-lg">{message}</p>
      </div>
      
      <div className="space-x-4">
        <button 
          onClick={loginAndSetToken}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Login & Set Token
        </button>
        
        <button 
          onClick={testOnboardingAPI}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Test Onboarding API
        </button>
        
        <button 
          onClick={() => {
            const token = localStorage.getItem('authToken');
            setMessage(`Current token: ${token ? `"${token.substring(0, 20)}..."` : 'null'}`);
          }}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Check Token
        </button>
      </div>
    </div>
  );
}
