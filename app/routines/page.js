'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Head from 'next/head';
import Header from '@/components/Header';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';

// Sample routines data
const routinesData = [
  {
    id: 'morning-basic',
    title: 'Basic Morning Routine',
    steps: [
      { id: 1, name: 'Cleanse', description: 'Start with a gentle cleanser to refresh your skin', time: '1-2 minutes', products: ['Gentle Foaming Cleanser', 'Hydrating Cream Cleanser'] },
      { id: 2, name: 'Tone (Optional)', description: 'Balance your skin pH with an alcohol-free toner', time: '30 seconds', products: ['Hydrating Toner'] },
      { id: 3, name: 'Serum', description: 'Apply a lightweight serum targeting your concerns', time: '1 minute', products: ['Vitamin C Brightening Serum', 'Hyaluronic Acid Serum'] },
      { id: 4, name: 'Moisturize', description: 'Lock in hydration with a moisturizer suitable for your skin type', time: '1 minute', products: ['Daily Moisture Cream', 'Oil-Free Moisturizer'] },
      { id: 5, name: 'Sunscreen', description: 'Finish with SPF protection (at least SPF 30)', time: '1 minute', products: ['Daily Defense SPF 50', 'Tinted Sunscreen SPF 40'] }
    ],
    skinTypes: ['All Skin Types'],
    timeRequired: '5-10 minutes',
    difficulty: 'Beginner',
    imageUrl: 'https://i0.wp.com/blog.organicharvest.in/wp-content/uploads/2023/05/Morning-Skincare-Routine.jpg?resize=950%2C500&ssl=1'
  },
  {
    id: 'evening-basic',
    title: 'Basic Evening Routine',
    steps: [
      { id: 1, name: 'Double Cleanse', description: 'First with an oil-based cleanser to remove makeup and sunscreen, then with a water-based cleanser', time: '2-3 minutes', products: ['Cleansing Oil', 'Gentle Foaming Cleanser'] },
      { id: 2, name: 'Tone (Optional)', description: 'Balance your skin pH with an alcohol-free toner', time: '30 seconds', products: ['Hydrating Toner'] },
      { id: 3, name: 'Treatment', description: 'Apply targeted treatments like retinol or exfoliating acids', time: '1 minute', products: ['Retinol Renewal Serum', 'AHA/BHA Exfoliating Solution'] },
      { id: 4, name: 'Moisturize', description: 'Apply a richer moisturizer than daytime', time: '1 minute', products: ['Intense Hydration Balm', 'Night Recovery Cream'] }
    ],
    skinTypes: ['All Skin Types'],
    timeRequired: '5-10 minutes',
    difficulty: 'Beginner',
    imageUrl: 'https://saturn.health/cdn/shop/articles/10_Beauty_Tips_For_Face_At_Home_You_Must_Inculcate_In_Your_Daily_Skincare_Regimen_720x.jpg?v=1672752885'
  },
  {
    id: 'acne-prone',
    title: 'Routine for Acne-Prone Skin',
    steps: [
      { id: 1, name: 'Cleanse', description: 'Use a cleanser with salicylic acid', time: '1-2 minutes', products: ['Salicylic Acid Cleanser'] },
      { id: 2, name: 'Tone', description: 'Use a witch hazel or BHA toner to remove excess oil and clear pores', time: '30 seconds', products: ['Clarifying Toner'] },
      { id: 3, name: 'Treatment', description: 'Apply spot treatment to active breakouts', time: '1 minute', products: ['Benzoyl Peroxide Spot Treatment', 'Tea Tree Oil Solution'] },
      { id: 4, name: 'Moisturize', description: 'Use a lightweight, non-comedogenic moisturizer', time: '1 minute', products: ['Oil-Free Moisturizer'] },
      { id: 5, name: 'Sunscreen (AM only)', description: 'Finish with a non-comedogenic SPF', time: '1 minute', products: ['Oil-Free SPF 30'] }
    ],
    skinTypes: ['Oily', 'Combination', 'Acne-Prone'],
    timeRequired: '5-10 minutes',
    difficulty: 'Intermediate',
    imageUrl: 'https://cdn-cdgdl.nitrocdn.com/NuHQviBvmmEbJjrsyBBmTIMsXPDRmbhb/assets/images/optimized/rev-d522591/cureskin.com/wp-content/uploads/2024/07/Relationship-Between-Oily-Skin-and-Acne.jpg'
  },
  {
    id: 'anti-aging',
    title: 'Anti-Aging Routine',
    steps: [
      { id: 1, name: 'Cleanse', description: 'Use a gentle, hydrating cleanser', time: '1-2 minutes', products: ['Hydrating Cream Cleanser'] },
      { id: 2, name: 'Tone', description: 'Use a hydrating toner with antioxidants', time: '30 seconds', products: ['Antioxidant Toner'] },
      { id: 3, name: 'Eye Cream', description: 'Apply eye cream to address fine lines and dark circles', time: '30 seconds', products: ['Peptide Eye Cream', 'Retinol Eye Cream'] },
      { id: 4, name: 'Serum (AM)', description: 'Apply vitamin C serum in the morning', time: '1 minute', products: ['Vitamin C Brightening Serum'] },
      { id: 5, name: 'Serum (PM)', description: 'Apply retinol serum in the evening', time: '1 minute', products: ['Retinol Renewal Serum'] },
      { id: 6, name: 'Moisturize', description: 'Use a rich moisturizer with peptides and ceramides', time: '1 minute', products: ['Anti-Aging Moisture Cream'] },
      { id: 7, name: 'Sunscreen (AM only)', description: 'Apply broad-spectrum sunscreen with at least SPF 30', time: '1 minute', products: ['Daily Defense SPF 50'] }
    ],
    skinTypes: ['Mature', 'Dry', 'Normal'],
    timeRequired: '10-15 minutes',
    difficulty: 'Advanced',
    imageUrl: 'https://m.clinique.com/media/export/cms/editorial_hub/article/anti_aging_skincare_routine/anti_aging_skincare_routine_548.jpg'
  },
  {
    id: 'hyperpigmentation',
    title: 'Routine for Hyperpigmentation',
    steps: [
      { id: 1, name: 'Cleanse', description: 'Use a gentle cleanser that won\'t irritate skin', time: '1-2 minutes', products: ['Gentle Foaming Cleanser'] },
      { id: 2, name: 'Tone', description: 'Use a brightening toner with niacinamide or alpha arbutin', time: '30 seconds', products: ['Brightening Toner'] },
      { id: 3, name: 'Targeted Treatment', description: 'Apply vitamin C serum in the morning or exfoliating serum (AHA/BHA) in the evening', time: '1 minute', products: ['Vitamin C Brightening Serum', 'AHA/BHA Exfoliating Solution'] },
      { id: 4, name: 'Spot Treatment', description: 'Apply targeted treatments with tranexamic acid or kojic acid', time: '30 seconds', products: ['Dark Spot Corrector'] },
      { id: 5, name: 'Moisturize', description: 'Use a moisturizer with brightening ingredients like niacinamide', time: '1 minute', products: ['Brightening Moisturizer'] },
      { id: 6, name: 'Sunscreen (AM only)', description: 'Apply SPF 50 sunscreen to prevent further darkening', time: '1 minute', products: ['Daily Defense SPF 50'] }
    ],
    skinTypes: ['All Skin Types'],
    timeRequired: '10-15 minutes',
    difficulty: 'Intermediate',
    imageUrl: 'https://images-1.eucerin.com/~/media/eucerin/international/about-skin/indications/postinflammatory-hyperpigmentation/pih-update2018/euc-int_about-skin_pih_00_teaser.jpg',
    description: 'A targeted routine for addressing dark spots, uneven skin tone, and hyperpigmentation issues.',
  }
];

