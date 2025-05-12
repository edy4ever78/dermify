'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { useTranslation } from '@/hooks/useTranslation';
import { useLoading } from '@/context/loading-context';
import { getAllConcerns } from '@/data/concerns';

export default function ConcernsPage() {
  const { t } = useTranslation();
  const { setIsLoading } = useLoading();
  const concerns = getAllConcerns();
  
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [setIsLoading]);
  
  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero Section with Gradient Background */}
        <div className="relative bg-gradient-to-r from-teal-500 to-blue-600 py-16 sm:py-24">
          <div className="absolute inset-0 bg-black/20 mix-blend-multiply" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                {t('skinConcerns')}
              </h1>
              <p className="mt-6 max-w-3xl mx-auto text-xl text-white">
                Explore common skin concerns and learn how to address them with effective ingredients and routines.
              </p>
            </div>
          </div>
        </div>

        {/* Concerns Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {concerns.map((concern) => (
              <Link 
                key={concern.id}
                href={`/concerns/${concern.id}`}
                className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="h-48 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-blue-500 group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black/30 mix-blend-multiply" />
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h2 className="text-2xl font-bold text-white text-center px-6">
                      {t(concern.id) || concern.id}
                    </h2>
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                    {concern.overview.substring(0, 120)}...
                  </p>
                  
                  <div className="mt-4 flex items-center text-teal-600 dark:text-teal-400 font-medium group-hover:text-teal-500">
                    {t('readMore')}
                    <svg 
                      className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
