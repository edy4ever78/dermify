'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import { useTranslation } from '@/hooks/useTranslation';
import { useLoading } from '@/context/loading-context';

export default function CreateRoutinePage() {
  const { t } = useTranslation();
  const { setIsLoading } = useLoading();
  const router = useRouter();
  
  const [routineData, setRoutineData] = useState({
    name: '',
    description: '',
    type: 'morning', // morning or evening
    skinType: '',
    concerns: [],
    difficulty: 'beginner',
    steps: [],
    timeOfDay: 'morning',
    estimatedTime: 0,
    tags: []
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [newStep, setNewStep] = useState({
    name: '',
    description: '',
    product: '',
    time: '',
    order: 1,
    category: '',
    isOptional: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [savedDrafts, setSavedDrafts] = useState([]);
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    
    // Load saved drafts
    const drafts = localStorage.getItem('routine-drafts');
    if (drafts) {
      setSavedDrafts(JSON.parse(drafts));
    }
    
    // Auto-initialize with default values for testing/demo
    console.log('🚀 AUTO-INITIALIZING: Setting default skin type and concerns...');
    setRoutineData(prev => {
      const autoData = {
        ...prev,
        name: prev.name || 'My Daily Routine',
        skinType: prev.skinType || 'combination', // Default to combination skin
        concerns: prev.concerns.length > 0 ? prev.concerns : ['acne', 'oiliness'], // Default concerns
        type: prev.type || 'morning' // Default to morning routine
      };
      console.log('✅ Auto-initialized data:', autoData);
      return autoData;
    });
    
    // Animation sequence
    const timer = setTimeout(() => {
      setIsLoading(false);
      setAnimationStep(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [setIsLoading]);

  // Keep animation step in sync with current step
  useEffect(() => {
    console.log('Syncing animation step with current step:', currentStep);
    setAnimationStep(currentStep);
  }, [currentStep]);

  // Enhanced skin types with detailed descriptions
  const skinTypes = [
    { 
      id: 'normal', 
      label: 'Normal', 
      emoji: '😊',
      description: 'Balanced skin that\'s not too oily or dry',
      characteristics: ['Balanced oil production', 'Small pores', 'Few imperfections']
    },
    { 
      id: 'dry', 
      label: 'Dry', 
      emoji: '🏜️',
      description: 'Skin that feels tight and may have flaky patches',
      characteristics: ['Feels tight after cleansing', 'May have flaky areas', 'Fine lines more visible']
    },
    { 
      id: 'oily', 
      label: 'Oily', 
      emoji: '💧',
      description: 'Skin with excess oil production and shine',
      characteristics: ['Shiny appearance', 'Enlarged pores', 'Prone to blackheads']
    },
    { 
      id: 'combination', 
      label: 'Combination', 
      emoji: '⚖️',
      description: 'Oily T-zone with normal to dry cheeks',
      characteristics: ['Oily forehead, nose, chin', 'Normal to dry cheeks', 'Mixed concerns']
    },
    { 
      id: 'sensitive', 
      label: 'Sensitive', 
      emoji: '⚡',
      description: 'Easily irritated skin that reacts to products',
      characteristics: ['Easily irritated', 'Redness-prone', 'Reacts to harsh ingredients']
    },
    { 
      id: 'acneProne', 
      label: 'Acne-Prone', 
      emoji: '🔴',
      description: 'Skin prone to breakouts and blemishes',
      characteristics: ['Frequent breakouts', 'Clogged pores', 'Post-acne marks']
    }
  ];

  // Enhanced concerns with priorities and solutions
  const concernOptions = [
    { 
      id: 'acne', 
      label: 'Acne & Breakouts', 
      emoji: '🔴',
      priority: 'high',
      description: 'Active breakouts, blackheads, and clogged pores',
      solutions: ['Salicylic acid', 'Benzoyl peroxide', 'Niacinamide']
    },
    { 
      id: 'aging', 
      label: 'Anti-Aging', 
      emoji: '⏳',
      priority: 'high',
      description: 'Fine lines, wrinkles, and loss of firmness',
      solutions: ['Retinol', 'Vitamin C', 'Peptides', 'Hyaluronic acid']
    },
    { 
      id: 'dryness', 
      label: 'Dryness', 
      emoji: '🏜️',
      priority: 'medium',
      description: 'Tight, flaky, or dehydrated skin',
      solutions: ['Hyaluronic acid', 'Ceramides', 'Natural oils']
    },
    { 
      id: 'oiliness', 
      label: 'Excess Oil', 
      emoji: '💧',
      priority: 'medium',
      description: 'Shiny skin and enlarged pores',
      solutions: ['Niacinamide', 'Clay masks', 'BHA exfoliation']
    },
    { 
      id: 'sensitivity', 
      label: 'Sensitivity', 
      emoji: '⚡',
      priority: 'high',
      description: 'Easily irritated or reactive skin',
      solutions: ['Gentle formulas', 'Centella asiatica', 'Minimal ingredients']
    },
    { 
      id: 'darkSpots', 
      label: 'Dark Spots', 
      emoji: '🎭',
      priority: 'medium',
      description: 'Hyperpigmentation and uneven skin tone',
      solutions: ['Vitamin C', 'Alpha arbutin', 'Kojic acid']
    },
    { 
      id: 'redness', 
      label: 'Redness', 
      emoji: '🌹',
      priority: 'medium',
      description: 'Persistent redness and inflammation',
      solutions: ['Azelaic acid', 'Green tea', 'Centella asiatica']
    },
    { 
      id: 'pores', 
      label: 'Large Pores', 
      emoji: '🔍',
      priority: 'low',
      description: 'Visible pores and uneven texture',
      solutions: ['Niacinamide', 'BHA', 'Retinol']
    },
    { 
      id: 'dullness', 
      label: 'Dullness', 
      emoji: '✨',
      priority: 'low',
      description: 'Lack of radiance and uneven texture',
      solutions: ['AHA exfoliation', 'Vitamin C', 'Brightening serums']
    }
  ];

  // Enhanced difficulty levels with time estimates
  const difficultyLevels = [
    { 
      id: 'beginner', 
      label: 'Beginner', 
      desc: '3-5 steps, simple routine', 
      emoji: '🌱',
      timeEstimate: '5-10 minutes',
      characteristics: ['Few products', 'Simple application', 'Low maintenance']
    },
    { 
      id: 'intermediate', 
      label: 'Intermediate', 
      desc: '5-7 steps, moderate complexity', 
      emoji: '🌿',
      timeEstimate: '10-15 minutes',
      characteristics: ['Multiple products', 'Some wait times', 'Regular commitment']
    },
    { 
      id: 'advanced', 
      label: 'Advanced', 
      desc: '7+ steps, comprehensive routine', 
      emoji: '🌳',
      timeEstimate: '15-25 minutes',
      characteristics: ['Many products', 'Complex layering', 'High commitment']
    }
  ];

  // Routine categories for better organization
  const stepCategories = [
    { id: 'cleanse', label: 'Cleansing', emoji: '🧼', order: 1 },
    { id: 'exfoliate', label: 'Exfoliation', emoji: '✨', order: 2 },
    { id: 'tone', label: 'Toning', emoji: '💧', order: 3 },
    { id: 'treat', label: 'Treatment', emoji: '💊', order: 4 },
    { id: 'moisturize', label: 'Moisturizing', emoji: '💦', order: 5 },
    { id: 'protect', label: 'Protection', emoji: '☀️', order: 6 }
  ];

  // Predefined routine templates
  const routineTemplates = [
    {
      id: 'basic-morning',
      name: 'Basic Morning Routine',
      type: 'morning',
      difficulty: 'beginner',
      steps: [
        { name: 'Gentle Cleanser', category: 'cleanse', time: '1 min', description: 'Remove overnight buildup' },
        { name: 'Vitamin C Serum', category: 'treat', time: '1 min', description: 'Antioxidant protection' },
        { name: 'Moisturizer', category: 'moisturize', time: '1 min', description: 'Hydrate and prep skin' },
        { name: 'Sunscreen SPF 30+', category: 'protect', time: '1 min', description: 'UV protection' }
      ]
    },
    {
      id: 'anti-aging-evening',
      name: 'Anti-Aging Evening Routine',
      type: 'evening',
      difficulty: 'intermediate',
      steps: [
        { name: 'Oil Cleanser', category: 'cleanse', time: '2 min', description: 'Remove makeup and sunscreen' },
        { name: 'Water-based Cleanser', category: 'cleanse', time: '1 min', description: 'Deep clean pores' },
        { name: 'Toner', category: 'tone', time: '30 sec', description: 'Balance pH and prep skin' },
        { name: 'Retinol Serum', category: 'treat', time: '1 min', description: 'Anti-aging treatment' },
        { name: 'Night Moisturizer', category: 'moisturize', time: '1 min', description: 'Overnight repair' }
      ]
    }
  ];

  // Memoized calculations for performance
  const estimatedTotalTime = useMemo(() => {
    return routineData.steps.reduce((total, step) => {
      const timeMatch = step.time?.match(/(\d+)/);
      return total + (timeMatch ? parseInt(timeMatch[1]) : 0);
    }, 0);
  }, [routineData.steps]);

  const completionPercentage = useMemo(() => {
    const totalSteps = 4;
    const completedSteps = currentStep - 1;
    return Math.round((completedSteps / totalSteps) * 100);
  }, [currentStep]);

  // Enhanced validation with detailed feedback
  const validateStep = useCallback(() => {
    console.log('=== VALIDATION START ===');
    console.log('Current step:', currentStep);
    console.log('Routine data to validate:', JSON.stringify(routineData, null, 2));
    
    const stepErrors = {};
    
    if (currentStep === 1) {
      console.log('Validating step 1...');
      
      console.log('Checking routine name:', `"${routineData.name}"`);
      if (!routineData.name.trim()) {
        stepErrors.name = 'Please give your routine a name';
        console.log('✖️ Name validation failed: empty');
      } else if (routineData.name.length < 3) {
        stepErrors.name = 'Routine name should be at least 3 characters';
        console.log('✖️ Name validation failed: too short');
      } else {
        console.log('✅ Name validation passed');
      }
      
      console.log('Checking skin type:', routineData.skinType);
      if (!routineData.skinType) {
        stepErrors.skinType = 'Please select your skin type to get personalized recommendations';
        console.log('✖️ Skin type validation failed: not selected');
      } else {
        console.log('✅ Skin type validation passed');
      }
      
      console.log('Checking concerns:', routineData.concerns);
      if (routineData.concerns.length === 0) {
        stepErrors.concerns = 'Select at least one skin concern to address';
        console.log('✖️ Concerns validation failed: none selected');
      } else {
        console.log('✅ Concerns validation passed');
      }
    }
    
    if (currentStep === 3 && routineData.steps.length === 0) {
      stepErrors.steps = 'Add at least one step to create your routine';
      console.log('✖️ Steps validation failed: no steps added');
    }

    console.log('All validation errors:', stepErrors);
    setErrors(stepErrors);
    const isValid = Object.keys(stepErrors).length === 0;
    console.log('Final validation result:', isValid ? '✅ VALID' : '✖️ INVALID');
    console.log('=== VALIDATION END ===');
    return isValid;
  }, [currentStep, routineData]);

  // Auto-save draft functionality
  const saveDraft = useCallback(() => {
    const draft = {
      ...routineData,
      id: Date.now(),
      savedAt: new Date().toISOString(),
      step: currentStep
    };
    
    const existingDrafts = JSON.parse(localStorage.getItem('routine-drafts') || '[]');
    const updatedDrafts = [draft, ...existingDrafts.slice(0, 4)]; // Keep only 5 most recent
    
    localStorage.setItem('routine-drafts', JSON.stringify(updatedDrafts));
    setSavedDrafts(updatedDrafts);
  }, [routineData, currentStep]);

  // Load draft functionality
  const loadDraft = useCallback((draft) => {
    setRoutineData(draft);
    setCurrentStep(draft.step || 1);
  }, []);

  // Smart recommendations based on skin type and concerns
  const getRecommendations = useCallback(() => {
    const { skinType, concerns } = routineData;
    let recommendations = [];

    if (skinType === 'oily' || concerns.includes('oiliness')) {
      recommendations.push('Consider a clay mask 2-3 times per week');
      recommendations.push('Use BHA (salicylic acid) for pore cleansing');
    }

    if (skinType === 'dry' || concerns.includes('dryness')) {
      recommendations.push('Layer hydrating serums before moisturizer');
      recommendations.push('Consider a facial oil for extra nourishment');
    }

    if (concerns.includes('aging')) {
      recommendations.push('Start with retinol 2-3 times per week');
      recommendations.push('Always use vitamin C in the morning');
    }

    if (concerns.includes('acne')) {
      recommendations.push('Introduce new products gradually');
      recommendations.push('Don\'t skip moisturizer even with oily skin');
    }

    return recommendations;
  }, [routineData]);

  const handleNext = useCallback(() => {
    console.log('Next button clicked - Current step:', currentStep);
    console.log('Routine data:', routineData);
    
    if (validateStep()) {
      console.log('Validation passed, advancing to next step');
      setCurrentStep(prev => {
        const next = Math.min(prev + 1, 4);
        console.log('Setting step from', prev, 'to', next);
        // Update animation step immediately to prevent fade issues
        setAnimationStep(next);
        return next;
      });
      saveDraft();
    } else {
      console.log('Validation failed, staying on current step');
      console.log('Errors:', errors);
    }
  }, [validateStep, saveDraft, currentStep, routineData, errors]);

  const handlePrevious = useCallback(() => {
    setCurrentStep(prev => {
      const previous = Math.max(prev - 1, 1);
      setAnimationStep(previous);
      return previous;
    });
  }, []);

  const handleConcernToggle = useCallback((concernId) => {
    console.log('🔄 CONCERN TOGGLE FUNCTION CALLED:', concernId);
    console.log('Current concerns:', routineData.concerns);
    
    try {
      setRoutineData(prev => {
        console.log('Previous concerns state:', prev.concerns);
        const newConcerns = prev.concerns.includes(concernId)
          ? prev.concerns.filter(id => id !== concernId)
          : [...prev.concerns, concernId];
        console.log('New concerns state:', newConcerns);
        
        const newData = { ...prev, concerns: newConcerns };
        console.log('Complete updated routine data:', newData);
        return newData;
      });
      console.log('✅ Concern toggle completed successfully');
    } catch (error) {
      console.error('✖️ Error toggling concern:', error);
    }
  }, [routineData.concerns]);

  const addStep = useCallback(() => {
    if (newStep.name.trim() && newStep.description.trim()) {
      const step = {
        ...newStep,
        id: Date.now(),
        order: routineData.steps.length + 1
      };
      
      setRoutineData(prev => ({
        ...prev,
        steps: [...prev.steps, step]
      }));
      
      setNewStep({
        name: '',
        description: '',
        product: '',
        time: '',
        order: routineData.steps.length + 2,
        category: '',
        isOptional: false
      });
    }
  }, [newStep, routineData.steps.length]);

  const removeStep = useCallback((stepId) => {
    setRoutineData(prev => ({
      ...prev,
      steps: prev.steps.filter(step => step.id !== stepId)
        .map((step, index) => ({ ...step, order: index + 1 }))
    }));
  }, []);

  const applyTemplate = useCallback((template) => {
    const templateSteps = template.steps.map((step, index) => ({
      ...step,
      id: Date.now() + index,
      order: index + 1
    }));

    setRoutineData(prev => ({
      ...prev,
      name: prev.name.trim() || template.name,
      type: template.type,
      difficulty: template.difficulty,
      steps: templateSteps
    }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!validateStep()) return;
    
    setIsSubmitting(true);
    
    try {
      // Enhanced routine data with computed fields
      const finalRoutine = {
        ...routineData,
        id: Date.now(),
        estimatedTime: estimatedTotalTime,
        recommendations: getRecommendations(),
        createdAt: new Date().toISOString(),
        lastUsed: new Date().toISOString(),
        isActive: true,
        version: '2.0'
      };
      
      console.log('Creating enhanced routine:', finalRoutine);
      
      // Save to completed routines
      const existingCompletedRoutines = JSON.parse(localStorage.getItem('completed-routines') || '[]');
      const updatedCompletedRoutines = [finalRoutine, ...existingCompletedRoutines];
      localStorage.setItem('completed-routines', JSON.stringify(updatedCompletedRoutines));
      
      // Clear draft after successful creation
      const drafts = savedDrafts.filter(draft => draft.id !== routineData.id);
      localStorage.setItem('routine-drafts', JSON.stringify(drafts));
      
      // Simulate API call with progress
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('✅ Routine successfully saved to localStorage');
      
      // Redirect with success state to main routines page
      router.push('/routines?created=success&name=' + encodeURIComponent(routineData.name));
    } catch (error) {
      console.error('Error creating routine:', error);
      setErrors({ submit: 'Failed to create routine. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  }, [validateStep, routineData, estimatedTotalTime, getRecommendations, savedDrafts, router]);

  // Enhanced step icons with animations
  const getStepIcon = useCallback((stepNum) => {
    const icons = [
      { emoji: '📝', label: 'Basic Info', color: 'from-blue-500 to-purple-500' },
      { emoji: '💊', label: 'Skin Profile', color: 'from-green-500 to-teal-500' },
      { emoji: '📋', label: 'Build Routine', color: 'from-orange-500 to-red-500' },
      { emoji: '✨', label: 'Review & Create', color: 'from-pink-500 to-rose-500' }
    ];
    return icons[stepNum - 1] || icons[0];
  }, []);

  // Progress indicator component
  const ProgressIndicator = ({ current, total }) => (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Step {current} of {total}
        </span>
        <span className="text-sm font-medium text-teal-600 dark:text-teal-400">
          {completionPercentage}% Complete
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-teal-500 to-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${completionPercentage}%` }}
        />
      </div>
    </div>
  );

  // Enhanced step content with better UX
  const renderStepContent = () => {
    // Simplified animation - always show current step content
    const fadeInClass = `transform transition-all duration-300 translate-x-0 opacity-100`;

    console.log('Rendering step content for step:', currentStep);

    switch (currentStep) {
      case 1:
        return (
          <div className={`space-y-8 ${fadeInClass}`}>
            {/* Quick Start Templates */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
              <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-300 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Quick Start Templates
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {routineTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => applyTemplate(template)}
                    className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-purple-200 dark:border-purple-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all text-left group"
                  >
                    <div className="font-medium text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {template.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {template.steps.length} steps • {template.difficulty}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Basic Information Form */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <span className="text-4xl mr-4">📝</span>
                <div>
                  <div>Let's Start Building</div>
                  <div className="text-lg text-gray-600 dark:text-gray-300 font-normal">Tell us about your routine</div>
                </div>
              </h3>
              
              <div className="space-y-6">
                {/* Routine Name with Character Counter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Routine Name *
                    <span className="ml-2 text-xs text-gray-500">({routineData.name.length}/50)</span>
                  </label>
                  <input
                    type="text"
                    value={routineData.name}
                    onChange={(e) => setRoutineData(prev => ({ ...prev, name: e.target.value.slice(0, 50) }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    placeholder="e.g., My Morning Glow Routine, Anti-Aging Night Ritual"
                  />
                  {errors.name && <p className="mt-2 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.name}
                  </p>}
                </div>

                {/* Description with Smart Suggestions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description (Optional)
                    <span className="ml-2 text-xs text-gray-500">Help others understand your routine goals</span>
                  </label>
                  <textarea
                    value={routineData.description}
                    onChange={(e) => setRoutineData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    placeholder="Describe your routine goals... e.g., 'A gentle routine for sensitive skin to reduce redness and maintain hydration'"
                  />
                </div>

                {/* Enhanced Routine Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    When will you use this routine? *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { 
                        id: 'morning', 
                        label: 'Morning Routine', 
                        emoji: '🌅', 
                        desc: 'Start your day fresh and protected',
                        benefits: ['Energy boost', 'UV protection', 'Antioxidant defense']
                      },
                      { 
                        id: 'evening', 
                        label: 'Evening Routine', 
                        emoji: '🌙', 
                        desc: 'Wind down and repair overnight',
                        benefits: ['Deep cleansing', 'Overnight repair', 'Relaxation']
                      }
                    ].map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setRoutineData(prev => ({ ...prev, type: type.id }))}
                        className={`p-6 rounded-xl border-2 transition-all duration-200 text-left group hover:scale-105 ${
                          routineData.type === type.id
                            ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 shadow-lg'
                            : 'border-gray-200 dark:border-gray-600 hover:border-teal-300 dark:hover:border-teal-600'
                        }`}
                      >
                        <div className="flex items-start space-x-4">
                          <span className="text-3xl group-hover:scale-110 transition-transform">{type.emoji}</span>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900 dark:text-white mb-1">{type.label}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">{type.desc}</div>
                            <div className="flex flex-wrap gap-1">
                              {type.benefits.map((benefit, idx) => (
                                <span key={idx} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
                                  {benefit}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className={`space-y-8 ${fadeInClass}`}>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <span className="text-4xl mr-4">💊</span>
                <div>
                  <div>Your Skin Profile</div>
                  <div className="text-lg text-gray-600 dark:text-gray-300 font-normal">Help us personalize your routine</div>
                </div>
              </h2>
              
              <div className="space-y-8">
                {/* Enhanced Skin Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                    What's your skin type? *
                    <span className="ml-2 text-xs text-gray-500">Choose the one that best describes your skin</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {skinTypes.map((type) => (
                      <button
                        key={type.id}
                        data-skin-type={type.id}
                        onClick={(e) => {
                          console.log('🔄 SKIN TYPE CLICK EVENT FIRED!', type.id);
                          console.log('Event details:', e);
                          console.log('Target element:', e.target);
                          console.log('Current target:', e.currentTarget);
                          
                          try {
                            setRoutineData(prev => {
                              console.log('Previous routine data:', prev);
                              const newData = { ...prev, skinType: type.id };
                              console.log('Updated routine data:', newData);
                              return newData;
                            });
                            console.log('✅ State update completed successfully');
                          } catch (error) {
                            console.error('✖️ Error updating state:', error);
                          }
                        }}
                        className={`p-6 rounded-xl border-2 transition-all duration-200 text-left group hover:scale-105 ${
                          routineData.skinType === type.id
                            ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 shadow-lg'
                            : 'border-gray-200 dark:border-gray-600 hover:border-teal-300 dark:hover:border-teal-600'
                        }`}
                      >
                        <div className="text-center mb-4">
                          <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">{type.emoji}</div>
                          <div className="font-semibold text-gray-900 dark:text-white">{type.label}</div>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300 mb-3">{type.description}</div>
                        <div className="space-y-1">
                          {type.characteristics.map((char, idx) => (
                            <div key={idx} className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                              <div className="w-1 h-1 bg-teal-500 rounded-full mr-2"></div>
                              {char}
                            </div>
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                  {errors.skinType && <p className="mt-3 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.skinType}
                  </p>}
                </div>

                {/* Enhanced Skin Concerns with Priority Indicators */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                    What are your main skin concerns? *
                    <span className="ml-2 text-xs text-gray-500">Select all that apply - we'll prioritize based on your choices</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {concernOptions.map((concern) => (
                      <button
                        key={concern.id}
                        data-concern={concern.id}
                        onClick={(e) => {
                          console.log('🔄 CONCERN CLICK EVENT FIRED!', concern.id);
                          console.log('Event details:', e);
                          console.log('Target element:', e.target);
                          console.log('Current target:', e.currentTarget);
                          
                          try {
                            handleConcernToggle(concern.id);
                            console.log('✅ handleConcernToggle called successfully');
                          } catch (error) {
                            console.error('✖️ Error calling handleConcernToggle:', error);
                          }
                        }}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 text-left group hover:scale-105 ${
                          routineData.concerns.includes(concern.id)
                            ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 shadow-lg'
                            : 'border-gray-200 dark:border-gray-600 hover:border-teal-300 dark:hover:border-teal-600'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="text-2xl group-hover:scale-110 transition-transform">{concern.emoji}</div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <div className="font-medium text-gray-900 dark:text-white">{concern.label}</div>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                concern.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                                concern.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                              }`}>
                                {concern.priority}
                              </span>
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-300 mb-2">{concern.description}</div>
                            <div className="flex flex-wrap gap-1">
                              {concern.solutions.slice(0, 2).map((solution, idx) => (
                                <span key={idx} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                                  {solution}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  {errors.concerns && <p className="mt-3 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.concerns}
                  </p>}
                </div>

                {/* Enhanced Difficulty Selection with Time Estimates */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                    How complex should your routine be?
                    <span className="ml-2 text-xs text-gray-500">Consider your lifestyle and commitment level</span>
                  </label>
                  <div className="space-y-3">
                    {difficultyLevels.map((level) => (
                      <button
                        key={level.id}
                        onClick={() => setRoutineData(prev => ({ ...prev, difficulty: level.id }))}
                        className={`w-full p-6 rounded-xl border-2 transition-all duration-200 text-left group hover:scale-105 ${
                          routineData.difficulty === level.id
                            ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 shadow-lg'
                            : 'border-gray-200 dark:border-gray-600 hover:border-teal-300 dark:hover:border-teal-600'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <span className="text-3xl group-hover:scale-110 transition-transform">{level.emoji}</span>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-semibold text-gray-900 dark:text-white">{level.label}</div>
                              <span className="text-sm font-medium text-teal-600 dark:text-teal-400">{level.timeEstimate}</span>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300 mb-3">{level.desc}</div>
                            <div className="flex flex-wrap gap-2">
                              {level.characteristics.map((char, idx) => (
                                <span key={idx} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
                                  {char}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Smart Recommendations Preview */}
                {(routineData.skinType || routineData.concerns.length > 0) && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      Personalized Recommendations
                    </h3>
                    <div className="space-y-2">
                      {getRecommendations().slice(0, 3).map((rec, idx) => (
                        <div key={idx} className="flex items-start space-x-2 text-sm text-blue-800 dark:text-blue-300">
                          <div className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className={`space-y-8 ${fadeInClass}`}>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <span className="text-4xl mr-4">📋</span>
                <div>
                  <div>Build Your Routine</div>
                  <div className="text-lg text-gray-600 dark:text-gray-300 font-normal">
                    Add steps to create your perfect routine • {routineData.steps.length} steps • ~{estimatedTotalTime} min
                  </div>
                </div>
              </h2>

              {/* Step Categories Quick Add */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800 mb-8">
                <h3 className="text-lg font-semibold text-green-900 dark:text-green-300 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Quick Add by Category
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {stepCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setNewStep(prev => ({ ...prev, category: category.id, name: category.label }))}
                      className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-green-200 dark:border-green-700 hover:border-green-300 dark:hover:border-green-600 transition-all text-center group"
                    >
                      <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">{category.emoji}</div>
                      <div className="text-xs font-medium text-gray-900 dark:text-white">{category.label}</div>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Current Routine Steps */}
              {routineData.steps.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Your Routine Steps</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>{routineData.steps.length} steps</span>
                      <span>~{estimatedTotalTime} minutes</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {routineData.steps.map((step, index) => (
                      <div key={step.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl p-6 group hover:shadow-lg transition-all duration-200">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4 flex-1">
                            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-full font-bold text-sm">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-3">
                                <h4 className="font-semibold text-gray-900 dark:text-white text-lg">{step.name}</h4>
                                {step.category && (
                                  <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full">
                                    {stepCategories.find(cat => cat.id === step.category)?.label || step.category}
                                  </span>
                                )}
                                {step.time && (
                                  <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
                                    {step.time}
                                  </span>
                                )}
                                {step.isOptional && (
                                  <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-2 py-1 rounded-full">
                                    Optional
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-600 dark:text-gray-300 mb-3">{step.description}</p>
                              {step.product && (
                                <div className="flex items-center space-x-2 text-sm">
                                  <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                  </svg>
                                  <span className="text-teal-600 dark:text-teal-400 font-medium">{step.product}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => removeStep(step.id)}
                            className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all opacity-0 group-hover:opacity-100"
                            title="Remove step"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Enhanced Add New Step Form */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-8 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add New Step
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Step Name *
                      </label>
                      <input
                        type="text"
                        value={newStep.name}
                        onChange={(e) => setNewStep(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                        placeholder="e.g., Gentle Cleanser, Vitamin C Serum"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Category
                      </label>
                      <select
                        value={newStep.category}
                        onChange={(e) => setNewStep(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      >
                        <option value="">Select category...</option>
                        {stepCategories.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.emoji} {cat.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Time
                        </label>
                        <input
                          type="text"
                          value={newStep.time}
                          onChange={(e) => setNewStep(prev => ({ ...prev, time: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                          placeholder="e.g., 2 min"
                        />
                      </div>
                      <div className="flex items-end">
                        <label className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                          <input
                            type="checkbox"
                            checked={newStep.isOptional}
                            onChange={(e) => setNewStep(prev => ({ ...prev, isOptional: e.target.checked }))}
                            className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                          />
                          <span>Optional step</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description *
                      </label>
                      <textarea
                        value={newStep.description}
                        onChange={(e) => setNewStep(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                        placeholder="Describe how to perform this step and its benefits..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Specific Product (Optional)
                      </label>
                      <input
                        type="text"
                        value={newStep.product}
                        onChange={(e) => setNewStep(prev => ({ ...prev, product: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                        placeholder="e.g., CeraVe Foaming Cleanser, The Ordinary Niacinamide"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={addStep}
                    disabled={!newStep.name.trim() || !newStep.description.trim()}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg font-medium hover:from-teal-700 hover:to-blue-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Step
                  </button>
                </div>
              </div>
              
              {errors.steps && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <p className="text-red-600 dark:text-red-400 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.steps}
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className={`space-y-8 ${fadeInClass}`}>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <span className="text-4xl mr-4">✨</span>
                <div>
                  <div>Review & Create</div>
                  <div className="text-lg text-gray-600 dark:text-gray-300 font-normal">Your personalized routine is ready!</div>
                </div>
              </h2>

              {/* Preview Toggle */}
              <div className="flex justify-end mb-6">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {showPreview ? 'Hide Preview' : 'Show Preview'}
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Routine Summary */}
                <div className="space-y-6">
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Routine Details
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</span>
                          <div className="text-gray-900 dark:text-white font-medium">{routineData.name}</div>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</span>
                          <div className="text-gray-900 dark:text-white">
                            {routineData.type === 'morning' ? '🌅 Morning' : '🌙 Evening'}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Skin Type</span>
                          <div className="text-gray-900 dark:text-white">
                            {skinTypes.find(t => t.id === routineData.skinType)?.label}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Complexity</span>
                          <div className="text-gray-900 dark:text-white">
                            {difficultyLevels.find(d => d.id === routineData.difficulty)?.label}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Steps</span>
                          <div className="text-gray-900 dark:text-white">{routineData.steps.length} steps</div>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Est. Time</span>
                          <div className="text-gray-900 dark:text-white">~{estimatedTotalTime} minutes</div>
                        </div>
                      </div>
                      
                      {routineData.description && (
                        <div>
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</span>
                          <div className="text-gray-900 dark:text-white mt-1">{routineData.description}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Target Concerns */}
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      Target Concerns
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {routineData.concerns.map(concernId => {
                        const concern = concernOptions.find(c => c.id === concernId);
                        return (
                          <span key={concernId} className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-800 dark:text-purple-300 px-3 py-2 rounded-full text-sm font-medium">
                            <span>{concern?.emoji}</span>
                            <span>{concern?.label}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Personalized Recommendations */}
                  {getRecommendations().length > 0 && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                      <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        Personalized Tips
                      </h3>
                      <div className="space-y-3">
                        {getRecommendations().map((rec, idx) => (
                          <div key={idx} className="flex items-start space-x-3 text-blue-800 dark:text-blue-300">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Routine Steps Preview */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Your Routine Steps ({routineData.steps.length})
                  </h3>
                  
                  {routineData.steps.length > 0 ? (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {routineData.steps.map((step, index) => (
                        <div key={step.id} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full font-bold text-sm flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-semibold text-gray-900 dark:text-white truncate">{step.name}</h4>
                              {step.time && (
                                <span className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 px-2 py-1 rounded flex-shrink-0">
                                  {step.time}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{step.description}</p>
                            {step.product && (
                              <p className="text-xs text-green-600 dark:text-green-400 mt-1 font-medium">{step.product}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                      </svg>
                      <p className="text-gray-500 dark:text-gray-400">No steps added yet</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500">Go back to Step 3 to add routine steps</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className={`space-y-8 ${fadeInClass}`}>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <span className="text-4xl mr-4">✨</span>
                <div>
                  <div>Review & Create</div>
                  <div className="text-lg text-gray-600 dark:text-gray-300 font-normal">Your personalized routine is ready!</div>
                </div>
              </h2>

              {/* Preview Toggle */}
              <div className="flex justify-end mb-6">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {showPreview ? 'Hide Preview' : 'Show Preview'}
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Routine Summary */}
                <div className="space-y-6">
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Routine Details
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</span>
                          <div className="text-gray-900 dark:text-white font-medium">{routineData.name}</div>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</span>
                          <div className="text-gray-900 dark:text-white">
                            {routineData.type === 'morning' ? '🌅 Morning' : '🌙 Evening'}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Skin Type</span>
                          <div className="text-gray-900 dark:text-white">
                            {skinTypes.find(t => t.id === routineData.skinType)?.label}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Complexity</span>
                          <div className="text-gray-900 dark:text-white">
                            {difficultyLevels.find(d => d.id === routineData.difficulty)?.label}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Steps</span>
                          <div className="text-gray-900 dark:text-white">{routineData.steps.length} steps</div>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Est. Time</span>
                          <div className="text-gray-900 dark:text-white">~{estimatedTotalTime} minutes</div>
                        </div>
                      </div>
                      
                      {routineData.description && (
                        <div>
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</span>
                          <div className="text-gray-900 dark:text-white mt-1">{routineData.description}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Target Concerns */}
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      Target Concerns
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {routineData.concerns.map(concernId => {
                        const concern = concernOptions.find(c => c.id === concernId);
                        return (
                          <span key={concernId} className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-800 dark:text-purple-300 px-3 py-2 rounded-full text-sm font-medium">
                            <span>{concern?.emoji}</span>
                            <span>{concern?.label}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Personalized Recommendations */}
                  {getRecommendations().length > 0 && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                      <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        Personalized Tips
                      </h3>
                      <div className="space-y-3">
                        {getRecommendations().map((rec, idx) => (
                          <div key={idx} className="flex items-start space-x-3 text-blue-800 dark:text-blue-300">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Routine Steps Preview */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Your Routine Steps ({routineData.steps.length})
                  </h3>
                  
                  {routineData.steps.length > 0 ? (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {routineData.steps.map((step, index) => (
                        <div key={step.id} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full font-bold text-sm flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-semibold text-gray-900 dark:text-white truncate">{step.name}</h4>
                              {step.time && (
                                <span className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 px-2 py-1 rounded flex-shrink-0">
                                  {step.time}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{step.description}</p>
                            {step.product && (
                              <p className="text-xs text-green-600 dark:text-green-400 mt-1 font-medium">{step.product}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                      </svg>
                      <p className="text-gray-500 dark:text-gray-400">No steps added yet</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500">Go back to Step 3 to add routine steps</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-teal-400/20 to-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Enhanced Header */}
          <div className="text-center mb-12">
            <nav className="mb-6">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <Link href="/account" className="hover:text-teal-600 transition-colors">Account</Link>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <Link href="/account/routines" className="hover:text-teal-600 transition-colors">Routines</Link>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-gray-900 dark:text-white font-medium">Create</span>
              </div>
            </nav>
            
            <div className="relative">
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                Create Your Perfect
                <br />
                Skincare Routine
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Build a personalized routine tailored to your unique skin type, concerns, and lifestyle. 
                Our smart system guides you through every step.
              </p>
            </div>
          </div>

          {/* Enhanced Progress Steps */}
          <div className="mb-12">
            <ProgressIndicator current={currentStep} total={4} />
            
            <div className="flex items-center justify-between relative">
              {[1, 2, 3, 4].map((step) => {
                const stepInfo = getStepIcon(step);
                return (
                  <div key={step} className="flex flex-col items-center relative z-10">
                    <div className={`
                      flex items-center justify-center w-16 h-16 rounded-2xl border-2 transition-all duration-300 mb-4
                      ${currentStep >= step 
                        ? `bg-gradient-to-r ${stepInfo.color} border-transparent text-white shadow-lg transform scale-110` 
                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400 hover:border-gray-400'
                      }
                    `}>
                      <span className="text-2xl">{stepInfo.emoji}</span>
                    </div>
                    <div className="text-center">
                      <div className={`text-sm font-medium transition-colors ${
                        currentStep >= step ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {stepInfo.label}
                      </div>
                    </div>
                    {step < 4 && (
                      <div className={`
                        absolute top-8 left-16 w-full h-1 transition-all duration-500 -z-10
                        ${currentStep > step 
                          ? 'bg-gradient-to-r from-teal-500 to-blue-500' 
                          : 'bg-gray-200 dark:bg-gray-700'
                        }
                      `} style={{ width: 'calc(100vw / 4 - 4rem)' }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Enhanced Step Content Container */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 lg:p-12 mb-8">
            {renderStepContent()}
          </div>

          {/* Enhanced Navigation */}
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`
                inline-flex items-center px-8 py-4 rounded-xl font-medium transition-all duration-200 transform
                ${currentStep === 1
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-105 shadow-lg'
                }
              `}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            {/* Auto-save Indicator */}
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Auto-saving...</span>
              </div>
              <button
                onClick={saveDraft}
                className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
              >
                Save Draft
              </button>
            </div>

            {currentStep < 4 ? (
              <button
                onClick={(e) => {
                  console.log('=== NEXT STEP BUTTON CLICKED ===');
                  console.log('Event:', e);
                  console.log('Current step:', currentStep);
                  console.log('Routine data:', JSON.stringify(routineData, null, 2));
                  console.log('Current errors:', JSON.stringify(errors, null, 2));
                  
                  console.log('=== CALLING VALIDATION ===');
                  const isValid = validateStep();
                  console.log('Validation result:', isValid);
                  
                  if (isValid) {
                    console.log('=== VALIDATION PASSED - ADVANCING ===');
                    setCurrentStep(prev => {
                      console.log('Setting step from', prev, 'to', prev + 1);
                      return prev + 1;
                    });
                  } else {
                    console.log('=== VALIDATION FAILED - STAYING ===');
                    console.log('Errors preventing advancement:', errors);
                  }
                  
                  console.log('=== NEXT STEP BUTTON CLICK COMPLETE ===');
                }}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl font-medium hover:from-teal-700 hover:to-blue-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Next Step
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`
                  inline-flex items-center px-8 py-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-lg
                  ${isSubmitting
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-600 to-teal-600 text-white hover:from-green-700 hover:to-teal-700'
                  }
                `}
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-3">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Creating Your Routine...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Create My Routine</span>
                  </div>
                )}
              </button>
            )}
          </div>

          {/* Error Display */}
          {errors.submit && (
            <div className="mt-6 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl">
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="text-lg font-medium text-red-800 dark:text-red-300">Oops! Something went wrong</h3>
                  <p className="text-red-600 dark:text-red-400 mt-1">{errors.submit}</p>
                </div>
              </div>
            </div>
          )}

          {/* Success Motivational Footer */}
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 rounded-2xl p-8 border border-teal-200 dark:border-teal-800">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                🌟 You're building something amazing!
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                A consistent skincare routine is the foundation of healthy, glowing skin. 
                You're taking the right steps toward your skin goals.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}


