'use client';

import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t dark:border-gray-800">
      <div className="max-w-7xl mx-auto py-10 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t('footerCategories.products')}
            </h3>
            <ul className="mt-3 sm:mt-4 space-y-1 sm:space-y-2">
              <li>
                <Link href="/products/cleansers" className="text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">
                  {t('productCategories.cleansers')}
                </Link>
              </li>
              <li>
                <Link href="/products/moisturizers" className="text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">
                  {t('productCategories.moisturizers')}
                </Link>
              </li>
              <li>
                <Link href="/products/serums" className="text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">
                  {t('productCategories.serums')}
                </Link>
              </li>
              <li>
                <Link href="/products/sunscreens" className="text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">
                  {t('productCategories.sunscreens')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t('footerCategories.ingredients')}
            </h3>
            <ul className="mt-3 sm:mt-4 space-y-1 sm:space-y-2">
              <li>
                <Link href="/ingredients/retinoids" className="text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">
                  {t('ingredientTypes.retinoids')}
                </Link>
              </li>
              <li>
                <Link href="/ingredients/aha-bha" className="text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">
                  {t('ingredientTypes.ahaBha')}
                </Link>
              </li>
              <li>
                <Link href="/ingredients/vitamin-c" className="text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">
                  {t('ingredientTypes.vitaminC')}
                </Link>
              </li>
              <li>
                <Link href="/ingredients/niacinamide" className="text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">
                  {t('ingredientTypes.niacinamide')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t('footerCategories.resources')}
            </h3>
            <ul className="mt-3 sm:mt-4 space-y-1 sm:space-y-2">
              <li>
                <Link href="/ingredients" className="text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">
                  {t('navigation.ingredients')}
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">
                  {t('navigation.products')}
                </Link>
              </li>
              <li>
                <Link href="/skin-analysis" className="text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">
                  {t('navigation.skinAnalysis')}
                </Link>
              </li>
              <li>
                <Link href="/concerns" className="text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">
                  {t('commonSkinConcerns')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t('footerCategories.company')}
            </h3>
            <ul className="mt-3 sm:mt-4 space-y-1 sm:space-y-2">
              <li>
                <Link href="/about" className="text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">
                  {t('companyLinks.aboutUs')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">
                  {t('companyLinks.contactUs')}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">
                  {t('companyLinks.privacy')}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">
                  {t('companyLinks.terms')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 sm:mt-12 border-t border-gray-200 dark:border-gray-700 pt-6 sm:pt-8">
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 text-center">
            © {new Date().getFullYear()} {t('appName')}. {t('copyright')}.
          </p>
        </div>
      </div>
    </footer>
  );
}
