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
        });

        loadSavedRoutines();
        loadRecentlyViewed();
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
        skinConcerns: formData.skinConcerns
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

      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            {/* Profile Header */}
            <div className="relative h-36 bg-gradient-to-r from-teal-500 to-blue-500">
              <div className="absolute -bottom-12 left-8">
                <div className="h-24 w-24 rounded-full bg-white dark:bg-gray-700 border-4 border-white dark:border-gray-700 flex items-center justify-center overflow-hidden">
                  {user.avatarUrl ? (
                    <img 
                      src={user.avatarUrl} 
                      alt={user.name} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="bg-teal-100 dark:bg-teal-900/30 h-full w-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-teal-500">
                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Actions */}
            <div className="pt-14 pb-4 px-8 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('Member Since')} {formatDate(user.dateJoined)}
                </p>
              </div>

              <div className="flex space-x-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      {t('Cancel')}
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
                      <span>{saveStatus === 'saving' ? t('saving') : t('saveChanges')}</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      {t('Edit Profile')}
                    </button>

                  </>
                )}
              </div>
            </div>

            {/* Save Status Message */}
            {saveStatus === 'success' && (
              <div className="m-4 p-3 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-md">
                <span className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t('Profile Updated')}
                </span>
              </div>
            )}

            {/* Profile Content */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column - Personal Info */}
                <div className="col-span-2">
                  <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
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
                    </div>
                  ) : (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                </div>

                {/* Right Column - Recently Viewed */}
                <div>
                  <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
                    {t('Recently Viewed')}
                  </h2>
                  
                  {recentlyViewed.length > 0 ? (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                      <div className="space-y-4">
                        {recentlyViewed.map((item, index) => (
                          <Link
                            key={index}
                            href={`/${item.type}s/${item.id}`}
                            className="block group"
                          >
                            <div className="flex items-center">
                              <div className="h-10 w-10 bg-gray-200 dark:bg-gray-600 rounded-md flex-shrink-0"></div>
                              <div className="ml-3 flex-1">
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-teal-500 transition-colors">
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
                    </div>
                  ) : (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-center">
                      <div className="mb-4">
                        <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                      <p className="mb-4 text-gray-600 dark:text-gray-400">{t('noRecentlyViewed')}</p>
                      <Link href="/products" className="inline-block px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors">
                        {t('Browse Products')}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
