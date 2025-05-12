'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import { getIngredientById, getAllIngredients } from '@/data/ingredients';

export default function IngredientDetail() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  
  const [ingredient, setIngredient] = useState(null);
  const [relatedIngredients, setRelatedIngredients] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Get ingredient data
    const ingredientData = getIngredientById(id);
    
    if (!ingredientData) {
      // If no ingredient is found, show loading for a moment then redirect
      const timer = setTimeout(() => {
        router.push('/ingredients');
      }, 1500);
      return () => clearTimeout(timer);
    }
    
    setIngredient(ingredientData);
    
    // Get related ingredients (same category or common skin types)
    const allIngredients = getAllIngredients();
    const related = allIngredients
      .filter(item => 
        item.id !== id && 
        (item.category === ingredientData.category || 
         item.skinTypes.some(type => ingredientData.skinTypes.includes(type)))
      )
      .slice(0, 3);
    setRelatedIngredients(related);
    
    // Simulated related products
    // In a real app, you would fetch actual product data containing this ingredient
    setRelatedProducts([
      {
        id: 'product-1',
        name: `${ingredientData.name} Serum`,
        brand: 'DermiCare',
        price: 24.99,
        imageUrl: '/images/products/serum-1.jpg',
        category: 'serums',
        description: `Concentrated formula with ${ingredientData.name.toLowerCase()} for maximum efficacy.`
      },
      {
        id: 'product-2',
        name: `Intensive ${ingredientData.name} Treatment`,
        brand: 'SkinFirst',
        price: 38.50,
        imageUrl: '/images/products/serum-2.jpg',
        category: 'treatments',
        description: `Advanced treatment featuring ${ingredientData.name.toLowerCase()} to target specific skin concerns.`
      },
      {
        id: 'product-3',
        name: `Daily ${ingredientData.name} Moisturizer`,
        brand: 'Pure Skin',
        price: 29.99,
        imageUrl: '/images/products/moisturizer-1.jpg',
        category: 'moisturizers',
        description: `Lightweight moisturizer enriched with ${ingredientData.name.toLowerCase()} for daily hydration and protection.`
      }
    ]);
    
    setLoading(false);
  }, [id, router]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center py-16">
              <div className="w-12 h-12 rounded-full border-4 border-t-teal-500 border-gray-200 dark:border-gray-700 animate-spin"></div>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (!ingredient) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Ingredient not found</h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400">Redirecting to ingredients page...</p>
          </div>
        </main>
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
                  <Link href="/ingredients" className="text-gray-500 hover:text-teal-500 dark:text-gray-400 dark:hover:text-teal-400 text-sm transition-colors">
                    Ingredients
                  </Link>
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </li>
                <li>
                  <span className="text-gray-700 dark:text-gray-300 text-sm">{ingredient.name}</span>
                </li>
              </ol>
            </nav>
          </div>
          
          {/* Ingredient Hero Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8">
            <div className="md:flex">
              <div className="md:w-1/3 h-64 md:h-auto bg-gray-200 dark:bg-gray-700 relative">
                {ingredient.imageUrl ? (
                  <img 
                    src={ingredient.imageUrl} 
                    alt={ingredient.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-teal-500/20 to-blue-500/20">
                    <svg className="h-24 w-24 text-gray-300 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                )}
              </div>
              
              <div className="p-8 md:w-2/3">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{ingredient.name}</h1>
                    
                    <div className="mt-2 flex items-center space-x-4">
                      <span className="inline-block text-sm font-medium text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20 px-3 py-1 rounded-full">
                        {ingredient.category}
                      </span>
                      
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400 mr-1">Safety:</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg 
                              key={i} 
                              className={`h-4 w-4 ${
                                i < ingredient.safetyRating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                              }`}
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400 mr-1">Evidence:</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg 
                              key={i} 
                              className={`h-4 w-4 ${
                                i < ingredient.scientificEvidence ? 'text-blue-400' : 'text-gray-300 dark:text-gray-600'
                              }`}
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {ingredient.aliases.length > 0 && (
                      <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-medium">Also known as:</span>{' '}
                        {ingredient.aliases.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
                
                <p className="mt-4 text-gray-600 dark:text-gray-300">
                  {ingredient.description}
                </p>
                
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Best for skin types:</h3>
                  <div className="flex flex-wrap gap-2">
                    {ingredient.skinTypes.map((type) => (
                      <span
                        key={type}
                        className="text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Commonly found in:</h3>
                  <div className="flex flex-wrap gap-2">
                    {ingredient.commonProducts.map((product) => (
                      <Link
                        key={product}
                        href={`/products/${product.toLowerCase().replace(/\s+/g, '-')}`}
                        className="text-sm bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-1 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800/30 transition-colors"
                      >
                        {product}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex -mb-px space-x-8">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'overview'
                      ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  Overview
                </button>
                
                <button
                  onClick={() => setActiveTab('benefits')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'benefits'
                      ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  Benefits
                </button>
                
                <button
                  onClick={() => setActiveTab('concerns')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'concerns'
                      ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  Concerns & Side Effects
                </button>
                
                <button
                  onClick={() => setActiveTab('products')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'products'
                      ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  Related Products
                </button>
              </nav>
            </div>
          </div>
          
          {/* Tab Content */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Overview</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {ingredient.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Key Benefits</h3>
                    <ul className="space-y-2">
                      {ingredient.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="h-6 w-6 text-teal-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-gray-600 dark:text-gray-300">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Potential Concerns</h3>
                    {ingredient.concerns.length > 0 ? (
                      <ul className="space-y-2">
                        {ingredient.concerns.map((concern, index) => (
                          <li key={index} className="flex items-start">
                            <svg className="h-6 w-6 text-amber-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span className="text-gray-600 dark:text-gray-300">{concern}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600 dark:text-gray-300">
                        No significant concerns have been reported for this ingredient when used as directed.
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Recommended For</h3>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {ingredient.skinTypes.map((type) => (
                      <div key={type} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                        <h4 className="font-medium text-gray-900 dark:text-white">{type} Skin</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Recommended</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Benefits Tab */}
            {activeTab === 'benefits' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Benefits</h2>
                
                <ul className="space-y-6">
                  {ingredient.benefits.map((benefit, index) => (
                    <li key={index} className="flex">
                      <div className="flex-shrink-0 h-10 w-10 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mr-4">
                        <span className="text-teal-600 dark:text-teal-400 font-medium">{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{benefit}</h3>
                        <p className="mt-1 text-gray-600 dark:text-gray-300">
                          {/* We could add more detailed benefit descriptions in a real app */}
                          Additional information about this specific benefit would be shown here, explaining how {ingredient.name} helps achieve this benefit and the science behind it.
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-10 bg-teal-50 dark:bg-teal-900/10 rounded-lg p-6 border border-teal-100 dark:border-teal-900/30">
                  <h3 className="text-lg font-medium text-teal-700 dark:text-teal-400 mb-3">Scientific Evidence</h3>
                  <div className="flex items-center mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          className={`h-5 w-5 ${
                            i < ingredient.scientificEvidence ? 'text-blue-400' : 'text-gray-300 dark:text-gray-600'
                          }`}
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-teal-700 dark:text-teal-400 font-medium">
                      {ingredient.scientificEvidence === 5 ? 'Extensive research' : 
                       ingredient.scientificEvidence === 4 ? 'Strong research' :
                       ingredient.scientificEvidence === 3 ? 'Moderate research' :
                       ingredient.scientificEvidence === 2 ? 'Limited research' : 'Minimal research'}
                    </span>
                  </div>
                  <p className="text-teal-600 dark:text-teal-300">
                    This rating indicates the level of scientific evidence supporting the claimed benefits of {ingredient.name}. 
                    A higher rating means more robust scientific studies back the ingredient's efficacy.
                  </p>
                </div>
              </div>
            )}
            
            {/* Concerns Tab */}
            {activeTab === 'concerns' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Potential Concerns & Side Effects
                </h2>
                
                {ingredient.concerns.length > 0 ? (
                  <>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      While {ingredient.name} is generally considered safe for most people, 
                      there are some potential concerns and side effects to be aware of:
                    </p>
                    
                    <ul className="space-y-6 mb-8">
                      {ingredient.concerns.map((concern, index) => (
                        <li key={index} className="flex">
                          <div className="flex-shrink-0 h-10 w-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mr-4">
                            <svg className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                              {concern}
                            </h3>
                            <p className="mt-1 text-gray-600 dark:text-gray-300">
                              {/* We could add more detailed concern explanations in a real app */}
                              More detailed information about this specific concern would be provided here, including who might be most affected and how to mitigate the risk.
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="bg-amber-50 dark:bg-amber-900/10 rounded-lg p-6 border border-amber-100 dark:border-amber-900/30">
                      <h3 className="flex items-center text-lg font-medium text-amber-700 dark:text-amber-400 mb-3">
                        <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Precautions
                      </h3>
                      <ul className="list-disc pl-5 text-amber-700 dark:text-amber-300 space-y-2">
                        <li>Always patch test new products containing {ingredient.name} before full application</li>
                        <li>If you have sensitive skin, start with lower concentrations</li>
                        <li>Discontinue use if irritation occurs and consult a dermatologist</li>
                        <li>Some ingredients may increase sun sensitivity - always use adequate sun protection</li>
                      </ul>
                    </div>
                  </>
                ) : (
                  <div className="bg-green-50 dark:bg-green-900/10 rounded-lg p-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-medium text-green-700 dark:text-green-400">
                          Generally Safe Ingredient
                        </h3>
                        <p className="mt-2 text-green-600 dark:text-green-300">
                          {ingredient.name} is considered safe for most skin types and has minimal reported side effects when used as directed. 
                          As with any skincare ingredient, individual reactions can vary, and it's always recommended to patch test before 
                          incorporating new products into your routine.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Related Products Tab */}
            {activeTab === 'products' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Products Containing {ingredient.name}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {relatedProducts.map((product) => (
                    <div key={product.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <div className="h-40 bg-gray-200 dark:bg-gray-600 relative">
                        {product.imageUrl ? (
                          <img 
                            src={product.imageUrl} 
                            alt={product.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                            <svg className="h-10 w-10 text-gray-300 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m-8-4l8 4m8 0l-8 4-8-4m16-4l-8 4m-8-4l8 4" />
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{product.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{product.brand}</p>
                          </div>
                          <p className="font-medium text-gray-900 dark:text-gray-200">${product.price.toFixed(2)}</p>
                        </div>
                        
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                          {product.description}
                        </p>
                        
                        <Link 
                          href={`/products/${product.category}/${product.id}`}
                          className="mt-4 inline-flex items-center text-teal-500 hover:text-teal-600 transition-colors text-sm font-medium"
                        >
                          View Product
                          <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="text-center">
                  <Link 
                    href={`/products?ingredient=${ingredient.id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-500 hover:bg-teal-600 transition-colors"
                  >
                    View All Products With {ingredient.name}
                    <svg className="ml-2 -mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          {/* Related Ingredients Section */}
          {relatedIngredients.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Related Ingredients
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedIngredients.map((relatedIngredient) => (
                  <Link 
                    href={`/ingredients/${relatedIngredient.id}`} 
                    key={relatedIngredient.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
                  >
                    <div className="h-40 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                      {relatedIngredient.imageUrl ? (
                        <img 
                          src={relatedIngredient.imageUrl} 
                          alt={relatedIngredient.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-teal-500/20 to-blue-500/20">
                          <svg className="h-16 w-16 text-gray-300 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                          </svg>
                        </div>
                      )}
                      
                      <div className="absolute top-3 right-3">
                        <div className="flex items-center bg-white dark:bg-gray-800 rounded-full px-2 py-1 text-xs font-medium">
                          {[...Array(5)].map((_, i) => (
                            <svg 
                              key={i} 
                              className={`h-3 w-3 ${
                                i < relatedIngredient.safetyRating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                              }`}
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-5 flex-grow flex flex-col">
                      <div className="mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{relatedIngredient.name}</h3>
                        <span className="inline-block text-xs font-medium text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20 px-2 py-1 rounded-full mt-1">
                          {relatedIngredient.category}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2 flex-grow">
                        {relatedIngredient.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-1 mt-2">
                        {relatedIngredient.skinTypes.slice(0, 3).map((type) => (
                          <span
                            key={type}
                            className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full"
                          >
                            {type}
                          </span>
                        ))}
                        {relatedIngredient.skinTypes.length > 3 && (
                          <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full">
                            +{relatedIngredient.skinTypes.length - 3} more
                          </span>
                        )}
                      </div>
                      
                      <div className="mt-4 text-teal-500 text-sm font-medium hover:text-teal-600 transition-colors flex items-center">
                        View details
                        <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
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
