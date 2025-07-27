'use client';

import Link from 'next/link';
import Header from '@/components/Header';

export default function NotFound() {
  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* 404 Illustration */}
            <div className="mb-8">
              <div className="text-8xl mb-4">🔍</div>
              <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
              <div className="text-2xl text-gray-600 dark:text-gray-300 mb-8">
                Page Not Found
              </div>
            </div>

            {/* Error Message */}
            <div className="max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Oops! This page doesn't exist
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                The page you're looking for might have been moved, deleted, or doesn't exist. 
                Don't worry, let's get you back on track with your skincare journey!
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl font-medium hover:from-teal-700 hover:to-blue-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Go Home
              </Link>

              <Link
                href="/skin-analysis"
                className="inline-flex items-center px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Start Skin Analysis
              </Link>
            </div>

            {/* Quick Links */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Popular Pages
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  href="/products"
                  className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <span className="text-2xl mr-3">🧴</span>
                  <div className="text-left">
                    <div className="font-medium text-gray-900 dark:text-white">Products</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Browse skincare products</div>
                  </div>
                </Link>

                <Link
                  href="/routines"
                  className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <span className="text-2xl mr-3">📋</span>
                  <div className="text-left">
                    <div className="font-medium text-gray-900 dark:text-white">Routines</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Skincare routines</div>
                  </div>
                </Link>

                <Link
                  href="/concerns"
                  className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <span className="text-2xl mr-3">🎯</span>
                  <div className="text-left">
                    <div className="font-medium text-gray-900 dark:text-white">Concerns</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Address skin concerns</div>
                  </div>
                </Link>

                <Link
                  href="/ingredients"
                  className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <span className="text-2xl mr-3">🧪</span>
                  <div className="text-left">
                    <div className="font-medium text-gray-900 dark:text-white">Ingredients</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Learn about ingredients</div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Contact Support */}
            <div className="mt-12">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Still can't find what you're looking for?
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
