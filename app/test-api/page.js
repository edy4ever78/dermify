'use client';

import { useState } from 'react';

export default function TestAPI() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testLoginAPI = async () => {
    setLoading(true);
    setResult('Testing login API...');
    
    try {
      console.log('Making fetch request to /api/auth/login');
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@test.com',
          password: 'password123'
        })
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      const data = await response.json();
      console.log('Response data:', data);
      
      setResult(`
Status: ${response.status}
Success: ${response.ok}
Data: ${JSON.stringify(data, null, 2)}
      `);
      
    } catch (error) {
      console.error('Fetch error:', error);
      setResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testUserExists = async () => {
    setLoading(true);
    setResult('Checking if test user exists...');
    
    try {
      // First check if Redis is working
      const response = await fetch('/api/test/token', {
        method: 'GET'
      });
      
      const data = await response.json();
      setResult(`
Redis Status: ${response.status}
Data: ${JSON.stringify(data, null, 2)}
      `);
      
    } catch (error) {
      setResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">API Test Page</h1>
      
      <div className="mb-4 space-x-2">
        <button 
          onClick={testLoginAPI}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Login API'}
        </button>
        
        <button 
          onClick={testUserExists}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Redis/User'}
        </button>
      </div>
      
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="font-bold mb-2">Result:</h2>
        <pre className="whitespace-pre-wrap text-sm">{result || 'No test run yet'}</pre>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>Open browser console (F12) to see detailed logs</p>
      </div>
    </div>
  );
}
