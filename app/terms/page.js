'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTranslation } from '@/hooks/useTranslation';

export default function Terms() {
  const { t } = useTranslation();
  
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent mb-8">
            {t('termsOfService')}
          </h1>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {t('termsIntroduction')}
            </p>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('useOfService')}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {t('useOfServiceDescription')}
            </p>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('userAccounts')}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {t('userAccountsDescription')}
            </p>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('limitationOfLiability')}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {t('limitationDescription')}
            </p>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('changesToTerms')}</h2>
            <p className="text-gray-600 dark:text-gray-400">
              {t('changesDescription')}
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
