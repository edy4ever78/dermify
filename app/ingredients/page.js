'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import IngredientCard from '@/components/IngredientCard';
import { getAllIngredients } from '@/data/ingredients';
import { useTranslation } from '@/hooks/useTranslation';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

function IngredientsContent() {
  const { t, getTranslatedIngredient } = useTranslation();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialSkinType = searchParams.get('skinType') || '';
  
  const [ingredients, setIngredients] = useState([]);
  const [filteredIngredients, setFilteredIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSkinType, setSelectedSkinType] = useState(initialSkinType);
  
  // Extract unique categories and skin types from ingredients data
  const [categories, setCategories] = useState([]);
  const [skinTypes, setSkinTypes] = useState([]);
  
  useEffect(() => {
    // Fetch ingredients
    const fetchIngredients = async () => {
      try {
        const allIngredients = getAllIngredients();
        setIngredients(allIngredients);
        
        // Extract unique categories and skin types
        const uniqueCategories = ['', ...new Set(allIngredients.map(item => item.category))];
        const uniqueSkinTypes = ['', ...new Set(allIngredients.flatMap(item => item.skinTypes))];
        
        setCategories(uniqueCategories);
        // Ensure skinTypes has no duplicates by using Set
        setSkinTypes([...new Set(uniqueSkinTypes)]);
        
        setFilteredIngredients(allIngredients);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching ingredients:', error);
        setLoading(false);
      }
    };
    
    fetchIngredients();
  }, []);
  
  // Filter ingredients based on search query, category, and skin type
  useEffect(() => {
    if (ingredients.length === 0) return;
    
    let filtered = [...ingredients];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        item => {
          const translatedItem = getTranslatedIngredient(item);
          return translatedItem.name.toLowerCase().includes(query) || 
          item.aliases.some(alias => alias.toLowerCase().includes(query)) ||
          translatedItem.description.toLowerCase().includes(query);
        }
      );
    }
    
    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(
        item => item.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    // Filter by skin type
    if (selectedSkinType) {
      filtered = filtered.filter(
        item => item.skinTypes.includes(selectedSkinType)
      );
    }
    
    setFilteredIngredients(filtered);
  }, [ingredients, searchQuery, selectedCategory, selectedSkinType]);
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };
  
  const handleSkinTypeChange = (e) => {
    setSelectedSkinType(e.target.value);
  };
  
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedSkinType('');
  };

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-[#FCFCFC] via-[#F6FDFD] to-[#A9E5D9]/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="backdrop-blur-xl bg-[#FCFCFC]/20 dark:bg-gray-800/20 rounded-2xl p-6 inline-block mb-6 border border-[#A9E5D9]/20 dark:border-gray-700/30 shadow-lg">
              <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-[#4BA3C7] to-[#A9E5D9] bg-clip-text text-transparent">
                {t('ingredients')}
              </h1>
            </div>
          </div>
          
          {/* Search and Filters */}
          <div className="mb-8 backdrop-blur-xl bg-[#FCFCFC]/80 dark:bg-gray-800/80 shadow-xl rounded-2xl p-6 border border-[#A9E5D9]/20 dark:border-gray-700/30">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              {/* Search Input */}
              <div className="md:col-span-2">
                <label htmlFor="search" className="block text-sm font-medium text-[#2E2E2E] dark:text-gray-300 mb-2">
                  {t('search')}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="search"
                    id="search"
                    className="block w-full pr-10 border border-[#A9E5D9]/30 dark:border-gray-600 focus:ring-2 focus:ring-[#4BA3C7] focus:border-[#4BA3C7] dark:bg-gray-700 dark:text-white rounded-xl py-3 px-4 bg-[#FCFCFC]/50 dark:bg-gray-700/50 transition-all duration-300"
                    placeholder={t('searchIngredients')}
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-[#4BA3C7] dark:text-[#A9E5D9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Category Filter */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-[#2E2E2E] dark:text-gray-300 mb-2">
                  {t('category')}
                </label>
                <select
                  id="category"
                  name="category"
                  className="block w-full border border-[#A9E5D9]/30 dark:border-gray-600 focus:ring-2 focus:ring-[#4BA3C7] focus:border-[#4BA3C7] dark:bg-gray-700 dark:text-white rounded-xl py-3 px-4 bg-[#FCFCFC]/50 dark:bg-gray-700/50 transition-all duration-300"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                >
                  <option value="">{t('allCategories')}</option>
                  {categories.filter(cat => cat !== '').map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              {/* Skin Type Filter */}
              <div>
                <label htmlFor="skinType" className="block text-sm font-medium text-[#2E2E2E] dark:text-gray-300 mb-2">
                  {t('skinType')}
                </label>
                <select
                  id="skinType"
                  name="skinType"
                  className="block w-full border border-[#A9E5D9]/30 dark:border-gray-600 focus:ring-2 focus:ring-[#4BA3C7] focus:border-[#4BA3C7] dark:bg-gray-700 dark:text-white rounded-xl py-3 px-4 bg-[#FCFCFC]/50 dark:bg-gray-700/50 transition-all duration-300"
                  value={selectedSkinType}
                  onChange={handleSkinTypeChange}
                >
                  <option value="">{t('allSkinTypes')}</option>
                  {skinTypes.filter(type => type !== '').map((type, index) => (
                    <option key={`${type}-${index}`} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Reset Filters Button */}
            {(searchQuery || selectedCategory || selectedSkinType) && (
              <div className="mt-4 text-right">
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center px-4 py-2 border border-[#A9E5D9]/30 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-xl text-[#2E2E2E] dark:text-gray-200 bg-[#FCFCFC]/50 dark:bg-gray-700/50 hover:bg-[#A9E5D9]/20 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4BA3C7] transition-all duration-300"
                >
                  <svg className="-ml-0.5 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {t('resetFilters')}
                </button>
              </div>
            )}
          </div>
          
          {/* Results Count */}
          <div className="mb-4 text-gray-600 dark:text-gray-400">
            {loading ? (
              <p>{t('loading')}</p>
            ) : (
              <p>
                {t('showing')} <span className="font-medium">{filteredIngredients.length}</span> {' '}
                {filteredIngredients.length === 1 ? t('ingredient') : t('ingredients')}
              </p>
            )}
          </div>
          
          {/* Ingredients Grid */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-16 h-16 border-4 border-[#A9E5D9]/30 border-t-[#4BA3C7] rounded-full animate-spin"></div>
            </div>
          ) : filteredIngredients.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredIngredients.map((ingredient) => (
                <IngredientCard key={ingredient.id} ingredient={getTranslatedIngredient(ingredient)} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 backdrop-blur-xl bg-[#FCFCFC]/80 dark:bg-gray-800/80 rounded-2xl shadow-xl border border-[#A9E5D9]/20 dark:border-gray-700/30">
              <svg className="mx-auto h-12 w-12 text-[#4BA3C7] dark:text-[#A9E5D9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-[#2E2E2E] dark:text-white">{t('noIngredientsFound')}</h3>
              <p className="mt-1 text-gray-500 dark:text-gray-400">{t('tryAdjustingFilters')}</p>
              <div className="mt-6">
                <button
                  onClick={resetFilters}
                  className="bg-gradient-to-r from-[#4BA3C7] to-[#A9E5D9] hover:from-[#3B92B0] hover:to-[#4BA3C7] text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                >
                  {t('resetFilters')}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default function Ingredients() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <IngredientsContent />
    </Suspense>
  );
}
