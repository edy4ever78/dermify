'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function SkinAnalysis() {
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [previousAnalyses, setPreviousAnalyses] = useState([]);
  const fileInputRef = useRef(null);
  const router = useRouter();

  // Check if user is logged in
  useEffect(() => {
    const checkUserLogin = async () => {
      try {
        const response = await fetch('/api/auth/check-auth', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          setIsLoggedIn(true);
          fetchPreviousAnalyses();
        } else {
          setIsLoggedIn(false);
          router.push('/signin?redirect=/skin-analysis');
        }
      } catch (error) {
        console.error('Authentication error:', error);
        setIsLoggedIn(false);
      } finally {
        setLoadingAuth(false);
      }
    };

    checkUserLogin();
  }, [router]);

  // Fetch previous analyses from Redis
  const fetchPreviousAnalyses = async () => {
    try {
      const response = await fetch('/api/skin-analysis/history', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPreviousAnalyses(data.history || []);
      }
    } catch (error) {
      console.error('Error fetching analysis history:', error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target.result);
      setResults(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target.result);
      setResults(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleAnalyze = async () => {
    if (!imagePreview) {
      setError('Please upload an image first');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Try to start the YOLOv8 API if it's not running
      try {
        const statusResponse = await fetch('/api/yolo-status', {
          method: 'GET',
        });
        
        const statusData = await statusResponse.json();
        
        if (statusData.status === 'stopped') {
          console.log('YOLOv8 API is not running, starting it...');
          await fetch('/api/yolo-status', {
            method: 'POST',
          });
          
          // Wait a moment for the API to start
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      } catch (e) {
        console.error('Error checking/starting YOLOv8 API:', e);
      }

      // Extract the base64 data from the image preview
      const base64Image = imagePreview.split(',')[1];

      // Call our API endpoint to analyze the image
      const response = await fetch('/api/skin-analysis/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64Image }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      // Ensure skinConditions are unique - extra safety check on client side
      if (data.skinConditions && Array.isArray(data.skinConditions)) {
        data.skinConditions = [...new Set(data.skinConditions)];
      }

      setResults(data);
      
      // Save the analysis to history
      try {
        await fetch('/api/skin-analysis/history', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ analysis: data }),
        });
      } catch (historyError) {
        console.error('Failed to save analysis to history:', historyError);
      }

      // Refresh the previous analyses list
      fetchPreviousAnalyses();
    } catch (error) {
      console.error('Analysis error:', error);
      setError(
        error.message || 
        'An error occurred during analysis. Please try again in a moment.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRecommendedIngredients = () => {
    if (!results || !results.skinConditions) return [];

    // Ensure we're working with unique conditions
    const uniqueConditions = [...new Set(results.skinConditions)];
    
    const recommendations = [];

    if (uniqueConditions.includes('acne') || uniqueConditions.includes('pimples')) {
      recommendations.push({
        name: 'Salicylic Acid',
        reason: 'Helps treat acne by unclogging pores and reducing inflammation.',
      });
      recommendations.push({
        name: 'Tea Tree Oil',
        reason: 'Natural antibacterial that can reduce acne-causing bacteria.',
      });
    }

    if (uniqueConditions.includes('dryness')) {
      recommendations.push({
        name: 'Hyaluronic Acid',
        reason: 'Intensely hydrates skin by attracting and binding water molecules.',
      });
      recommendations.push({
        name: 'Ceramides',
        reason: 'Restore skin barrier and lock in moisture.',
      });
    }

    if (uniqueConditions.includes('redness') || uniqueConditions.includes('sensitivity')) {
      recommendations.push({
        name: 'Centella Asiatica',
        reason: 'Calms inflammation and soothes irritated skin.',
      });
      recommendations.push({
        name: 'Niacinamide',
        reason: 'Reduces redness and strengthens skin barrier function.',
      });
    }

    if (uniqueConditions.includes('aging') || uniqueConditions.includes('wrinkles')) {
      recommendations.push({
        name: 'Retinol',
        reason: 'Promotes cell turnover and stimulates collagen production.',
      });
      recommendations.push({
        name: 'Peptides',
        reason: 'Support skin structure and firmness.',
      });
    }

    return recommendations;
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center p-6">
            <div className="h-12 w-12 rounded-full border-4 border-teal-500 border-t-transparent animate-spin mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Verifying account...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-8 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 sm:text-4xl">
              Skin Analysis
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
              Upload a clear, well-lit photo of your face to receive personalized skincare recommendations based on your skin conditions.
            </p>
          </div>

          <div className="mb-8">
            <div
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-teal-500 dark:hover:border-teal-400 transition-colors"
              onClick={() => fileInputRef.current.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-80 max-w-full mx-auto rounded-md"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setImagePreview(null);
                    }}
                    className="absolute top-2 right-2 bg-gray-800 bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70 transition-opacity"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-gray-600 dark:text-gray-400">
                    Drag and drop your image here, or click to select
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Supported formats: JPG, PNG, WEBP (max 10MB)
                  </p>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/jpeg, image/png, image/webp"
              />
            </div>
            
            {error && (
              <div className="mt-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-900 rounded-md p-4 text-red-700 dark:text-red-400">
                {error}
              </div>
            )}
            
            <div className="mt-4 flex justify-center">
              <button
                onClick={handleAnalyze}
                disabled={!imagePreview || isAnalyzing}
                className={`px-6 py-2 text-sm font-medium text-white rounded-md shadow-sm transition-all duration-300 
                  ${!imagePreview || isAnalyzing
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600'}`}
              >
                {isAnalyzing ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </div>
                ) : 'Analyze Image'}
              </button>
            </div>
          </div>

          {results && (
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden transition-all duration-300 animate-fade-in">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Analysis Results</h2>
                
                {/* Show the annotated image if available */}
                {results.annotatedImage && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Analyzed Image</h3>
                    <div className="mt-2 flex justify-center">
                      <img 
                        src={`data:image/jpeg;base64,${results.annotatedImage}`} 
                        alt="Analyzed skin"
                        className="max-h-80 max-w-full rounded-md border border-gray-200 dark:border-gray-700" 
                      />
                    </div>
                  </div>
                )}
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Detected Skin Conditions</h3>
                  <div className="flex flex-wrap gap-2">
                    {results.skinConditions && results.skinConditions.length > 0 ? (
                      // Use unique conditions for display
                      [...new Set(results.skinConditions)].map((condition, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200"
                        >
                          {condition}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-600 dark:text-gray-400">No specific skin conditions detected.</p>
                    )}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Skin Type</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {results.skinType || "Unable to determine skin type"}
                  </p>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Recommended Ingredients</h3>
                  <div className="space-y-2">
                    {getRecommendedIngredients().length > 0 ? (
                      getRecommendedIngredients().map((item, index) => (
                        <div key={index} className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 text-teal-500">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{item.reason}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600 dark:text-gray-400">No specific recommendations available.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {previousAnalyses.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Previous Analysis Results</h2>
              
              <div className="space-y-4">
                {previousAnalyses.map((analysis, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row justify-between">
                        <div className="mb-4 sm:mb-0">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(analysis.date).toLocaleString()}
                          </p>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white mt-1">
                            Skin Type: {analysis.skinType || "Not determined"}
                          </h3>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {analysis.skinConditions && analysis.skinConditions.map((condition, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200"
                              >
                                {condition}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}