'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { useTranslation } from '@/hooks/useTranslation';
import { useLoading } from '@/context/loading-context';

export default function AccountRoutinesPage() {
  const { t } = useTranslation();
  const { setIsLoading } = useLoading();
  const [routines, setRoutines] = useState([]);
  const [filter, setFilter] = useState('all'); // all, morning, evening

  useEffect(() => {
    setIsLoading(true);
    
    // Load real user routines from localStorage
    const loadUserRoutines = () => {
      const storedRoutines = [];
      
      // Load completed routines (created routines)
      const completedRoutines = localStorage.getItem('completed-routines');
      if (completedRoutines) {
        try {
          const parsed = JSON.parse(completedRoutines);
          if (Array.isArray(parsed)) {
            storedRoutines.push(...parsed);
          }
        } catch (error) {
          console.warn('Error parsing completed routines:', error);
        }
      }
      
      // Load routine drafts that were completed
      const drafts = localStorage.getItem('routine-drafts');
      if (drafts) {
        try {
          const parsedDrafts = JSON.parse(drafts);
          if (Array.isArray(parsedDrafts)) {
            // Add completed drafts (those with steps)
            const completedDrafts = parsedDrafts
              .filter(draft => draft.steps && draft.steps.length > 0)
              .map(draft => ({
                id: draft.id || Date.now(),
                name: draft.name || 'Untitled Routine',
                type: draft.type || 'morning',
                skinType: draft.skinType || 'normal',
                concerns: Array.isArray(draft.concerns) ? draft.concerns : [],
                difficulty: draft.difficulty || 'beginner',
                steps: draft.steps ? draft.steps.length : 0,
                createdAt: draft.savedAt || new Date().toISOString(),
                lastUsed: draft.savedAt || new Date().toISOString(),
                isActive: true,
                description: draft.description || '',
                estimatedTime: draft.estimatedTime || 10
              }));
            storedRoutines.push(...completedDrafts);
          }
        } catch (error) {
          console.warn('Error parsing routine drafts:', error);
        }
      }
      
      // If no user routines, show mock data for demo
      if (storedRoutines.length === 0) {
        return [
          {
            id: 'demo-1',
            name: "My Morning Glow Routine",
            type: "morning",
            skinType: "combination",
            concerns: ["acne", "aging"],
            difficulty: "intermediate",
            steps: 6,
            createdAt: "2025-01-15",
            lastUsed: "2025-01-27",
            isActive: true,
            description: "Demo routine - Create your own to see it here!"
          },
          {
            id: 'demo-2',
            name: "Nighttime Repair Routine",
            type: "evening",
            skinType: "combination", 
            concerns: ["aging", "dryness"],
            difficulty: "advanced",
            steps: 8,
            createdAt: "2025-01-10",
            lastUsed: "2025-01-26",
            isActive: true,
            description: "Demo routine - Your created routines will appear here!"
          }
        ];
      }
      
      return storedRoutines;
    };
    
    const timer = setTimeout(() => {
      const userRoutines = loadUserRoutines();
      console.log('Loaded user routines:', userRoutines);
      setRoutines(userRoutines);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [setIsLoading]);

  const filteredRoutines = routines.filter(routine => {
    if (filter === 'all') return true;
    return routine.type === filter;
  });

  const getRoutineIcon = (type) => {
    return type === 'morning' ? '🌅' : '🌙';
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      advanced: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    };
    return colors[difficulty] || colors.beginner;
  };

  const getConcernEmoji = (concern) => {
    const emojis = {
      acne: '🔴',
      aging: '⏳',
      dryness: '🏜️',
      oiliness: '💧',
      sensitivity: '⚡',
      darkSpots: '🎭',
      redness: '🌹',
      pores: '🔍'
    };
    return emojis[concern] || '✨';
  };

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-12">
            <nav className="mb-6">
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <Link href="/account" className="hover:text-teal-600">Account</Link>
                <span>/</span>
                <span className="text-gray-900 dark:text-white">Routines</span>
              </div>
            </nav>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  My Skincare Routines
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Manage and track your personalized skincare routines
                </p>
              </div>
              
              <div className="mt-6 sm:mt-0">
                <Link
                  href="/account/routines/create"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl font-medium hover:from-teal-700 hover:to-blue-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create New Routine
                </Link>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-3">
              {[
                { id: 'all', label: 'All Routines', emoji: '📋' },
                { id: 'morning', label: 'Morning', emoji: '🌅' },
                { id: 'evening', label: 'Evening', emoji: '🌙' }
              ].map((filterOption) => (
                <button
                  key={filterOption.id}
                  onClick={() => setFilter(filterOption.id)}
                  className={`
                    inline-flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200
                    ${filter === filterOption.id
                      ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/25'
                      : 'bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
                    }
                  `}
                >
                  <span>{filterOption.emoji}</span>
                  <span>{filterOption.label}</span>
                  <span className="bg-black/10 text-xs px-2 py-0.5 rounded-full">
                    {filterOption.id === 'all' ? routines.length : routines.filter(r => r.type === filterOption.id).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Routines Grid */}
          {filteredRoutines.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRoutines.map((routine) => (
                <div
                  key={routine.id}
                  className="group bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                  onClick={() => {
                    window.location.href = `/routines/user-${routine.id}`;
                  }}
                >
                  {/* Header */}
                  <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-blue-500 rounded-xl flex items-center justify-center text-2xl">
                          {getRoutineIcon(routine.type)}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white text-lg group-hover:text-teal-500 transition-colors">
                            {routine.name}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(routine.difficulty)}`}>
                              {routine.difficulty}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {routine.steps?.length || 0} steps
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {routine.isActive && (
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        )}
                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Concerns */}
                    <div className="flex flex-wrap gap-1">
                      {routine.concerns.map((concern) => (
                        <span
                          key={concern}
                          className="inline-flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-xs"
                        >
                          <span>{getConcernEmoji(concern)}</span>
                          <span className="capitalize">{concern}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                          {Math.floor((new Date() - new Date(routine.createdAt)) / (1000 * 60 * 60 * 24))}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Days Active</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {Math.floor((new Date() - new Date(routine.lastUsed)) / (1000 * 60 * 60 * 24))}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Days Since Use</div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-6 pt-0">
                    <div className="flex space-x-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card click
                          // Navigate to routine detail page
                          window.location.href = `/routines/user-${routine.id}`;
                        }}
                        className="flex-1 bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 py-2 px-4 rounded-xl font-medium hover:bg-teal-100 dark:hover:bg-teal-900/30 transition-colors"
                      >
                        View Details
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card click
                          // Navigate to create page with edit mode (you can implement edit functionality later)
                          window.location.href = '/account/routines/create';
                        }}
                        className="flex-1 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-16">
              <div className="text-6xl mb-6">🧴</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {filter === 'all' ? 'No routines yet' : `No ${filter} routines found`}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
                {filter === 'all' 
                  ? "Start building your personalized skincare routine to track your progress and achieve your skin goals."
                  : `You don't have any ${filter} routines. Create one to get started!`
                }
              </p>
              <div className="space-y-4">
                <Link
                  href="/account/routines/create"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl font-medium hover:from-teal-700 hover:to-blue-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Your First Routine
                </Link>
                
                {filter !== 'all' && (
                  <div>
                    <button
                      onClick={() => setFilter('all')}
                      className="text-teal-600 dark:text-teal-400 hover:text-teal-500 font-medium"
                    >
                      View all routines
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          {routines.length > 0 && (
            <div className="mt-16 bg-gradient-to-r from-teal-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Ready to Optimize Your Routine?
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                  Get AI-powered analysis of your current routines and discover how to improve them for better results.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/skin-analysis"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl font-medium hover:from-teal-700 hover:to-blue-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200"
                  >
                    Analyze My Skin
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <Link
                    href="/products"
                    className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-600 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200"
                  >
                    Discover Products
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
