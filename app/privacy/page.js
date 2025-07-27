'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTranslation } from '@/hooks/useTranslation';

export default function Privacy() {
  const { t } = useTranslation();
  
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent mb-8">
            {t('privacyPolicy')}
          </h1>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {t('privacyDescription')}
            </p>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('informationWeCollect')}</h2>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 mb-4">
              <li>{t('personalInformation')}</li>
              <li>{t('usageData')}</li>
              <li>{t('cookiesTracking')}</li>
            </ul>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('howWeUseInformation')}</h2>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 mb-4">
              <li>{t('provideServices')}</li>
              <li>{t('personalizeExperience')}</li>
              <li>{t('communicateUpdates')}</li>
              <li>{t('ensureSecurity')}</li>
            </ul>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('yourRights')}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {t('rightsDescription')}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              {t('policyUpdateNotice')}
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
