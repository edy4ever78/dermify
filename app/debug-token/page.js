'use client';

import { useState } from 'react';

export default function DebugToken() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testCreateUser = async () => {
    setLoading(true);
    setResult('Creating test user...');
    
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: 'Test',
          lastName: 'User',
          email: 'test@test.com',
          password: 'password123'
        })
      });
      
      const data = await response.json();
      setResult(`
Signup Status: ${response.status}
Success: ${response.ok}
Data: ${JSON.stringify(data, null, 2)}
      `);
    } catch (error) {
      setResult(`Signup Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    setResult('Testing login...');
    
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
      }
      
      setResult(`
Login Status: ${response.status}
Success: ${response.ok}
Token: ${data.token ? data.token.substring(0, 30) + '...' : 'missing'}
Data: ${JSON.stringify(data, null, 2)}
      `);
    } catch (error) {
      setResult(`Login Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testOnboarding = async () => {
    setLoading(true);
    setResult('Testing onboarding...');
    
    try {
      const authToken = localStorage.getItem('authToken');
      
      if (!authToken) {
        setResult('No token found. Please login first.');
        setLoading(false);
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
      setResult(`
Onboarding Status: ${response.status}
Success: ${response.ok}
Data: ${JSON.stringify(data, null, 2)}
      `);
    } catch (error) {
      setResult(`Onboarding Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const checkToken = () => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    setResult(`
Current Token: ${token || 'null'}
Current User: ${user || 'null'}
LocalStorage Keys: ${Object.keys(localStorage).join(', ')}
    `);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Debug Auth & Onboarding</h1>
      
      <div className="mb-4 space-x-2">
        <button 
          onClick={testCreateUser}
          disabled={loading}
          className="bg-purple-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Working...' : 'Create Test User'}
        </button>
        
        <button 
          onClick={testLogin}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Working...' : 'Test Login'}
        </button>
        
        <button 
          onClick={testOnboarding}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Working...' : 'Test Onboarding'}
        </button>
        
        <button 
          onClick={checkToken}
          disabled={loading}
          className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Check Token
        </button>
        
        <button 
          onClick={() => {localStorage.clear(); setResult('Storage cleared');}}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Clear Storage
        </button>
      </div>
      
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="font-bold mb-2">Result:</h2>
        <pre className="whitespace-pre-wrap text-sm">{result || 'No test run yet'}</pre>
      </div>
    </div>
  );
}
