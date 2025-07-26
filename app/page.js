'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import ChatbotIcon from '@/components/ChatbotIcon';
import { useLoading } from '@/context/loading-context';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { handleSearch } from '@/utils/search';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [hasRedirected, setHasRedirected] = useState(false);
  const { setIsLoading } = useLoading();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  // Check if user wants to bypass redirects (for debugging or accessing landing page)
  const [bypassRedirect, setBypassRedirect] = useState(false);
  
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
      
      console.log('Redirect check:', { 
        authLoading, 
        isAuthenticated, 
        userExists: !!user,
        onboardingCompleted: user?.onboardingCompleted,
        hasRedirected,
        bypassRedirect,
        currentPath 
      });
      
      // Only redirect if user hasn't completed onboarding
      if (currentPath === '/' && user.onboardingCompleted === false) {
        setHasRedirected(true);
        console.log('Redirecting to onboarding - user has not completed onboarding');
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  // Show redirecting screen only for authenticated users who haven't completed onboarding
  if (isAuthenticated && user && user.onboardingCompleted === false && !hasRedirected && !bypassRedirect) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Redirecting to onboarding...</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            If you're stuck, <a href="/?bypass=true" className="text-teal-500 underline">click here</a> to access the home page
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
        {/* Hero Section with Video Background */}
        <div className="relative overflow-hidden">
          {/* Video background */}
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover z-0"
            style={{ minHeight: '480px' }}
            onLoadedData={() => console.log("Video loaded successfully")}
            onError={(e) => console.error("Video error:", e.target.error)}
          >
            <source 
              src="/videos/skincare-hero.mp4" 
              type="video/mp4" 
            />
            Loading...
          </video>
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/30 z-10"></div>

          {/* Content */}
          <div className="relative z-20 py-16 sm:py-20 md:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-3xl font-extrabold text-white sm:text-4xl md:text-5xl lg:text-6xl drop-shadow-md leading-tight">
                Know What's in Your Skincare
              </h1>
              <p className="mt-4 max-w-md mx-auto text-sm text-white sm:text-base md:text-lg lg:text-xl md:mt-6 md:max-w-2xl lg:max-w-3xl leading-relaxed">
                Check safety ratings, analyze ingredients, and find safer products for your skin
              </p>
              <div className="mt-8 sm:mt-10 max-w-xs sm:max-w-md mx-auto">
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center shadow-lg rounded-lg overflow-hidden">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products or ingredients..."
                    className="w-full px-4 py-3 sm:px-5 sm:py-4 text-sm sm:text-base focus:outline-none dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400 transition-colors"
                    aria-label="Search"
                  />
                  <button 
                    type="submit"
                    className="px-4 py-3 sm:px-5 sm:py-4 bg-white text-teal-500 font-medium hover:bg-gray-50 dark:bg-gray-700 dark:text-teal-400 dark:hover:bg-gray-600 transition-colors flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 sm:mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span className="hidden sm:inline ml-1">Search</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="py-12 sm:py-16 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl font-extrabold dark:text-white mb-4">
                How Dermify Works
              </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
                Our advanced AI-powered platform combines scientific research, ingredient analysis, and personalized recommendations to revolutionize your skincare journey
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
              {[
                {
                  step: '01',
                  title: 'Analyze',
                  description: 'Upload a photo for AI-powered skin analysis or search our comprehensive database of products and ingredients',
                  icon: '🔍',
                  color: 'from-blue-500 to-purple-500'
                },
                {
                  step: '02',
                  title: 'Discover',
                  description: 'Get detailed safety ratings, ingredient breakdowns, and personalized recommendations based on your skin type',
                  icon: '💡',
                  color: 'from-purple-500 to-pink-500'
                },
                {
                  step: '03',
                  title: 'Transform',
                  description: 'Build your perfect skincare routine with science-backed products tailored to your unique skin needs',
                  icon: '✨',
                  color: 'from-pink-500 to-red-500'
                }
              ].map((item, index) => (
                <div key={index} className="relative group">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700">
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center text-xl sm:text-2xl mb-4 sm:mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                      {item.icon}
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-gray-400 dark:text-gray-500 mb-2 text-center">
                      STEP {item.step}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 text-center">
                      {item.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-gray-300 dark:text-gray-600">
                      <svg className="w-6 h-6 lg:w-8 lg:h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Safety Score Section */}
        <div className="py-12 sm:py-16 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-extrabold dark:text-white mb-4">
                Understanding Safety Scores
              </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
                Our evidence-based rating system helps you make informed decisions about your skincare products
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6">
              {[
                { score: 1, color: 'bg-green-500', label: 'Excellent', description: 'Minimal to no safety concerns' },
                { score: 3, color: 'bg-lime-500', label: 'Good', description: 'Limited safety concerns' },
                { score: 5, color: 'bg-yellow-500', label: 'Moderate', description: 'Some safety considerations' },
                { score: 7, color: 'bg-orange-500', label: 'Caution', description: 'Notable safety concerns' },
                { score: 9, color: 'bg-red-500', label: 'High Risk', description: 'Significant safety concerns' },
              ].map((item) => (
                <div key={item.score} className="text-center group hover:transform hover:scale-105 transition-all duration-300">
                  <div className={`${item.color} w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold mx-auto mb-3 sm:mb-4 shadow-lg group-hover:shadow-xl`}>
                    {item.score}
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base">{item.label}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed px-1">{item.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 sm:mt-12 text-center">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-4xl mx-auto px-4">
                Our safety ratings are based on peer-reviewed scientific research, regulatory databases, and expert dermatologist reviews. 
                We continuously update our assessments as new research becomes available.
              </p>
            </div>
          </div>
        </div>

        {/* Feature Sections */}
        <div className="py-12 sm:py-16 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl font-extrabold dark:text-white mb-4">
                What Dermify Offers
              </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
                Comprehensive skincare analysis powered by artificial intelligence and backed by scientific research
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
              {/* Product Analysis */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-blue-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                <div className="relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700">
                  <div className="p-6 sm:p-8">
                    <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-gradient-to-r from-teal-400 to-teal-600 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                      <svg className="h-6 w-6 sm:h-8 sm:w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 dark:text-white">Product Analysis</h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 leading-relaxed">
                      Analyze your skincare products to understand their ingredients, safety ratings, and benefits for your specific skin type.
                    </p>
                    <div className="mb-4 sm:mb-6 space-y-2">
                      <div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Comprehensive ingredient breakdown
                      </div>
                      <div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Safety scoring system
                      </div>
                      <div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Personalized recommendations
                      </div>
                    </div>
                    <button 
                      onClick={() => navigateTo('/products')}
                      className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white font-medium py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 text-sm sm:text-base"
                    >
                      Analyze Products
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Ingredient Database */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                <div className="relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700">
                  <div className="p-6 sm:p-8">
                    <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                      <svg className="h-6 w-6 sm:h-8 sm:w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 dark:text-white">Ingredient Database</h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 leading-relaxed">
                      Explore our comprehensive database of skincare ingredients with detailed information about their effects and compatibility.
                    </p>
                    <div className="mb-4 sm:mb-6 space-y-2">
                      <div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        800+ ingredients studied
                      </div>
                      <div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Scientific evidence ratings
                      </div>
                      <div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Skin type compatibility
                      </div>
                    </div>
                    <button 
                      onClick={() => navigateTo('/ingredients')}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-sm sm:text-base"
                    >
                      Explore Ingredients
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Face Analysis */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                <div className="relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700">
                  <div className="p-6 sm:p-8">
                    <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                      <svg className="h-6 w-6 sm:h-8 sm:w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 dark:text-white">AI Skin Analysis</h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 leading-relaxed">
                      Get personalized skin recommendations based on advanced AI analysis of your facial features and skin concerns.
                    </p>
                    <div className="mb-4 sm:mb-6 space-y-2">
                      <div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        AI-powered skin detection
                      </div>
                      <div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Condition identification
                      </div>
                      <div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Personalized routines
                      </div>
                    </div>
                    <button 
                      onClick={() => navigateTo('/skin-analysis')}
                      className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white font-medium py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 text-sm sm:text-base"
                    >
                      Analyze Your Skin
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Latest Analyzed Products */}
        <div className="py-12 sm:py-16 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-extrabold dark:text-white mb-4">
                Recently Analyzed Products
              </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 px-4">
                Discover what products our community has been analyzing and their safety scores
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                { name: "Hydrating Cleanser", brand: "CeraVe", score: 2, users: 1240, category: "cleansers" },
                { name: "2% BHA Liquid Exfoliant", brand: "Paula's Choice", score: 3, users: 980, category: "exfoliants" },
                { name: "Daily Moisturizer", brand: "Cetaphil", score: 2, users: 756, category: "moisturizers" },
                { name: "Anthelios SPF 50+", brand: "La Roche-Posay", score: 1, users: 1120, category: "sunscreens" }
              ].map((product, index) => (
                <div key={product.name} className="group">
                  <div className="bg-white dark:bg-gray-700 rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-600">
                    {/* Score Badge */}
                    <div className="flex justify-between items-start mb-3 sm:mb-4">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${
                        product.score <= 2 ? 'bg-green-500' : 
                        product.score <= 4 ? 'bg-yellow-500' : 'bg-red-500'
                      } text-white font-bold flex items-center justify-center text-base sm:text-lg shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {product.score}
                      </div>
                    </div>
                    
                    {/* Product Info */}
                    <div className="space-y-2">
                      <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors duration-300 leading-tight">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">{product.brand}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full capitalize">
                          {product.category.replace('-', ' ')}
                        </span>
                        <button 
                          onClick={() => navigateTo(`/products/${product.category}`)}
                          className="text-xs text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium transition-colors duration-300"
                        >
                          View Details →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Call to Action */}
            <div className="text-center mt-10 sm:mt-12">
              <button 
                onClick={() => navigateTo('/products')}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-medium rounded-lg hover:from-teal-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Analyze More Products
              </button>
            </div>
          </div>
        </div>

        {/* Trending Ingredients Section */}
        <div className="py-12 sm:py-16 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-extrabold dark:text-white mb-4">
                Trending Ingredients
              </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 px-4">
                Discover the most searched and effective skincare ingredients backed by science
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                { 
                  name: "Niacinamide", 
                  popularity: 95, 
                  benefits: ["Reduces oil", "Minimizes pores", "Anti-inflammatory"],
                  safetyScore: 2,
                  trendingUp: true
                },
                { 
                  name: "Hyaluronic Acid", 
                  popularity: 92, 
                  benefits: ["Deep hydration", "Plumps skin", "Anti-aging"],
                  safetyScore: 1,
                  trendingUp: true
                },
                { 
                  name: "Retinol", 
                  popularity: 88, 
                  benefits: ["Reduces wrinkles", "Improves texture", "Brightens"],
                  safetyScore: 4,
                  trendingUp: false
                },
                { 
                  name: "Vitamin C", 
                  popularity: 85, 
                  benefits: ["Antioxidant", "Brightening", "Collagen boost"],
                  safetyScore: 3,
                  trendingUp: true
                }
              ].map((ingredient, index) => (
                <div key={ingredient.name} className="group">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${
                        ingredient.safetyScore <= 2 ? 'bg-green-500' : 
                        ingredient.safetyScore <= 4 ? 'bg-yellow-500' : 'bg-red-500'
                      } text-white font-bold flex items-center justify-center text-xs sm:text-sm`}>
                        {ingredient.safetyScore}
                      </div>
                    </div>
                    
                    {/* Ingredient Name */}
                    <h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white mb-2 sm:mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                      {ingredient.name}
                    </h3>
                    
                    {/* Benefits */}
                    <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
                      {ingredient.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {benefit}
                        </div>
                      ))}
                    </div>
                    
                    {/* Learn More Button */}
                    <button 
                      onClick={() => navigateTo(`/ingredients/${ingredient.name.toLowerCase().replace(' ', '-')}`)}
                      className="w-full text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium text-xs sm:text-sm transition-colors duration-300 flex items-center justify-center group"
                    >
                      Learn More
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-10 sm:mt-12">
              <button 
                onClick={() => navigateTo('/ingredients')}
                className="inline-flex items-center px-6 sm:px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                Explore All Ingredients
              </button>
            </div>
          </div>
        </div>

        {/* Skin Concerns Section */}
        <div className="py-12 sm:py-16 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-extrabold dark:text-white mb-4">
                Common Skin Concerns
              </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 px-4">
                Get expert guidance and personalized solutions for your specific skin challenges
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {[
                { name: "Acne", icon: '😞', users: '12k+', description: 'Breakouts & blemishes' },
                { name: "Aging", icon: '⏳', users: '8k+', description: 'Fine lines & wrinkles' },
                { name: "Dryness", icon: '🏜️', users: '15k+', description: 'Dehydrated skin' },
                { name: "Redness", icon: '🔴', users: '6k+', description: 'Irritation & sensitivity' },
                { name: "Hyperpigmentation", icon: '🎭', users: '9k+', description: 'Dark spots & uneven tone' },
                { name: "Sensitivity", icon: '⚡', users: '11k+', description: 'Reactive & delicate skin' }
              ].map((concern) => (
                <div 
                  key={concern.name}
                  onClick={() => navigateTo(`/concerns/${concern.name.toLowerCase()}`)}
                  className="group cursor-pointer"
                >
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 sm:p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:bg-white dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700">
                    <div className="text-2xl sm:text-3xl mb-2 sm:mb-3 transform group-hover:scale-110 transition-transform duration-300">
                      {concern.icon}
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors duration-300 text-sm sm:text-base">
                      {concern.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 sm:mb-2">
                      {concern.users} users helped
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                      {concern.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-10 sm:mt-12">
              <button 
                onClick={() => navigateTo('/concerns')}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-teal-500 to-green-500 text-white font-medium rounded-lg hover:from-teal-600 hover:to-green-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View All Concerns
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Feature highlight - Face Analysis */}
        <div className="py-16 sm:py-20 bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              {/* Content */}
              <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 sm:mb-6">
                    Revolutionize Your Skincare with AI
                  </h2>
                  <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-6 sm:mb-8">
                    Get personalized skincare recommendations powered by advanced artificial intelligence. 
                    Our YOLO-based skin analysis technology can detect multiple skin conditions and provide 
                    tailored product suggestions in seconds.
                  </p>
                </div>
                
                <div className="space-y-3 sm:space-y-4">
                  {[
                    { icon: '📸', title: 'Upload Your Photo', description: 'Take a clear selfie or upload an existing photo' },
                    { icon: '🤖', title: 'AI Analysis', description: 'Our advanced AI detects skin conditions and determines your skin type' },
                    { icon: '📋', title: 'Get Recommendations', description: 'Receive personalized product suggestions and skincare routine' }
                  ].map((step, index) => (
                    <div key={index} className="flex items-start space-x-3 sm:space-x-4 group">
                      <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg flex items-center justify-center text-white text-lg sm:text-xl group-hover:scale-110 transition-transform duration-300">
                        {step.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-1 text-sm sm:text-base">{step.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button 
                    onClick={() => navigateTo('/skin-analysis')}
                    className="flex-1 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl hover:from-teal-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
                  >
                    Start Free Analysis
                  </button>
                  <button 
                    onClick={() => navigateTo('/about')}
                    className="flex-1 bg-white dark:bg-gray-800 text-teal-600 dark:text-teal-400 font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl border-2 border-teal-500 hover:bg-teal-50 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
                  >
                    Learn More
                  </button>
                </div>
              </div>
              
              {/* Visual */}
              <div className="relative order-1 lg:order-2">
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 transform rotate-1 hover:rotate-0 transition-transform duration-300">
                  <div className="aspect-square bg-gradient-to-br from-teal-100 to-blue-100 dark:from-gray-700 dark:to-gray-600 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                    <div className="text-4xl sm:text-6xl">🔍</div>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                    <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 animate-pulse"></div>
                    <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2 animate-pulse"></div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-lg sm:text-2xl shadow-lg animate-bounce">
                  ✨
                </div>
                <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center text-white text-base sm:text-xl shadow-lg animate-pulse">
                  🎯
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-100 dark:bg-gray-900 border-t dark:border-gray-800">
          <div className="max-w-7xl mx-auto py-10 sm:py-12 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Products</h3>
                <ul className="mt-3 sm:mt-4 space-y-1 sm:space-y-2">
                  <li><Link href="/products/cleansers" className="text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">Cleansers</Link></li>
                  <li><Link href="/products/moisturizers" className="text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">Moisturizers</Link></li>
                  <li><Link href="/products/serums" className="text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">Serums</Link></li>
                  <li><Link href="/products/sunscreens" className="text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">Sunscreens</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ingredients</h3>
                <ul className="mt-3 sm:mt-4 space-y-1 sm:space-y-2">
                  <li><Link href="/ingredients/retinoids" className="text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">Retinoids</Link></li>
                  <li><Link href="/ingredients/aha-bha" className="text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">AHA/BHA</Link></li>
                  <li><Link href="/ingredients/vitamin-c" className="text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">Vitamin C</Link></li>
                  <li><Link href="/ingredients/niacinamide" className="text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">Niacinamide</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Resources</h3>
                <ul className="mt-3 sm:mt-4 space-y-1 sm:space-y-2">
                  <li><Link href="/ingredients" className="text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">Ingredients</Link></li>
                  <li><Link href="/products" className="text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">Products</Link></li>
                  <li><Link href="/skin-analysis" className="text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">Skin Analysis</Link></li>
                  <li><Link href="/concerns" className="text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">Skin Concerns</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Company</h3>
                <ul className="mt-3 sm:mt-4 space-y-1 sm:space-y-2">
                  <li><Link href="/about" className="text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">About Us</Link></li>
                  <li><Link href="/contact" className="text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">Contact Us</Link></li>
                  <li><Link href="/privacy" className="text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">Privacy</Link></li>
                  <li><Link href="/terms" className="text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">Terms</Link></li>
                </ul>
              </div>
            </div>
            <div className="mt-8 sm:mt-12 border-t border-gray-200 dark:border-gray-700 pt-6 sm:pt-8">
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 text-center">
                © {new Date().getFullYear()} Dermify. All rights reserved.
              </p>
            </div>
          </div>
        </footer>

        {/* Add ChatbotIcon component */}
        <ChatbotIcon />
      </main>
    </>
  );
}
