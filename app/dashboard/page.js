'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { useTranslation } from '@/hooks/useTranslation';
import Header from '@/components/Header';
import Link from 'next/link';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

function DashboardPageContent() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isWelcome = searchParams.get('welcome') === 'true';
  const [showWelcome, setShowWelcome] = useState(isWelcome);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/signin?redirect=/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  // Redirect to onboarding if not completed - but be very conservative
  useEffect(() => {
    // Only redirect if user explicitly has onboardingCompleted set to false
    // AND we're not coming from the onboarding page itself
    // This prevents redirect loops
    if (user && user.onboardingCompleted === false && typeof window !== 'undefined') {
      const currentUrl = window.location.href;
      const cameFromOnboarding = document.referrer.includes('/onboarding') || currentUrl.includes('welcome=true');
      
      // Don't redirect if we just came from onboarding (indicates completion)
      if (!cameFromOnboarding) {
        console.log('Dashboard: User onboarding status:', user.onboardingCompleted);
        console.log('Dashboard: Redirecting to onboarding - user has not completed onboarding');
        window.location.href = '/onboarding';
      } else {
        console.log('Dashboard: Not redirecting - user came from onboarding or has welcome flag');
      }
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const getSkincareRecommendations = () => {
    if (!user.skinType || !user.skinConcerns) return [];
    
    const recommendations = [];
    
    // Basic recommendations based on skin type and concerns
    if (user.skinConcerns.includes('acne')) {
      recommendations.push({
        title: 'Try Salicylic Acid',
        description: 'Great for unclogging pores and reducing acne',
        action: 'Explore Products',
        link: '/products?ingredient=salicylic-acid'
      });
    }
    
    if (user.skinConcerns.includes('aging')) {
      recommendations.push({
        title: 'Consider Retinol',
        description: 'Proven anti-aging ingredient for fine lines',
        action: 'Learn More',
        link: '/ingredients?search=retinol'
      });
    }
    
    if (user.skinConcerns.includes('hyperpigmentation')) {
      recommendations.push({
        title: 'Vitamin C Serum',
        description: 'Brightens skin and fades dark spots',
        action: 'View Products',
        link: '/products?ingredient=vitamin-c'
      });
    }
    
    return recommendations.slice(0, 3); // Limit to 3 recommendations
  };

  const recommendations = getSkincareRecommendations();

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Message */}
        {showWelcome && (
          <div className="mb-8 bg-gradient-to-r from-teal-500 to-blue-500 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-3xl font-bold mb-2">
                Welcome to Dermify, {user.firstName}! 🎉
              </h1>
              <p className="text-teal-100 mb-4">
                Your skincare journey starts here. We've personalized your experience based on your profile.
              </p>
              <button
                onClick={() => setShowWelcome(false)}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg transition-all duration-200"
              >
                Got it!
              </button>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Your Skin Profile
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-xl">
                  <h3 className="font-semibold text-teal-800 dark:text-teal-200 mb-1">
                    Skin Type
                  </h3>
                  <p className="text-teal-700 dark:text-teal-300 capitalize">
                    {user.skinType}
                  </p>
                </div>
                
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">
                    Main Concerns
                  </h3>
                  <p className="text-blue-700 dark:text-blue-300">
                    {user.skinConcerns && user.skinConcerns.length > 0 
                      ? user.skinConcerns.map(concern => concern.charAt(0).toUpperCase() + concern.slice(1).replace(/[-_]/g, ' ')).join(', ')
                      : 'None specified'}
                  </p>
                </div>
                
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                  <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-1">
                    Experience Level
                  </h3>
                  <p className="text-purple-700 dark:text-purple-300 capitalize">
                    {user.skincareExperience || 'Not specified'}
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <h3 className="font-semibold text-green-800 dark:text-green-200 mb-1">
                    Age Range
                  </h3>
                  <p className="text-green-700 dark:text-green-300">
                    {user.ageRange || 'Not specified'}
                  </p>
                </div>

                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                  <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-1">
                    Budget Range
                  </h3>
                  <p className="text-orange-700 dark:text-orange-300 capitalize">
                    {user.budget || 'Not specified'}
                  </p>
                </div>

                <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-xl">
                  <h3 className="font-semibold text-pink-800 dark:text-pink-200 mb-1">
                    Lifestyle
                  </h3>
                  <p className="text-pink-700 dark:text-pink-300 capitalize">
                    {user.lifestyle || 'Not specified'}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <Link 
                  href="/account/profile"
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors duration-200"
                >
                  Edit Profile
                </Link>
                <Link 
                  href="/onboarding"
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200"
                >
                  Retake Quiz
                </Link>
              </div>
            </div>

            {/* Personalized Recommendations */}
            {recommendations.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Personalized for You
                </h2>
                
                <div className="space-y-4">
                  {recommendations.map((rec, index) => (
                    <div 
                      key={index}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-teal-300 dark:hover:border-teal-500 transition-colors duration-200"
                    >
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {rec.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {rec.description}
                      </p>
                      <Link 
                        href={rec.link}
                        className="inline-flex items-center text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium"
                      >
                        {rec.action} →
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <Link 
                  href="/skin-analysis"
                  className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-teal-500 dark:hover:border-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all duration-200 group"
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">📸</div>
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400">
                      Analyze Your Skin
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Upload a photo for AI analysis
                    </p>
                  </div>
                </Link>
                
                <Link 
                  href="/products"
                  className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 group"
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">🧴</div>
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      Browse Products
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Find products for your skin
                    </p>
                  </div>
                </Link>
                
                <Link 
                  href="/ingredients"
                  className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-purple-500 dark:hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200 group"
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">🧪</div>
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">
                      Learn Ingredients
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Understand what's in your products
                    </p>
                  </div>
                </Link>
                
                <Link 
                  href="/routines"
                  className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-green-500 dark:hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 group"
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">📋</div>
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400">
                      Create Routine
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Build your skincare routine
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tips */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                💡 Today's Tip
              </h3>
              <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl">
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  Always apply sunscreen as your last step in the morning routine, even on cloudy days!
                </p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Recent Activity
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Completed skin profile
                  </span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Joined Dermify
                  </span>
                </div>
              </div>
            </div>

            {/* Help */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Need Help?
              </h3>
              <div className="space-y-3">
                <Link 
                  href="/contact"
                  className="block p-3 bg-gray-50 dark:bg-gray-700 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-lg transition-colors duration-200"
                >
                  <div className="font-medium text-gray-900 dark:text-white">Contact Support</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Get help with your skincare</div>
                </Link>
                <Link 
                  href="/about"
                  className="block p-3 bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
                >
                  <div className="font-medium text-gray-900 dark:text-white">Learn More</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">About Dermify platform</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardPageContent />
    </Suspense>
  );
}
