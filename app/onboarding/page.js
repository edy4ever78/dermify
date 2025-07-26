'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [countdown, setCountdown] = useState(3);

  // Auto-redirect after completion
  useEffect(() => {
    if (isCompleted) {
      let timeLeft = 3;
      setCountdown(timeLeft);
      
      const timer = setInterval(() => {
        timeLeft -= 1;
        
        if (timeLeft <= 0) {
          clearInterval(timer);
          router.push('/dashboard');
        } else {
          setCountdown(timeLeft);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isCompleted, router]);

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
          setError('Please select your skin type to continue');
          return false;
        }
        break;
      case 2:
        if (formData.skinConcerns.length === 0) {
          setError('Please select at least one skin concern to continue');
          return false;
        }
        break;
      case 3:
        if (!formData.ageRange || !formData.skincareExperience) {
          setError('Please complete all fields in this step');
          return false;
        }
        break;
      case 4:
        if (!formData.budget || !formData.lifestyle) {
          setError('Please select your budget and lifestyle preferences');
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
      setError('❌ Please select your skin type');
      setCurrentStep(1);
      return;
    }
    
    if (formData.skinConcerns.length === 0) {
      setError('❌ Please select at least one skin concern');
      setCurrentStep(2);
      return;
    }
    
    if (!formData.ageRange || !formData.skincareExperience) {
      setError('❌ Please complete your personal information');
      setCurrentStep(3);
      return;
    }
    
    if (!formData.budget || !formData.lifestyle) {
      setError('❌ Please select your budget and lifestyle preferences');
      setCurrentStep(4);
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const authToken = localStorage.getItem('authToken');
      
      if (!authToken) {
        setError('Please login first to complete onboarding.');
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

      setSuccess('✅ Onboarding completed successfully!');
      setIsCompleted(true);

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
        setError('Please login first to complete onboarding.');
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

      setSuccess('✅ Onboarding completed successfully!');
      setIsCompleted(true);

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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                What's your skin type? <span className="text-red-500">*</span>
              </h2>
              <p className="text-gray-600">This helps us recommend the right products for you</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { value: 'oily', label: 'Oily', desc: 'Shiny, enlarged pores, prone to blackheads' },
                { value: 'dry', label: 'Dry', desc: 'Tight, flaky, rough texture' },
                { value: 'combination', label: 'Combination', desc: 'Oily T-zone, dry cheeks' },
                { value: 'normal', label: 'Normal', desc: 'Balanced, not too oily or dry' },
                { value: 'sensitive', label: 'Sensitive', desc: 'Easily irritated, reacts to products' },
                { value: 'mature', label: 'Mature', desc: 'Fine lines, loss of elasticity' }
              ].map((type) => (
                <button
                  key={type.value}
                  onClick={() => handleInputChange('skinType', type.value)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    formData.skinType === type.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <h3 className="font-semibold text-gray-900">{type.label}</h3>
                  <p className="text-sm text-gray-600">{type.desc}</p>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                What are your main skin concerns? <span className="text-red-500">*</span>
              </h2>
              <p className="text-gray-600">Select all that apply (you can choose multiple)</p>
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
                  className={`p-3 rounded-lg border-2 text-sm transition-all ${
                    formData.skinConcerns.includes(concern.value)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Tell us about yourself <span className="text-red-500">*</span>
              </h2>
              <p className="text-gray-600">This helps us personalize your recommendations</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Age Range <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['Under 18', '18-24', '25-34', '35-44', '45-54', '55+'].map((age) => (
                    <button
                      key={age}
                      onClick={() => handleInputChange('ageRange', age)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.ageRange === age
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      {age}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Skincare Experience <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { value: 'beginner', label: 'Beginner', desc: 'New to skincare' },
                    { value: 'intermediate', label: 'Intermediate', desc: 'Some experience' },
                    { value: 'advanced', label: 'Advanced', desc: 'Very knowledgeable' }
                  ].map((level) => (
                    <button
                      key={level.value}
                      onClick={() => handleInputChange('skincareExperience', level.value)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        formData.skincareExperience === level.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <h3 className="font-semibold">{level.label}</h3>
                      <p className="text-sm text-gray-600">{level.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Budget & Lifestyle <span className="text-red-500">*</span>
              </h2>
              <p className="text-gray-600">Help us recommend products within your preferences</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Monthly Skincare Budget <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { value: 'budget', label: 'Budget-Friendly', desc: 'Under $50/month' },
                    { value: 'moderate', label: 'Moderate', desc: '$50-150/month' },
                    { value: 'premium', label: 'Premium', desc: '$150-300/month' },
                    { value: 'luxury', label: 'Luxury', desc: '$300+/month' }
                  ].map((budget) => (
                    <button
                      key={budget.value}
                      onClick={() => handleInputChange('budget', budget.value)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        formData.budget === budget.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <h3 className="font-semibold">{budget.label}</h3>
                      <p className="text-sm text-gray-600">{budget.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Lifestyle <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { value: 'minimal', label: 'Minimal Routine', desc: '5 minutes or less' },
                    { value: 'normal', label: 'Standard Routine', desc: '10-15 minutes' },
                    { value: 'extensive', label: 'Extensive Routine', desc: '20+ minutes' },
                    { value: 'travel', label: 'Always Traveling', desc: 'Need portable solutions' }
                  ].map((lifestyle) => (
                    <button
                      key={lifestyle.value}
                      onClick={() => handleInputChange('lifestyle', lifestyle.value)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        formData.lifestyle === lifestyle.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <h3 className="font-semibold">{lifestyle.label}</h3>
                      <p className="text-sm text-gray-600">{lifestyle.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Additional Information</h2>
              <p className="text-gray-600">Optional details to better personalize your experience</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Known Allergies or Sensitivities
                </label>
                <textarea
                  value={formData.allergies}
                  onChange={(e) => handleInputChange('allergies', e.target.value)}
                  placeholder="e.g., fragrance, retinol, sulfates... (optional)"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Skincare Routine
                </label>
                <textarea
                  value={formData.currentRoutine}
                  onChange={(e) => handleInputChange('currentRoutine', e.target.value)}
                  placeholder="Describe your current products and routine... (optional)"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="4"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skincare Goals
                </label>
                <textarea
                  value={formData.goals}
                  onChange={(e) => handleInputChange('goals', e.target.value)}
                  placeholder="What do you hope to achieve with your skincare routine? (optional)"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Your Profile</h2>
              <p className="text-gray-600">Make sure everything looks correct before submitting</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Skin Type</h3>
                  <p className="text-gray-600 capitalize">{formData.skinType || 'Not selected'}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Age Range</h3>
                  <p className="text-gray-600">{formData.ageRange || 'Not selected'}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Experience Level</h3>
                  <p className="text-gray-600 capitalize">{formData.skincareExperience || 'Not selected'}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Budget</h3>
                  <p className="text-gray-600 capitalize">{formData.budget || 'Not selected'}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900">Skin Concerns</h3>
                <p className="text-gray-600">
                  {formData.skinConcerns.length > 0 
                    ? formData.skinConcerns.join(', ') 
                    : 'None selected'
                  }
                </p>
              </div>
              
              {(formData.allergies || formData.goals) && (
                <div className="pt-4 border-t border-gray-200">
                  {formData.allergies && (
                    <div className="mb-3">
                      <h3 className="font-semibold text-gray-900">Allergies</h3>
                      <p className="text-gray-600 text-sm">{formData.allergies}</p>
                    </div>
                  )}
                  {formData.goals && (
                    <div>
                      <h3 className="font-semibold text-gray-900">Goals</h3>
                      <p className="text-gray-600 text-sm">{formData.goals}</p>
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
              Redirecting to dashboard in {countdown} second{countdown !== 1 ? 's' : ''}...
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Let's Get to Know Your Skin</h1>
            <p className="text-gray-600">Answer a few questions to get personalized skincare recommendations</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm text-gray-500">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded">
              {success}
            </div>
          )}

          {/* Main Content */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            {renderStep()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              {currentStep > 1 && (
                <button
                  onClick={prevStep}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  ← Previous
                </button>
              )}
              
              <button
                onClick={handleSkip}
                className="px-6 py-3 text-gray-500 hover:text-gray-700 transition-colors font-medium"
              >
                Skip for now
              </button>
            </div>

            <div className="flex space-x-4">
              {currentStep < totalSteps ? (
                <button
                  onClick={nextStep}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Next →
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
                    step <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
