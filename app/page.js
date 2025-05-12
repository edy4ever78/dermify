'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { useLoading } from '@/context/loading-context';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const { setIsLoading } = useLoading();
  const router = useRouter();

  // Helper function to navigate with loading indicator
  const navigateTo = (path) => {
    setIsLoading(true);
    router.push(path);
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigateTo(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

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
          
          {/* Gradient overlay that only darkens the bottom where text appears */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10"></div>

          {/* Content */}
          <div className="relative z-20 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl drop-shadow-md">
                Your Skin Journey Starts Here
              </h1>
              <p className="mt-4 max-w-md mx-auto text-base text-white sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                Analyze skincare products, learn about ingredients, and build personalized routines
              </p>
              <div className="mt-10 max-w-md mx-auto">
                <form onSubmit={handleSearch} className="flex items-center shadow-lg rounded-md overflow-hidden">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for products or ingredients..."
                    className="w-full px-5 py-4 text-base focus:outline-none dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400 transition-colors"
                    aria-label="Search"
                  />
                  <button 
                    type="submit"
                    className="px-5 py-4 bg-white text-teal-500 font-medium hover:bg-gray-50 dark:bg-gray-700 dark:text-teal-400 dark:hover:bg-gray-600 transition-colors flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Search
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Sections - Improved cards with hover effects */}
        <div className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-center mb-12 dark:text-white">
              What Dermify Offers
            </h2>
            
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Product Analysis */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="p-6">
                  <div className="h-14 w-14 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mb-6">
                    <svg className="h-8 w-8 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 dark:text-white">Product Analysis</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Analyze your skincare products to understand their ingredients and benefits.
                  </p>
                  <button 
                    onClick={() => navigateTo('/products')}
                    className="text-teal-500 hover:text-teal-600 font-medium inline-flex items-center group"
                  >
                    Analyze Products
                    <svg className="h-5 w-5 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Ingredient Database */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="p-6">
                  <div className="h-14 w-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6">
                    <svg className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 dark:text-white">Ingredient Database</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Explore our comprehensive database of skincare ingredients and their effects.
                  </p>
                  <button 
                    onClick={() => navigateTo('/ingredients')}
                    className="text-blue-500 hover:text-blue-600 font-medium inline-flex items-center group"
                  >
                    Explore Ingredients
                    <svg className="h-5 w-5 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Face Analysis */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="p-6">
                  <div className="h-14 w-14 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-6">
                    <svg className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 dark:text-white">Face Analysis</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Get personalized skin recommendations based on AI analysis of your face.
                  </p>
                  <button 
                    onClick={() => navigateTo('/skin-analysis')}
                    className="text-purple-500 hover:text-purple-600 font-medium inline-flex items-center group"
                  >
                    Analyze Your Skin
                    <svg className="h-5 w-5 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skin Concerns Section */}
        <div className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-center mb-12 dark:text-white">
              Skin Concerns
            </h2>
            
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {[
                { name: "Acne", icon: '😞' },
                { name: "Aging", icon: '⏳' },
                { name: "Dryness", icon: '🏜️' },
                { name: "Redness", icon: '🔴' },
                { name: "Hyperpigmentation", icon: '🎭' },
                { name: "Sensitivity", icon: '⚡' }
              ].map((concern) => (
                <div 
                  key={concern.name}
                  onClick={() => navigateTo(`/concerns/${concern.name.toLowerCase()}`)}
                  className="bg-white dark:bg-gray-700 rounded-lg p-5 text-center shadow hover:shadow-md transition-all hover:bg-gray-50 dark:hover:bg-gray-600 group cursor-pointer"
                >
                  <div className="text-2xl mb-2">{concern.icon}</div>
                  <span className="font-medium dark:text-white group-hover:text-teal-500 dark:group-hover:text-teal-400 transition-colors">
                    {concern.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature highlight - Face Analysis */}
        <div className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold dark:text-white mb-6">
                Analyze Your Skin
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Get personalized skincare recommendations based on advanced AI analysis of your skin concerns.
              </p>
              <button 
                onClick={() => navigateTo('/skin-analysis')}
                className="px-8 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-medium rounded-md hover:from-teal-600 hover:to-blue-600 transition-all duration-300 shadow-sm transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                Analyze Your Skin
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-100 dark:bg-gray-900 border-t dark:border-gray-800">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Products</h3>
                <ul className="mt-4 space-y-2">
                  <li><Link href="/products/cleansers" className="text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">Cleansers</Link></li>
                  <li><Link href="/products/moisturizers" className="text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">Moisturizers</Link></li>
                  <li><Link href="/products/serums" className="text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">Serums</Link></li>
                  <li><Link href="/products/sunscreens" className="text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">Sunscreens</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ingredients</h3>
                <ul className="mt-4 space-y-2">
                  <li><Link href="/ingredients/retinoids" className="text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">Retinoids</Link></li>
                  <li><Link href="/ingredients/aha-bha" className="text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">AHA/BHA</Link></li>
                  <li><Link href="/ingredients/vitamin-c" className="text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">Vitamin C</Link></li>
                  <li><Link href="/ingredients/niacinamide" className="text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">Niacinamide</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Resources</h3>
                <ul className="mt-4 space-y-2">
                  <li><Link href="/ingredients" className="text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">Ingredients</Link></li>
                  <li><Link href="/products" className="text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">Products</Link></li>
                  <li><Link href="/skin-analysis" className="text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">Skin Analysis</Link></li>
                  <li><Link href="/concerns" className="text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">Skin Concerns</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Company</h3>
                <ul className="mt-4 space-y-2">
                  <li><Link href="/about" className="text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">About Us</Link></li>
                  <li><Link href="/contact" className="text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">Contact Us</Link></li>
                  <li><Link href="/privacy" className="text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">Privacy</Link></li>
                  <li><Link href="/terms" className="text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">Terms</Link></li>
                </ul>
              </div>
            </div>
            <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
              <p className="text-base text-gray-500 dark:text-gray-400 text-center">
                © {new Date().getFullYear()} Dermify. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
