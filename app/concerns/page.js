'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Header from '@/components/Header';
import { useTranslation } from '@/hooks/useTranslation';
import { useLoading } from '@/context/loading-context';
import { getAllConcerns } from '@/data/concerns';
import styles from './concerns.module.css';

export default function ConcernsPage() {
  const { t } = useTranslation();
  const { setIsLoading } = useLoading();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const [favorites, setFavorites] = useState(new Set());
  
  const concerns = getAllConcerns();
  
  // Debounced search function
  const debouncedSearch = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    
    // Simulate loading with shorter time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [setIsLoading]);

  // Load favorites from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedFavorites = localStorage.getItem('concernFavorites');
      if (savedFavorites) {
        setFavorites(new Set(JSON.parse(savedFavorites)));
      }
    }
  }, []);

  // Save favorites to localStorage
  const toggleFavorite = useCallback((concernId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(concernId)) {
        newFavorites.delete(concernId);
      } else {
        newFavorites.add(concernId);
      }
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('concernFavorites', JSON.stringify([...newFavorites]));
      }
      
      return newFavorites;
    });
  }, []);

  // Enhanced filtering and sorting with memoization
  const filteredAndSortedConcerns = useMemo(() => {
    let filtered = concerns.filter(concern => {
      const matchesSearch = 
        concern.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        concern.overview.toLowerCase().includes(searchTerm.toLowerCase()) ||
        concern.causes?.some(cause => cause.toLowerCase().includes(searchTerm.toLowerCase())) ||
        concern.recommendedIngredients?.some(ingredient => 
          ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      if (selectedCategory === 'all') return matchesSearch;
      if (selectedCategory === 'favorites') return matchesSearch && favorites.has(concern.id);
      
      // Enhanced categorization
      const categories = {
        'common': ['acne', 'aging', 'dryness'],
        'specific': ['redness', 'hyperpigmentation', 'sensitivity'],
        'preventable': ['aging', 'hyperpigmentation'],
        'inflammatory': ['acne', 'redness', 'sensitivity']
      };
      
      return matchesSearch && categories[selectedCategory]?.includes(concern.id);
    });

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.id.localeCompare(b.id);
        case 'treatments':
          return (b.treatments?.length || 0) - (a.treatments?.length || 0);
        case 'ingredients':
          return (b.recommendedIngredients?.length || 0) - (a.recommendedIngredients?.length || 0);
        case 'favorites':
          const aFav = favorites.has(a.id) ? 1 : 0;
          const bFav = favorites.has(b.id) ? 1 : 0;
          return bFav - aFav;
        default:
          return 0;
      }
    });

    return filtered;
  }, [concerns, searchTerm, selectedCategory, sortBy, favorites]);

  // Statistics
  const stats = useMemo(() => ({
    total: concerns.length,
    filtered: filteredAndSortedConcerns.length,
    favorites: favorites.size,
    categories: {
      common: concerns.filter(c => ['acne', 'aging', 'dryness'].includes(c.id)).length,
      specific: concerns.filter(c => ['redness', 'hyperpigmentation', 'sensitivity'].includes(c.id)).length
    }
  }), [concerns, filteredAndSortedConcerns, favorites]);

  // Get concern icon with enhanced variety
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

  // Enhanced color variations with gradients
  const getConcernColor = (concernId) => {
    const colors = {
      'acne': 'from-red-500 via-rose-500 to-pink-500',
      'aging': 'from-purple-600 via-indigo-500 to-blue-500',
      'dryness': 'from-amber-500 via-orange-500 to-red-400',
      'redness': 'from-rose-600 via-red-500 to-pink-500',
      'hyperpigmentation': 'from-gray-700 via-gray-600 to-slate-800',
      'sensitivity': 'from-emerald-500 via-teal-500 to-cyan-500'
    };
    return colors[concernId] || 'from-blue-500 via-indigo-500 to-purple-500';
  };

  // Get concern severity indicator
  const getConcernSeverity = (concern) => {
    const treatmentCount = concern.treatments?.length || 0;
    const ingredientCount = concern.recommendedIngredients?.length || 0;
    const complexity = treatmentCount + ingredientCount;
    
    if (complexity <= 6) return { level: 'Mild', color: 'text-green-600', bg: 'bg-green-100' };
    if (complexity <= 10) return { level: 'Moderate', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { level: 'Complex', color: 'text-red-600', bg: 'bg-red-100' };
  };
  
  return (
    <>
      <Head>
        <title>Skin Concerns & Solutions | Expert Skincare Guidance | Dermify</title>
        <meta name="description" content="Discover comprehensive solutions for all your skin concerns. Expert-backed treatments, ingredient recommendations, and personalized skincare advice for acne, aging, dryness, and more." />
        <meta name="keywords" content="skin concerns, skincare, acne treatment, anti-aging, dry skin, sensitive skin, hyperpigmentation, redness, skincare routine" />
        <meta property="og:title" content="Complete Guide to Skin Concerns & Solutions" />
        <meta property="og:description" content="Expert skincare solutions for acne, aging, dryness, and more. Get personalized recommendations." />
        <meta property="og:type" content="website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://dermify.app/concerns" />
      </Head>
      
      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          .animate-fadeInUp {
            animation: fadeInUp 0.6s ease-out forwards;
          }
          
          .animate-slideInRight {
            animation: slideInRight 0.5s ease-out forwards;
          }
        `}</style>
        {/* Modern Hero Section with Enhanced Features */}
        <div className="relative overflow-hidden">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-blue-500/10 to-purple-500/10">
            <div className="absolute inset-0 animate-pulse" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                               radial-gradient(circle at 75% 75%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
                               radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)`
            }} />
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
            <div className="text-center space-y-8">
              {/* Enhanced Header with Stats */}
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-200 text-sm font-medium">
                  ✨ {stats.total} Expert-Curated Skin Solutions
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                  {t('commonSkinConcerns')}
                </h1>
                <p className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  Discover personalized solutions for your unique skin challenges with expert-backed treatments, ingredient recommendations, and professional insights.
                </p>
              </div>

              {/* Enhanced Search and Controls Section */}
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Advanced Search Bar */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400 group-focus-within:text-teal-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-12 pr-12 py-4 border border-gray-300 dark:border-gray-600 rounded-2xl leading-5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-lg"
                    placeholder="Search concerns, ingredients, or treatments..."
                    value={searchTerm}
                    onChange={(e) => debouncedSearch(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Enhanced Controls Row */}
                <div className="flex flex-wrap justify-between items-center gap-4">
                  {/* Category Filters */}
                  <div className="flex flex-wrap justify-center gap-2">
                    {[
                      { id: 'all', label: 'All Concerns', count: stats.total },
                      { id: 'favorites', label: 'Favorites', count: stats.favorites },
                      { id: 'common', label: 'Common Issues', count: stats.categories.common },
                      { id: 'specific', label: 'Specific Conditions', count: stats.categories.specific },
                      { id: 'preventable', label: 'Preventable', count: 2 },
                      { id: 'inflammatory', label: 'Inflammatory', count: 3 }
                    ].map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`group relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                          selectedCategory === category.id
                            ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/25 scale-105'
                            : 'bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-gray-700 hover:scale-105 border border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        {category.label}
                        <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${
                          selectedCategory === category.id
                            ? 'bg-white/20 text-white'
                            : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                        }`}>
                          {category.count}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* View Controls */}
                  <div className="flex items-center gap-3">
                    {/* Sort Dropdown */}
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-2 rounded-lg bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="name">Sort by Name</option>
                      <option value="treatments">Most Treatments</option>
                      <option value="ingredients">Most Ingredients</option>
                      <option value="favorites">Favorites First</option>
                    </select>

                    {/* View Mode Toggle */}
                    <div className="flex rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`px-3 py-2 text-sm ${
                          viewMode === 'grid'
                            ? 'bg-teal-500 text-white'
                            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`px-3 py-2 text-sm ${
                          viewMode === 'list'
                            ? 'bg-teal-500 text-white'
                            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
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
            </div>
          </div>
        </div>

        {/* Enhanced Concerns Display */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Results Header with Analytics */}
          <div className="mb-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedCategory === 'favorites' ? 'Your Favorite Concerns' : 
                   selectedCategory === 'all' ? 'All Skin Concerns' :
                   `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Concerns`}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {filteredAndSortedConcerns.length === concerns.length 
                    ? `Showing all ${concerns.length} expertly curated skin concerns`
                    : `Found ${filteredAndSortedConcerns.length} of ${concerns.length} concerns`
                  }
                  {searchTerm && ` matching "${searchTerm}"`}
                </p>
              </div>
              
              {/* Quick Stats */}
              <div className="flex gap-4 text-sm">
                <div className="text-center">
                  <div className="font-bold text-teal-600">{stats.favorites}</div>
                  <div className="text-gray-500">Favorites</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-blue-600">{stats.categories.common}</div>
                  <div className="text-gray-500">Common</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-purple-600">{stats.categories.specific}</div>
                  <div className="text-gray-500">Specific</div>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Grid/List Layout */}
          <div className={`
            ${viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8' 
              : 'space-y-4'
            }
          `}>
            {filteredAndSortedConcerns.map((concern, index) => {
              const severity = getConcernSeverity(concern);
              const isFavorite = favorites.has(concern.id);
              
              return viewMode === 'grid' ? (
                // Enhanced Grid Card
                <Link 
                  key={concern.id}
                  href={`/concerns/${concern.id}`}
                  className="group relative bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] border border-gray-100 dark:border-gray-700 animate-fadeInUp"
                  style={{ 
                    animationDelay: `${index * 50}ms`
                  }}
                >
                  {/* Enhanced Gradient Header */}
                  <div className={`h-40 relative overflow-hidden bg-gradient-to-br ${getConcernColor(concern.id)}`}>
                    {/* Animated Pattern Overlay */}
                    <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
                      <div className="absolute inset-0 animate-pulse" style={{
                        backgroundImage: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 50%),
                                         radial-gradient(circle at 70% 70%, rgba(255,255,255,0.3) 0%, transparent 50%)`
                      }} />
                    </div>
                    
                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                      <div className="text-4xl mb-3 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                        {getConcernIcon(concern.id)}
                      </div>
                      <h3 className="text-xl font-bold text-center leading-tight">
                        {t(`skinConcernTypes.${concern.id}`) || concern.id}
                      </h3>
                    </div>

                    {/* Enhanced Badges */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${severity.bg} ${severity.color}`}>
                        {severity.level}
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleFavorite(concern.id);
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

                    {/* Treatment Count Badge */}
                    <div className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                      <span className="text-xs font-medium text-white">
                        {concern.treatments?.length || 0} solutions
                      </span>
                    </div>
                  </div>
                  
                  {/* Enhanced Content Section */}
                  <div className="p-6 space-y-4">
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
                      {concern.overview.substring(0, 140)}...
                    </p>
                    
                    {/* Enhanced Tags with Tooltips */}
                    <div className="flex flex-wrap gap-2">
                      {concern.recommendedIngredients?.slice(0, 2).map((ingredient, idx) => (
                        <span
                          key={idx}
                          title={ingredient.description}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300 hover:bg-teal-200 dark:hover:bg-teal-900/50 transition-colors cursor-help"
                        >
                          {ingredient.name}
                        </span>
                      ))}
                      {concern.recommendedIngredients?.length > 2 && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                          +{concern.recommendedIngredients.length - 2} more
                        </span>
                      )}
                    </div>
                    
                    {/* Enhanced Action Row */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-teal-600 dark:text-teal-400 group-hover:text-teal-500 transition-colors">
                          {t('learnMore')}
                        </span>
                        <div className="flex gap-1">
                          {[...Array(Math.min(5, Math.ceil((concern.treatments?.length || 0) / 2)))].map((_, i) => (
                            <div key={i} className="w-1 h-1 rounded-full bg-teal-400 opacity-60"></div>
                          ))}
                        </div>
                      </div>
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

                  {/* Enhanced Hover Effect Border */}
                  <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-teal-200 dark:group-hover:border-teal-600 transition-all duration-300" />
                </Link>
              ) : (
                // Enhanced List View
                <Link
                  key={concern.id}
                  href={`/concerns/${concern.id}`}
                  className="group flex items-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-teal-200 dark:hover:border-teal-600 animate-slideInRight"
                  style={{ 
                    animationDelay: `${index * 30}ms`
                  }}
                >
                  {/* List Icon */}
                  <div className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${getConcernColor(concern.id)} flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform`}>
                    {getConcernIcon(concern.id)}
                  </div>
                  
                  {/* List Content */}
                  <div className="flex-1 ml-6 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                          {t(`skinConcernTypes.${concern.id}`) || concern.id}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {concern.overview.substring(0, 200)}...
                        </p>
                        <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                          <span>{concern.treatments?.length || 0} treatments</span>
                          <span>{concern.recommendedIngredients?.length || 0} ingredients</span>
                          <span className={`px-2 py-1 rounded-full ${severity.bg} ${severity.color}`}>
                            {severity.level}
                          </span>
                        </div>
                      </div>
                      
                      {/* List Actions */}
                      <div className="flex items-center gap-3 ml-4">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            toggleFavorite(concern.id);
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
                </Link>
              );
            })}
          </div>

          {/* Enhanced No Results */}
          {filteredAndSortedConcerns.length === 0 && (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="text-8xl mb-6 animate-bounce">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {searchTerm ? `No results for "${searchTerm}"` : 'No concerns found'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                  {searchTerm 
                    ? 'Try adjusting your search terms or browse our complete collection of skin concerns.'
                    : 'It looks like there are no concerns in this category. Try exploring other categories or viewing all concerns.'
                  }
                </p>
                
                <div className="space-y-4">
                  <div className="flex flex-wrap justify-center gap-3">
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('all');
                        setSortBy('name');
                      }}
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                      View All Concerns
                    </button>
                    
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-full text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
                      >
                        Clear Search
                      </button>
                    )}
                  </div>

                  {/* Popular suggestions */}
                  <div className="mt-8">
                    <p className="text-sm text-gray-500 mb-3">Popular searches:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {['acne', 'aging', 'dryness', 'sensitivity'].map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => {
                            setSearchTerm(suggestion);
                            setSelectedCategory('all');
                          }}
                          className="px-3 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-teal-100 dark:hover:bg-teal-900 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Bottom CTA Section */}
        <div className="relative bg-gradient-to-r from-teal-50 via-blue-50 to-purple-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 py-20 overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 via-blue-500/5 to-purple-500/5">
            <div className="absolute top-10 left-10 w-20 h-20 bg-teal-200/20 rounded-full blur-xl"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-200/20 rounded-full blur-xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-purple-200/20 rounded-full blur-xl"></div>
          </div>
          
          <div className="relative max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-200 text-sm font-medium mb-6">
                🎯 Personalized Skincare Solutions
              </div>
              
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Ready for Your 
                <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent"> Custom </span>
                Skincare Journey?
              </h2>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
                Get AI-powered skin analysis, personalized product recommendations, and expert-backed routines tailored specifically to your unique skin needs and concerns.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <Link
                  href="/skin-analysis"
                  className="group inline-flex items-center px-8 py-4 border border-transparent text-lg font-semibold rounded-2xl text-white bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-xl hover:shadow-2xl"
                >
                  Start Free Skin Analysis
                  <svg className="ml-3 -mr-1 h-6 w-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                
                <Link
                  href="/products"
                  className="inline-flex items-center px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-lg font-semibold rounded-2xl text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-teal-300 dark:hover:border-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200 transform hover:scale-105"
                >
                  Browse Products
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
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Expert Analysis</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">AI-powered skin assessment with dermatologist-backed recommendations</p>
                </div>
                
                <div className="space-y-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-2xl flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Personalized Care</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Custom routines designed for your unique skin type and concerns</p>
                </div>
                
                <div className="space-y-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 rounded-2xl flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Fast Results</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">See improvements with science-backed ingredients and proven formulations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
