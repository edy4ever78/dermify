'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';

// Sample routines data (same as in routines/page.js)
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
    imageUrl: 'https://i0.wp.com/blog.organicharvest.in/wp-content/uploads/2023/05/Morning-Skincare-Routine.jpg?resize=950%2C500&ssl=1',
    description: 'A simple yet effective morning routine suitable for all skin types. This routine focuses on cleansing, hydration, and sun protection to prepare your skin for the day ahead.',
    notes: 'For best results, be consistent with your routine every morning. Allow each product to absorb for about 30 seconds before applying the next one.'
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
    imageUrl: 'https://saturn.health/cdn/shop/articles/10_Beauty_Tips_For_Face_At_Home_You_Must_Inculcate_In_Your_Daily_Skincare_Regimen_720x.jpg?v=1672752885',
    description: 'A straightforward evening routine that focuses on removing the day\'s impurities and replenishing your skin overnight. Includes optional treatments to address specific skin concerns.',
    notes: 'If using retinol, start with 1-2 times per week and gradually increase frequency. Always patch test new products, especially active treatments.'
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
    imageUrl: 'https://cdn-cdgdl.nitrocdn.com/NuHQviBvmmEbJjrsyBBmTIMsXPDRmbhb/assets/images/optimized/rev-d522591/cureskin.com/wp-content/uploads/2024/07/Relationship-Between-Oily-Skin-and-Acne.jpg',
    description: 'Tailored for those struggling with breakouts, this routine focuses on controlling oil production, clearing pores, and reducing inflammation.',
    notes: 'Be cautious not to over-cleanse or use too many actives at once, as this can irritate skin and potentially worsen acne. Introduce new products one at a time to identify any triggers.'
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
    imageUrl: 'https://m.clinique.com/media/export/cms/editorial_hub/article/anti_aging_skincare_routine/anti_aging_skincare_routine_548.jpg',
    description: 'A comprehensive routine designed to target signs of aging such as fine lines, wrinkles, and loss of elasticity.',
    notes: 'Consistency is key with anti-aging routines. Results typically take 6-12 weeks to become visible. Make sure to incorporate preventive measures like sunscreen daily.'
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
    imageUrl: '/images/routines/hyperpigmentation.jpg',
    description: 'A targeted routine for addressing dark spots, uneven skin tone, and hyperpigmentation issues.',
    notes: 'Consistency and sun protection are crucial for treating hyperpigmentation. Most brightening treatments require 8-12 weeks for visible results.'
  }
];

