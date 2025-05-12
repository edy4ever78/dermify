'use client';

import { useLoading } from '@/context/loading-context';
import { useTranslation } from '@/hooks/useTranslation';

export default function LoadingScreen() {
  const { isLoading } = useLoading();
  const { t } = useTranslation();
  
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 bg-opacity-80 dark:bg-opacity-80 flex items-center justify-center z-50 backdrop-blur-sm transition-all duration-300">
      <div className="text-center p-6 rounded-lg">
        <div className="relative w-24 h-24 mx-auto">
          {/* Gradient circle */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-500 via-blue-500 to-teal-500 opacity-30 animate-pulse"></div>
          
          {/* Spinner */}
          <div className="absolute inset-1 rounded-full border-4 border-transparent border-t-teal-500 border-b-blue-500 animate-spin"></div>
          
          {/* Leaf icon in the middle */}
          <div className="absolute inset-4 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-lg">
            <svg className="h-10 w-10" viewBox="0 0 24 24">
              <path 
                d="M12 2C8.5 2 5 3.5 3 6c-2 2.5-3 4.5-3 8 0 3.5 2 6.5 5 8 3 1.5 8 2 11 0 3-2 5-4.5 5-8 0-3.5-2-5.5-4-8-2-2.5-4.5-4-5-4z"
                className="fill-teal-500"
              />
              <path 
                d="M12 6c-2.5 0-4.5 1.5-5.5 3.5-1 2-1 4.5 0 6.5 1 2 3 3 5.5 3 2.5 0 4.5-1 5.5-3 1-2 1-4.5 0-6.5-1-2-3-3.5-5.5-3.5z"
                className="fill-blue-500"
              />
            </svg>
          </div>
        </div>
        <h2 className="mt-6 text-xl font-medium text-gray-900 dark:text-white">Dermify</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300 animate-pulse">{t('loading') || 'Se încarcă...'}</p>
      </div>
    </div>
  );
}
