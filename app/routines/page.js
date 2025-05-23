'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkinType, setSelectedSkinType] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  
  // Available filter options
  const skinTypes = ['All', 'Normal', 'Dry', 'Oily', 'Combination', 'Sensitive', 'Mature', 'Acne-Prone'];
  const difficultyLevels = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  
  // Filter routines based on search term and filters
  const filteredRoutines = routinesData.filter(routine => {
    const matchesSearch = 
      routine.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      routine.steps.some(step => step.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSkinType = 
      selectedSkinType === 'All' || 
      routine.skinTypes.includes(selectedSkinType);
    
    const matchesDifficulty = 
      selectedDifficulty === 'All' || 
      routine.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesSkinType && matchesDifficulty;
  });

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent">
              Skincare Routines
            </h1>
            <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
              Discover curated skincare routines for different skin types and concerns
            </p>
          </div>
          
          {/* Filters Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Search Routines
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search routines or steps..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="md:w-48">
                <label htmlFor="skinType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Skin Type
                </label>
                <select
                  id="skinType"
                  value={selectedSkinType}
                  onChange={(e) => setSelectedSkinType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                >
                  {skinTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div className="md:w-48">
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Difficulty
                </label>
                <select
                  id="difficulty"
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                >
                  {difficultyLevels.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mt-4 flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {filteredRoutines.length} routines found
              </span>
              
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSkinType('All');
                  setSelectedDifficulty('All');
                }}
                className="text-sm text-teal-500 hover:text-teal-600"
              >
                Reset Filters
              </button>
            </div>
          </div>
          
          {/* Routines Grid */}
          {filteredRoutines.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredRoutines.map((routine) => (
                <Link href={`/routines/${routine.id}`} key={routine.id}>
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col">
                    <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
                      {routine.imageUrl ? (
                        <img
                          src={routine.imageUrl}
                          alt={routine.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                          <svg className="h-16 w-16 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-5 flex-grow flex flex-col">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{routine.title}</h3>
                      
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex-grow">
                        <div className="flex items-center mb-1">
                          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {routine.timeRequired}
                        </div>
                        <div className="flex items-center mb-1">
                          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          {routine.steps.length} steps
                        </div>
                        <div className="flex items-center">
                          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          {routine.difficulty}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {routine.skinTypes.map((type) => (
                          <span
                            key={type}
                            className="text-xs bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 px-2 py-1 rounded-full"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-10 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No routines found</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">Try adjusting your search or filters to find what you're looking for.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSkinType('All');
                  setSelectedDifficulty('All');
                }}
                className="mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-500 hover:bg-teal-600"
              >
                Reset Filters
              </button>
            </div>
          )}
          
          {/* Create Custom Routine CTA */}
          <div className="mt-12 bg-gradient-to-r from-teal-500/10 to-blue-500/10 dark:from-teal-800/20 dark:to-blue-800/20 rounded-xl p-8 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Create Your Own Routine</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 max-w-xl mx-auto">
              Build a personalized skincare routine based on your unique skin type and concerns.
            </p>
            <Link href="/account/routines/create">
              <button className="px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-medium rounded-md hover:from-teal-600 hover:to-blue-600 transition-all duration-300 shadow-sm transform hover:-translate-y-0.5">
                Create Custom Routine
              </button>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
