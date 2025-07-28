'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import ChatbotIcon from '@/components/ChatbotIcon';
import TranslatedFooter from '@/components/TranslatedFooter';
import { useLoading } from '@/context/loading-context';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { handleSearch } from '@/utils/search';
import { useTranslation } from '@/hooks/useTranslation';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [hasRedirected, setHasRedirected] = useState(false);
  const { setIsLoading } = useLoading();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();
  
  // Check if user wants to bypass redirects (for debugging or accessing landing page)
  const [bypassRedirect, setBypassRedirect] = useState(false);

  // Add custom animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes gradient-x {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
      }
      @keyframes float-delay {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-15px); }
      }
      @keyframes spin-slow {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes reverse-spin {
        from { transform: rotate(360deg); }
        to { transform: rotate(0deg); }
      }
      .animate-gradient-x {
        background-size: 200% 200%;
        animation: gradient-x 3s ease infinite;
      }
      .animate-shimmer {
        animation: shimmer 2s ease-in-out infinite;
      }
      .animate-float {
        animation: float 6s ease-in-out infinite;
      }
      .animate-float-delay {
        animation: float-delay 8s ease-in-out infinite;
      }
      .animate-spin-slow {
        animation: spin-slow 20s linear infinite;
      }
      .animate-reverse-spin {
        animation: reverse-spin 25s linear infinite;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  // Check for bypass parameter on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      setBypassRedirect(urlParams.get('bypass') === 'true');
    }
  }, []);

  // Handle user redirection based on authentication and onboarding status
  useEffect(() => {
    // Prevent redirect if still loading, already redirected, or bypass is enabled
    if (authLoading || hasRedirected || bypassRedirect) {
      return;
    }

    // ONLY redirect authenticated users who haven't completed onboarding
    // Users who have completed onboarding can freely access the landing page
    if (isAuthenticated && user && typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      
      // Only redirect if user hasn't completed onboarding
      if (currentPath === '/' && user.onboardingCompleted === false) {
        setHasRedirected(true);
        window.location.href = '/onboarding';
      }
      // Do NOT redirect users who have completed onboarding - let them use the landing page
    }
  }, [authLoading, isAuthenticated, user, hasRedirected, bypassRedirect]);

  // Helper function to navigate with loading indicator
  const navigateTo = (path) => {
    setIsLoading(true);
    router.push(path);
  };

  // Handle search form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchQuery, router, setIsLoading);
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FCFCFC] to-[#F6FDFD] dark:from-gray-900 dark:to-gray-800">
        <div className="relative">
          <div className="animate-spin rounded-full h-32 w-32 border-4 border-[#A9E5D9] border-t-[#4BA3C7]"></div>
          <div className="absolute inset-0 rounded-full h-32 w-32 border-4 border-transparent border-t-[#4BA3C7] animate-pulse"></div>
        </div>
      </div>
    );
  }

  // Show redirecting screen only for authenticated users who haven't completed onboarding
  if (isAuthenticated && user && user.onboardingCompleted === false && !hasRedirected && !bypassRedirect) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FCFCFC] to-[#F6FDFD] dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="animate-spin rounded-full h-32 w-32 border-4 border-[#A9E5D9] border-t-[#4BA3C7] mx-auto"></div>
            <div className="absolute inset-0 rounded-full h-32 w-32 border-4 border-transparent border-t-[#4BA3C7] animate-pulse mx-auto"></div>
          </div>
          <p className="text-[#2E2E2E] dark:text-gray-300 text-lg font-medium">Redirecting to onboarding...</p>
          <p className="text-sm text-[#2E2E2E]/60 dark:text-gray-400 mt-2">
            If you're stuck, <a href="/?bypass=true" className="text-[#4BA3C7] underline hover:text-[#3B92B0]">click here</a> to access the home page
          </p>
        </div>
      </div>
    );
  }

  // For all other cases (not authenticated, completed onboarding, or bypass), show the landing page

  return (
    <>
      <Header />
      
      <main className="min-h-screen">
        {/* Hero Section with Dermify Color Palette */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#FCFCFC] via-[#F6FDFD] to-[#A9E5D9]/20 dark:from-gray-900 dark:via-gray-800 dark:to-[#4BA3C7]/10 min-h-screen flex items-center">
          {/* Enhanced floating orbs with Dermify colors */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-[#4BA3C7]/30 to-[#A9E5D9]/30 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-[#A9E5D9]/30 to-[#C8E6C9]/30 rounded-full blur-xl animate-pulse delay-1000"></div>
            <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-r from-[#C8E6C9]/20 to-[#4BA3C7]/20 rounded-full blur-xl animate-pulse delay-2000"></div>
            <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-r from-[#F28B82]/25 to-[#A9E5D9]/25 rounded-full blur-xl animate-pulse delay-500"></div>
            
            {/* Additional floating elements with Dermify palette */}
            <div className="absolute top-1/3 left-1/3 w-20 h-20 bg-gradient-to-r from-[#4BA3C7]/20 to-[#A9E5D9]/20 rounded-full blur-lg animate-bounce"></div>
            <div className="absolute top-3/4 right-1/4 w-16 h-16 bg-gradient-to-r from-[#C8E6C9]/25 to-[#A9E5D9]/25 rounded-full blur-lg animate-bounce delay-700"></div>
            <div className="absolute bottom-1/3 left-3/4 w-12 h-12 bg-gradient-to-r from-[#4BA3C7]/30 to-[#C8E6C9]/30 rounded-full blur-md animate-ping"></div>
            
            {/* Hero background video with Dermify colors */}
                  <video
                    className="absolute top-0 left-0 w-full h-full object-cover opacity-80"
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster="/videos/skincare-hero.jpg"
                  >
                    <source src="/videos/skincare-hero.mp4" type="video/mp4" />
                    {/* Fallback text */}
                    Your browser does not support the video tag.
                  </video>
                  </div>

                  {/* Enhanced glass overlay with Dermify tint */}
                  <div className="absolute inset-0 backdrop-blur-sm bg-[#FCFCFC]/5 dark:bg-black/5"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#F6FDFD]/10 to-transparent animate-shimmer"></div>

                  {/* Content */}
          <div className="relative z-20 w-full py-12 sm:py-16 md:py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              {/* Main Title with Dermify Glass Background */}
              <div className="backdrop-blur-xl bg-[#FCFCFC]/10 dark:bg-gray-800/20 rounded-2xl p-6 sm:p-8 mb-8 sm:mb-10 border border-[#A9E5D9]/20 dark:border-gray-700/30 shadow-2xl relative overflow-hidden group">
                {/* Animated border gradient with Dermify colors */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#4BA3C7]/20 via-[#A9E5D9]/20 to-[#C8E6C9]/20 rounded-2xl animate-gradient-x"></div>
                <div className="absolute inset-[1px] bg-[#FCFCFC]/10 dark:bg-gray-800/20 backdrop-blur-xl rounded-2xl"></div>
                
                {/* Content with z-index */}
                <div className="relative z-10">
                  <h1 className="text-3xl font-black text-[#2E2E2E] dark:text-white sm:text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight">
                    <span className="bg-gradient-to-r from-[#4BA3C7] via-[#A9E5D9] to-[#4BA3C7] bg-clip-text text-transparent animate-gradient-x">
                      {t('heroTitle')}
                    </span>
                  </h1>
                  <p className="mt-4 max-w-2xl mx-auto text-base text-[#2E2E2E]/80 dark:text-gray-300 sm:text-lg md:text-xl font-medium leading-relaxed">
                    {t('heroSubtitle')}
                  </p>
                </div>
                
                {/* Floating particles with Dermify colors */}
                <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-[#4BA3C7] rounded-full animate-ping"></div>
                <div className="absolute bottom-4 left-4 w-1 h-1 bg-[#A9E5D9] rounded-full animate-ping delay-500"></div>
                <div className="absolute top-1/2 right-6 w-0.5 h-0.5 bg-[#C8E6C9] rounded-full animate-pulse"></div>
              </div>
              
              <div className="max-w-sm mx-auto">
                <form onSubmit={handleSubmit} className="relative group">
                  {/* Enhanced Dermify Glass Container */}
                  <div className="relative backdrop-blur-xl bg-[#FCFCFC]/80 dark:bg-gray-800/80 rounded-xl p-1.5 shadow-xl border border-[#A9E5D9]/20 dark:border-gray-700/30 transition-all duration-300 group-hover:shadow-2xl group-hover:scale-[1.01] overflow-hidden">
                    {/* Animated border glow with Dermify colors */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#4BA3C7]/30 via-[#A9E5D9]/30 to-[#C8E6C9]/30 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute inset-[1px] bg-[#FCFCFC]/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl"></div>
                    
                    <div className="relative z-10 flex items-center space-x-2">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t('searchPlaceholder')}
                        className="flex-1 px-3 py-3 bg-transparent text-[#2E2E2E] dark:text-white placeholder:text-[#2E2E2E]/60 dark:placeholder:text-gray-400 text-base font-medium focus:outline-none"
                        aria-label="Search"
                      />
                      <button 
                        type="submit"
                        className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-[#4BA3C7] to-[#A9E5D9] rounded-lg flex items-center justify-center text-white hover:from-[#3B92B0] hover:to-[#4BA3C7] transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg relative overflow-hidden group"
                      >
                        {/* Button glow effect with Dermify colors */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#4BA3C7] to-[#A9E5D9] opacity-0 group-hover:opacity-50 transition-opacity duration-300 rounded-lg blur-sm"></div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              
              {/* Enhanced Dermify Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center max-w-lg mx-auto">
                <button 
                  onClick={() => navigateTo('/skin-analysis')}
                  className="flex-1 bg-gradient-to-r from-[#4BA3C7] to-[#A9E5D9] text-white font-bold py-3 px-6 rounded-xl hover:from-[#3B92B0] hover:to-[#4BA3C7] transition-all duration-300 transform hover:scale-[1.01] shadow-lg hover:shadow-xl backdrop-blur-sm relative overflow-hidden group"
                >
                  {/* Button shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <span className="text-base relative z-10">✨ {t('analyzeYourSkin')}</span>
                </button>
                <button 
                  onClick={() => navigateTo('/products')}
                  className="flex-1 backdrop-blur-xl bg-[#FCFCFC]/90 dark:bg-gray-800/90 text-[#2E2E2E] dark:text-white font-bold py-3 px-6 rounded-xl border border-[#A9E5D9]/50 dark:border-gray-700/50 hover:bg-[#F6FDFD] dark:hover:bg-gray-700 hover:border-[#4BA3C7]/60 transition-all duration-300 transform hover:scale-[1.01] shadow-lg hover:shadow-xl relative overflow-hidden group"
                >
                  {/* Button shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#A9E5D9]/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <span className="text-base relative z-10">🔍 {t('analyzeProducts')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section - Dermify Color Palette */}
        <div className="py-12 sm:py-16 bg-gradient-to-br from-[#FCFCFC] via-[#F6FDFD] to-[#A9E5D9]/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
          {/* Animated background elements with Dermify colors */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-16 left-16 w-24 h-24 bg-gradient-to-r from-[#4BA3C7]/10 to-[#A9E5D9]/10 rounded-full blur-xl animate-float"></div>
            <div className="absolute bottom-32 right-32 w-20 h-20 bg-gradient-to-r from-[#A9E5D9]/10 to-[#C8E6C9]/10 rounded-full blur-xl animate-float-delay"></div>
            <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-gradient-to-r from-[#4BA3C7]/15 to-[#A9E5D9]/15 rounded-full blur-lg animate-pulse"></div>
          </div>
          
          {/* Enhanced glass overlay with Dermify tint */}
          <div className="absolute inset-0 backdrop-blur-sm bg-[#FCFCFC]/5 dark:bg-black/5"></div>
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(75,163,199,0.1),transparent_50%)]"></div>
          </div>
          
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              {/* Enhanced title with Dermify colors */}
              <div className="backdrop-blur-xl bg-[#FCFCFC]/20 dark:bg-gray-800/20 rounded-2xl p-4 sm:p-6 inline-block mb-6 border border-[#A9E5D9]/20 dark:border-gray-700/30 shadow-lg relative overflow-hidden group">
                {/* Animated background gradient with Dermify colors */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#4BA3C7]/10 via-[#A9E5D9]/10 to-[#C8E6C9]/10 animate-gradient-x"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(252,252,252,0.1),transparent_70%)] group-hover:opacity-100 opacity-0 transition-opacity duration-500"></div>
                
                <h2 className="text-2xl sm:text-3xl font-black text-[#2E2E2E] dark:text-white tracking-tight relative z-10">
                  <span className="bg-gradient-to-r from-[#4BA3C7] to-[#A9E5D9] bg-clip-text text-transparent">
                    {t('howItWorks')}
                  </span>
                </h2>
                
                {/* Floating micro-animations with Dermify colors */}
                <div className="absolute top-2 right-3 w-0.5 h-0.5 bg-[#4BA3C7] rounded-full animate-ping"></div>
                <div className="absolute bottom-2 left-4 w-0.5 h-0.5 bg-[#A9E5D9] rounded-full animate-pulse delay-300"></div>
              </div>
              <p className="text-lg sm:text-xl text-[#2E2E2E]/80 dark:text-gray-300 max-w-2xl mx-auto font-medium leading-relaxed">
                {t('howItWorksSubtitle')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  step: '01',
                  title: t('steps.analyze.title'),
                  description: t('steps.analyze.description'),
                  icon: '🔍',
                  gradient: 'from-[#4BA3C7] to-[#A9E5D9]'
                },
                {
                  step: '02',
                  title: t('steps.discover.title'),
                  description: t('steps.discover.description'),
                  icon: '💡',
                  gradient: 'from-[#A9E5D9] to-[#C8E6C9]'
                },
                {
                  step: '03',
                  title: t('steps.transform.title'),
                  description: t('steps.transform.description'),
                  icon: '✨',
                  gradient: 'from-[#C8E6C9] to-[#4BA3C7]'
                }
              ].map((item, index) => (
                <div key={index} className="relative group">
                  {/* Enhanced Dermify Glass Card */}
                  <div className="relative backdrop-blur-xl bg-[#FCFCFC]/80 dark:bg-gray-800/80 rounded-2xl p-6 sm:p-8 shadow-xl border border-[#A9E5D9]/20 dark:border-gray-700/30 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
                    {/* Animated border gradient with Dermify colors */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#F6FDFD]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer"></div>
                    
                    {/* Floating particles with Dermify colors */}
                    <div className="absolute top-3 right-4 w-0.5 h-0.5 bg-[#4BA3C7] rounded-full animate-ping opacity-50"></div>
                    <div className="absolute bottom-4 left-6 w-0.5 h-0.5 bg-[#A9E5D9] rounded-full animate-pulse delay-500 opacity-60"></div>
                    <div className="absolute top-1/3 right-3 w-1 h-1 bg-[#C8E6C9] rounded-full animate-bounce delay-1000 opacity-40"></div>
                    
                    {/* Floating Icon Container with Dermify colors */}
                    <div className={`relative w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-r ${item.gradient} flex items-center justify-center text-xl sm:text-2xl mb-4 sm:mb-6 mx-auto group-hover:scale-105 group-hover:rotate-2 transition-all duration-500 shadow-lg overflow-hidden`}>
                      {item.icon}
                      {/* Enhanced glow effect */}
                      <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${item.gradient} blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500`}></div>
                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    </div>
                    
                    {/* Step number with Dermify style */}
                    <div className="text-xs font-black text-[#2E2E2E]/60 dark:text-gray-500 mb-2 text-center tracking-wider">
                      STEP {item.step}
                    </div>
                    
                    <h3 className="text-lg sm:text-xl font-black text-[#2E2E2E] dark:text-white mb-3 sm:mb-4 text-center leading-tight">
                      {item.title}
                    </h3>
                    
                    <p className="text-sm sm:text-base text-[#2E2E2E]/80 dark:text-gray-300 text-center leading-relaxed font-medium">
                      {item.description}
                    </p>
                  </div>
                  
                  {/* Connection Line with Dermify colors */}
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <div className="w-8 h-0.5 bg-gradient-to-r from-[#A9E5D9] to-[#4BA3C7] dark:from-gray-600 dark:to-gray-500"></div>
                      <div className="absolute -right-1 -top-0.5 w-1.5 h-1.5 bg-gradient-to-r from-[#4BA3C7] to-[#A9E5D9] rounded-full"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Safety Score Section - iOS 18 Style */}
        <div className="py-12 sm:py-16 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20 relative">
          {/* Glass overlay */}
          <div className="absolute inset-0 backdrop-blur-sm bg-white/5 dark:bg-black/5"></div>
          
          <div className="relative max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-center mb-10 sm:mb-12">
              {/* Title with glass background */}
              <div className="backdrop-blur-xl bg-white/20 dark:bg-gray-800/20 rounded-2xl p-4 sm:p-6 inline-block mb-6 border border-white/20 dark:border-gray-700/30 shadow-lg">
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                  <span className="bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
                    {t('safetyScores')}
                  </span>
                </h2>
              </div>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-medium leading-relaxed">
                {t('safetyScoresSubtitle')}
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 sm:gap-8">
              {[
                { score: 1, gradient: 'from-[#C8E6C9] to-emerald-500', label: t('safetyLabels.excellent'), description: t('safetyDescriptions.excellent') },
                { score: 3, gradient: 'from-[#C8E6C9] to-green-500', label: t('safetyLabels.good'), description: t('safetyDescriptions.good') },
                { score: 5, gradient: 'from-[#A9E5D9] to-[#4BA3C7]', label: t('safetyLabels.moderate'), description: t('safetyDescriptions.moderate') },
                { score: 7, gradient: 'from-yellow-400 to-[#F28B82]', label: t('safetyLabels.caution'), description: t('safetyDescriptions.caution') },
                { score: 9, gradient: 'from-[#F28B82] to-red-500', label: t('safetyLabels.highRisk'), description: t('safetyDescriptions.highRisk') },
              ].map((item) => (
                <div key={item.score} className="text-center group">
                  {/* Enhanced iOS 18 Glass Card with consistent styling */}
                  <div className="backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 sm:p-8 shadow-xl border border-white/20 dark:border-gray-700/30 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] relative overflow-hidden min-h-[280px] flex flex-col justify-between">
                    {/* Hover glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Floating micro particles */}
                    <div className="absolute top-2 right-3 w-1 h-1 bg-indigo-400 rounded-full animate-ping opacity-60"></div>
                    <div className="absolute bottom-3 left-4 w-0.5 h-0.5 bg-pink-400 rounded-full animate-pulse delay-700 opacity-50"></div>
                    
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r ${item.gradient} rounded-xl flex items-center justify-center text-white text-lg sm:text-xl font-black mb-4 sm:mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-500 relative overflow-hidden`}>
                        {item.score}
                        {/* Enhanced glow effect */}
                        <div className={`absolute w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r ${item.gradient} rounded-xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500`}></div>
                        {/* Shine effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                      </div>
                      <h3 className="font-black text-gray-900 dark:text-white mb-3 sm:mb-4 text-lg sm:text-xl">{item.label}</h3>
                    </div>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed font-medium text-center">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 sm:mt-16 text-center">
              {/* iOS 18 Disclaimer Card with enhanced glass effect */}
              <div className="backdrop-blur-2xl bg-white/40 dark:bg-gray-800/40 rounded-3xl p-6 sm:p-8 border border-white/30 dark:border-gray-700/30 max-w-4xl mx-auto shadow-2xl">
                <div className="backdrop-blur-xl bg-white/20 dark:bg-gray-700/20 rounded-2xl p-4 sm:p-6 border border-white/20 dark:border-gray-600/20">
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                    {t('safetyDisclaimer')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Sections - iOS 18 Style */}
        <div className="py-12 sm:py-16 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 relative">
          {/* Glass overlay */}
          <div className="absolute inset-0 backdrop-blur-sm bg-white/5 dark:bg-black/5"></div>
          
          <div className="relative max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-center mb-12 sm:mb-16">
              {/* Title with glass background */}
              <div className="backdrop-blur-xl bg-white/20 dark:bg-gray-800/20 rounded-2xl p-4 sm:p-6 inline-block mb-6 border border-white/20 dark:border-gray-700/30 shadow-lg">
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                  <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                    {t('whatDermifyOffers')}
                  </span>
                </h2>
              </div>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-medium leading-relaxed">
                {t('whatDermifyOffersSubtitle')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
              {/* Product Analysis */}
              <div className="group relative">
                {/* iOS 18 Glass Card */}
                <div className="relative backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 sm:p-8 shadow-xl border border-white/20 dark:border-gray-700/30 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02]">
                  {/* Floating Icon */}
                  <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-r from-teal-400 to-teal-600 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                    <svg className="h-6 w-6 sm:h-8 sm:w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    {/* Glow effect */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-400 to-teal-600 blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                  </div>
                  
                  <h3 className="text-lg sm:text-xl font-black mb-3 sm:mb-4 text-gray-900 dark:text-white">{t('productAnalysis')}</h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 leading-relaxed font-medium">
                    {t('productAnalysisDesc')}
                  </p>
                  
                  <div className="mb-4 sm:mb-6 space-y-2">
                    {[
                      t('productFeatures.comprehensiveBreakdown'),
                      t('productFeatures.safetyScoring'),
                      t('productFeatures.personalizedRecommendations')
                    ].map((feature, i) => (
                      <div key={i} className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium">
                        <div className="w-1.5 h-1.5 bg-gradient-to-r from-green-400 to-green-500 rounded-full mr-2 flex-shrink-0"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  <button 
                    onClick={() => navigateTo('/products')}
                    className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold py-3 px-4 rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-[1.02] focus:outline-none shadow-lg hover:shadow-xl text-sm sm:text-base"
                  >
                    {t('analyzeProducts')}
                  </button>
                </div>
              </div>
              
              {/* Ingredient Database */}
              <div className="group relative">
                <div className="relative backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 sm:p-8 shadow-xl border border-white/20 dark:border-gray-700/30 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02]">
                  <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                    <svg className="h-6 w-6 sm:h-8 sm:w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 to-blue-600 blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                  </div>
                  
                  <h3 className="text-lg sm:text-xl font-black mb-3 sm:mb-4 text-gray-900 dark:text-white">{t('ingredientDatabase')}</h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 leading-relaxed font-medium">
                    {t('ingredientDatabaseDesc')}
                  </p>
                  
                  <div className="mb-4 sm:mb-6 space-y-2">
                    {[
                      t('productFeatures.studiedIngredients'),
                      t('productFeatures.evidenceRatings'),
                      t('productFeatures.skinCompatibility')
                    ].map((feature, i) => (
                      <div key={i} className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium">
                        <div className="w-1.5 h-1.5 bg-gradient-to-r from-green-400 to-green-500 rounded-full mr-2 flex-shrink-0"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  <button 
                    onClick={() => navigateTo('/ingredients')}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-[1.02] focus:outline-none shadow-lg hover:shadow-xl text-sm sm:text-base"
                  >
                    {t('exploreIngredients')}
                  </button>
                </div>
              </div>
              
              {/* Face Analysis */}
              <div className="group relative">
                <div className="relative backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 sm:p-8 shadow-xl border border-white/20 dark:border-gray-700/30 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02]">
                  <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                    <svg className="h-6 w-6 sm:h-8 sm:w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400 to-purple-600 blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                  </div>
                  
                  <h3 className="text-lg sm:text-xl font-black mb-3 sm:mb-4 text-gray-900 dark:text-white">{t('faceAnalysis')}</h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 leading-relaxed font-medium">
                    {t('faceAnalysisDesc')}
                  </p>
                  
                  <div className="mb-4 sm:mb-6 space-y-2">
                    {[
                      t('productFeatures.aiPoweredDetection'),
                      t('productFeatures.conditionIdentification'),
                      t('productFeatures.personalizedRoutines')
                    ].map((feature, i) => (
                      <div key={i} className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium">
                        <div className="w-1.5 h-1.5 bg-gradient-to-r from-green-400 to-green-500 rounded-full mr-2 flex-shrink-0"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  <button 
                    onClick={() => navigateTo('/skin-analysis')}
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold py-3 px-4 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] focus:outline-none shadow-lg hover:shadow-xl text-sm sm:text-base"
                  >
                    {t('analyzeYourSkin')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Latest Analyzed Products - iOS 18 Style */}
        <div className="py-16 sm:py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20 relative">
          {/* Glass overlay */}
          <div className="absolute inset-0 backdrop-blur-sm bg-white/5 dark:bg-black/5"></div>
          
          <div className="relative max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-center mb-12 sm:mb-16">
              {/* Title with glass background */}
              <div className="backdrop-blur-xl bg-white/20 dark:bg-gray-800/20 rounded-3xl p-6 sm:p-8 inline-block mb-8 border border-white/20 dark:border-gray-700/30 shadow-xl">
                <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {t('recentlyAnalyzed')}
                  </span>
                </h2>
              </div>
              <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                {t('recentlyAnalyzedSubtitle')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {[
                { id: "cerave-hydrating-cleanser", name: "Hydrating Cleanser", brand: "CeraVe", score: 2, users: 1240, category: "cleansers" },
                { id: "paula-choice-bha-liquid-exfoliant", name: "2% BHA Liquid Exfoliant", brand: "Paula's Choice", score: 3, users: 980, category: "exfoliants" },
                { id: "dr-jart-ceramidin-cream", name: "Ceramidin Cream", brand: "Dr. Jart+", score: 2, users: 756, category: "moisturizers" },
                { id: "la-roche-posay-anthelios-ultra-fluid-spf-50-facial-sunscreen", name: "Anthelios SPF 50+", brand: "La Roche-Posay", score: 1, users: 1120, category: "sunscreens" }
              ].map((product, index) => (
                <div key={product.id} className="group">
                  {/* Enhanced iOS 18 Product Card with consistent sizing */}
                  <div className="backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 sm:p-8 shadow-xl border border-white/20 dark:border-gray-700/30 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] relative overflow-hidden min-h-[280px] flex flex-col">
                    {/* Animated background on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Floating particles */}
                    <div className="absolute top-4 right-6 w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-50 group-hover:opacity-80"></div>
                    <div className="absolute bottom-8 left-6 w-0.5 h-0.5 bg-pink-400 rounded-full animate-pulse delay-300 opacity-60"></div>
                    
                    {/* Score Badge with enhanced effects */}
                    <div className="flex justify-between items-start mb-4 sm:mb-6 relative z-10">
                      <div className={`relative w-12 h-12 sm:w-16 sm:h-16 rounded-xl ${
                        product.score <= 2 ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 
                        product.score <= 4 ? 'bg-gradient-to-r from-yellow-400 to-amber-500' : 'bg-gradient-to-r from-red-400 to-pink-500'
                      } text-white font-black flex items-center justify-center text-lg sm:text-xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 overflow-hidden`}>
                        {product.score}
                        {/* Enhanced glow effect */}
                        <div className={`absolute inset-0 rounded-xl ${
                          product.score <= 2 ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 
                          product.score <= 4 ? 'bg-gradient-to-r from-yellow-400 to-amber-500' : 'bg-gradient-to-r from-red-400 to-pink-500'
                        } blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500`}></div>
                        {/* Shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-800"></div>
                      </div>
                    </div>
                    
                    {/* Product Info */}
                    <div className="space-y-3 sm:space-y-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-black text-base sm:text-lg text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300 leading-tight mb-2">
                          {product.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base font-medium">{product.brand}</p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-xs sm:text-sm bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-600 dark:to-gray-700 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-full capitalize font-medium">
                          {product.category.replace('-', ' ')}
                        </span>
                        <button 
                          onClick={() => navigateTo(`/products/${product.category}/${product.id}`)}
                          className="text-xs sm:text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-bold transition-colors duration-300 flex items-center space-x-1"
                        >
                          <span>{t('viewDetails')}</span>
                          <svg className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Call to Action */}
            <div className="text-center mt-12 sm:mt-16">
              <button 
                onClick={() => navigateTo('/products')}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-[1.02] shadow-2xl hover:shadow-3xl text-base sm:text-lg"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {t('analyzeMoreProducts')}
              </button>
            </div>
          </div>
        </div>

        {/* Trending Ingredients Section - iOS 18 Style */}
        <div className="py-16 sm:py-20 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-emerald-900/20 dark:to-teal-900/20 relative">
          {/* Glass overlay */}
          <div className="absolute inset-0 backdrop-blur-sm bg-white/5 dark:bg-black/5"></div>
          
          <div className="relative max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-center mb-12 sm:mb-16">
              {/* Title with glass background */}
              <div className="backdrop-blur-xl bg-white/20 dark:bg-gray-800/20 rounded-3xl p-6 sm:p-8 inline-block mb-8 border border-white/20 dark:border-gray-700/30 shadow-xl">
                <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                  <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    {t('trendingIngredients')}
                  </span>
                </h2>
              </div>
              <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                {t('trendingIngredientsSubtitle')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {[
                { 
                  name: "Niacinamide", 
                  popularity: 95, 
                  benefits: ["Reduces oil", "Minimizes pores", "Anti-inflammatory"],
                  safetyScore: 2,
                  trendingUp: true,
                  gradient: "from-blue-400 to-blue-600"
                },
                { 
                  name: "Hyaluronic Acid", 
                  popularity: 92, 
                  benefits: ["Deep hydration", "Plumps skin", "Anti-aging"],
                  safetyScore: 1,
                  trendingUp: true,
                  gradient: "from-emerald-400 to-emerald-600"
                },
                { 
                  name: "Retinol", 
                  popularity: 88, 
                  benefits: ["Reduces wrinkles", "Improves texture", "Brightens"],
                  safetyScore: 4,
                  trendingUp: false,
                  gradient: "from-amber-400 to-orange-600"
                },
                { 
                  name: "Vitamin C", 
                  popularity: 85, 
                  benefits: ["Antioxidant", "Brightening", "Collagen boost"],
                  safetyScore: 3,
                  trendingUp: true,
                  gradient: "from-yellow-400 to-amber-600"
                }
              ].map((ingredient, index) => (
                <div key={ingredient.name} className="group">
                  {/* iOS 18 Ingredient Card with consistent styling */}
                  <div className="backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 sm:p-8 shadow-xl border border-white/20 dark:border-gray-700/30 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] min-h-[320px] flex flex-col">
                    {/* Header with Score and Trending */}
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <div className={`relative w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-r ${
                        ingredient.safetyScore <= 2 ? 'from-green-400 to-emerald-500' : 
                        ingredient.safetyScore <= 4 ? 'from-yellow-400 to-amber-500' : 'from-red-400 to-pink-500'
                      } text-white font-black flex items-center justify-center text-lg sm:text-xl shadow-lg`}>
                        {ingredient.safetyScore}
                        <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${
                          ingredient.safetyScore <= 2 ? 'from-green-400 to-emerald-500' : 
                          ingredient.safetyScore <= 4 ? 'from-yellow-400 to-amber-500' : 'from-red-400 to-pink-500'
                        } blur-xl opacity-30 transition-opacity duration-500`}></div>
                      </div>
                      {ingredient.trendingUp && (
                        <div className="flex items-center space-x-1 text-green-500">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                          </svg>
                          <span className="text-xs font-bold">Trending</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Ingredient Name */}
                    <h3 className="font-black text-lg sm:text-xl text-gray-900 dark:text-white mb-4 sm:mb-6 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
                      {ingredient.name}
                    </h3>
                    
                    {/* Benefits */}
                    <div className="space-y-2 mb-6 sm:mb-8 flex-1">
                      {ingredient.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-center text-sm sm:text-base text-gray-600 dark:text-gray-300 font-medium">
                          <div className="w-1.5 h-1.5 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full mr-2 flex-shrink-0"></div>
                          {benefit}
                        </div>
                      ))}
                    </div>
                    
                    {/* Learn More Button */}
                    <button 
                      onClick={() => navigateTo(`/ingredients/${ingredient.name.toLowerCase().replace(' ', '-')}`)}
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-3 px-4 rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl text-sm sm:text-base flex items-center justify-center space-x-2"
                    >
                      <span>{t('learnMore')}</span>
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12 sm:mt-16">
              <button 
                onClick={() => navigateTo('/ingredients')}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black rounded-2xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-[1.02] shadow-2xl hover:shadow-3xl text-base sm:text-lg"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                {t('exploreAllIngredients')}
              </button>
            </div>
          </div>
        </div>

        {/* Skin Concerns Section - iOS 18 Style */}
        <div className="py-16 sm:py-20 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-gray-900 dark:via-orange-900/20 dark:to-red-900/20 relative">
          {/* Glass overlay */}
          <div className="absolute inset-0 backdrop-blur-sm bg-white/5 dark:bg-black/5"></div>
          
          <div className="relative max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-center mb-12 sm:mb-16">
              {/* Title with glass background */}
              <div className="backdrop-blur-xl bg-white/20 dark:bg-gray-800/20 rounded-3xl p-6 sm:p-8 inline-block mb-8 border border-white/20 dark:border-gray-700/30 shadow-xl">
                <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                  <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    {t('commonSkinConcerns')}
                  </span>
                </h2>
              </div>
              <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                {t('commonSkinConcernsSubtitle')}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-3 lg:grid-cols-6">
              {[
                { name: t('skinConcernTypes.acne'), icon: '😞', users: '12k+', description: t('skinConcernDescriptions.acne'), gradient: "from-red-400 to-red-600" },
                { name: t('skinConcernTypes.aging'), icon: '⏳', users: '8k+', description: t('skinConcernDescriptions.aging'), gradient: "from-purple-400 to-purple-600" },
                { name: t('skinConcernTypes.dryness'), icon: '🏜️', users: '15k+', description: t('skinConcernDescriptions.dryness'), gradient: "from-yellow-400 to-orange-600" },
                { name: t('skinConcernTypes.redness'), icon: '🔴', users: '6k+', description: t('skinConcernDescriptions.redness'), gradient: "from-pink-400 to-red-600" },
                { name: t('skinConcernTypes.hyperpigmentation'), icon: '🎭', users: '9k+', description: t('skinConcernDescriptions.hyperpigmentation'), gradient: "from-indigo-400 to-purple-600" },
                { name: t('skinConcernTypes.sensitivity'), icon: '⚡', users: '11k+', description: t('skinConcernDescriptions.sensitivity'), gradient: "from-emerald-400 to-teal-600" }
              ].map((concern) => (
                <div 
                  key={concern.name}
                  onClick={() => navigateTo(`/concerns/${concern.name.toLowerCase()}`)}
                  className="group cursor-pointer"
                >
                  {/* Enhanced iOS 18 Concern Card with consistent styling */}
                  <div className="backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 sm:p-8 text-center shadow-xl border border-white/20 dark:border-gray-700/30 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] min-h-[280px] flex flex-col justify-between relative overflow-hidden">
                    {/* Animated background gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-red-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Floating micro animations */}
                    <div className="absolute top-3 right-4 w-1 h-1 bg-orange-400 rounded-full animate-ping opacity-50 group-hover:opacity-80"></div>
                    <div className="absolute bottom-4 left-5 w-0.5 h-0.5 bg-red-400 rounded-full animate-pulse delay-500 opacity-60"></div>
                    <div className="absolute top-1/2 right-3 w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce delay-1000 opacity-40"></div>
                    
                    {/* Enhanced Icon Container */}
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-r ${concern.gradient} flex items-center justify-center text-xl sm:text-2xl mb-4 sm:mb-6 mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg relative overflow-hidden`}>
                      {concern.icon}
                      {/* Enhanced glow effect */}
                      <div className={`absolute w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-r ${concern.gradient} blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500`}></div>
                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="font-black text-gray-900 dark:text-white mb-2 sm:mb-3 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300 text-sm sm:text-base leading-tight break-words">
                        {concern.name}
                      </h3>
                      
                      <p className="text-xs sm:text-sm text-orange-600 dark:text-orange-400 mb-2 font-bold">
                        {concern.users} {t('usersHelped')}
                      </p>
                      
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium break-words">
                        {concern.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12 sm:mt-16">
              {/* Enhanced glass call-to-action */}
              <div className="backdrop-blur-xl bg-white/20 dark:bg-gray-800/20 rounded-2xl p-6 sm:p-8 inline-block border border-white/20 dark:border-gray-700/30 shadow-xl mb-6">
                <button 
                  onClick={() => navigateTo('/concerns')}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-black rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl text-base sm:text-lg backdrop-blur-sm"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {t('viewAllConcerns')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Feature highlight - Face Analysis - iOS 18 Style */}
        <div className="py-20 sm:py-24 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-900/30 dark:to-purple-900/30 relative overflow-hidden">
          {/* iOS 18 Background Orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-10 w-40 h-40 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-32 h-32 bg-gradient-to-r from-pink-400/20 to-red-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
          </div>

          <div className="relative max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 items-center">
              {/* Content */}
              <div className="space-y-8 sm:space-y-10 order-2 lg:order-1">
                <div>
                  <h2 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-6 sm:mb-8 tracking-tight leading-tight">
                    <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {t('revolutionizeTitle')}
                    </span>
                  </h2>
                  <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8 sm:mb-10 font-medium">
                    {t('revolutionizeSubtitle')}
                  </p>
                </div>
                
                <div className="space-y-6 sm:space-y-8">
                  {[
                    { icon: '📸', title: t('aiSteps.upload.title'), description: t('aiSteps.upload.description'), gradient: "from-blue-400 to-blue-600" },
                    { icon: '🤖', title: t('aiSteps.analysis.title'), description: t('aiSteps.analysis.description'), gradient: "from-purple-400 to-purple-600" },
                    { icon: '📋', title: t('aiSteps.recommendations.title'), description: t('aiSteps.recommendations.description'), gradient: "from-pink-400 to-pink-600" }
                  ].map((step, index) => (
                    <div key={index} className="flex items-start space-x-4 sm:space-x-6 group">
                      <div className={`relative flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r ${step.gradient} rounded-2xl flex items-center justify-center text-white text-xl sm:text-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl`}>
                        {step.icon}
                        {/* Glow effect */}
                        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${step.gradient} blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500`}></div>
                      </div>
                      <div>
                        <h3 className="font-black text-gray-900 dark:text-white mb-2 text-lg sm:text-xl">{step.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg font-medium leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <button 
                    onClick={() => navigateTo('/skin-analysis')}
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black py-4 sm:py-5 px-8 sm:px-10 rounded-2xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] shadow-2xl hover:shadow-3xl text-lg sm:text-xl"
                  >
                    ✨ {t('startFreeAnalysis')}
                  </button>
                  <button 
                    onClick={() => navigateTo('/about')}
                    className="flex-1 backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 text-indigo-600 dark:text-indigo-400 font-black py-4 sm:py-5 px-8 sm:px-10 rounded-2xl border-2 border-indigo-500/30 hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-[1.02] shadow-2xl hover:shadow-3xl text-lg sm:text-xl"
                  >
                    📖 {t('learnMore')}
                  </button>
                </div>
              </div>
              
              {/* Visual */}
              <div className="relative order-1 lg:order-2">
                {/* Main Card */}
                <div className="relative backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 rounded-3xl shadow-2xl p-8 sm:p-10 transform hover:rotate-0 transition-all duration-500 border border-white/20 dark:border-gray-700/30">
                  {/* Analysis Visualization */}
                  <div className="aspect-square bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 dark:from-gray-700 dark:via-indigo-800 dark:to-purple-800 rounded-2xl flex items-center justify-center mb-6 sm:mb-8 relative overflow-hidden">
                    <div className="text-6xl sm:text-8xl animate-pulse">🔍</div>
                    {/* Scanning Animation */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                  </div>
                  
                  {/* Analysis Results */}
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-green-500 rounded-full animate-pulse"></div>
                      <div className="h-3 sm:h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded w-3/4 animate-pulse"></div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full animate-pulse delay-300"></div>
                      <div className="h-3 sm:h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded w-2/3 animate-pulse delay-300"></div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full animate-pulse delay-500"></div>
                      <div className="h-3 sm:h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded w-1/2 animate-pulse delay-500"></div>
                    </div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-6 -left-6 sm:-top-8 sm:-left-8 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center text-white text-2xl sm:text-3xl shadow-2xl animate-bounce">
                  ✨
                </div>
                <div className="absolute -bottom-6 -right-6 sm:-bottom-8 sm:-right-8 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-green-400 to-teal-500 rounded-2xl flex items-center justify-center text-white text-xl sm:text-2xl shadow-2xl animate-pulse">
                  🎯
                </div>
                <div className="absolute top-1/4 -right-4 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-pink-400 to-red-500 rounded-2xl flex items-center justify-center text-white text-lg sm:text-xl shadow-2xl animate-ping">
                  💫
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <TranslatedFooter />

        {/* Add ChatbotIcon component */}
        <ChatbotIcon />
      </main>
    </>
  );
}
