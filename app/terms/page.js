'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Terms() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent mb-8">
            Terms of Service
          </h1>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              By using our service, you agree to these terms. Please read them carefully.
            </p>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Use of Service</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Dermify provides information and recommendations for skincare. You agree to use our service for lawful purposes only and not to misuse or disrupt our platform.
            </p>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">User Accounts</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You are responsible for maintaining the confidentiality of your account and password. Notify us immediately of any unauthorized use.
            </p>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Limitation of Liability</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Dermify is not liable for any damages resulting from the use or inability to use our service. All content is provided for informational purposes only and is not a substitute for professional medical advice.
            </p>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Changes to Terms</h2>
            <p className="text-gray-600 dark:text-gray-400">
              We may update these terms at any time. Continued use of the service constitutes acceptance of the new terms.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