export default function Routines() {
  const { t, getTranslatedRoutine, isInitialized } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkinType, setSelectedSkinType] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [favorites, setFavorites] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [userRoutines, setUserRoutines] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'templates', 'custom'
  
  // Load favorites and user routines from localStorage with error handling
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const savedFavorites = localStorage.getItem('routineFavorites');
        if (savedFavorites) {
          setFavorites(new Set(JSON.parse(savedFavorites)));
        }
        
        // Load user's custom routines
        const completedRoutines = JSON.parse(localStorage.getItem('completed-routines') || '[]');
        const draftRoutines = JSON.parse(localStorage.getItem('routine-drafts') || '[]');
        
        // Convert user routines to match template format
        const convertedUserRoutines = completedRoutines.map(routine => ({
          id: `user-${routine.id}`,
          title: routine.name,
          description: routine.description || `A personalized ${routine.type} routine for ${routine.skinType} skin`,
          steps: routine.steps.map((step, index) => ({
            id: index + 1,
            name: step.name,
            description: step.description,
            time: step.time || '1 minute',
            products: step.product ? [step.product] : []
          })),
          skinTypes: routine.skinType ? [routine.skinType.charAt(0).toUpperCase() + routine.skinType.slice(1)] : ['All Skin Types'],
          timeRequired: `${routine.estimatedTime || 5}-${(routine.estimatedTime || 5) + 5} minutes`,
          difficulty: routine.difficulty ? routine.difficulty.charAt(0).toUpperCase() + routine.difficulty.slice(1) : 'Beginner',
          imageUrl: null, // User routines don't have images
          isUserCreated: true,
          createdAt: routine.createdAt
        }));
        
        setUserRoutines(convertedUserRoutines);
        console.log('Loaded user routines:', convertedUserRoutines);
      }
    } catch (error) {
      console.warn('Error loading data:', error);
    }
    setIsLoading(false);
  }, []);
  
  // Safe translation functions with fallbacks
  const safeT = useCallback((key, fallback = key) => {
    try {
      if (!isInitialized) return fallback;
      const result = t(key);
      return typeof result === 'string' ? result : fallback;
    } catch (error) {
      console.warn(`Translation error for key "${key}":`, error);
      return fallback;
    }
  }, [t, isInitialized]);
  
  // Available filter options with safe translations
  const skinTypes = ['All', 'Normal', 'Dry', 'Oily', 'Combination', 'Sensitive', 'Mature', 'Acne-Prone'];
  const skinTypeLabels = useMemo(() => [
    safeT('all', 'All'),
    safeT('normal', 'Normal'),
    safeT('dry', 'Dry'),
    safeT('oily', 'Oily'),
    safeT('combination', 'Combination'),
    safeT('sensitive', 'Sensitive'),
    safeT('mature', 'Mature'),
    safeT('acneProne', 'Acne-Prone')
  ], [safeT]);
  
  const difficultyLevels = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const difficultyLabels = useMemo(() => [
    safeT('all', 'All'),
    safeT('beginner', 'Beginner'),
    safeT('intermediate', 'Intermediate'),
    safeT('advanced', 'Advanced')
  ], [safeT]);
  
  // Toggle favorites with error handling
  const toggleFavorite = useCallback((routineId) => {
    try {
      setFavorites(prev => {
        const newFavorites = new Set(prev);
        if (newFavorites.has(routineId)) {
          newFavorites.delete(routineId);
        } else {
          newFavorites.add(routineId);
        }
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('routineFavorites', JSON.stringify([...newFavorites]));
        }
        
        return newFavorites;
      });
    } catch (error) {
      console.warn('Error toggling favorite:', error);
    }
  }, []);
  
  // Helper function to translate skin type safely
  const translateSkinType = useCallback((skinType) => {
    const typeMap = {
      'All Skin Types': safeT('allSkinTypes', 'All Skin Types'),
      'Normal': safeT('normal', 'Normal'),
      'Dry': safeT('dry', 'Dry'),
      'Oily': safeT('oily', 'Oily'),
      'Combination': safeT('combination', 'Combination'),
      'Sensitive': safeT('sensitive', 'Sensitive'),
      'Mature': safeT('mature', 'Mature'),
      'Acne-Prone': safeT('acneProne', 'Acne-Prone')
    };
    return typeMap[skinType] || skinType;
  }, [safeT]);
  
  // Helper function to translate difficulty safely
  const translateDifficulty = useCallback((difficulty) => {
    const difficultyMap = {
      'Beginner': safeT('beginner', 'Beginner'),
      'Intermediate': safeT('intermediate', 'Intermediate'),
      'Advanced': safeT('advanced', 'Advanced')
    };
    return difficultyMap[difficulty] || difficulty;
  }, [safeT]);
  
  // Filter routines with memoization and safe translations
  const filteredRoutines = useMemo(() => {
    if (!isInitialized) return [];
    
    // Combine template routines and user routines based on active tab
    let allRoutines = [];
    if (activeTab === 'all') {
      allRoutines = [...userRoutines, ...routinesData];
    } else if (activeTab === 'templates') {
      allRoutines = routinesData;
    } else if (activeTab === 'custom') {
      allRoutines = userRoutines;
    }
    
    return allRoutines.filter(routine => {
      try {
        const translatedRoutine = getTranslatedRoutine ? getTranslatedRoutine(routine) : routine;
        const title = translatedRoutine.title || routine.title || '';
        
        const matchesSearch = 
          title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          routine.steps.some(step => 
            (step.name || '').toLowerCase().includes(searchTerm.toLowerCase())
          );
        
        const matchesSkinType = 
          selectedSkinType === 'All' || 
          routine.skinTypes.includes(selectedSkinType) ||
          routine.skinTypes.some(type => type.toLowerCase().includes(selectedSkinType.toLowerCase()));
        
        const matchesDifficulty = 
          selectedDifficulty === 'All' || 
          routine.difficulty === selectedDifficulty ||
          routine.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

        return matchesSearch && matchesSkinType && matchesDifficulty;
      } catch (error) {
        console.warn('Error filtering routine:', error);
        return false;
      }
    });
  }, [routinesData, userRoutines, searchTerm, selectedSkinType, selectedDifficulty, isInitialized, getTranslatedRoutine, activeTab]);
  
  // Get routine stats
  const stats = useMemo(() => {
    const allRoutines = [...routinesData, ...userRoutines];
    return {
      total: allRoutines.length,
      templates: routinesData.length,
      custom: userRoutines.length,
      filtered: filteredRoutines.length,
      favorites: favorites.size,
      beginner: allRoutines.filter(r => r.difficulty === 'Beginner' || r.difficulty === 'beginner').length,
      intermediate: allRoutines.filter(r => r.difficulty === 'Intermediate' || r.difficulty === 'intermediate').length,
      advanced: allRoutines.filter(r => r.difficulty === 'Advanced' || r.difficulty === 'advanced').length
    };
  }, [routinesData, userRoutines, filteredRoutines, favorites]);
  
  // Reset all filters
  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedSkinType('All');
    setSelectedDifficulty('All');
  }, []);

  // Show loading state while translations are initializing
  if (isLoading || !isInitialized) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-8 w-2/3 mx-auto"></div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-md h-96">
                    <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-t-xl"></div>
                    <div className="p-5 space-y-3">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }  return (
    <>
      <Head>
        <title>Skincare Routines | Expert Guides & Custom Plans | Dermify</title>
        <meta name="description" content="Discover proven skincare routines for every skin type and concern. From beginner to advanced routines with step-by-step guidance and product recommendations." />
        <meta name="keywords" content="skincare routine, morning routine, evening routine, acne routine, anti-aging routine, skincare steps" />
        <meta property="og:title" content="Expert Skincare Routines & Custom Plans" />
        <meta property="og:description" content="Professional skincare routines tailored to your skin type and concerns." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 pb-16">
        <style jsx>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slideInRight {
            from { opacity: 0; transform: translateX(30px); }
            to { opacity: 1; transform: translateX(0); }
          }
          .animate-fadeInUp { animation: fadeInUp 0.6s ease-out forwards; }
          .animate-slideInRight { animation: slideInRight 0.5s ease-out forwards; }
        `}</style>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced Hero Section */}
          <div className="relative overflow-hidden mb-12">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-blue-500/10 to-purple-500/10">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                                 radial-gradient(circle at 75% 75%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)`
              }} />
            </div>
            
            <div className="relative text-center py-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-200 text-sm font-medium mb-6">
                ✨ {stats.total} Expert-Curated & Custom Routines
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent mb-6">
                {safeT('skincareRoutines', 'Skincare Routines')}
              </h1>
              
              <p className="mt-3 max-w-3xl mx-auto text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                {safeT('discoverCuratedRoutines', 'Discover expertly curated skincare routines designed for every skin type, concern, and experience level.')}
              </p>
              
              {/* Quick Stats */}
              <div className="flex justify-center gap-8 mt-8 text-sm">
                <div className="text-center">
                  <div className="font-bold text-teal-600">{stats.templates}</div>
                  <div className="text-gray-500">Templates</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-blue-600">{stats.custom}</div>
                  <div className="text-gray-500">Custom</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-purple-600">{stats.favorites}</div>
                  <div className="text-gray-500">Favorites</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === 'all'
                    ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                All Routines ({stats.total})
              </button>
              <button
                onClick={() => setActiveTab('custom')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === 'custom'
                    ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                My Routines ({stats.custom})
              </button>
              <button
                onClick={() => setActiveTab('templates')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === 'templates'
                    ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Templates ({stats.templates})
              </button>
            </div>
          </div>
          
          {/* Enhanced Filters Section */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search */}
              <div className="flex-1">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {safeT('searchRoutines', 'Search Routines')}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={safeT('searchRoutinesPlaceholder', 'Search by routine name or steps...')}
                    className="w-full px-4 py-3 pl-11 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              
              {/* Filters Row */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Skin Type Filter */}
                <div className="sm:w-48">
                  <label htmlFor="skinType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {safeT('skinType', 'Skin Type')}
                  </label>
                  <select
                    id="skinType"
                    value={selectedSkinType}
                    onChange={(e) => setSelectedSkinType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    {skinTypes.map((type, index) => (
                      <option key={type} value={type}>{skinTypeLabels[index]}</option>
                    ))}
                  </select>
                </div>
                
                {/* Difficulty Filter */}
                <div className="sm:w-48">
                  <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {safeT('difficulty', 'Difficulty')}
                  </label>
                  <select
                    id="difficulty"
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    {difficultyLevels.map((level, index) => (
                      <option key={level} value={level}>{difficultyLabels[index]}</option>
                    ))}
                  </select>
                </div>
                
                {/* View Mode Toggle */}
                <div className="flex items-end">
                  <div className="flex rounded-xl border border-gray-200 dark:border-gray-600 overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`px-3 py-3 text-sm transition-colors ${
                        viewMode === 'grid'
                          ? 'bg-teal-500 text-white'
                          : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600'
                      }`}
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`px-3 py-3 text-sm transition-colors ${
                        viewMode === 'list'
                          ? 'bg-teal-500 text-white'
                          : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600'
                      }`}
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 8a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 12a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Filter Stats and Reset */}
            <div className="mt-6 flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                <span>
                  <span className="font-semibold text-teal-600">{stats.filtered}</span> of {stats.total} routines
                  {searchTerm && ` matching "${searchTerm}"`}
                </span>
                <span>•</span>
                <span>
                  <span className="font-semibold text-red-500">{stats.favorites}</span> favorites
                </span>
              </div>
              
              {(searchTerm || selectedSkinType !== 'All' || selectedDifficulty !== 'All') && (
                <button
                  onClick={resetFilters}
                  className="text-sm text-teal-500 hover:text-teal-600 font-medium transition-colors"
                >
                  {safeT('resetFilters', 'Reset Filters')}
                </button>
              )}
            </div>
          </div>
          
          {/* Enhanced Routines Display */}
          {filteredRoutines.length > 0 ? (
            <div className={`
              ${viewMode === 'grid' 
                ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' 
                : 'space-y-4'
              }
            `}>
              {filteredRoutines.map((routine, index) => {
                const isFavorite = favorites.has(routine.id);
                
                try {
                  const translatedRoutine = getTranslatedRoutine ? getTranslatedRoutine(routine) : routine;
                  const title = translatedRoutine.title || routine.title || 'Untitled Routine';
                  
                  return viewMode === 'grid' ? (
                    // Enhanced Grid Card
                    <div key={routine.id} className="cursor-pointer" onClick={() => {
                      if (routine.isUserCreated) {
                        // For user routines, go to the detail page with proper ID
                        window.location.href = `/routines/${routine.id}`;
                      } else {
                        // For template routines, go to detail page
                        window.location.href = `/routines/${routine.id}`;
                      }
                    }}>
                      <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden h-full flex flex-col border border-gray-100 dark:border-gray-700 hover:border-teal-200 dark:hover:border-teal-600 animate-fadeInUp transform hover:-translate-y-2 hover:scale-[1.02]"
                           style={{ animationDelay: `${index * 100}ms` }}>
                        
                        {/* Enhanced Image Section */}
                        <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 relative overflow-hidden">
                          {routine.imageUrl ? (
                            <img
                              src={routine.imageUrl}
                              alt={title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          
                          {/* Fallback Icon */}
                          <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-teal-100 to-blue-100 dark:from-teal-900 dark:to-blue-900 ${routine.imageUrl ? 'hidden' : 'flex'}`}>
                            <svg className="h-16 w-16 text-teal-500 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                          </div>
                          
                          {/* Overlay Gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                          
                          {/* Top Badges */}
                          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                            <div className="flex gap-2">
                              {routine.isUserCreated && (
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                                  Custom
                                </span>
                              )}
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                routine.difficulty === 'Beginner' || routine.difficulty === 'beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                routine.difficulty === 'Intermediate' || routine.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                              }`}>
                                {translateDifficulty(routine.difficulty)}
                              </span>
                            </div>
                            
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                toggleFavorite(routine.id);
                              }}
                              className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110 ${
                                isFavorite 
                                  ? 'bg-red-500 text-white shadow-lg' 
                                  : 'bg-white/20 text-white hover:bg-white/30'
                              }`}
                            >
                              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                          
                          {/* Bottom Badge */}
                          <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-3 py-1">
                            <span className="text-xs font-medium text-gray-800 dark:text-gray-200">
                              {routine.steps.length} {safeT('stepsCount', 'steps')}
                            </span>
                          </div>
                        </div>
                        
                        {/* Enhanced Content Section */}
                        <div className="p-6 flex-grow flex flex-col">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors line-clamp-2">
                            {title}
                          </h3>
                          
                          {/* Description if available */}
                          {routine.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                              {routine.description}
                            </p>
                          )}
                          
                          {/* Enhanced Stats */}
                          <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 space-y-2 flex-grow">
                            <div className="flex items-center gap-1">
                              <svg className="h-4 w-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="font-medium">{routine.timeRequired}</span>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                              </svg>
                              <span>{routine.steps.length} {safeT('stepsCount', 'steps')}</span>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <svg className="h-4 w-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                              <span>{translateDifficulty(routine.difficulty)}</span>
                            </div>
                          </div>
                          
                          {/* Enhanced Skin Type Tags */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {routine.skinTypes.slice(0, 2).map((type) => (
                              <span
                                key={type}
                                className="text-xs bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 px-3 py-1 rounded-full font-medium"
                              >
                                {translateSkinType(type)}
                              </span>
                            ))}
                            {routine.skinTypes.length > 2 && (
                              <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full">
                                +{routine.skinTypes.length - 2}
                              </span>
                            )}
                          </div>
                          
                          {/* Enhanced Action Row */}
                          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                            <span className="text-sm font-medium text-teal-600 dark:text-teal-400 group-hover:text-teal-500 transition-colors">
                              {safeT('viewRoutine', 'View Routine')}
                            </span>
                            <svg 
                              className="h-5 w-5 text-teal-600 dark:text-teal-400 group-hover:text-teal-500 transform group-hover:translate-x-1 transition-all duration-200" 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Enhanced List View
                    <div key={routine.id} className="cursor-pointer" onClick={() => {
                      if (routine.isUserCreated) {
                        // For user routines, go to the detail page with proper ID
                        window.location.href = `/routines/${routine.id}`;
                      } else {
                        // For template routines, go to detail page
                        window.location.href = `/routines/${routine.id}`;
                      }
                    }}>
                      <div className="group flex items-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-teal-200 dark:hover:border-teal-600 animate-slideInRight"
                           style={{ animationDelay: `${index * 50}ms` }}>
                        
                        {/* List Thumbnail */}
                        <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-teal-100 to-blue-100 dark:from-teal-900 dark:to-blue-900 rounded-xl overflow-hidden">
                          {routine.imageUrl ? (
                            <img
                              src={routine.imageUrl}
                              alt={title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div className={`w-full h-full flex items-center justify-center ${routine.imageUrl ? 'hidden' : 'flex'}`}>
                            <svg className="h-8 w-8 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                          </div>
                        </div>
                        
                        {/* List Content */}
                        <div className="flex-1 ml-6 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors line-clamp-1">
                                  {title}
                                </h3>
                                {routine.isUserCreated && (
                                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                                    Custom
                                  </span>
                                )}
                              </div>
                              
                              {routine.description && (
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                  {routine.description}
                                </p>
                              )}
                              
                              <div className="mt-3 flex items-center gap-6 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  {routine.timeRequired}
                                </span>
                                <span>{routine.steps.length} steps</span>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  routine.difficulty === 'Beginner' || routine.difficulty === 'beginner' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                  routine.difficulty === 'Intermediate' || routine.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                }`}>
                                  {translateDifficulty(routine.difficulty)}
                                </span>
                              </div>
                            </div>
                            
                            {/* List Actions */}
                            <div className="flex items-center gap-3 ml-4">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  toggleFavorite(routine.id);
                                }}
                                className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                                  isFavorite 
                                    ? 'text-red-500 hover:text-red-600' 
                                    : 'text-gray-400 hover:text-red-500'
                                }`}
                              >
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                </svg>
                              </button>
                              
                              <svg 
                                className="h-5 w-5 text-gray-400 group-hover:text-teal-500 transform group-hover:translate-x-1 transition-all duration-200" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                } catch (error) {
                  console.warn('Error rendering routine:', error);
                  return null;
                }
              })}
            </div>
          ) : (
            // Enhanced Empty State
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center border border-gray-100 dark:border-gray-700">
              <div className="max-w-md mx-auto">
                <div className="text-8xl mb-6 animate-bounce">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {searchTerm ? 
                    `No routines found for "${searchTerm}"` : 
                    safeT('noRoutinesFound', 'No routines found')
                  }
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                  {searchTerm ? 
                    'Try adjusting your search terms or browse our complete collection of skincare routines.' :
                    safeT('adjustSearchFilters', 'Try adjusting your filters or create a custom routine tailored to your needs.')
                  }
                </p>
                
                <div className="space-y-4">
                  <div className="flex flex-wrap justify-center gap-3">
                    <button
                      onClick={resetFilters}
                      className="px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                      {safeT('resetFilters', 'Reset Filters')}
                    </button>
                    
                    <Link href="/account/routines/create">
                      <button className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-xl text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        Create Custom Routine
                      </button>
                    </Link>
                  </div>

                  {/* Popular suggestions */}
                  {searchTerm && (
                    <div className="mt-8">
                      <p className="text-sm text-gray-500 mb-3">Try searching for:</p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {['morning', 'evening', 'acne', 'anti-aging'].map((suggestion) => (
                          <button
                            key={suggestion}
                            onClick={() => setSearchTerm(suggestion)}
                            className="px-3 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-teal-100 dark:hover:bg-teal-900 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Enhanced Create Custom Routine CTA */}
          <div className="mt-16 relative overflow-hidden bg-gradient-to-r from-teal-50 via-blue-50 to-purple-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-3xl p-12 shadow-xl">
            {/* Background decorations */}
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 via-blue-500/5 to-purple-500/5">
              <div className="absolute top-10 left-10 w-20 h-20 bg-teal-200/20 rounded-full blur-xl"></div>
              <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-200/20 rounded-full blur-xl"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-purple-200/20 rounded-full blur-xl"></div>
            </div>
            
            <div className="relative text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-200 text-sm font-medium mb-6">
                ✨ Personalized for You
              </div>
              
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Ready to Create Your 
                <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent"> Perfect </span>
                Routine?
              </h2>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed max-w-2xl mx-auto">
                Build a personalized skincare routine based on your unique skin type, concerns, and lifestyle preferences with our guided routine builder.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <Link href="/account/routines/create">
                  <button className="group px-8 py-4 bg-gradient-to-r from-teal-600 to-blue-600 text-white font-semibold rounded-2xl hover:from-teal-700 hover:to-blue-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 text-lg">
                    Create Custom Routine
                    <svg className="ml-3 -mr-1 h-6 w-6 inline-block group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </Link>
                
                <Link href="/skin-analysis">
                  <button className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-2xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-teal-300 dark:hover:border-teal-600 transition-all duration-200 transform hover:scale-105 text-lg">
                    Take Skin Analysis
                  </button>
                </Link>
              </div>

              {/* Feature highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="space-y-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-900 dark:to-teal-800 rounded-2xl flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Step-by-Step Guidance</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Clear instructions for each step with timing and application tips</p>
                </div>
                
                <div className="space-y-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-2xl flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tailored Recommendations</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Personalized product suggestions based on your skin profile</p>
                </div>
                
                <div className="space-y-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 rounded-2xl flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Proven Results</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Science-backed routines developed by skincare experts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
