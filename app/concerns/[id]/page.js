'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import { getConcernById } from '@/data/concerns';
import Header from '@/components/Header';
import { useLoading } from '@/context/loading-context';

export default function ConcernPage() {
  const { id } = useParams();
  const [concern, setConcern] = useState(null);
  const { t } = useTranslation();
  const { setIsLoading } = useLoading();
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    
    try {
      const concernData = getConcernById(id);
      
      if (concernData) {
        setConcern(concernData);
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

  if (error) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Concern not found
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                The skin concern you're looking for doesn't exist or has been removed.
              </p>
              <Link href="/" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                Return to homepage
              </Link>
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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero section with gradient background */}
        <div className="relative bg-gradient-to-r from-teal-500 to-blue-600">
          <div className="absolute inset-0 bg-black/30 mix-blend-multiply" />
          <div className="relative max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl text-center">
              {t(concern?.id) || concern?.id}
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-xl text-white text-center">
              {concern?.overview.substring(0, 150)}...
            </p>
          </div>
        </div>

        {/* Content section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {[
                { id: 'overview', label: 'Concern Overview' },
                { id: 'causes', label: 'Concern Causes' },
                { id: 'treatments', label: 'Concern Treatments' },
                { id: 'ingredients', label: 'Concern Ingredients' },
                { id: 'tips', label: 'Concern Tips' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                    ${activeTab === tab.id
                      ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'}
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab content with consistent styling */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              {/* Overview tab */}
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {concern.id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Overview
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {concern.overview}
                  </p>
                </div>
              )}

              {/* Causes tab */}
              {activeTab === 'causes' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {concern.id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Causes
                  </h2>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                    {concern.causes.map((cause, index) => (
                      <li key={index}>{cause}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Treatments tab */}
              {activeTab === 'treatments' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {concern.id.charAt(0).toUpperCase() + concern.id.slice(1)} Treatments
                  </h2>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                    {concern.treatments.map((treatment, index) => (
                      <li key={index}>{treatment}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Ingredients tab */}
              {activeTab === 'ingredients' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {concern.id.charAt(0).toUpperCase() + concern.id.slice(1)} Ingredients
                  </h2>
                  <div className="grid gap-6 mt-6">
                    {concern.recommendedIngredients.map((ingredient, index) => (
                      <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h3 className="font-medium text-gray-900 dark:text-white text-lg">
                          {ingredient.name}
                        </h3>
                        <p className="mt-1 text-gray-700 dark:text-gray-300">
                          {ingredient.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tips tab */}
              {activeTab === 'tips' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {concern.id.charAt(0).toUpperCase() + concern.id.slice(1)} Tips
                  </h2>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                    {concern.tips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Related concerns with matching card style */}
          {concern?.relatedConcerns && concern.relatedConcerns.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                {t('Rrelated Concerns')}
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {concern.relatedConcerns.map((relatedId) => (
                  <Link
                    key={relatedId}
                    href={`/concerns/${relatedId}`}
                    className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="p-6">
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg capitalize group-hover:text-teal-500 transition-colors">
                        {relatedId.replace(/-/g, ' ')}
                      </h3>
                      <div className="mt-4 text-teal-600 dark:text-teal-400 inline-flex items-center">
                        {t('Read More')}
                        <svg className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
