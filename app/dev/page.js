'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import ProductManager from '@/components/dev/ProductManager';
import IngredientManager from '@/components/dev/IngredientManager';
import { useTranslation } from '@/hooks/useTranslation';

export default function DevPage() {
  const { t } = useTranslation();
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('products');
  const [isAuthorized, setIsAuthorized] = useState(false);

  // List of authorized developer emails - you can modify this
  const authorizedDevs = [
    'admin@dermify.com',
    'dev@dermify.com',
    // Add your email here for testing
  ];

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/signin?redirect=/dev');
        return;
      }
      
      // Check if user is authorized developer
      if (!authorizedDevs.includes(user.email)) {
        router.push('/');
        return;
      }
      
      setIsAuthorized(true);
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Developer Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage products and ingredients for Dermify
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('products')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'products'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Products Manager
              </button>
              <button
                onClick={() => setActiveTab('ingredients')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'ingredients'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Ingredients Manager
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            {activeTab === 'products' && <ProductManager />}
            {activeTab === 'ingredients' && <IngredientManager />}
          </div>
        </div>
      </div>
    </>
  );
}
