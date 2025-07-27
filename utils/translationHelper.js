// Helper utility for managing translations across the app
import { useTranslation } from '@/hooks/useTranslation';

// Common translation patterns used throughout the app
export const useCommonTranslations = () => {
  const { t } = useTranslation();

  return {
    // Navigation
    nav: {
      home: t('navigation.home'),
      products: t('navigation.products'),
      ingredients: t('navigation.ingredients'),
      skinAnalysis: t('navigation.skinAnalysis'),
      routines: t('navigation.routines'),
      about: t('navigation.about'),
      contact: t('navigation.contact'),
      profile: t('navigation.profile'),
      logout: t('navigation.logout'),
      login: t('navigation.login'),
      signup: t('navigation.signup')
    },

    // Common actions
    actions: {
      search: t('search'),
      loading: t('loading'),
      learnMore: t('learnMore'),
      viewDetails: t('viewDetails'),
      getStarted: t('getStarted'),
      tryAgain: t('tryAgain')
    },

    // Product categories
    categories: {
      cleansers: t('productCategories.cleansers'),
      moisturizers: t('productCategories.moisturizers'),
      serums: t('productCategories.serums'),
      sunscreens: t('productCategories.sunscreens'),
      exfoliants: t('productCategories.exfoliants')
    },

    // Ingredient types
    ingredients: {
      retinoids: t('ingredientTypes.retinoids'),
      ahaBha: t('ingredientTypes.ahaBha'),
      vitaminC: t('ingredientTypes.vitaminC'),
      niacinamide: t('ingredientTypes.niacinamide')
    },

    // Safety labels
    safety: {
      excellent: t('safetyLabels.excellent'),
      good: t('safetyLabels.good'),
      moderate: t('safetyLabels.moderate'),
      caution: t('safetyLabels.caution'),
      highRisk: t('safetyLabels.highRisk')
    },

    // Skin concerns
    concerns: {
      acne: t('skinConcernTypes.acne'),
      aging: t('skinConcernTypes.aging'),
      dryness: t('skinConcernTypes.dryness'),
      redness: t('skinConcernTypes.redness'),
      hyperpigmentation: t('skinConcernTypes.hyperpigmentation'),
      sensitivity: t('skinConcernTypes.sensitivity')
    },

    // Company links
    company: {
      aboutUs: t('companyLinks.aboutUs'),
      contactUs: t('companyLinks.contactUs'),
      privacy: t('companyLinks.privacy'),
      terms: t('companyLinks.terms')
    }
  };
};

// Translation wrapper for pages that need multiple translations
export const withTranslations = (Component) => {
  return function WrappedComponent(props) {
    const translations = useCommonTranslations();
    const { t } = useTranslation();

    return <Component {...props} t={t} translations={translations} />;
  };
};

export default useCommonTranslations;
