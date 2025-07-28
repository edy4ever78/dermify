'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import Header from '@/components/Header';

export default function OnboardingPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [countdown, setCountdown] = useState(3);

  // Auto-redirect after completion - disabled to use setTimeout instead
  // useEffect(() => {
  //   if (isCompleted) {
  //     let timeLeft = 3;
  //     setCountdown(timeLeft);
      
  //     const timer = setInterval(() => {
  //       timeLeft -= 1;
        
  //       if (timeLeft <= 0) {
  //         clearInterval(timer);
  //         router.push('/dashboard');
  //       } else {
  //         setCountdown(timeLeft);
  //       }
  //     }, 1000);

  //     return () => clearInterval(timer);
  //   }
  // }, [isCompleted, router]);

  // Form data state
  const [formData, setFormData] = useState({
    skinType: '',
    skinConcerns: [],
    ageRange: '',
    skincareExperience: '',
    allergies: '',
    currentRoutine: '',
    goals: '',
    budget: '',
    lifestyle: ''
  });

  const totalSteps = 6;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConcernToggle = (concern) => {
    setFormData(prev => ({
      ...prev,
      skinConcerns: prev.skinConcerns.includes(concern)
        ? prev.skinConcerns.filter(c => c !== concern)
        : [...prev.skinConcerns, concern]
    }));
  };

  const validateCurrentStep = () => {
    setError(''); // Clear previous errors
    
    switch (currentStep) {
      case 1:
        if (!formData.skinType) {
          setError(t('errors.selectSkinType'));
          return false;
        }
        break;
      case 2:
        if (formData.skinConcerns.length === 0) {
          setError(t('errors.selectConcerns'));
          return false;
        }
        break;
      case 3:
        if (!formData.ageRange || !formData.skincareExperience) {
          setError(t('errors.completeFields'));
          return false;
        }
        break;
      case 4:
        if (!formData.budget || !formData.lifestyle) {
          setError(t('errors.selectBudgetLifestyle'));
          return false;
        }
        break;
      // Steps 5 and 6 are optional, so no validation needed
    }
    return true;
  };

  const nextStep = () => {
    const isValid = validateCurrentStep();
    if (isValid && currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    // Validate all required fields before submission
    if (!formData.skinType) {
      setError(t('errors.selectSkinTypeLong'));
      setCurrentStep(1);
      return;
    }
    
    if (formData.skinConcerns.length === 0) {
      setError(t('errors.selectConcernsLong'));
      setCurrentStep(2);
      return;
    }
    
    if (!formData.ageRange || !formData.skincareExperience) {
      setError(t('errors.completePersonalInfo'));
      setCurrentStep(3);
      return;
    }
    
    if (!formData.budget || !formData.lifestyle) {
      setError(t('errors.selectBudgetLifestyleLong'));
      setCurrentStep(4);
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const authToken = localStorage.getItem('authToken');
      
      if (!authToken) {
        setError(t('errors.loginRequired'));
        setIsSubmitting(false);
        return;
      }

      // Ensure we have complete data with defaults for optional fields
      const completeFormData = {
        ...formData,
        allergies: formData.allergies || '',
        currentRoutine: formData.currentRoutine || '',
        goals: formData.goals || 'General skincare improvement'
      };

      console.log('Submitting onboarding data:', completeFormData);

      const response = await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authToken
        },
        body: JSON.stringify(completeFormData)
      });

      const data = await response.json();
      console.log('Onboarding response:', data);

      if (!response.ok) {
        throw new Error(data.message || `Error: ${response.status}`);
      }

      // Update user data in localStorage with complete server response
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        // Fallback: just update the onboarding status
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          user.onboardingCompleted = true;
          localStorage.setItem('user', JSON.stringify(user));
        }
      }

      // Force a page reload to ensure all components get the updated user data
      setSuccess('✅ Onboarding completed successfully!');
      setIsCompleted(true);
      
      // Give a brief moment for the success message to show, then redirect
      setTimeout(() => {
        window.location.href = '/dashboard?welcome=true';
      }, 2000);

    } catch (error) {
      console.error('Onboarding error:', error);
      setError(`❌ ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = async () => {
    const skipData = {
      skinType: 'normal',
      skinConcerns: ['general'],
      ageRange: '25-34',
      skincareExperience: 'intermediate',
      allergies: '',
      currentRoutine: '',
      goals: 'General skincare improvement',
      budget: 'moderate',
      lifestyle: 'normal'
    };

    setFormData(skipData);
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const authToken = localStorage.getItem('authToken');
      
      if (!authToken) {
        setError(t('errors.loginRequired'));
        setIsSubmitting(false);
        return;
      }

      console.log('Submitting skip data:', skipData);

      const response = await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authToken
        },
        body: JSON.stringify(skipData)
      });

      const data = await response.json();
      console.log('Skip onboarding response:', data);

      if (!response.ok) {
        throw new Error(data.message || `Error: ${response.status}`);
      }

      // Update user data in localStorage with complete server response
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        // Fallback: just update the onboarding status
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          user.onboardingCompleted = true;
          localStorage.setItem('user', JSON.stringify(user));
        }
      }

      // Force a page reload to ensure all components get the updated user data
      setSuccess('✅ Onboarding completed successfully!');
      setIsCompleted(true);
      
      // Give a brief moment for the success message to show, then redirect
      setTimeout(() => {
        window.location.href = '/dashboard?welcome=true';
      }, 2000);

    } catch (error) {
      console.error('Onboarding error:', error);
      setError(`❌ ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {t('whatIsYourSkinType')} <span className="text-red-500">*</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400">{t('thisHelpsUsRecommend')}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { value: 'oily', label: t('skinTypes.oily'), desc: t('skinTypeDescriptions.oily') },
                { value: 'dry', label: t('skinTypes.dry'), desc: t('skinTypeDescriptions.dry') },
                { value: 'combination', label: t('skinTypes.combination'), desc: t('skinTypeDescriptions.combination') },
                { value: 'normal', label: t('skinTypes.normal'), desc: t('skinTypeDescriptions.normal') },
                { value: 'sensitive', label: t('skinTypes.sensitive'), desc: t('skinTypeDescriptions.sensitive') },
                { value: 'mature', label: t('mature'), desc: t('skinTypeDescriptions.mature') }
              ].map((type) => (
                <button
                  key={type.value}
                  onClick={() => handleInputChange('skinType', type.value)}
                  className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                    formData.skinType === type.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 dark:border-blue-400'
                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-500/5'
                  }`}
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{type.label}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{type.desc}</p>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {t('whatAreYourMainConcerns')} <span className="text-red-500">*</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400">{t('selectAllThatApply')}</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { value: 'acne', label: '🔴 Acne & Breakouts' },
                { value: 'aging', label: '⏳ Fine Lines & Wrinkles' },
                { value: 'dark-spots', label: '🎭 Dark Spots' },
                { value: 'dryness', label: '🏜️ Dryness' },
                { value: 'oiliness', label: '💧 Excess Oil' },
                { value: 'redness', label: '🌹 Redness & Irritation' },
                { value: 'pores', label: '🔍 Large Pores' },
                { value: 'dullness', label: '🌫️ Dull Skin' },
                { value: 'sensitivity', label: '⚡ Sensitivity' },
                { value: 'uneven-tone', label: '🎨 Uneven Skin Tone' },
                { value: 'blackheads', label: '⚫ Blackheads' },
                { value: 'general', label: '✨ General Care' }
              ].map((concern) => (
                <button
                  key={concern.value}
                  onClick={() => handleConcernToggle(concern.value)}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${
                    formData.skinConcerns.includes(concern.value)
                      ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:border-blue-400 dark:text-blue-300'
                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-500/5'
                  }`}
                >
                  {concern.label}
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {t('tellUsAboutYourself')} <span className="text-red-500">*</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400">{t('thisHelpsPersonalize')}</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  {t('ageRange')} <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {(() => {
                    const ageRanges = t('ageRanges');
                    if (typeof ageRanges === 'object') {
                      return Object.entries(ageRanges).map(([key, label]) => (
                        <button
                          key={key}
                          onClick={() => handleInputChange('ageRange', key)}
                          className={`p-3 rounded-lg border-2 font-medium transition-all duration-200 ${
                            formData.ageRange === key
                              ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:border-blue-400 dark:text-blue-300'
                              : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-500/5'
                          }`}
                        >
                          {label}
                        </button>
                      ));
                    } else {
                      // Fallback to hardcoded age ranges if translation fails
                      return ['under18', '18-24', '25-34', '35-44', '45-54', '55+'].map((age) => (
                        <button
                          key={age}
                          onClick={() => handleInputChange('ageRange', age)}
                          className={`p-3 rounded-lg border-2 font-medium transition-all duration-200 ${
                            formData.ageRange === age
                              ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:border-blue-400 dark:text-blue-300'
                              : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-500/5'
                          }`}
                        >
                          {t(`ageRanges.${age}`) || age}
                        </button>
                      ));
                    }
                  })()}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  {t('skincareExperience')} <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {(() => {
                    const experienceLevels = t('experienceLevels');
                    if (typeof experienceLevels === 'object') {
                      return Object.entries(experienceLevels).map(([key, data]) => (
                        <button
                          key={key}
                          onClick={() => handleInputChange('skincareExperience', key)}
                          className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                            formData.skincareExperience === key
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 dark:border-blue-400'
                              : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-500/5'
                          }`}
                        >
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{data.label}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{data.desc}</p>
                        </button>
                      ));
                    } else {
                      // Fallback to hardcoded experience levels if translation fails
                      return [
                        { key: 'beginner', label: 'Beginner', desc: 'New to skincare' },
                        { key: 'intermediate', label: 'Intermediate', desc: 'Some experience' },
                        { key: 'advanced', label: 'Advanced', desc: 'Very knowledgeable' }
                      ].map((level) => (
                        <button
                          key={level.key}
                          onClick={() => handleInputChange('skincareExperience', level.key)}
                          className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                            formData.skincareExperience === level.key
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 dark:border-blue-400'
                              : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-500/5'
                          }`}
                        >
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{t(`experienceLevels.${level.key}.label`) || level.label}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{t(`experienceLevels.${level.key}.desc`) || level.desc}</p>
                        </button>
                      ));
                    }
                  })()}
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {t('budgetAndLifestyle')} <span className="text-red-500">*</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-300">{t('helpUsRecommendProducts')}</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  {t('monthlySkincarebudget')} <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(() => {
                    const budgetOptions = t('budgetOptions');
                    if (typeof budgetOptions === 'object') {
                      return Object.entries(budgetOptions).map(([key, data]) => (
                        <button
                          key={key}
                          onClick={() => handleInputChange('budget', key)}
                          className={`p-4 rounded-lg border-2 text-left transition-all ${
                            formData.budget === key
                              ? 'border-blue-500 bg-blue-50 text-blue-900 dark:bg-blue-900/20 dark:border-blue-400 dark:text-blue-300'
                              : 'border-gray-300 bg-white text-gray-900 hover:border-blue-300 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:border-blue-400 dark:hover:bg-gray-600'
                          }`}
                        >
                          <h3 className="font-semibold">{data.label}</h3>
                          <p className="text-sm opacity-75">{data.desc}</p>
                        </button>
                      ));
                    } else {
                      // Fallback to hardcoded budget options if translation fails
                      return [
                        { key: 'budget', label: 'Budget-Friendly', desc: 'Under $50/month' },
                        { key: 'moderate', label: 'Moderate', desc: '$50-150/month' },
                        { key: 'premium', label: 'Premium', desc: '$150-300/month' },
                        { key: 'luxury', label: 'Luxury', desc: '$300+/month' }
                      ].map((budget) => (
                        <button
                          key={budget.key}
                          onClick={() => handleInputChange('budget', budget.key)}
                          className={`p-4 rounded-lg border-2 text-left transition-all ${
                            formData.budget === budget.key
                              ? 'border-blue-500 bg-blue-50 text-blue-900 dark:bg-blue-900/20 dark:border-blue-400 dark:text-blue-300'
                              : 'border-gray-300 bg-white text-gray-900 hover:border-blue-300 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:border-blue-400 dark:hover:bg-gray-600'
                          }`}
                        >
                          <h3 className="font-semibold">{t(`budgetOptions.${budget.key}.label`) || budget.label}</h3>
                          <p className="text-sm opacity-75">{t(`budgetOptions.${budget.key}.desc`) || budget.desc}</p>
                        </button>
                      ));
                    }
                  })()}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  {t('lifestyle')} <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(() => {
                    const lifestyleOptions = t('lifestyleOptions');
                    if (typeof lifestyleOptions === 'object') {
                      return Object.entries(lifestyleOptions).map(([key, data]) => (
                        <button
                          key={key}
                          onClick={() => handleInputChange('lifestyle', key)}
                          className={`p-4 rounded-lg border-2 text-left transition-all ${
                            formData.lifestyle === key
                              ? 'border-blue-500 bg-blue-50 text-blue-900 dark:bg-blue-900/20 dark:border-blue-400 dark:text-blue-300'
                              : 'border-gray-300 bg-white text-gray-900 hover:border-blue-300 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:border-blue-400 dark:hover:bg-gray-600'
                          }`}
                        >
                          <h3 className="font-semibold">{data.label}</h3>
                          <p className="text-sm opacity-75">{data.desc}</p>
                        </button>
                      ));
                    } else {
                      // Fallback to hardcoded lifestyle options if translation fails
                      return [
                        { key: 'minimal', label: 'Minimal Routine', desc: '5 minutes or less' },
                        { key: 'normal', label: 'Standard Routine', desc: '10-15 minutes' },
                        { key: 'extensive', label: 'Extensive Routine', desc: '20+ minutes' },
                        { key: 'travel', label: 'Always Traveling', desc: 'Need portable solutions' }
                      ].map((lifestyle) => (
                        <button
                          key={lifestyle.key}
                          onClick={() => handleInputChange('lifestyle', lifestyle.key)}
                          className={`p-4 rounded-lg border-2 text-left transition-all ${
                            formData.lifestyle === lifestyle.key
                              ? 'border-blue-500 bg-blue-50 text-blue-900 dark:bg-blue-900/20 dark:border-blue-400 dark:text-blue-300'
                              : 'border-gray-300 bg-white text-gray-900 hover:border-blue-300 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:border-blue-400 dark:hover:bg-gray-600'
                          }`}
                        >
                          <h3 className="font-semibold">{t(`lifestyleOptions.${lifestyle.key}.label`) || lifestyle.label}</h3>
                          <p className="text-sm opacity-75">{t(`lifestyleOptions.${lifestyle.key}.desc`) || lifestyle.desc}</p>
                        </button>
                      ));
                    }
                  })()}
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Additional Information</h2>
              <p className="text-gray-600 dark:text-gray-300">Optional details to better personalize your experience</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Known Allergies or Sensitivities
                </label>
                <textarea
                  value={formData.allergies}
                  onChange={(e) => handleInputChange('allergies', e.target.value)}
                  placeholder={t('allergiesPlaceholder')}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Skincare Routine
                </label>
                <textarea
                  value={formData.currentRoutine}
                  onChange={(e) => handleInputChange('currentRoutine', e.target.value)}
                  placeholder={t('routinePlaceholder')}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  rows="4"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Skincare Goals
                </label>
                <textarea
                  value={formData.goals}
                  onChange={(e) => handleInputChange('goals', e.target.value)}
                  placeholder={t('goalsPlaceholder')}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  rows="3"
                />
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Review Your Profile</h2>
              <p className="text-gray-600 dark:text-gray-300">Make sure everything looks correct before submitting</p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">{t('skinType')}</h3>
                  <p className="text-gray-600 dark:text-gray-300 capitalize">{formData.skinType || t('notSelected')}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">{t('ageRange')}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{formData.ageRange ? t(`ageRanges.${formData.ageRange}`) : t('notSelected')}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">{t('experienceLevel')}</h3>
                  <p className="text-gray-600 dark:text-gray-300 capitalize">{formData.skincareExperience ? t(`experienceLevels.${formData.skincareExperience}.label`) : t('notSelected')}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">{t('budget')}</h3>
                  <p className="text-gray-600 dark:text-gray-300 capitalize">{formData.budget ? t(`budgetOptions.${formData.budget}.label`) : t('notSelected')}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">{t('skinConcernsLabel')}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {formData.skinConcerns.length > 0 
                    ? formData.skinConcerns.map(concern => {
                        const translation = t(`skinConcerns.${concern}`);
                        return typeof translation === 'string' ? translation : concern;
                      }).join(', ')
                    : t('noneSelected')
                  }
                </p>
              </div>
              
              {(formData.allergies || formData.goals) && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  {formData.allergies && (
                    <div className="mb-3">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">Allergies</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">{formData.allergies}</p>
                    </div>
                  )}
                  {formData.goals && (
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">Goals</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">{formData.goals}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Dermify!</h2>
            <p className="text-gray-600 mb-4">Your skincare profile has been created successfully.</p>
            <p className="text-sm text-gray-500">
              You'll be redirected to your dashboard shortly...
            </p>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Go to Dashboard Now
            </button>
            <button
              onClick={() => router.push('/products')}
              className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Browse Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('letsGetToKnowYourSkin')}</h1>
              <p className="text-gray-600 dark:text-gray-300">{t('answerQuestions')}</p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('stepOf').replace('{current}', currentStep).replace('{total}', totalSteps)}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{Math.round((currentStep / totalSteps) * 100)}% {t('complete')}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                ></div>
              </div>
            </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 rounded">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border-l-4 border-green-500 text-green-700 dark:text-green-300 rounded">
              {success}
            </div>
          )}

          {/* Main Content */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8 transition-colors">
            {renderStep()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              {currentStep > 1 && (
                <button
                  onClick={prevStep}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors font-medium"
                >
                  ← Previous
                </button>
              )}
              
              <button
                onClick={handleSkip}
                className="px-6 py-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors font-medium"
              >
                Skip for now
              </button>
            </div>

            <div className="flex space-x-4">
              {currentStep < totalSteps ? (
                <button
                  onClick={nextStep}
                  className="px-8 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium"
                >
                  Next →
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Saving...' : 'Complete Profile ✨'}
                </button>
              )}
            </div>
          </div>

          {/* Steps Indicator */}
          <div className="mt-8 flex justify-center">
            <div className="flex space-x-2">
              {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                <div
                  key={step}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    step <= currentStep ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