export default function RoutineDetail() {
  const params = useParams();
  const { id } = params;
  
  const [routine, setRoutine] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [productLinks, setProductLinks] = useState({});
  
  // Get routine data and product links
  useEffect(() => {
    const foundRoutine = routinesData.find(r => r.id === id);
    if (foundRoutine) {
      setRoutine(foundRoutine);
      
      // Fetch product links
      const fetchProductLinks = async () => {
        try {
          const response = await fetch('/api/products');
          const products = await response.json();
          
          // Create a map of product names to their URLs
          const links = {};
          products.forEach(product => {
            links[product.name.toLowerCase()] = `/products/${product.category}/${product.id}`;
          });
          setProductLinks(links);
        } catch (error) {
          console.error('Error fetching product links:', error);
        }
      };
      
      fetchProductLinks();
      
      // Check if routine is saved in local storage
      const savedRoutines = JSON.parse(localStorage.getItem('savedRoutines') || '[]');
      if (savedRoutines.includes(id)) {
        setIsSaved(true);
      }
    }
  }, [id]);
  
  const handleSaveRoutine = () => {
    const savedRoutines = JSON.parse(localStorage.getItem('savedRoutines') || '[]');
    
    if (isSaved) {
      // Remove from saved
      const updated = savedRoutines.filter(routineId => routineId !== id);
      localStorage.setItem('savedRoutines', JSON.stringify(updated));
      setIsSaved(false);
    } else {
      // Add to saved
      savedRoutines.push(id);
      localStorage.setItem('savedRoutines', JSON.stringify(savedRoutines));
      setIsSaved(true);
    }
  };
  
  const handleDeleteProduct = (stepIndex, productIndex) => {
    const updatedRoutine = { ...routine };
    updatedRoutine.steps[stepIndex].products.splice(productIndex, 1);
    setRoutine(updatedRoutine);
  };
  
  if (!routine) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Routine not found</h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">The routine you're looking for doesn't exist or has been removed.</p>
            <Link href="/routines">
              <button className="mt-6 px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-medium rounded-md hover:from-teal-600 hover:to-blue-600 transition-all duration-300">
                View All Routines
              </button>
            </Link>
          </div>
        </div>
      </>
    );
  }
  
  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                <li>
                  <Link href="/" className="text-gray-500 hover:text-teal-500 dark:text-gray-400 dark:hover:text-teal-400 text-sm transition-colors">
                    Home
                  </Link>
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </li>
                <li>
                  <Link href="/routines" className="text-gray-500 hover:text-teal-500 dark:text-gray-400 dark:hover:text-teal-400 text-sm transition-colors">
                    Routines
                  </Link>
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </li>
                <li>
                  <span className="text-gray-700 dark:text-gray-300 text-sm">{routine.title}</span>
                </li>
              </ol>
            </nav>
          </div>
          
          {/* Routine Header */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8">
            <div className="h-64 bg-gray-200 dark:bg-gray-700 relative">
              {routine.imageUrl ? (
                <img
                  src={routine.imageUrl}
                  alt={routine.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                  <svg className="h-24 w-24 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{routine.title}</h1>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {routine.skinTypes.map((type) => (
                      <span key={type} className="text-xs bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 px-2 py-1 rounded-full">
                        {type}
                      </span>
                    ))}
                    <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full">
                      {routine.difficulty}
                    </span>
                    <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-1 rounded-full">
                      {routine.timeRequired}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={handleSaveRoutine}
                  className={`p-2 rounded-full ${
                    isSaved 
                      ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-500 dark:text-teal-400' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  } hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors`}
                >
                  {isSaved ? (
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  )}
                </button>
              </div>
              
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                {routine.description}
              </p>
              
              {routine.notes && (
                <div className="mt-4 bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-100 dark:border-blue-900/20">
                  <h4 className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">Notes:</h4>
                  <p className="text-sm text-blue-600 dark:text-blue-300">{routine.notes}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Routine Steps Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Step-by-Step Instructions</h2>
            </div>
            
            <div className="px-6 py-5">
              {/* Step Navigation */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                  disabled={currentStep === 0}
                  className={`px-4 py-2 rounded-md ${
                    currentStep === 0
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  } transition-colors`}
                >
                  Previous
                </button>
                
                <span className="text-gray-600 dark:text-gray-400">
                  Step {currentStep + 1} of {routine.steps.length}
                </span>
                
                <button
                  onClick={() => setCurrentStep(prev => Math.min(routine.steps.length - 1, prev + 1))}
                  disabled={currentStep === routine.steps.length - 1}
                  className={`px-4 py-2 rounded-md ${
                    currentStep === routine.steps.length - 1
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      : 'bg-teal-500 text-white hover:bg-teal-600'
                  } transition-colors`}
                >
                  Next
                </button>
              </div>
              
              {/* Step Indicators */}
              <div className="flex items-center justify-center mb-6">
                <div className="flex items-center w-full max-w-md">
                  {routine.steps.map((step, index) => (
                    <div key={step.id} className="flex items-center flex-grow">
                      <button
                        onClick={() => setCurrentStep(index)}
                        className={`w-5 h-5 rounded-full ${
                          index === currentStep
                            ? 'bg-teal-500 ring-2 ring-teal-300 dark:ring-teal-700'
                            : index < currentStep
                              ? 'bg-teal-400'
                              : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      />
                      {index < routine.steps.length - 1 && (
                        <div className={`h-1 flex-grow ${
                          index < currentStep
                            ? 'bg-teal-400'
                            : 'bg-gray-300 dark:bg-gray-600'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Current Step Details */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <span className="text-2xl font-bold text-teal-500 dark:text-teal-400 mr-3">
                    {currentStep + 1}
                  </span>
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                    {routine.steps[currentStep].name}
                  </h3>
                  <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
                    {routine.steps[currentStep].time}
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {routine.steps[currentStep].description}
                </p>
                
                {/* Update the product links section */}
                {routine.steps[currentStep].products.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Recommended Products:
                    </h4>
                    <ul className="space-y-2">
                      {routine.steps[currentStep].products.map((product, index) => {
                        const productLink = productLinks[product.toLowerCase()];
                        return (
                          <li key={index} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <svg className="h-4 w-4 text-teal-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {productLink ? (
                                <Link
                                  href={productLink}
                                  className="text-teal-600 dark:text-teal-400 hover:underline"
                                >
                                  {product}
                                </Link>
                              ) : (
                                <span className="text-gray-600 dark:text-gray-400">{product}</span>
                              )}
                            </div>
                            <button
                              onClick={() => handleDeleteProduct(currentStep, index)}
                              className="text-red-500 hover:text-red-600 p-1"
                              aria-label="Delete product"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
              
              {currentStep === routine.steps.length - 1 && (
                <div className="mt-6 text-center">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Routine Complete!</h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    You've completed all steps in this routine. For best results, follow this routine consistently.
                  </p>
                  <button
                    onClick={() => setCurrentStep(0)}
                    className="px-6 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
                  >
                    Start Over
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
