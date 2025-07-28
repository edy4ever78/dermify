'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { useTranslation } from '@/hooks/useTranslation';
import Header from '@/components/Header';

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate form
    const { firstName, lastName, email, password, confirmPassword } = formData;
    
    if (!firstName || !lastName || !email || !password) {
      setError(t('allFieldsRequired'));
      return;
    }
    
    if (password.length < 8) {
      setError(t('passwordTooShort'));
      return;
    }
    
    if (password !== confirmPassword) {
      setError(t('passwordsDoNotMatch'));
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newUser = await signup({ firstName, lastName, email, password });
      
      // Redirect to onboarding for new users
      router.push('/onboarding');
    } catch (error) {
      setError(error.message || t('signupFailed'));
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 className="text-3xl font-black bg-gradient-to-r from-[#4BA3C7] to-[#A9E5D9] bg-clip-text text-transparent">
              {t('createYourAccount')}
            </h2>
            <p className="text-[#2E2E2E]/80 dark:text-gray-400 text-center font-medium">
              {t('beginYourJourney')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#2E2E2E] dark:text-gray-300 mb-2">
                    {t('firstName')}
                  </label>
                  <input
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-[#A9E5D9]/30 dark:border-gray-600 focus:ring-2 focus:ring-[#4BA3C7] dark:focus:ring-[#A9E5D9] focus:border-[#4BA3C7] bg-[#FCFCFC]/70 dark:bg-gray-800/70 backdrop-blur-sm transition-all duration-300 text-[#2E2E2E] dark:text-white placeholder-[#2E2E2E]/60"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2E2E2E] dark:text-gray-300 mb-2">
                    {t('lastName')}
                  </label>
                  <input
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-[#A9E5D9]/30 dark:border-gray-600 focus:ring-2 focus:ring-[#4BA3C7] dark:focus:ring-[#A9E5D9] focus:border-[#4BA3C7] bg-[#FCFCFC]/70 dark:bg-gray-800/70 backdrop-blur-sm transition-all duration-300 text-[#2E2E2E] dark:text-white placeholder-[#2E2E2E]/60"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2E2E2E] dark:text-gray-300 mb-2">
                  {t('email')}
                </label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('password')}
                </label>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('confirmPassword')}
                </label>
                <input
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all duration-200"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-50/50 dark:bg-red-900/20 backdrop-blur-sm border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-medium shadow-lg shadow-teal-500/25 dark:shadow-teal-800/20 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
            >
              {isSubmitting ? t('creatingAccount') : t('signUp')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link 
              href="/signin" 
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-teal-500 dark:hover:text-teal-400 transition-colors duration-200"
            >
              {t('alreadyHaveAccount')} {t('signIn')} &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
