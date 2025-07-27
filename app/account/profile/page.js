'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import { getProductRecommendations, getIngredientRecommendations } from '@/utils/recommendations';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Available skin types for dropdown
const skinTypes = [
  'Normal',
  'Dry',
  'Oily',
  'Combination',
  'Sensitive',
  'Mature'
];

// Available skin concerns for multi-select
const skinConcernOptions = [
  'Acne',
  'Hyperpigmentation',
  'Aging',
  'Dryness',
  'Sensitivity',
  'Redness',
  'Large Pores',
  'Dullness',
  'Uneven Texture',
  'Uneven Tone'
];

// Format skin concerns display properly
const formatSkinConcerns = (concerns) => {
  if (!concerns || !Array.isArray(concerns) || concerns.length === 0) {
    return "None specified";
  }
  
  // Join the concerns with proper spacing and formatting
  return concerns.join(', ');
};

function ProfilePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [saveStatus, setSaveStatus] = useState(null);
  const [error, setError] = useState(null);
  const [savedRoutines, setSavedRoutines] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalAnalyses: 0,
    recentAnalyses: 0,
    favoriteProducts: 0,
    savedRoutines: 0
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [showWelcome, setShowWelcome] = useState(searchParams?.get('welcome') === 'true');
  const [recommendations, setRecommendations] = useState({ products: [], ingredients: [] });
  const [savedProducts, setSavedProducts] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        let email = localStorage.getItem('userEmail');

        if (!email) {
          // Fetch email from Redis
          const redisResponse = await fetch('/api/redis/get-email', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (redisResponse.ok) {
            const { userEmail } = await redisResponse.json();
            email = userEmail;

            if (email) {
              localStorage.setItem('userEmail', email);
            } else {
              console.error('No user email found in Redis');
              router.push('/signin');
              return;
            }
          } else {
            const errorDetails = await redisResponse.text();
            console.error('Failed to fetch email from Redis:', errorDetails);
            router.push('/signin');
            return;
          }
        }

        if (!email) {
          console.error('Email is missing or invalid');
          router.push('/signin');
          return;
        }

        const response = await fetch(`/api/user/profile?email=${encodeURIComponent(email)}`);
        if (!response.ok) {
          const errorDetails = await response.text();
          throw new Error(`Failed to fetch user data: ${errorDetails}`);
        }

        const userData = await response.json();
        setUser(userData);
        setFormData({
          name: `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
          skinType: userData.skinType || 'Normal',
          skinConcerns: Array.isArray(userData.skinConcerns) && userData.skinConcerns.length > 0
            ? userData.skinConcerns
            : [],
          ageRange: userData.ageRange || '',
          skincareExperience: userData.skincareExperience || '',
          budget: userData.budget || '',
          lifestyle: userData.lifestyle || '',
          goals: userData.goals || '',
          allergies: userData.allergies || '',
          currentRoutine: userData.currentRoutine || ''
        });

        loadSavedRoutines();
        loadRecentlyViewed();
        loadAnalysisHistory();
        loadDashboardStats();
        loadRecommendations(userData);
        loadSavedProducts();
      } catch (error) {
        console.error('Error fetching user data:', error.message);
        setError('Failed to load profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);
  
  const loadSavedRoutines = () => {
    try {
      const rawData = localStorage.getItem('savedRoutines');
      if (!rawData || rawData === 'null' || rawData === 'undefined') {
        setSavedRoutines([]);
        return;
      }
      const savedRoutinesData = JSON.parse(rawData);
      setSavedRoutines(Array.isArray(savedRoutinesData) ? savedRoutinesData : []);
    } catch (e) {
      console.error('Error loading saved routines:', e);
      localStorage.removeItem('savedRoutines'); // Clear corrupted data
      setSavedRoutines([]);
    }
  };
  
  const loadRecentlyViewed = () => {
    try {
      const rawData = localStorage.getItem('recentlyViewed');
      if (!rawData || rawData === 'null' || rawData === 'undefined') {
        setRecentlyViewed([]);
        return;
      }
      const recentlyViewedData = JSON.parse(rawData);
      setRecentlyViewed(Array.isArray(recentlyViewedData) ? recentlyViewedData.slice(0, 5) : []);
    } catch (e) {
      console.error('Error loading recently viewed products:', e);
      localStorage.removeItem('recentlyViewed'); // Clear corrupted data
      setRecentlyViewed([]);
    }
  };

  const loadAnalysisHistory = async () => {
    try {
      const response = await fetch('/api/skin-analysis/history');
      if (response.ok) {
        const text = await response.text();
        if (!text || text.trim() === '') {
          setAnalysisHistory([]);
          return;
        }
        
        try {
          const historyData = JSON.parse(text);
          const userEmail = localStorage.getItem('userEmail');
          const userHistory = Array.isArray(historyData) 
            ? historyData.filter(item => item.userId === userEmail)
            : [];
          setAnalysisHistory(userHistory.slice(0, 5));
        } catch (parseError) {
          console.error('Error parsing analysis history JSON:', parseError);
          setAnalysisHistory([]);
        }
      } else {
        console.error('Failed to fetch analysis history:', response.status);
        setAnalysisHistory([]);
      }
    } catch (e) {
      console.error('Error loading analysis history:', e);
      setAnalysisHistory([]);
    }
  };

  const loadDashboardStats = () => {
    try {
      const userEmail = localStorage.getItem('userEmail');
      
      // Safe parsing of localStorage data
      const getLocalStorageArray = (key) => {
        try {
          const rawData = localStorage.getItem(key);
          if (!rawData || rawData === 'null' || rawData === 'undefined') {
            return [];
          }
          const parsed = JSON.parse(rawData);
          return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
          console.error(`Error parsing ${key} from localStorage:`, e);
          localStorage.removeItem(key); // Clear corrupted data
          return [];
        }
      };
      
      const recentlyViewedData = getLocalStorageArray('recentlyViewed');
      const savedRoutinesData = getLocalStorageArray('savedRoutines');
      const savedProductsData = getLocalStorageArray('savedProducts');
      
      // Load analysis history for stats
      fetch('/api/skin-analysis/history')
        .then(response => response.json())
        .then(historyData => {
          const userHistory = Array.isArray(historyData) 
            ? historyData.filter(item => item.userId === userEmail)
            : [];
          const recentAnalyses = userHistory.filter(item => {
            const analysisDate = new Date(item.date);
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            return analysisDate >= oneWeekAgo;
          });

          setDashboardStats({
            totalAnalyses: userHistory.length,
            recentAnalyses: recentAnalyses.length,
            favoriteProducts: savedProductsData.length,
            savedRoutines: savedRoutinesData.length
          });
        })
        .catch(e => {
          console.error('Error loading stats:', e);
          setDashboardStats({
            totalAnalyses: 0,
            recentAnalyses: 0,
            favoriteProducts: savedProductsData.length,
            savedRoutines: savedRoutinesData.length
          });
        });
    } catch (e) {
      console.error('Error loading dashboard stats:', e);
    }
  };

  const loadRecommendations = (userData) => {
    try {
      if (userData.skinType && userData.skinConcerns) {
        const productRecs = getProductRecommendations(userData.skinType, userData.skinConcerns, null, 3);
        const ingredientRecs = getIngredientRecommendations(userData.skinType, userData.skinConcerns, 3);
        setRecommendations({ products: productRecs, ingredients: ingredientRecs });
      }
    } catch (e) {
      console.error('Error loading recommendations:', e);
      setRecommendations({ products: [], ingredients: [] });
    }
  };

  const loadSavedProducts = () => {
    try {
      const rawData = localStorage.getItem('savedProducts');
      if (!rawData || rawData === 'null' || rawData === 'undefined') {
        setSavedProducts([]);
        return;
      }
      const savedProductsData = JSON.parse(rawData);
      setSavedProducts(Array.isArray(savedProductsData) ? savedProductsData.slice(0, 5) : []);
    } catch (e) {
      console.error('Error loading saved products:', e);
      localStorage.removeItem('savedProducts'); // Clear corrupted data
      setSavedProducts([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleConcernChange = (concern) => {
    if (formData.skinConcerns.includes(concern)) {
      setFormData({
        ...formData,
        skinConcerns: formData.skinConcerns.filter(item => item !== concern)
      });
    } else {
      setFormData({
        ...formData,
        skinConcerns: [...formData.skinConcerns, concern]
      });
    }
  };

  const handleSaveProfile = async () => {
    setSaveStatus('saving');

    try {
      const nameParts = formData.name.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');
      
      const updateData = {
        email: formData.email,
        firstName,
        lastName,
        skinType: formData.skinType,
        skinConcerns: formData.skinConcerns,
        ageRange: formData.ageRange,
        skincareExperience: formData.skincareExperience,
        budget: formData.budget,
        lifestyle: formData.lifestyle,
        goals: formData.goals,
        allergies: formData.allergies,
        currentRoutine: formData.currentRoutine
      };
      
      const response = await fetch('/api/user/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update profile');
      }
      
      const updatedUser = await response.json();
      
      setUser(updatedUser);
      setIsEditing(false);
      setSaveStatus('success');
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.setItem('userEmail', updatedUser.email);
      
      // Reload recommendations with updated profile
      loadRecommendations(updatedUser);
      
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setSaveStatus('error');
      
      setError(error.message || 'Failed to update profile');
      
      setTimeout(() => {
        setSaveStatus(null);
        setError(null);
      }, 3000);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const getRoutineName = (routineId) => {
    return routineId
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const renderSkinConcerns = () => {
    if (!user.skinConcerns || !Array.isArray(user.skinConcerns) || user.skinConcerns.length === 0) {
      return (
        <p className="text-gray-600 dark:text-gray-400">
          {t('noneSpecified')}
        </p>
      );
    }

    return (
      <div className="flex flex-wrap gap-2">
        {user.skinConcerns.map((concern, index) => (
          <span 
            key={index} 
            className="text-xs bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 px-2 py-1 rounded-full"
          >
            {concern}
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center pt-16">
              <div className="w-12 h-12 rounded-full border-4 border-t-teal-500 border-gray-200 dark:border-gray-700 animate-spin"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('notLoggedIn')}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{t('pleaseSignIn')}</p>
            <Link href="/signin">
              <button className="px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-medium rounded-md hover:from-teal-600 hover:to-blue-600 transition-all duration-300">
                {t('login')}
              </button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Message */}
        {showWelcome && (
          <div className="mb-8 bg-gradient-to-r from-teal-500 to-blue-500 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user?.firstName || 'User'}! 🎉
              </h1>
              <p className="text-teal-100 mb-4">
                Your personalized skincare dashboard is ready. Track your progress and discover new recommendations.
              </p>
              <button
                onClick={() => setShowWelcome(false)}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg transition-all duration-200"
              >
                Got it!
              </button>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
          </div>
        )}

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-teal-100 dark:bg-teal-900/30 rounded-full">
                <svg className="h-6 w-6 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Analyses</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardStats.totalAnalyses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Saved Products</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardStats.favoriteProducts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 002 2h10a2 2 002-2V7a2 2 002-2h-2M9 5a2 2 002 2h2a2 2 002-2M9 5a2 2 0 012-2h2a2 2 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Saved Routines</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardStats.savedRoutines}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">This Week</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardStats.recentAnalyses}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: '📊' },
              { id: 'profile', name: 'Profile', icon: '👤' },
              { id: 'recommendations', name: 'Recommendations', icon: '💡' },
              { id: 'history', name: 'History', icon: '📈' },
              { id: 'saved', name: 'Saved Items', icon: '❤️' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Overview */}
            <div className="lg:col-span-2 space-y-8">
              {/* Skin Profile Summary */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Your Skin Profile
                </h2>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-xl">
                    <h3 className="font-semibold text-teal-800 dark:text-teal-200 mb-1">
                      Skin Type
                    </h3>
                    <p className="text-teal-700 dark:text-teal-300 capitalize">
                      {user?.skinType || 'Not specified'}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">
                      Main Concerns
                    </h3>
                    <p className="text-blue-700 dark:text-blue-300 text-sm">
                      {user?.skinConcerns && user.skinConcerns.length > 0 
                        ? user.skinConcerns.slice(0, 2).join(', ') + (user.skinConcerns.length > 2 ? '...' : '')
                        : 'None specified'}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                    <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-1">
                      Experience
                    </h3>
                    <p className="text-purple-700 dark:text-purple-300 capitalize">
                      {user?.skincareExperience || 'Not specified'}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors duration-200"
                  >
                    Edit Profile
                  </button>
                  <Link 
                    href="/onboarding"
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200"
                  >
                    Retake Quiz
                  </Link>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Quick Actions
                </h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <Link 
                    href="/skin-analysis"
                    className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-teal-500 dark:hover:border-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all duration-200 group"
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">📸</div>
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400">
                        Analyze Your Skin
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Upload a photo for AI analysis
                      </p>
                    </div>
                  </Link>
                  
                  <Link 
                    href="/products"
                    className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 group"
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">🧴</div>
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        Browse Products
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Find products for your skin
                      </p>
                    </div>
                  </Link>
                  
                  <Link 
                    href="/ingredients"
                    className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-purple-500 dark:hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200 group"
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">🧪</div>
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">
                        Learn Ingredients
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Understand what's in your products
                      </p>
                    </div>
                  </Link>
                  
                  <Link 
                    href="/routines"
                    className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-green-500 dark:hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 group"
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">📋</div>
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400">
                        Create Routine
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Build your skincare routine
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Today's Tip */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  💡 Today's Tip
                </h3>
                <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl">
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Always apply sunscreen as your last step in the morning routine, even on cloudy days!
                  </p>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Recent Activity
                </h3>
                <div className="space-y-3 text-sm">
                  {analysisHistory.length > 0 ? (
                    analysisHistory.slice(0, 3).map((analysis, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                        <span className="text-gray-600 dark:text-gray-400">
                          Skin analysis completed
                        </span>
                        <span className="text-xs text-gray-500 ml-auto">
                          {new Date(analysis.date).toLocaleDateString()}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-600 dark:text-gray-400">
                        Joined Dermify
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Help */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Need Help?
                </h3>
                <div className="space-y-3">
                  <Link 
                    href="/contact"
                    className="block p-3 bg-gray-50 dark:bg-gray-700 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-lg transition-colors duration-200"
                  >
                    <div className="font-medium text-gray-900 dark:text-white">Contact Support</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Get help with your skincare</div>
                  </Link>
                  <Link 
                    href="/about"
                    className="block p-3 bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
                  >
                    <div className="font-medium text-gray-900 dark:text-white">Learn More</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">About Dermify platform</div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {isEditing ? 'Edit Profile' : 'Profile Information'}
              </h2>
              <div className="flex space-x-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={saveStatus === 'saving'}
                      className={`px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors flex items-center space-x-1 disabled:opacity-70`}
                    >
                      {saveStatus === 'saving' && (
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                      <span>{saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            {/* Save Status Message */}
            {saveStatus === 'success' && (
              <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-md">
                <span className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Profile Updated Successfully!
                </span>
              </div>
            )}

            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor="skinType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Skin Type
                  </label>
                  <select
                    id="skinType"
                    name="skinType"
                    value={formData.skinType || 'Normal'}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                  >
                    {skinTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="ageRange" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Age Range
                  </label>
                  <select
                    id="ageRange"
                    name="ageRange"
                    value={formData.ageRange || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select Age Range</option>
                    <option value="Under 18">Under 18</option>
                    <option value="18-24">18-24</option>
                    <option value="25-34">25-34</option>
                    <option value="35-44">35-44</option>
                    <option value="45-54">45-54</option>
                    <option value="55+">55+</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Skin Concerns (Select all that apply)
                  </span>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {skinConcernOptions.map(concern => (
                      <label key={concern} className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.skinConcerns?.includes(concern) || false}
                          onChange={() => handleConcernChange(concern)}
                          className="h-4 w-4 text-teal-500 focus:ring-teal-500 border-gray-300 dark:border-gray-600 rounded"
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">{concern}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="skincareExperience" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Skincare Experience
                  </label>
                  <select
                    id="skincareExperience"
                    name="skincareExperience"
                    value={formData.skincareExperience || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select Experience Level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Budget Range
                  </label>
                  <select
                    id="budget"
                    name="budget"
                    value={formData.budget || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select Budget Range</option>
                    <option value="budget">Budget-Friendly (Under $50/month)</option>
                    <option value="moderate">Moderate ($50-150/month)</option>
                    <option value="premium">Premium ($150-300/month)</option>
                    <option value="luxury">Luxury ($300+/month)</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</h3>
                  <p className="mt-1 text-gray-900 dark:text-gray-100">{user?.name || 'Not specified'}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</h3>
                  <p className="mt-1 text-gray-900 dark:text-gray-100">{user?.email || 'Not specified'}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Skin Type</h3>
                  <p className="mt-1 text-gray-900 dark:text-gray-100">{user?.skinType || 'Not specified'}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Skin Concerns</h3>
                  <div className="mt-1">
                    {user?.skinConcerns && user.skinConcerns.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {user.skinConcerns.map((concern, index) => (
                          <span 
                            key={index} 
                            className="text-xs bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 px-2 py-1 rounded-full"
                          >
                            {concern}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600 dark:text-gray-400">None specified</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Age Range</h3>
                  <p className="mt-1 text-gray-900 dark:text-gray-100">{user?.ageRange || 'Not specified'}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Experience Level</h3>
                  <p className="mt-1 text-gray-900 dark:text-gray-100 capitalize">{user?.skincareExperience || 'Not specified'}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && (
          <div className="space-y-8">
            {/* Personalized Product Recommendations */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Recommended Products
              </h2>
              
              {recommendations.products.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.products.map((product, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-shadow">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {product.brand} {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {product.description?.substring(0, 100)}...
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-teal-600 dark:text-teal-400">
                          ${product.price}
                        </span>
                        <Link 
                          href={`/products/${product.category}/${product.id}`}
                          className="px-3 py-1 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors text-sm"
                        >
                          View Product
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🧴</div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Complete your skin profile to get personalized product recommendations
                  </p>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
                  >
                    Complete Profile
                  </button>
                </div>
              )}
            </div>

            {/* Ingredient Recommendations */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Recommended Ingredients
              </h2>
              
              {recommendations.ingredients.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.ingredients.map((ingredient, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-shadow">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {ingredient.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {ingredient.description?.substring(0, 100)}...
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-teal-600 dark:text-teal-400">
                          Safety: {ingredient.safetyRating}/5
                        </span>
                        <Link 
                          href={`/ingredients?search=${ingredient.name}`}
                          className="px-3 py-1 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors text-sm"
                        >
                          Learn More
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🧪</div>
                  <p className="text-gray-600 dark:text-gray-400">
                    No ingredient recommendations available yet
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Analysis History
            </h2>
            
            {analysisHistory.length > 0 ? (
              <div className="space-y-4">
                {analysisHistory.map((analysis, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          Skin Analysis #{analysis.id?.substring(0, 8) || index + 1}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Skin Type: {analysis.skinType}
                        </p>
                        {analysis.skinConditions && analysis.skinConditions.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Detected Conditions:</p>
                            <div className="flex flex-wrap gap-1">
                              {analysis.skinConditions.map((condition, idx) => (
                                <span key={idx} className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full">
                                  {condition}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(analysis.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
                
                <div className="text-center pt-4">
                  <Link 
                    href="/skin-analysis"
                    className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
                  >
                    New Analysis
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No Analysis History
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Start your skincare journey by analyzing your skin
                </p>
                <Link 
                  href="/skin-analysis"
                  className="px-6 py-3 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
                >
                  Analyze Your Skin
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Saved Items Tab */}
        {activeTab === 'saved' && (
          <div className="space-y-8">
            {/* Saved Routines */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Saved Routines
              </h2>
              
              {savedRoutines.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {savedRoutines.map(routineId => (
                    <Link
                      href={`/routines/${routineId}`}
                      key={routineId}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all p-4 flex items-center"
                    >
                      <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-md mr-4 flex items-center justify-center">
                        <svg className="h-6 w-6 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 002 2h10a2 2 002-2V7a2 2 002-2h-2M9 5a2 2 002 2h2a2 2 002-2M9 5a2 2 0 012-2h2a2 2 012 2" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white capitalize">
                          {getRoutineName(routineId)}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          View Routine →
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">📋</div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">No saved routines yet</p>
                  <Link href="/routines" className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors">
                    Browse Routines
                  </Link>
                </div>
              )}
            </div>

            {/* Saved Products */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Saved Products
              </h2>
              
              {savedProducts.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {savedProducts.map((product, index) => (
                    <Link
                      key={index}
                      href={`/products/${product.category}/${product.id}`}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all p-4"
                    >
                      <div className="flex items-center">
                        <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-md mr-4 flex-shrink-0">
                          {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover rounded-md" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {product.brand} {product.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                            {product.category}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">❤️</div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">No saved products yet</p>
                  <Link href="/products" className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors">
                    Browse Products
                  </Link>
                </div>
              )}
            </div>

            {/* Recently Viewed */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Recently Viewed
              </h2>
              
              {recentlyViewed.length > 0 ? (
                <div className="space-y-4">
                  {recentlyViewed.map((item, index) => (
                    <Link
                      key={index}
                      href={`/${item.type}s/${item.id}`}
                      className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="h-10 w-10 bg-gray-200 dark:bg-gray-600 rounded-md mr-3 flex-shrink-0"></div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                          {item.type}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">👁️</div>
                  <p className="text-gray-600 dark:text-gray-400">No recently viewed items</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfilePageContent />
    </Suspense>
  );
}
