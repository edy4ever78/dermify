# User Onboarding System

## Overview
The Dermify application now includes a comprehensive user onboarding system that collects essential skincare information from new users and personalizes their experience based on their skin profile.

## Features

### 1. Multi-Step Onboarding Flow
- **Step 1**: Skin type selection (Normal, Dry, Oily, Combination, Sensitive, Mature)
- **Step 2**: Skin concerns selection (Acne, Aging, Dark spots, etc.)
- **Step 3**: Age range selection
- **Step 4**: Skincare experience level
- **Step 5**: Allergies and ingredients to avoid (optional)
- **Step 6**: Current routine and goals (optional)

### 2. User Flow
1. **New User Registration**: Users sign up with basic information
2. **Automatic Redirect**: After signup, users are redirected to `/onboarding`
3. **Skip Option**: Users can skip onboarding if they prefer
4. **Completion**: After onboarding, users are redirected to `/dashboard` with a welcome message

### 3. Existing User Handling
- **Returning Users**: Existing users are checked for onboarding completion
- **Dashboard Access**: Completed users go straight to personalized dashboard
- **Onboarding Enforcement**: Incomplete users are redirected to complete onboarding

### 4. Database Integration
- All onboarding data is stored in Redis
- User profiles include new fields:
  - `skinType`
  - `skinConcerns` (array)
  - `ageRange`
  - `skincareExperience`
  - `allergies`
  - `currentRoutine`
  - `goals`
  - `onboardingCompleted` (boolean)
  - `onboardingCompletedAt` (timestamp)

### 5. Personalized Dashboard
- **Profile Summary**: Displays user's skin information
- **Personalized Recommendations**: Based on skin type and concerns
- **Quick Actions**: Easy access to main features
- **Activity Tracking**: Recent user activity
- **Tips and Help**: Contextual assistance

## API Endpoints

### POST `/api/user/onboarding`
Saves user onboarding data and marks onboarding as completed.

**Request Body:**
```json
{
  "skinType": "combination",
  "skinConcerns": ["acne", "large_pores"],
  "ageRange": "26-35",
  "skincareExperience": "intermediate",
  "allergies": "fragrance, sulfates",
  "currentRoutine": "Basic cleansing and moisturizing",
  "goals": "Clear skin and smaller pores"
}
```

**Response:**
```json
{
  "message": "Onboarding completed successfully",
  "user": {
    "id": "user:123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "skinType": "combination",
    "skinConcerns": ["acne", "large_pores"],
    "onboardingCompleted": true,
    "onboardingCompletedAt": "2025-01-25T10:30:00Z"
  }
}
```

## File Structure

```
app/
├── onboarding/
│   └── page.js                 # Multi-step onboarding form
├── dashboard/
│   └── page.js                 # Personalized dashboard
├── api/
│   └── user/
│       └── onboarding/
│           └── route.js        # Onboarding API handler
├── signup/
│   └── page.js                 # Updated to redirect to onboarding
└── page.js                     # Updated to handle user routing

context/
└── auth-context.js             # Added refreshUser function

lib/
└── redis.js                    # Added updateUser function
```

## User Experience Flow

### New User Journey
1. Visit homepage → Sign up
2. Complete registration → Redirect to onboarding
3. Complete 6-step questionnaire → Redirect to dashboard
4. See personalized welcome message and recommendations

### Returning User Journey
1. Visit homepage → Sign in
2. Check onboarding status:
   - If incomplete → Redirect to onboarding
   - If complete → Redirect to dashboard

### Onboarding Retake
- Users can retake the onboarding questionnaire anytime from their profile
- Link available in dashboard: "Retake Quiz"
- Previous answers are overwritten with new responses

## Technical Implementation

### State Management
- Uses React Context for authentication state
- Form state managed locally in onboarding component
- Progress tracking with step-by-step navigation

### Data Validation
- Required fields: skin type, concerns, age range, experience level
- Optional fields: allergies, routine, goals
- Client-side and server-side validation

### Error Handling
- Network errors during submission
- Invalid authentication tokens
- Missing required data
- User feedback with error messages

### Responsive Design
- Mobile-friendly multi-step form
- Progress indicator
- Touch-friendly buttons and inputs
- Proper spacing and typography

## Customization Options

### Adding New Questions
1. Add new step to onboarding component
2. Update form state structure
3. Add validation logic
4. Update API to handle new fields
5. Update database schema in Redis

### Modifying Recommendations
Update the `getSkincareRecommendations()` function in dashboard to add new recommendation logic based on user profile data.

### Styling Customization
The onboarding flow uses Tailwind CSS classes and follows the existing design system. Colors, spacing, and animations can be customized through the theme configuration.

## Testing Recommendations

1. **Complete Flow Testing**:
   - Test signup → onboarding → dashboard flow
   - Test skip functionality
   - Test form validation

2. **Error Scenarios**:
   - Network failures during submission
   - Invalid form data
   - Authentication issues

3. **User Experience**:
   - Mobile responsiveness
   - Form usability
   - Navigation between steps

4. **Data Persistence**:
   - Verify data saves correctly in Redis
   - Test user profile updates
   - Check recommendation accuracy

## Future Enhancements

1. **Advanced Questionnaire**:
   - Dynamic questions based on previous answers
   - Image-based skin condition assessment
   - Integration with skin analysis AI

2. **Onboarding Analytics**:
   - Track completion rates
   - Identify drop-off points
   - A/B test different flows

3. **Social Features**:
   - Optional social media integration
   - Skincare goals sharing
   - Community recommendations

4. **Progressive Profiling**:
   - Collect additional data over time
   - Seasonal preference updates
   - Product usage tracking
