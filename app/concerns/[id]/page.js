'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import { getConcernById, getAllConcerns } from '@/data/concerns';
import Header from '@/components/Header';
import { useLoading } from '@/context/loading-context';

export default function ConcernPage() {
  const { id } = useParams();
  const router = useRouter();
  const [concern, setConcern] = useState(null);
  const { t } = useTranslation();
  const { setIsLoading } = useLoading();
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState(false);
  const [relatedConcerns, setRelatedConcerns] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    
    try {
      const concernData = getConcernById(id);
      
      if (concernData) {
        setConcern(concernData);
        
        // Get related concerns data
        const allConcerns = getAllConcerns();
        const related = allConcerns.filter(c => 
          concernData.relatedConcerns?.includes(c.id) && c.id !== id
        );
        setRelatedConcerns(related);
      } else {
        setError(true);
      }
    } catch (error) {
      console.error('Error loading concern data:', error);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }, [id, setIsLoading]);

  // Get concern icon based on ID
  const getConcernIcon = (concernId) => {
    const icons = {
      'acne': '🔴',
      'aging': '⏳',
      'dryness': '🏜️',
      'redness': '🌹',
      'hyperpigmentation': '🎭',
      'sensitivity': '⚡'
    };
    return icons[concernId] || '✨';
  };

  // Get concern color based on ID
  const getConcernColor = (concernId) => {
    const colors = {
      'acne': 'from-red-500 to-pink-500',
      'aging': 'from-purple-500 to-indigo-500',
      'dryness': 'from-amber-500 to-orange-500',
      'redness': 'from-rose-500 to-red-500',
      'hyperpigmentation': 'from-gray-600 to-gray-800',
      'sensitivity': 'from-green-500 to-teal-500'
    };
    return colors[concernId] || 'from-blue-500 to-indigo-500';
  };

  if (error) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="flex items-center justify-center min-h-screen">
            <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 text-center">
              <div className="text-6xl mb-6">😞</div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Concern Not Found
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                The skin concern you're looking for doesn't exist or may have been moved.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => router.back()}
                  className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200"
                >
                  Go Back
                </button>
                <Link
                  href="/concerns"
                  className="w-full inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-full text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200"
                >
                  Browse All Concerns
                </Link>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (!concern) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading concern details...</p>
          </div>
        </div>
      </>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'causes', label: 'Causes', icon: '🔍' },
    { id: 'treatments', label: 'Treatments', icon: '💊' },
    { id: 'ingredients', label: 'Ingredients', icon: '🧪' },
    { id: 'tips', label: 'Tips', icon: '💡' },
  ];

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Modern Hero Section */}
        <div className="relative overflow-hidden">
          {/* Background Pattern */}
          <div className={`absolute inset-0 bg-gradient-to-br ${getConcernColor(concern.id)}`}>
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.3) 0%, transparent 50%),
                                 radial-gradient(circle at 75% 75%, rgba(255,255,255,0.2) 0%, transparent 50%)`
              }} />
            </div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            {/* Breadcrumb */}
            <nav className="mb-8">
              <div className="flex items-center space-x-2 text-white/80 text-sm">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <span>/</span>
                <Link href="/concerns" className="hover:text-white transition-colors">Concerns</Link>
                <span>/</span>
                <span className="text-white font-medium">
                  {t(`skinConcernTypes.${concern.id}`) || concern.id}
                </span>
              </div>
            </nav>

            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                <span className="text-4xl">{getConcernIcon(concern.id)}</span>
              </div>
              
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
                  {t(`skinConcernTypes.${concern.id}`) || concern.id}
                </h1>
                <p className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl text-white/90 leading-relaxed">
                  {concern.overview.substring(0, 200)}...
                </p>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap justify-center gap-6 mt-8">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3">
                  <div className="text-2xl font-bold text-white">{concern.causes?.length || 0}</div>
                  <div className="text-sm text-white/80">Causes</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3">
                  <div className="text-2xl font-bold text-white">{concern.treatments?.length || 0}</div>
                  <div className="text-sm text-white/80">Treatments</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3">
                  <div className="text-2xl font-bold text-white">{concern.recommendedIngredients?.length || 0}</div>
                  <div className="text-sm text-white/80">Ingredients</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Modern Tabs */}
          <div className="mb-8">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-2 shadow-lg">
              <nav className="flex space-x-1 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center space-x-2 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 whitespace-nowrap
                      ${activeTab === tab.id
                        ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg shadow-teal-500/25'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-gray-700'
                      }
                    `}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
            <div className="p-8 lg:p-12">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                      <span className="mr-3">📋</span>
                      About {t(`skinConcernTypes.${concern.id}`) || concern.id}
                    </h2>
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                        {concern.overview}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Causes Tab */}
              {activeTab === 'causes' && (
                <div className="space-y-8">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    <span className="mr-3">🔍</span>
                    What Causes {t(`skinConcernTypes.${concern.id}`) || concern.id}?
                  </h2>
                  <div className="grid gap-4">
                    {concern.causes?.map((cause, index) => (
                      <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
                        <div className="flex-shrink-0 w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                          <span className="text-red-600 dark:text-red-400 font-bold text-sm">{index + 1}</span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{cause}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Treatments Tab */}
              {activeTab === 'treatments' && (
                <div className="space-y-8">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    <span className="mr-3">💊</span>
                    Treatment Options
                  </h2>
                  <div className="grid gap-4">
                    {concern.treatments?.map((treatment, index) => (
                      <div key={index} className="flex items-start space-x-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                          <span className="text-green-600 dark:text-green-400">✓</span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{treatment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ingredients Tab */}
              {activeTab === 'ingredients' && (
                <div className="space-y-8">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    <span className="mr-3">🧪</span>
                    Recommended Ingredients
                  </h2>
                  <div className="grid gap-6 lg:grid-cols-2">
                    {concern.recommendedIngredients?.map((ingredient, index) => (
                      <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800">
                        <h3 className="font-bold text-gray-900 dark:text-white text-xl mb-3 flex items-center">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                          {ingredient.name}
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {ingredient.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tips Tab */}
              {activeTab === 'tips' && (
                <div className="space-y-8">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    <span className="mr-3">💡</span>
                    Expert Tips & Advice
                  </h2>
                  <div className="grid gap-4">
                    {concern.tips?.map((tip, index) => (
                      <div key={index} className="flex items-start space-x-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl">
                        <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                          <span className="text-yellow-600 dark:text-yellow-400">💡</span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Concerns */}
          {relatedConcerns.length > 0 && (
            <div className="mt-16">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                Related Skin Concerns
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedConcerns.map((relatedConcern) => (
                  <Link
                    key={relatedConcern.id}
                    href={`/concerns/${relatedConcern.id}`}
                    className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className={`h-32 relative overflow-hidden bg-gradient-to-br ${getConcernColor(relatedConcern.id)}`}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl">{getConcernIcon(relatedConcern.id)}</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2 group-hover:text-teal-500 transition-colors">
                        {t(`skinConcernTypes.${relatedConcern.id}`) || relatedConcern.id}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                        {relatedConcern.overview.substring(0, 100)}...
                      </p>
                      <div className="flex items-center text-teal-600 dark:text-teal-400 text-sm font-medium">
                        {t('learnMore')}
                        <svg className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Bottom CTA */}
          <div className="mt-16 bg-gradient-to-r from-teal-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-8 lg:p-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Need Personalized Treatment Plan?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Get AI-powered skin analysis and receive customized treatment recommendations for your specific {t(`skinConcernTypes.${concern.id}`) || concern.id} concerns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/skin-analysis"
                className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-full text-white bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Start Analysis
                <svg className="ml-2 -mr-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center px-8 py-4 border border-gray-300 dark:border-gray-600 text-lg font-medium rounded-full text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200"
              >
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
