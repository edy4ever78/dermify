'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';

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

export default function ProfilePage() {
  const router = useRouter();
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
      const savedRoutinesData = JSON.parse(localStorage.getItem('savedRoutines') || '[]');
      setSavedRoutines(savedRoutinesData);
    } catch (e) {
      console.error('Error loading saved routines:', e);
      setSavedRoutines([]);
    }
  };
  
  const loadRecentlyViewed = () => {
    try {
      const recentlyViewedData = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      setRecentlyViewed(recentlyViewedData.slice(0, 5));
    } catch (e) {
      console.error('Error loading recently viewed products:', e);
      setRecentlyViewed([]);
    }
  };

  const loadAnalysisHistory = async () => {
    try {
      const response = await fetch('/api/analysis/history');
      if (response.ok) {
        const historyData = await response.json();
        const userEmail = localStorage.getItem('userEmail');
        const userHistory = historyData.filter(item => item.userId === userEmail);
        setAnalysisHistory(userHistory.slice(0, 5));
      }
    } catch (e) {
      console.error('Error loading analysis history:', e);
      setAnalysisHistory([]);
    }
  };

  const loadDashboardStats = () => {
    try {
      const userEmail = localStorage.getItem('userEmail');
      const recentlyViewedData = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      const savedRoutinesData = JSON.parse(localStorage.getItem('savedRoutines') || '[]');
      
      // Load analysis history for stats
      fetch('/api/analysis/history')
        .then(response => response.json())
        .then(historyData => {
          const userHistory = historyData.filter(item => item.userId === userEmail);
          const recentAnalyses = userHistory.filter(item => {
            const analysisDate = new Date(item.date);
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            return analysisDate >= oneWeekAgo;
          });

          setDashboardStats({
            totalAnalyses: userHistory.length,
            recentAnalyses: recentAnalyses.length,
            favoriteProducts: recentlyViewedData.length,
            savedRoutines: savedRoutinesData.length
          });
        })
        .catch(e => console.error('Error loading stats:', e));
    } catch (e) {
      console.error('Error loading dashboard stats:', e);
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

  const getSkincareRecommendations = () => {
    if (!user.skinConcerns || !Array.isArray(user.skinConcerns)) return [];
    
    const recommendations = [];
    
    // Basic recommendations based on skin type and concerns
    if (user.skinConcerns.includes('Acne')) {
      recommendations.push({
        title: 'Try Salicylic Acid',
        description: 'Great for unclogging pores and reducing acne',
        action: 'Explore Products',
        link: '/products?ingredient=salicylic-acid',
        icon: '🧴'
      });
    }
    
    if (user.skinConcerns.includes('Aging')) {
      recommendations.push({
        title: 'Consider Retinol',
        description: 'Proven anti-aging ingredient for fine lines',
        action: 'Learn More',
        link: '/ingredients?search=retinol',
        icon: '✨'
      });
    }
    
    if (user.skinConcerns.includes('Hyperpigmentation')) {
      recommendations.push({
        title: 'Vitamin C Serum',
        description: 'Brightens skin and fades dark spots',
        action: 'View Products',
        link: '/products?ingredient=vitamin-c',
        icon: '🍊'
      });
    }

    if (user.skinConcerns.includes('Dryness')) {
      recommendations.push({
        title: 'Hyaluronic Acid',
        description: 'Deeply hydrates and plumps skin',
        action: 'Shop Now',
        link: '/products?ingredient=hyaluronic-acid',
        icon: '💧'
      });
    }

    if (user.skinConcerns.includes('Sensitivity')) {
      recommendations.push({
        title: 'Gentle Formulas',
        description: 'Fragrance-free and hypoallergenic products',
        action: 'Browse',
        link: '/products?filter=sensitive-skin',
        icon: '🌿'
      });
    }
    
    return recommendations.slice(0, 3); // Limit to 3 recommendations
  };

  const formatAnalysisDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
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
    <>
      <Header />

      <main className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced Profile Header */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8">
            {/* Profile Header */}
            <div className="relative h-48 bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute -bottom-16 left-8">
                <div className="h-32 w-32 rounded-full bg-white dark:bg-gray-700 border-4 border-white dark:border-gray-700 flex items-center justify-center overflow-hidden shadow-xl">
                  {user.avatarUrl ? (
                    <img 
                      src={user.avatarUrl} 
                      alt={user.name} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="bg-teal-100 dark:bg-teal-900/30 h-full w-full flex items-center justify-center">
                      <span className="text-3xl font-bold text-teal-500">
                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {/* Stats in header */}
              <div className="absolute top-6 right-6 flex space-x-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-white">{dashboardStats.totalAnalyses}</div>
                  <div className="text-sm text-white/80">Analyses</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-white">{dashboardStats.savedRoutines}</div>
                  <div className="text-sm text-white/80">Routines</div>
                </div>
              </div>
            </div>

            {/* Profile Actions */}
            <div className="pt-20 pb-6 px-8 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{user.name}</h1>
                <p className="text-gray-500 dark:text-gray-400 mb-2">
                  {t('Member Since')} {formatDate(user.dateJoined)}
                </p>
                <div className="flex items-center space-x-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-200">
                    {user.skinType} Skin
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                    {user.skincareExperience || 'Beginner'} Level
                  </span>
                </div>
              </div>

              <div className="flex space-x-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium"
                    >
                      {t('Cancel')}
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={saveStatus === 'saving'}
                      className={`px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-lg hover:from-teal-600 hover:to-blue-600 transition-all duration-200 flex items-center space-x-2 font-medium disabled:opacity-70 shadow-lg`}
                    >
                      {saveStatus === 'saving' && (
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                      <span>{saveStatus === 'saving' ? t('saving') : t('saveChanges')}</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium"
                    >
                      {t('Edit Profile')}
                    </button>
                    <Link
                      href="/dashboard"
                      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 font-medium shadow-lg"
                    >
                      View Dashboard
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Save Status Message */}
            {saveStatus === 'success' && (
              <div className="mx-8 mt-4 p-4 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg">
                <span className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t('Profile Updated')}
                </span>
              </div>
            )}
          </div>

          {/* Dashboard Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📸</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Analyses</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardStats.totalAnalyses}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📋</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Saved Routines</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardStats.savedRoutines}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">👁️</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Recently Viewed</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardStats.favoriteProducts}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">⚡</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">This Week</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardStats.recentAnalyses}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - Profile & Recommendations */}
            <div className="lg:col-span-2 space-y-8">
              {/* Profile Information */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  {isEditing ? t('Edit Profile') : t('Profile Information')}
                </h2>

                {isEditing ? (
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          {t('Full Name')}
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          {t('Email Address')}
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      <div>
                        <label htmlFor="skinType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          {t('Skin Type')}
                        </label>
                        <select
                          id="skinType"
                          name="skinType"
                          value={formData.skinType}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                        >
                          {skinTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('Skin Concerns Profile')} (Select all that apply)
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          {skinConcernOptions.map(concern => (
                            <label key={concern} className="inline-flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.skinConcerns.includes(concern)}
                                onChange={() => handleConcernChange(concern)}
                                className="h-4 w-4 text-teal-500 focus:ring-teal-500 border-gray-300 dark:border-gray-600 rounded"
                              />
                              <span className="ml-2 text-gray-700 dark:text-gray-300">{concern}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="ageRange" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Age Range
                        </label>
                        <select
                          id="ageRange"
                          name="ageRange"
                          value={formData.ageRange}
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

                      <div>
                        <label htmlFor="skincareExperience" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Skincare Experience
                        </label>
                        <select
                          id="skincareExperience"
                          name="skincareExperience"
                          value={formData.skincareExperience}
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
                          value={formData.budget}
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

                      <div>
                        <label htmlFor="lifestyle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Lifestyle
                        </label>
                        <select
                          id="lifestyle"
                          name="lifestyle"
                          value={formData.lifestyle}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="">Select Lifestyle</option>
                          <option value="minimal">Minimal Routine (5 minutes or less)</option>
                          <option value="normal">Standard Routine (10-15 minutes)</option>
                          <option value="extensive">Extensive Routine (20+ minutes)</option>
                          <option value="travel">Always Traveling (Need portable solutions)</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="goals" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Skincare Goals
                        </label>
                        <textarea
                          id="goals"
                          name="goals"
                          value={formData.goals}
                          onChange={handleInputChange}
                          rows="3"
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                          placeholder="What do you hope to achieve with your skincare routine?"
                        />
                      </div>

                      <div>
                        <label htmlFor="allergies" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Allergies & Sensitivities
                        </label>
                        <textarea
                          id="allergies"
                          name="allergies"
                          value={formData.allergies}
                          onChange={handleInputChange}
                          rows="2"
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                          placeholder="e.g., fragrance, retinol, sulfates..."
                        />
                      </div>

                      <div>
                        <label htmlFor="currentRoutine" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Current Skincare Routine
                        </label>
                        <textarea
                          id="currentRoutine"
                          name="currentRoutine"
                          value={formData.currentRoutine}
                          onChange={handleInputChange}
                          rows="3"
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                          placeholder="Describe your current products and routine..."
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('Full Name')}</h3>
                          <p className="mt-1 text-gray-900 dark:text-gray-100">{user.name}</p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('Email Address')}</h3>
                          <p className="mt-1 text-gray-900 dark:text-gray-100">{user.email}</p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('Skin Type')}</h3>
                          <p className="mt-1 text-gray-900 dark:text-gray-100">{user.skinType}</p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('Skin Concerns Profile')}</h3>
                          <div className="mt-1">
                            {renderSkinConcerns()}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Age Range</h3>
                          <p className="mt-1 text-gray-900 dark:text-gray-100">{user.ageRange || 'Not specified'}</p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Experience Level</h3>
                          <p className="mt-1 text-gray-900 dark:text-gray-100 capitalize">{user.skincareExperience || 'Not specified'}</p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Budget Range</h3>
                          <p className="mt-1 text-gray-900 dark:text-gray-100 capitalize">{user.budget || 'Not specified'}</p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Lifestyle</h3>
                          <p className="mt-1 text-gray-900 dark:text-gray-100 capitalize">{user.lifestyle || 'Not specified'}</p>
                        </div>

                        {user.goals && (
                          <div className="col-span-2">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Skincare Goals</h3>
                            <p className="mt-1 text-gray-900 dark:text-gray-100">{user.goals}</p>
                          </div>
                        )}

                        {user.allergies && (
                          <div className="col-span-2">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Allergies & Sensitivities</h3>
                            <p className="mt-1 text-gray-900 dark:text-gray-100">{user.allergies}</p>
                          </div>
                        )}

                        {user.currentRoutine && (
                          <div className="col-span-2">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Routine</h3>
                            <p className="mt-1 text-gray-900 dark:text-gray-100">{user.currentRoutine}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Saved Routines */}
                  <div className="mt-8">
                    <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
                      {t('Saved Routines')}
                    </h2>
                    
                    {savedRoutines.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {savedRoutines.map(routineId => (
                          <Link
                            href={`/routines/${routineId}`}
                            key={routineId}
                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all p-4 flex items-center"
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
                                {t('View Routine')} &rarr;
                              </p>
                            </div>
                          </Link>
                        ))}

                        <Link
                          href="/routines"
                          className="bg-gray-50 dark:bg-gray-700 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all p-4 flex items-center justify-center text-center"
                        >
                          <div>
                            <div className="mx-auto h-12 w-12 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center mb-2">
                              <svg className="h-6 w-6 text-gray-400 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </div>
                            <h3 className="font-medium text-gray-700 dark:text-gray-300">
                              {t('Browse More Routines')}
                            </h3>
                          </div>
                        </Link>
                      </div>
                    ) : (
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-center">
                        <div className="mb-4">
                          <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 012 2v6a2 2 01-2 2H5a2 2 01-2-2v-6a2 2 012-2m14 0V9a2 2 00-2-2M5 11V9a2 2 012-2m0 0V5a2 2 012-2h6a2 2 012 2v2M7 7h10" />
                          </svg>
                        </div>
                        <p className="mb-4 text-gray-600 dark:text-gray-400">{t('noSavedRoutines')}</p>
                        <Link href="/routines" className="inline-block px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors">
                          {t('Browse Routines')}
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Personalized Recommendations */}
                  <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                      Personalized for You ✨
                    </h2>
                    
                    {(() => {
                      const recommendations = getSkincareRecommendations();
                      return recommendations.length > 0 ? (
                        <div className="grid gap-4">
                          {recommendations.map((rec, index) => (
                            <div 
                              key={index}
                              className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-teal-300 dark:hover:border-teal-500 transition-all duration-200 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 hover:shadow-lg"
                            >
                              <div className="flex items-start space-x-4">
                                <div className="text-3xl">{rec.icon}</div>
                                <div className="flex-1">
                                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">
                                    {rec.title}
                                  </h3>
                                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    {rec.description}
                                  </p>
                                  <Link 
                                    href={rec.link}
                                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                                  >
                                    {rec.action} →
                                  </Link>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <div className="text-4xl mb-4">🎯</div>
                          <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Complete your profile to get personalized recommendations!
                          </p>
                          <button
                            onClick={() => setIsEditing(true)}
                            className="px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-lg hover:from-teal-600 hover:to-blue-600 transition-all duration-200 font-medium"
                          >
                            Update Profile
                          </button>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Quick Actions */}
                  <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                      Quick Actions
                    </h2>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <Link 
                        href="/skin-analysis"
                        className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-teal-500 dark:hover:border-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all duration-200 group"
                      >
                        <div className="text-center">
                          <div className="text-3xl mb-3">📸</div>
                          <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 mb-2">
                            Analyze Your Skin
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Upload a photo for AI analysis
                          </p>
                        </div>
                      </Link>
                      
                      <Link 
                        href="/products"
                        className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 group"
                      >
                        <div className="text-center">
                          <div className="text-3xl mb-3">🧴</div>
                          <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-2">
                            Browse Products
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Find products for your skin
                          </p>
                        </div>
                      </Link>
                      
                      <Link 
                        href="/ingredients"
                        className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-purple-500 dark:hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200 group"
                      >
                        <div className="text-center">
                          <div className="text-3xl mb-3">🧪</div>
                          <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 mb-2">
                            Learn Ingredients
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Understand what's in your products
                          </p>
                        </div>
                      </Link>
                      
                      <Link 
                        href="/routines"
                        className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-green-500 dark:hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 group"
                      >
                        <div className="text-center">
                          <div className="text-3xl mb-3">📋</div>
                          <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 mb-2">
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

                {/* Enhanced Sidebar */}
                <div className="space-y-6">
                  {/* Recently Viewed */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                      <span className="text-2xl mr-2">👁️</span>
                      {t('Recently Viewed')}
                    </h3>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                      <span className="text-2xl mr-2">👁️</span>
                      {t('Recently Viewed')}
                    </h3>
                    
                    {recentlyViewed.length > 0 ? (
                      <div className="space-y-3">
                        {recentlyViewed.map((item, index) => (
                          <Link
                            key={index}
                            href={`/${item.type}s/${item.id}`}
                            className="block group"
                          >
                            <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all duration-200">
                              <div className="h-12 w-12 bg-gradient-to-br from-teal-400 to-blue-500 rounded-lg flex-shrink-0 flex items-center justify-center text-white font-bold">
                                {item.name.charAt(0)}
                              </div>
                              <div className="ml-3 flex-1">
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                                  {item.name}
                                </h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                  {item.type}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <div className="text-3xl mb-3">🔍</div>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">{t('noRecentlyViewed')}</p>
                        <Link href="/products" className="inline-block px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium">
                          {t('Browse Products')}
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Analysis History */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                      <span className="text-2xl mr-2">📊</span>
                      Analysis History
                    </h3>
                    
                    {analysisHistory.length > 0 ? (
                      <div className="space-y-3">
                        {analysisHistory.map((analysis, index) => (
                          <div
                            key={index}
                            className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {analysis.skinType} Skin
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatAnalysisDate(analysis.date)}
                              </span>
                            </div>
                            {analysis.skinConditions && analysis.skinConditions.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {analysis.skinConditions.slice(0, 2).map((condition, idx) => (
                                  <span 
                                    key={idx}
                                    className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full"
                                  >
                                    {condition}
                                  </span>
                                ))}
                                {analysis.skinConditions.length > 2 && (
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    +{analysis.skinConditions.length - 2} more
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                        <Link
                          href="/skin-analysis"
                          className="block text-center p-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-lg hover:from-teal-600 hover:to-blue-600 transition-all duration-200 font-medium"
                        >
                          New Analysis
                        </Link>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <div className="text-3xl mb-3">📸</div>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">No skin analyses yet</p>
                        <Link
                          href="/skin-analysis"
                          className="inline-block px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-lg hover:from-teal-600 hover:to-blue-600 transition-all duration-200 font-medium"
                        >
                          Start Analysis
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Today's Tip */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                      <span className="text-2xl mr-2">💡</span>
                      Today's Tip
                    </h3>
                    <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border-l-4 border-yellow-400">
                      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                        {user.skinType === 'Oily' 
                          ? "Don't over-cleanse oily skin! Use a gentle cleanser twice daily to avoid stripping natural oils, which can trigger more oil production."
                          : user.skinType === 'Dry'
                          ? "Apply moisturizer to slightly damp skin to lock in hydration. Look for ingredients like hyaluronic acid and ceramides."
                          : user.skinType === 'Sensitive'
                          ? "Always patch test new products on a small area before full application. Introduce new products one at a time."
                          : "Always apply sunscreen as your last step in the morning routine, even on cloudy days! UV protection is the best anti-aging strategy."
                        }
                      </p>
                    </div>
                  </div>

                  {/* Help & Support */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                      <span className="text-2xl mr-2">🆘</span>
                      Need Help?
                    </h3>
                    <div className="space-y-3">
                      <Link 
                        href="/contact"
                        className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-lg transition-all duration-200 group"
                      >
                        <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-lg">💬</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400">Contact Support</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Get help with your skincare</div>
                        </div>
                      </Link>
                      <Link 
                        href="/about"
                        className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 group"
                      >
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-lg">📚</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">Learn More</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">About Dermify platform</div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
