'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTranslation } from '@/hooks/useTranslation';

export default function SkinAnalysis() {
  const { t } = useTranslation();
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [previousAnalyses, setPreviousAnalyses] = useState([]);
  const [modelStatus, setModelStatus] = useState(null);
  const [checkingModel, setCheckingModel] = useState(false);
  const fileInputRef = useRef(null);
  const router = useRouter();

  // Check if user is logged in
  useEffect(() => {
    const checkUserLogin = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        const response = await fetch('/api/auth/check-auth', {
          method: 'GET',
          headers: {
            'Authorization': authToken || '',
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
  
  // Check YOLO model status when page loads
  useEffect(() => {
    const checkYoloStatus = async () => {
      try {
        setCheckingModel(true);
        const response = await fetch('/api/yolo-status', {
          method: 'GET',
        });
        
        const data = await response.json();
        setModelStatus(data);
        
        if (data.status === 'model_missing') {
          setError("The skin analysis model is not properly loaded. The system will attempt to use alternative analysis methods.");
        }
      } catch (e) {
        console.error('Error checking YOLO status:', e);
        setError("Could not verify skin analysis system status. Analysis may be limited.");
      } finally {
        setCheckingModel(false);
      }
    };
    
    checkYoloStatus();
  }, []);

  // Fetch previous analyses
  const fetchPreviousAnalyses = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem('user'))?.email || 'anonymous';
      const response = await fetch(`/api/skin-analysis/history?userId=${encodeURIComponent(userId)}`, {
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
        
        if (statusData.status === 'stopped' || statusData.status === 'error') {
          console.log('YOLOv8 API is not running, starting it...');
          await fetch('/api/yolo-status', {
            method: 'POST',
          });
          
          // Wait a moment for the API to start
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
        
        // Check if model is loaded
        if (statusData.status === 'model_missing') {
          console.log('YOLOv8 model is missing, analysis may be limited');
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
        body: JSON.stringify({ image: imagePreview }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.apiStatus && !data.apiStatus.modelLoaded) {
          throw new Error("The skin analysis model could not be loaded. Please try again later.");
        } else {
          throw new Error(data.message || 'Analysis failed');
        }
      }

      // Ensure skinConditions are unique - extra safety check on client side
      if (data.skinConditions && Array.isArray(data.skinConditions)) {
        data.skinConditions = [...new Set(data.skinConditions)];
      }

      setResults(data);
      
      // Save the analysis to history
      try {
        const user = JSON.parse(localStorage.getItem('user')) || {};
        const userId = user.email || 'anonymous';
        
        await fetch('/api/skin-analysis/history', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            analysis: data,
            userId: userId
          }),
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
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#FCFCFC] via-[#F6FDFD] to-[#A9E5D9]/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center p-6">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#A9E5D9] border-t-[#4BA3C7]"></div>
              <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-[#4BA3C7] animate-pulse"></div>
            </div>
            <p className="text-[#2E2E2E] dark:text-gray-300 mt-4 font-medium">Verifying account...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#FCFCFC] via-[#F6FDFD] to-[#A9E5D9]/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      <main className="flex-grow pt-8 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="backdrop-blur-xl bg-[#FCFCFC]/20 dark:bg-gray-800/20 rounded-2xl p-6 inline-block mb-6 border border-[#A9E5D9]/20 dark:border-gray-700/30 shadow-lg">
              <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-[#4BA3C7] to-[#A9E5D9] bg-clip-text text-transparent">
                {t('skinAnalysis')}
              </h1>
            </div>
            <p className="mt-3 max-w-2xl mx-auto text-lg text-[#2E2E2E] dark:text-gray-300 font-medium">
              Upload a clear, well-lit photo of your face to receive personalized skincare recommendations based on your skin conditions.
            </p>
            
            {/* Show model status warning if there are issues */}
            {modelStatus && modelStatus.status === 'model_missing' && (
              <div className="mt-6 backdrop-blur-xl bg-[#F28B82]/10 dark:bg-[#F28B82]/20 border border-[#F28B82]/30 dark:border-[#F28B82]/50 rounded-xl p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-[#F28B82]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-bold text-[#F28B82]">Limited Analysis Mode</h3>
                    <div className="mt-2 text-sm">
                      <p className="text-[#2E2E2E] dark:text-gray-300">The skin analysis model is not properly loaded. Analysis results may be limited.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mb-8">
            <div
              className="border-2 border-dashed border-[#A9E5D9]/40 dark:border-gray-600 rounded-2xl p-8 text-center cursor-pointer hover:border-[#4BA3C7] dark:hover:border-[#A9E5D9] transition-all duration-300 backdrop-blur-xl bg-[#FCFCFC]/50 dark:bg-gray-800/50 hover:bg-[#F6FDFD]/60 dark:hover:bg-gray-700/60"
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
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-r from-[#4BA3C7] to-[#A9E5D9] rounded-2xl flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-white"
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
                  </div>
                  <div>
                    <p className="text-[#2E2E2E] dark:text-gray-300 font-medium text-lg">
                      Drag and drop your image here, or click to select
                    </p>
                    <p className="text-sm text-[#2E2E2E]/60 dark:text-gray-500 mt-2">
                      Supported formats: JPG, PNG, WEBP (max 10MB)
                    </p>
                  </div>
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
              <div className="mt-4 backdrop-blur-xl bg-[#F28B82]/10 dark:bg-[#F28B82]/20 border border-[#F28B82]/30 dark:border-[#F28B82]/50 rounded-xl p-4 text-[#F28B82] dark:text-[#F28B82]">
                {error}
              </div>
            )}
            
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleAnalyze}
                disabled={!imagePreview || isAnalyzing}
                className={`px-8 py-3 text-base font-bold text-white rounded-xl shadow-xl transition-all duration-300 transform hover:scale-[1.02] 
                  ${!imagePreview || isAnalyzing
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#4BA3C7] to-[#A9E5D9] hover:from-[#3B92B0] hover:to-[#4BA3C7] hover:shadow-2xl'}`}
              >
                {isAnalyzing ? (
                  <div className="flex items-center">
                    <div className="relative mr-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    </div>
                    Analyzing...
                  </div>
                ) : 'Analyze Image'}
              </button>
            </div>
          </div>

          {results && (
            <div className="backdrop-blur-xl bg-[#FCFCFC]/90 dark:bg-gray-800/90 shadow-2xl rounded-2xl overflow-hidden transition-all duration-500 animate-fade-in border border-[#A9E5D9]/20 dark:border-gray-700/30">
              <div className="p-8">
                <h2 className="text-2xl font-black text-[#2E2E2E] dark:text-white mb-6 bg-gradient-to-r from-[#4BA3C7] to-[#A9E5D9] bg-clip-text text-transparent">Analysis Results</h2>
                
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
                  <h3 className="text-lg font-bold text-[#2E2E2E] dark:text-white mb-3">Detected Skin Conditions</h3>
                  <div className="flex flex-wrap gap-2">
                    {results.skinConditions && results.skinConditions.length > 0 ? (
                      // Use unique conditions for display
                      [...new Set(results.skinConditions)].map((condition, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-[#C8E6C9] to-[#A9E5D9] text-[#2E2E2E] border border-[#A9E5D9]/30"
                        >
                          {condition}
                        </span>
                      ))
                    ) : (
                      <p className="text-[#2E2E2E]/70 dark:text-gray-400">No specific skin conditions detected.</p>
                    )}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-[#2E2E2E] dark:text-white mb-3">Skin Type</h3>
                  <div className="backdrop-blur-xl bg-[#F6FDFD]/50 dark:bg-gray-700/50 rounded-xl p-4 border border-[#A9E5D9]/20">
                    <p className="text-[#2E2E2E] dark:text-gray-300 font-medium">
                      {results.skinType || "Unable to determine skin type"}
                    </p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-[#2E2E2E] dark:text-white mb-4">Recommended Ingredients</h3>
                  <div className="space-y-3">
                    {getRecommendedIngredients().length > 0 ? (
                      getRecommendedIngredients().map((item, index) => (
                        <div key={index} className="backdrop-blur-xl bg-[#F6FDFD]/50 dark:bg-gray-700/50 rounded-xl p-4 border border-[#A9E5D9]/20">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 h-6 w-6 text-[#C8E6C9] mr-3 mt-0.5">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-base font-bold text-[#2E2E2E] dark:text-white">{item.name}</p>
                              <p className="text-sm text-[#2E2E2E]/70 dark:text-gray-400 mt-1">{item.reason}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-[#2E2E2E]/70 dark:text-gray-400">No specific recommendations available.</p>
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