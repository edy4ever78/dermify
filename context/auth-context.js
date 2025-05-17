"use client";
import { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLoading } from './loading-context';

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  error: null,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { setIsLoading: setGlobalLoading } = useLoading();

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First check localStorage for faster loading experience
        const storedUser = localStorage.getItem('user');
        const authToken = localStorage.getItem('authToken');
        
        if (storedUser && authToken) {
          setUser(JSON.parse(storedUser));
          setIsLoading(false);
          return;
        }

        // If not found in localStorage, validate session with server
        const response = await fetch('/api/auth/session', {
          headers: {
            'Authorization': authToken || ''
          }
        });
        const data = await response.json();
        
        if (data.user) {
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
          localStorage.setItem('userEmail', data.user.email);
        } else {
          setUser(null);
          localStorage.removeItem('user');
          localStorage.removeItem('userEmail');
          localStorage.removeItem('authToken');
        }
      } catch (error) {
        console.error('Authentication check error:', error);
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('authToken');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    setError(null);
    setGlobalLoading(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('userEmail', data.user.email);
      localStorage.setItem('authToken', data.token);
      
      return data.user;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setGlobalLoading(false);
    }
  };

  const signup = async (userData) => {
    setError(null);
    setGlobalLoading(true);
    
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('userEmail', data.user.email);
      localStorage.setItem('authToken', data.token);
      
      return data.user;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setGlobalLoading(false);
    }
  };

  const logout = async () => {
    setGlobalLoading(true);
    
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('authToken');
      router.push('/signin');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setGlobalLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      signup,
      logout,
      error,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
