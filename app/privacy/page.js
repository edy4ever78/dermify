'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Privacy() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent mb-8">
            Privacy Policy
          </h1>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you use Dermify.
            </p>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Information We Collect</h2>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 mb-4">
              <li>Personal information you provide (such as name, email, etc.)</li>
              <li>Usage data (pages visited, products viewed, etc.)</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">How We Use Your Information</h2>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 mb-4">
              <li>To provide and improve our services</li>
              <li>To personalize your experience</li>
              <li>To communicate with you about updates and offers</li>
              <li>To ensure security and prevent fraud</li>
            </ul>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Your Rights</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You have the right to access, update, or delete your personal information. Contact us at <a href="mailto:privacy@dermify.com" className="text-teal-500 underline">privacy@dermify.com</a> for any privacy-related requests.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              We may update this policy from time to time. Please review it periodically.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
