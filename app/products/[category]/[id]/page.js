'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import { addToRecentlyViewed } from '@/lib/userUtils';
import Footer from '@/components/Footer';

export default function ProductDetail() {
  const params = useParams();
  const { category, id } = params;
  
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [selectedTab, setSelectedTab] = useState('description');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch product data based on category and id
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        
        const productData = await response.json();
        setProduct(productData);
        
        // Track this product view
        addToRecentlyViewed({
          type: 'product',
          id: id,
          name: productData.name
        });
        
        // Fetch related products if specified
        if (productData.relatedProducts && Array.isArray(productData.relatedProducts)) {
          const relatedData = await Promise.all(
            productData.relatedProducts.map(async (relatedId) => {
              const relatedResponse = await fetch(`/api/products/${relatedId}`);
              if (relatedResponse.ok) {
                return await relatedResponse.json();
              }
              return null;
            })
          );
          
          setRelatedProducts(relatedData.filter(p => p !== null));
        }
        
        // Check if product is saved in favorites
        const savedProducts = JSON.parse(localStorage.getItem('savedProducts') || '[]');
        if (savedProducts.some(item => item.id === id)) {
          setIsSaved(true);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);
  
  const handleSaveProduct = () => {
    if (!product) return;
    
    const savedProducts = JSON.parse(localStorage.getItem('savedProducts') || '[]');
    
    if (isSaved) {
      // Remove from saved
      const filtered = savedProducts.filter(item => item.id !== id);
      localStorage.setItem('savedProducts', JSON.stringify(filtered));
      setIsSaved(false);
    } else {
      // Add to saved
      savedProducts.push({ 
        id, 
        category, 
        name: product.name, 
        brand: product.brand,
        imageUrl: product.imageUrl 
      });
      localStorage.setItem('savedProducts', JSON.stringify(savedProducts));
      setIsSaved(true);
    }
  };
  
  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-12 h-12 rounded-full border-4 border-t-teal-500 border-gray-200 dark:border-gray-700 animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading product information...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }
  
  if (error || !product) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Product not found</h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              {error || "The product you're looking for doesn't exist or has been removed."}
            </p>
            <Link href="/products">
              <button className="mt-6 px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-medium rounded-md hover:from-teal-600 hover:to-blue-600 transition-all duration-300">
                View All Products
              </button>
            </Link>
          </div>
        </div>
        <Footer />
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
                  <Link href="/products" className="text-gray-500 hover:text-teal-500 dark:text-gray-400 dark:hover:text-teal-400 text-sm transition-colors">
                    Products
                  </Link>
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </li>
                <li>
                  <Link 
                    href={`/products/${category}`} 
                    className="text-gray-500 hover:text-teal-500 dark:text-gray-400 dark:hover:text-teal-400 text-sm transition-colors capitalize"
                  >
                    {category}
                  </Link>
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </li>
                <li>
                  <span className="text-gray-700 dark:text-gray-300 text-sm">{product.name}</span>
                </li>
              </ol>
            </nav>
          </div>
          
          {/* Product Overview */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Images */}
              <div className="p-6">
                <div className="relative h-80 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 overflow-hidden">
                  {product.imageUrl ? (
                    <>
                      <img
                        src={selectedImage === 0 ? product.imageUrl : (product.additionalImages?.[selectedImage - 1] || product.imageUrl)}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-contain transition-opacity duration-300"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `/images/placeholder-product.png`;
                          e.target.classList.add('opacity-70');
                        }}
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="h-16 w-16 text-gray-300 dark:text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                      </svg>
                    </div>
                  )}
                </div>
                
                {/* Image thumbnails */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedImage(0)}
                    className={`relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0 ${selectedImage === 0 ? 'ring-2 ring-teal-500' : 'ring-1 ring-gray-200 dark:ring-gray-700'}`}
                  >
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover" 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `/images/placeholder-product.png`;
                          e.target.classList.add('opacity-70');
                        }}
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </button>
                  
                  {/* Additional image thumbnails - same pattern for these */}
                  {product.additionalImages && product.additionalImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index + 1)}
                      className={`relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0 ${selectedImage === index + 1 ? 'ring-2 ring-teal-500' : 'ring-1 ring-gray-200 dark:ring-gray-700'}`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} view ${index + 1}`}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `/images/placeholder-product.png`;
                          e.target.classList.add('opacity-70');
                        }}
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Product Info */}
              <div className="p-6">
                <div className="mb-4">
                  <span className="text-sm text-teal-500 font-medium">{product.brand}</span>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{product.name}</h1>
                </div>
                
                {/* Price and Rating */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-2xl font-medium text-gray-900 dark:text-white">${product.price?.toFixed(2) || '0.00'}</span>
                  
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          className={`h-4 w-4 ${i < Math.floor(product.rank || 0) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      {product.rank || '0'} ({product.reviewCount || '0'} reviews)
                    </span>
                  </div>
                </div>
                
                {/* Product Meta */}
                <div className="mb-6 space-y-2">
                  {product.size && (
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400 w-24">Size:</span>
                      <span className="text-sm text-gray-900 dark:text-white">{product.size}</span>
                    </div>
                  )}
                  
                  {/* Skin Type display */}
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400 w-24">Skin Type:</span>
                    <div className="flex flex-wrap gap-1">
                      {product.skinTypes && Object.entries(product.skinTypes)
                        .filter(([_, value]) => value)
                        .map(([type]) => (
                          <span key={type} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full capitalize">
                            {type}
                          </span>
                        ))}
                    </div>
                  </div>
                  
                  {/* Concerns */}
                  {product.concerns && (
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400 w-24">Concerns:</span>
                      <div className="flex flex-wrap gap-1">
                        {product.concerns.map(concern => (
                          <span key={concern} className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-full">
                            {concern}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {product.description || "No description available."}
                </p>
                
                {/* Buttons */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <a 
                    href={product.purchaseUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-medium rounded-md hover:from-teal-600 hover:to-blue-600 transition-all duration-300 shadow-sm flex items-center justify-center"
                    onClick={(e) => {
                      if (!product.purchaseUrl) {
                        e.preventDefault();
                        alert('Purchase link not available for this product.');
                      }
                    }}
                    aria-label={`Buy ${product.name} from retailer`}
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Buy Now {product.purchaseUrl && <svg className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                    </svg>}
                  </a>
                  
                  <button
                    onClick={handleSaveProduct}
                    className={`px-4 py-3 ${
                      isSaved 
                        ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-500 dark:text-teal-400' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    } font-medium rounded-md hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all duration-300 flex items-center justify-center`}
                  >
                    {isSaved ? (
                      <>
                        <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                        </svg>
                        Saved
                      </>
                    ) : (
                      <>
                        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                        Save
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Product Details Tab Navigation */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <div className="flex">
                <button
                  onClick={() => setSelectedTab('description')}
                  className={`px-6 py-4 text-sm font-medium focus:outline-none ${
                    selectedTab === 'description' 
                      ? 'border-b-2 border-teal-500 text-teal-500' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
                >
                  Description
                </button>
                
                {product.ingredients && (
                  <button
                    onClick={() => setSelectedTab('ingredients')}
                    className={`px-6 py-4 text-sm font-medium focus:outline-none ${
                      selectedTab === 'ingredients' 
                        ? 'border-b-2 border-teal-500 text-teal-500' 
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                    }`}
                  >
                    Ingredients
                  </button>
                )}
                
                {product.howToUse && (
                  <button
                    onClick={() => setSelectedTab('howToUse')}
                    className={`px-6 py-4 text-sm font-medium focus:outline-none ${
                      selectedTab === 'howToUse' 
                        ? 'border-b-2 border-teal-500 text-teal-500' 
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                    }`}
                  >
                    How to Use
                  </button>
                )}
              </div>
            </div>
            
            {/* Tab Contents */}
            <div className="p-6">
              {/* Description Tab */}
              {selectedTab === 'description' && (
                <div>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">{product.description || "No description available."}</p>
                  
                  {product.benefits && product.benefits.length > 0 && (
                    <>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Key Benefits</h3>
                      <ul className="space-y-3">
                        {product.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start">
                            <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-gray-600 dark:text-gray-300">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>  
              )}
              
              {/* Ingredients Tab */}
              {selectedTab === 'ingredients' && (
                <div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Ingredient listings are subject to change. Please refer to the product packaging for the most up-to-date ingredient list.
                    </p>
                  </div>
                  
                  {typeof product.ingredients === 'string' ? (
                    <p className="text-gray-600 dark:text-gray-300">{product.ingredients}</p>
                  ) : Array.isArray(product.ingredients) ? (
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                      {product.ingredients.map((ingredient, index) => (
                        <li key={index} className={`py-4 ${ingredient.highlight ? 'bg-teal-50 dark:bg-teal-900/10 px-3 -mx-3 rounded' : ''}`}>
                          <div className="flex flex-col sm:flex-row sm:justify-between">
                            <h4 className={`font-medium ${ingredient.highlight ? 'text-teal-700 dark:text-teal-400' : 'text-gray-900 dark:text-white'}`}>
                              {ingredient.name}
                              {ingredient.highlight && (
                                <span className="ml-2 text-xs bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 px-2 py-0.5 rounded-full">
                                  Key Ingredient
                                </span>
                              )}
                            </h4>
                            <p className="mt-1 sm:mt-0 text-sm text-gray-500 dark:text-gray-400">{ingredient.description}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">No ingredient information available.</p>
                  )}
                </div>
              )}
              
              {/* How to Use Tab */}
              {selectedTab === 'howToUse' && product.howToUse && (
                <div>
                  <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-6 mb-6 border border-blue-100 dark:border-blue-900/20">
                    <h3 className="text-lg font-medium text-blue-800 dark:text-blue-400 mb-3">How to Use</h3>
                    <p className="text-blue-700 dark:text-blue-300">{product.howToUse}</p>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Tips for Best Results</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-600 dark:text-gray-300">
                          Allow product to fully absorb before applying the next skincare step.
                        </span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-600 dark:text-gray-300">
                          For maximum effectiveness, use as directed in a consistent skincare routine.
                        </span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-600 dark:text-gray-300">
                          Patch test before first use, especially if you have sensitive skin.
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">You May Also Like</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProducts.map(relatedProduct => (
                  <Link
                    key={relatedProduct.id}
                    href={`/products/${relatedProduct.category || category}/${relatedProduct.id}`}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden"
                  >
                    <div className="h-48 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                      {relatedProduct.imageUrl ? (
                        <img
                          src={relatedProduct.imageUrl}
                          alt={relatedProduct.name}
                          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300" 
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `/images/placeholder-product.png`;
                            e.target.classList.add('opacity-70');
                          }}
                          loading="lazy"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                          <svg className="h-12 w-12 text-gray-300 dark:text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{relatedProduct.brand}</p>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mt-1">{relatedProduct.name}</h3>
                      </div>
                      
                      <div className="mt-3 flex items-center justify-between">
                        <span className="font-medium text-gray-900 dark:text-gray-200">${(relatedProduct.price || 0).toFixed(2)}</span>
                        
                        <div className="flex items-center">
                          <div className="flex items-center">
                            <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">{relatedProduct.rank || '0'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
