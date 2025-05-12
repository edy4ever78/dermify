'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Contact() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent mb-8">
            Contact Us
          </h1>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Have questions, feedback, or need support? We'd love to hear from you. Fill out the form below or reach us directly at <a href="mailto:edy4ever6@gmai.com" className="text-teal-500 underline">edy4ever6@gmai.com</a>.
            </p>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                <input type="text" className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm" placeholder="Your Name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input type="email" className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm" placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
                <textarea className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm" rows={4} placeholder="How can we help you?" />
              </div>
              <button type="submit" className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors">
                Send Message
              </button>
            </form>
          </div>
          
        </div>
      </main>
      <Footer />
    </>
  );
}
