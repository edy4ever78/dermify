'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { useTranslation } from '@/hooks/useTranslation';
import Header from '@/components/Header';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

function SignInContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirect);
    }
  }, [isAuthenticated, router, redirect]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError(t('emailPasswordRequired'));
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const user = await login(email, password);
      
      // Always redirect to the specified redirect parameter or home page
      // Let the destination page handle onboarding redirect if needed
      router.push(redirect);
    } catch (error) {
      setError(error.message || t('loginFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#FCFCFC] via-[#F6FDFD] to-[#A9E5D9]/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Animated background elements with Dermify colors */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-[#4BA3C7]/20 to-[#A9E5D9]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-32 w-24 h-24 bg-gradient-to-r from-[#A9E5D9]/20 to-[#C8E6C9]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-gradient-to-r from-[#C8E6C9]/15 to-[#4BA3C7]/15 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      <div className="relative w-full max-w-md px-6 py-12">
        <div className="backdrop-blur-xl bg-[#FCFCFC]/90 dark:bg-gray-900/90 rounded-3xl shadow-2xl p-8 border border-[#A9E5D9]/20 dark:border-gray-700/30 transform transition-all duration-500 hover:scale-[1.01]">
          <div className="flex flex-col items-center space-y-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-[#4BA3C7] to-[#A9E5D9] rounded-2xl flex items-center justify-center mb-2">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-3xl font-black bg-gradient-to-r from-[#4BA3C7] to-[#A9E5D9] bg-clip-text text-transparent">
              {t('welcomeBack')}
            </h2>
            <p className="text-[#2E2E2E]/80 dark:text-gray-400 text-center font-medium">
              {t('signIn')} {t('continueYourJourney')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#2E2E2E] dark:text-gray-300 mb-2">
                  {t('email')}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#A9E5D9]/30 dark:border-gray-600 focus:ring-2 focus:ring-[#4BA3C7] dark:focus:ring-[#A9E5D9] focus:border-[#4BA3C7] bg-[#FCFCFC]/70 dark:bg-gray-800/70 backdrop-blur-sm transition-all duration-300 text-[#2E2E2E] dark:text-white placeholder-[#2E2E2E]/60"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#2E2E2E] dark:text-gray-300 mb-2">
                  {t('password')}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#A9E5D9]/30 dark:border-gray-600 focus:ring-2 focus:ring-[#4BA3C7] dark:focus:ring-[#A9E5D9] focus:border-[#4BA3C7] bg-[#FCFCFC]/70 dark:bg-gray-800/70 backdrop-blur-sm transition-all duration-300 text-[#2E2E2E] dark:text-white placeholder-[#2E2E2E]/60"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-[#F28B82]/10 dark:bg-[#F28B82]/20 backdrop-blur-sm border border-[#F28B82]/30 dark:border-[#F28B82]/50">
                <p className="text-sm text-[#F28B82] dark:text-[#F28B82] font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-4 rounded-xl bg-gradient-to-r from-[#4BA3C7] to-[#A9E5D9] hover:from-[#3B92B0] hover:to-[#4BA3C7] text-white font-bold shadow-xl shadow-[#4BA3C7]/25 dark:shadow-[#4BA3C7]/20 focus:ring-2 focus:ring-[#4BA3C7] focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 hover:scale-[1.02] relative overflow-hidden group"
            >
              {/* Button shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <span className="relative z-10">
                {isSubmitting ? t('signingIn') : t('signIn')}
              </span>
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link 
              href="/forgot-password" 
              className="text-sm text-[#2E2E2E]/60 dark:text-gray-400 hover:text-[#4BA3C7] dark:hover:text-[#A9E5D9] transition-colors duration-300 block mb-4 font-medium"
            >
              {t('forgotPassword')}
            </Link>
            <Link 
              href="/signup" 
              className="text-sm text-[#2E2E2E]/80 dark:text-gray-300 hover:text-[#4BA3C7] dark:hover:text-[#A9E5D9] transition-colors duration-300 font-medium"
            >
              {t('dontHaveAccount')} <span className="text-[#4BA3C7] font-bold">{t('createAccount')} →</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInContent />
    </Suspense>
  );
}
