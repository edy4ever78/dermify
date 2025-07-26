'use client';

import { useAuth } from '../../context/auth-context';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TestOnboarding() {
  const { user, token, login } = useAuth();
  const [localStorageInfo, setLocalStorageInfo] = useState({});
  const [testResults, setTestResults] = useState([]);
  const [manualToken, setManualToken] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Get localStorage info
    const info = {
      authToken: localStorage.getItem('authToken'),
      user: localStorage.getItem('user'),
      userEmail: localStorage.getItem('userEmail'),
      allKeys: Object.keys(localStorage)
    };
    setLocalStorageInfo(info);
  }, []);

  const refreshStorage = () => {
    const info = {
      authToken: localStorage.getItem('authToken'),
      user: localStorage.getItem('user'),
      userEmail: localStorage.getItem('userEmail'),
      allKeys: Object.keys(localStorage)
    };
    setLocalStorageInfo(info);
  };

  const testLogin = async () => {
    try {
      const user = await login('test@test.com', 'password123');
      setTestResults(prev => [...prev, {
        action: 'Login via Context',
        success: !!user,
        data: user,
        timestamp: new Date().toISOString()
      }]);
      
      // Refresh storage info after login
      setTimeout(refreshStorage, 100);
    } catch (error) {
      setTestResults(prev => [...prev, {
        action: 'Login via Context',
        error: error.message,
        timestamp: new Date().toISOString()
      }]);
    }
  };

  const testDirectLogin = async () => {
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
      
      if (data.token) {
        // Manually store the token
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('userEmail', data.user.email);
      }
      
      setTestResults(prev => [...prev, {
        action: 'Direct Login API',
        status: response.status,
        success: response.ok,
        data: data,
        timestamp: new Date().toISOString()
      }]);

      setTimeout(refreshStorage, 100);
    } catch (error) {
      setTestResults(prev => [...prev, {
        action: 'Direct Login API',
        error: error.message,
        timestamp: new Date().toISOString()
      }]);
    }
  };

  const testOnboarding = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      
      if (!authToken) {
        setTestResults(prev => [...prev, {
          action: 'Onboarding Test',
          error: 'No token found in localStorage',
          timestamp: new Date().toISOString()
        }]);
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
      setTestResults(prev => [...prev, {
        action: 'Onboarding API',
        status: response.status,
        success: response.ok,
        data: data,
        timestamp: new Date().toISOString()
      }]);
    } catch (error) {
      setTestResults(prev => [...prev, {
        action: 'Onboarding API',
        error: error.message,
        timestamp: new Date().toISOString()
      }]);
    }
  };

  const setManualTokenInStorage = () => {
    if (manualToken) {
      localStorage.setItem('authToken', manualToken);
      refreshStorage();
      setTestResults(prev => [...prev, {
        action: 'Manual Token Set',
        success: true,
        data: { token: manualToken.substring(0, 20) + '...' },
        timestamp: new Date().toISOString()
      }]);
    }
  };

  const clearStorage = () => {
    localStorage.clear();
    setLocalStorageInfo({});
    setTestResults([]);
  };

  const goToOnboarding = () => {
    router.push('/onboarding');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Test Onboarding Flow</h1>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Auth Context</h2>
        <div className="bg-gray-100 p-3 rounded">
          <p><strong>User:</strong> {user ? user.email : 'null'}</p>
          <p><strong>Token:</strong> {token ? `"${token.substring(0, 20)}..."` : 'null'}</p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">localStorage</h2>
        <div className="bg-gray-100 p-3 rounded">
          <p><strong>authToken:</strong> {localStorageInfo.authToken ? `"${localStorageInfo.authToken.substring(0, 20)}..."` : 'null'}</p>
          <p><strong>user:</strong> {localStorageInfo.user ? 'exists' : 'null'}</p>
          <p><strong>userEmail:</strong> {localStorageInfo.userEmail || 'null'}</p>
          <p><strong>All keys:</strong> {localStorageInfo.allKeys?.join(', ') || 'none'}</p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Actions</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          <button 
            onClick={testLogin}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Login via Context
          </button>
          <button 
            onClick={testDirectLogin}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Direct Login API
          </button>
          <button 
            onClick={testOnboarding}
            className="bg-purple-500 text-white px-4 py-2 rounded"
          >
            Test Onboarding API
          </button>
          <button 
            onClick={goToOnboarding}
            className="bg-yellow-500 text-white px-4 py-2 rounded"
          >
            Go to Onboarding Page
          </button>
          <button 
            onClick={refreshStorage}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Refresh Info
          </button>
          <button 
            onClick={clearStorage}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Clear Storage
          </button>
        </div>
        
        <div className="flex gap-2 items-center mb-4">
          <input
            type="text"
            placeholder="Paste token here to set manually"
            value={manualToken}
            onChange={(e) => setManualToken(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded flex-1"
          />
          <button 
            onClick={setManualTokenInStorage}
            className="bg-orange-500 text-white px-4 py-2 rounded"
          >
            Set Token
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Test Results</h2>
        <div className="bg-gray-100 p-3 rounded max-h-96 overflow-y-auto">
          {testResults.length === 0 ? (
            <p>No tests run yet</p>
          ) : (
            testResults.map((result, index) => (
              <div key={index} className="mb-3 pb-3 border-b border-gray-300 last:border-b-0">
                <p><strong>{result.action}</strong> - {result.timestamp}</p>
                {result.error ? (
                  <p className="text-red-600">Error: {result.error}</p>
                ) : (
                  <>
                    <p>Status: {result.status} ({result.success ? 'Success' : 'Failed'})</p>
                    <pre className="text-xs mt-1 bg-white p-2 rounded overflow-x-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
